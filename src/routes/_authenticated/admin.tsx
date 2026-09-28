import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, LogOut, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { formatBRL } from "@/data/products";
import { PRODUCT_BUCKET, STORAGE_PREFIX } from "@/lib/catalog.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [
    { title: "Gerenciar produtos — CORRES DO ZK" },
    { name: "description", content: "Painel privado de produtos da CORRES DO ZK." },
    { property: "og:title", content: "Gerenciar produtos — CORRES DO ZK" },
    { property: "og:description", content: "Painel privado de produtos da CORRES DO ZK." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Admin,
});

type Row = Tables<"products">;
type Draft = { id?: string; slug: string; name: string; description: string; category: string; price: string; drop_name: string; sizes: string; colors: string; stock: string; status: string; images: string[] };
const empty: Draft = { slug: "", name: "", description: "", category: "Camisetas", price: "", drop_name: "", sizes: "P, M, G, GG", colors: "Preto", stock: "0", status: "ativo", images: [] };
const categories = ["Camisetas", "Moletons", "Conjuntos", "Calças", "Boné", "Acessórios"];
const split = (value: string) => [...new Set(value.split(",").map((part) => part.trim()).filter(Boolean))];
const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fromRow = (row: Row): Draft => ({ ...row, price: String(row.price), stock: String(row.stock), sizes: row.sizes.join(", "), colors: row.colors.join(", ") });

function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (!active) return;
      if (authError || !user.user) { setAllowed(false); setLoading(false); return; }
      const { data: admin, error } = await supabase.rpc("has_role", { _user_id: user.user.id, _role: "admin" });
      if (!active) return;
      setAllowed(!error && admin === true);
      if (admin && !error) {
        const result = await supabase.from("products").select("*").order("sort_order");
        if (active) {
          if (result.error) toast.error("Não foi possível carregar os produtos.");
          else setRows(result.data ?? []);
        }
      }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!draft) return;
    let active = true;
    const paths = draft.images.filter((image) => image.startsWith(STORAGE_PREFIX)).map((image) => image.slice(STORAGE_PREFIX.length));
    if (!paths.length) return;
    void supabase.storage.from(PRODUCT_BUCKET).createSignedUrls(paths, 3600).then(({ data }) => {
      if (active) setPreviews(Object.fromEntries((data ?? []).filter((entry) => entry.signedUrl).map((entry) => [STORAGE_PREFIX + entry.path, entry.signedUrl])));
    });
    return () => { active = false; };
  }, [draft?.id, draft?.images.join("|")]);

  async function refresh() {
    const { data, error } = await supabase.from("products").select("*").order("sort_order");
    if (error) throw error;
    setRows(data ?? []);
    await queryClient.invalidateQueries({ queryKey: ["products"] });
  }

  async function upload(files: FileList | null) {
    if (!files || !draft) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) throw new Error("Use imagens de até 10 MB.");
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${crypto.randomUUID()}.${extension}`;
        const { error } = await supabase.storage.from(PRODUCT_BUCKET).upload(path, file, { contentType: file.type });
        if (error) throw error;
        uploaded.push(STORAGE_PREFIX + path);
      }
      setDraft((current) => current ? { ...current, images: [...current.images, ...uploaded] } : current);
      toast.success("Foto enviada. Salve o produto para publicar.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Falha ao enviar foto."); }
    finally { setBusy(false); }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !allowed) return;
    const price = Number(draft.price.replace(",", "."));
    const stock = Number(draft.stock);
    const slug = slugify(draft.slug || draft.name);
    if (!slug || !draft.name.trim() || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0 || !split(draft.sizes).length || !split(draft.colors).length) {
      toast.error("Confira nome, preço, estoque, tamanhos e cores."); return;
    }
    setBusy(true);
    try {
      const payload = { slug, name: draft.name.trim(), description: draft.description.trim(), category: draft.category, price, drop_name: draft.drop_name.trim(), sizes: split(draft.sizes), colors: split(draft.colors), stock, status: draft.status, images: draft.images };
      const result = draft.id
        ? await supabase.from("products").update(payload).eq("id", draft.id)
        : await supabase.from("products").insert({ ...payload, sort_order: rows.length + 1 });
      if (result.error) throw result.error;
      await refresh();
      setDraft(null);
      toast.success("Produto salvo na loja.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível salvar."); }
    finally { setBusy(false); }
  }

  async function remove(row: Row) {
    if (!allowed || !window.confirm(`Excluir ${row.name} da loja?`)) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("products").delete().eq("id", row.id);
      if (error) throw error;
      await refresh(); toast.success("Produto removido.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível remover."); }
    finally { setBusy(false); }
  }

  async function signOut() {
    await queryClient.cancelQueries(); queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }

  if (loading) return <div className="min-h-[70vh] px-4 py-24 text-center">Carregando painel...</div>;
  if (!allowed) return <div className="mx-auto min-h-[70vh] max-w-lg px-4 py-24 text-center"><h1 className="zk-title text-4xl">Acesso restrito</h1><p className="mt-4 text-muted-foreground">Esta conta não é a administradora da loja.</p><Button onClick={signOut} className="mt-6">Sair desta conta</Button></div>;

  return <div className="min-h-[80vh] bg-background text-foreground">
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div><p className="zk-eyebrow text-primary">Área privada</p><h1 className="zk-title mt-2 text-4xl sm:text-5xl">Meus produtos</h1></div>
        <Button variant="outline" onClick={signOut} title="Sair" aria-label="Sair"><LogOut className="h-4 w-4" /></Button>
      </div>
      {!draft ? <>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">{rows.length} produtos cadastrados</p><Button onClick={() => { setPreviews({}); setDraft({ ...empty }); }}><Plus className="mr-2 h-4 w-4" />Novo produto</Button></div>
        <div className="mt-5 divide-y divide-border border-y border-border">
          {rows.map((row) => <div key={row.id} className="flex min-w-0 items-center gap-3 py-4 sm:gap-5">
            <div className="h-16 w-14 shrink-0 bg-muted">{row.images[0] && !row.images[0].startsWith(STORAGE_PREFIX) && <img src={row.images[0]} alt="" className="h-full w-full object-cover" />}</div>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{row.name}</p><p className="mt-1 text-xs text-muted-foreground">{formatBRL(row.price)} · {row.stock} em estoque · {row.status}</p></div>
            <Button variant="outline" size="icon" title="Editar" aria-label={`Editar ${row.name}`} onClick={() => { setPreviews({}); setDraft(fromRow(row)); }}><Pencil className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" title="Excluir" aria-label={`Excluir ${row.name}`} disabled={busy} onClick={() => void remove(row)}><Trash2 className="h-4 w-4" /></Button>
          </div>)}
        </div>
        <Link to="/loja" className="mt-8 inline-block text-sm underline">Ver loja</Link>
      </> : <form onSubmit={save} className="mt-7 space-y-5">
        <div className="flex items-center justify-between gap-3"><h2 className="zk-title text-3xl">{draft.id ? "Editar produto" : "Novo produto"}</h2><Button type="button" variant="ghost" size="icon" onClick={() => setDraft(null)} aria-label="Fechar"><X className="h-5 w-5" /></Button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="name">Nome</Label><Input id="name" required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="mt-2" /></div>
          <div><Label htmlFor="slug">Endereço da peça (opcional)</Label><Input id="slug" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} placeholder="Criado a partir do nome" className="mt-2" /></div>
          <div><Label htmlFor="price">Preço em R$</Label><Input id="price" required inputMode="decimal" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="189,00" className="mt-2" /></div>
          <div><Label htmlFor="stock">Quantidade em estoque</Label><Input id="stock" type="number" min="0" required value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} className="mt-2" /></div>
          <div><Label htmlFor="category">Categoria</Label><select id="category" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="mt-2 h-10 w-full border border-input bg-background px-3">{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
          <div><Label htmlFor="status">Exibição</Label><select id="status" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} className="mt-2 h-10 w-full border border-input bg-background px-3"><option value="ativo">Ativo</option><option value="esgotado">Esgotado</option><option value="oculto">Oculto</option></select></div>
          <div><Label htmlFor="sizes">Tamanhos (separados por vírgula)</Label><Input id="sizes" value={draft.sizes} onChange={(e) => setDraft({ ...draft, sizes: e.target.value })} className="mt-2" /></div>
          <div><Label htmlFor="colors">Cores (separadas por vírgula)</Label><Input id="colors" value={draft.colors} onChange={(e) => setDraft({ ...draft, colors: e.target.value })} className="mt-2" /></div>
          <div><Label htmlFor="drop">Coleção</Label><Input id="drop" value={draft.drop_name} onChange={(e) => setDraft({ ...draft, drop_name: e.target.value })} className="mt-2" /></div>
        </div>
        <div><Label htmlFor="description">Descrição</Label><Textarea id="description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="mt-2" /></div>
        <div><Label htmlFor="photos">Fotos da roupa (até 10 MB cada)</Label><Input id="photos" type="file" accept="image/*" multiple disabled={busy} onChange={(e) => { void upload(e.target.files); e.target.value = ""; }} className="mt-2 h-11 cursor-pointer pt-2" /><div className="mt-3 flex flex-wrap gap-3">{draft.images.map((image, index) => <div key={`${image}-${index}`} className="relative h-24 w-20 bg-muted"><img src={previews[image] ?? (image.startsWith(STORAGE_PREFIX) ? "" : image)} alt={`Foto ${index + 1}`} className="h-full w-full object-cover" /><Button type="button" variant="destructive" size="icon" title="Remover foto" aria-label={`Remover foto ${index + 1}`} className="absolute -right-2 -top-2 h-7 w-7" onClick={() => setDraft({ ...draft, images: draft.images.filter((_, i) => i !== index) })}><X className="h-3 w-3" /></Button></div>)}</div></div>
        <div className="flex flex-wrap gap-3 border-t border-border pt-5"><Button disabled={busy} type="submit"><Upload className="mr-2 h-4 w-4" />{busy ? "Aguarde..." : "Salvar produto"}</Button><Button type="button" variant="outline" onClick={() => setDraft(null)}>Cancelar</Button></div>
      </form>}
    </div>
  </div>;
}

import { createFileRoute } from "@tanstack/react-router";
import { Image, Package, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBRL, products } from "@/data/products";
import { type SiteTextKey, useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel — CORRES DO ZK" },
      { name: "description", content: "Painel de conteúdo visual da CORRES DO ZK." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const textFields: Array<{ key: SiteTextKey; label: string }> = [
  { key: "heroKicker", label: "Linha pequena do banner" },
  { key: "heroTitle", label: "Título principal" },
  { key: "heroSubtitle", label: "Subtítulo" },
  { key: "heroCta", label: "Texto do botão" },
  { key: "editorialTitle", label: "Título editorial" },
];

const categoryNames = ["Camisetas", "Moletons", "Conjuntos", "Calças", "Boné", "Acessórios"];

function Admin() {
  const { content, setText, setImage, setCategoryImage, setProductImage, resetContent } = useSiteContent();
  const stockTotal = products.reduce((total, product) => total + product.stock, 0);
  const uniqueDrops = new Set(products.map((product) => product.drop)).size;

  return (
    <div className="min-h-[80vh] bg-[#090909] text-white">
      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#111,#090909)]">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8">
          <p className="zk-eyebrow text-primary">Painel visual</p>
          <h1 className="zk-title mt-3 text-5xl sm:text-7xl">Conteúdo da loja</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">Edite textos e URLs das imagens importantes sem alterar a estrutura. As alterações deste painel ficam salvas neste navegador.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="border border-white/10 bg-white/[0.025] p-5"><Package className="h-5 w-5 text-primary" /><p className="zk-eyebrow mt-4 text-white/40">Produtos</p><p className="zk-title mt-2 text-3xl">{products.length}</p></div>
          <div className="border border-white/10 bg-white/[0.025] p-5"><Package className="h-5 w-5 text-primary" /><p className="zk-eyebrow mt-4 text-white/40">Peças em estoque</p><p className="zk-title mt-2 text-3xl">{stockTotal}</p></div>
          <div className="border border-white/10 bg-white/[0.025] p-5"><Image className="h-5 w-5 text-primary" /><p className="zk-eyebrow mt-4 text-white/40">Drops cadastrados</p><p className="zk-title mt-2 text-3xl">{uniqueDrops}</p></div>
        </div>

        <section className="border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div><p className="zk-eyebrow text-primary">Banner principal</p><h2 className="zk-title mt-2 text-3xl">Texto e imagens</h2></div>
            <Button type="button" variant="outline" className="rounded-none border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white" onClick={resetContent}><RotateCcw className="mr-2 h-4 w-4" />Restaurar padrão</Button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {textFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input id={field.key} value={content.text[field.key]} onChange={(event) => setText(field.key, event.target.value)} />
              </div>
            ))}
            {(["logo", "hero", "editorial"] as const).map((key) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`image-${key}`}>{key === "logo" ? "Logo" : key === "hero" ? "Imagem do banner" : "Imagem editorial"}</Label>
                <Input id={`image-${key}`} value={content.images[key]} onChange={(event) => setImage(key, event.target.value)} placeholder="URL ou caminho da imagem" />
              </div>
            ))}
          </div>
        </section>

        <section className="border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <p className="zk-eyebrow text-primary">Categorias</p>
          <h2 className="zk-title mt-2 text-3xl">Fotos dos cards</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {categoryNames.map((category) => (
              <div key={category} className="space-y-2">
                <Label htmlFor={`category-${category}`}>{category}</Label>
                <Input id={`category-${category}`} value={content.images.categories[category] ?? ""} onChange={(event) => setCategoryImage(category, event.target.value)} />
              </div>
            ))}
          </div>
        </section>

        <section className="border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <p className="zk-eyebrow text-primary">Catálogo</p>
          <h2 className="zk-title mt-2 text-3xl">Imagens de produto</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {products.map((product) => (
              <div key={product.slug} className="border border-white/10 p-4">
                <div className="flex items-center justify-between gap-3"><p className="text-sm font-black uppercase">{product.name}</p><span className="text-xs text-white/40">{formatBRL(product.price)}</span></div>
                <Label htmlFor={`product-${product.slug}`} className="mt-4 block text-[9px] uppercase tracking-[0.16em] text-white/45">URL da imagem</Label>
                <Input id={`product-${product.slug}`} className="mt-2" value={content.images.products[product.slug] ?? product.image} onChange={(event) => setProductImage(product.slug, event.target.value)} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ChevronLeft, Minus, Plus, Ruler, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatBRL, getProduct, products } from "@/data/products";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Peça não encontrada — CORRES DO ZK" }, { name: "robots", content: "noindex" }] };
    const { product } = loaderData;
    return { meta: [
      { title: `${product.name} — CORRES DO ZK` },
      { name: "description", content: product.description },
      { property: "og:title", content: `${product.name} — CORRES DO ZK` },
      { property: "og:description", content: product.description },
    ]};
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-32 text-center">
      <p className="zk-eyebrow text-primary">404 / DROP</p>
      <h1 className="zk-title mt-3 text-5xl">Peça não encontrada</h1>
      <p className="mt-4 text-sm text-muted-foreground">Esse item pode ter esgotado ou saído do catálogo.</p>
      <Button asChild className="mt-8"><Link to="/loja">Voltar para a coleção</Link></Button>
    </div>
  ),
  component: Produto,
});

function Produto() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(null);

  const relacionados = products.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12">
      <Link to="/loja" className="zk-focus inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"><ChevronLeft className="h-3 w-3" /> Voltar à coleção</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
        <div className="zk-surface zk-grain overflow-hidden rounded-sm">
          <div className="relative">
            <img src={product.image} alt={product.name} width={1008} height={1200} className="aspect-[5/6] w-full object-cover" />
            <span className="absolute left-4 top-4 bg-primary px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-primary-foreground">{product.drop}</span>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="zk-eyebrow text-primary">{product.category} / edição limitada</p>
          <h1 className="zk-title mt-3 text-5xl sm:text-6xl">{product.name}</h1>
          <p className="mt-5 text-2xl font-bold">{formatBRL(product.price)}</p>
          <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">{product.description}</p>

          <div className="mt-9 flex items-center justify-between">
            <p className="zk-eyebrow">Tamanho</p>
            <button type="button" className="zk-focus inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"><Ruler className="h-3.5 w-3.5" /> Guia de tamanho</button>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {product.sizes.map((s) => (
              <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)} className={`zk-focus h-12 border text-xs font-bold transition-all ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/50 hover:border-primary/60"}`}>{s}</button>
            ))}
          </div>

          <Button size="lg" className="mt-5 h-14 w-full text-xs font-bold uppercase tracking-[0.16em]" onClick={() => {
            if (!size) { toast.error("Escolha um tamanho"); return; }
            add({ slug: product.slug, name: product.name, price: product.price, image: product.image, size, qty: 1 });
            toast.success("Adicionado à sacola", { description: `${product.name} • Tam ${size}` });
          }}>Adicionar à sacola</Button>

          <div className="mt-7 grid gap-3 border-t border-border pt-6 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:grid-cols-3">
            <div className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" /> {product.stock} peças disponíveis</div>
            <div className="flex gap-2"><Truck className="h-4 w-4 shrink-0 text-primary" /> Envio em até 3 dias</div>
            <div className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" /> Troca em 7 dias</div>
          </div>
        </div>
      </div>

      {relacionados.length > 0 && <section className="mt-24 border-t border-border pt-12"><p className="zk-eyebrow text-primary">Completa o corre</p><h2 className="zk-title mt-3 text-4xl">Você também pode gostar</h2><div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{relacionados.map((p) => <ProductCard key={p.slug} product={p} />)}</div></section>}
    </div>
  );
}

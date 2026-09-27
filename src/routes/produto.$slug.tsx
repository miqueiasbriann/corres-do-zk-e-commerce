import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ChevronLeft, Maximize2, Ruler, Truck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatBRL, getProduct, products } from "@/data/products";
import { useCart } from "@/lib/cart";
import { useSiteContent } from "@/lib/site-content";
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
      <Button asChild className="mt-8 rounded-none"><Link to="/loja">Voltar para a coleção</Link></Button>
    </div>
  ),
  component: Produto,
});

function Produto() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const { content } = useSiteContent();
  const [size, setSize] = useState<string | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const image = content.images.products[product.slug] || product.image;

  const relacionados = products.filter((item) => item.slug !== product.slug && item.category === product.category).slice(0, 3);

  return (
    <div className="bg-[#090909] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link to="/loja" className="zk-focus inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/45 hover:text-white"><ChevronLeft className="h-3 w-3" /> Voltar à coleção</Link>

        <div className="mt-7 grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
          <div>
            <button type="button" onClick={() => setZoomOpen(true)} className="zk-focus group relative block w-full overflow-hidden border border-white/10 bg-[#111] text-left" aria-label={`Ampliar foto de ${product.name}`}>
              <img src={image} alt={product.name} width={1008} height={1200} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.015]" />
              <span className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur"><Maximize2 className="h-4 w-4" /></span>
              <span className="absolute bottom-3 left-3 bg-black/70 px-3 py-2 text-[8px] font-black uppercase tracking-[0.18em] text-white/75 backdrop-blur">Toque para ampliar</span>
            </button>
          </div>

          <div className="flex flex-col justify-center lg:sticky lg:top-24 lg:self-start lg:py-8">
            <p className="zk-eyebrow text-primary">{product.category} / {product.drop}</p>
            <h1 className="zk-title mt-3 text-5xl sm:text-6xl lg:text-7xl">{product.name}</h1>
            <p className="mt-5 text-2xl font-black">{formatBRL(product.price)}</p>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/55">{product.description}</p>

            <div className="mt-9 flex items-center justify-between">
              <p className="zk-eyebrow text-white/50">Tamanho</p>
              <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.14em] text-white/35"><Ruler className="h-3.5 w-3.5" /> Selecione abaixo</span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.sizes.map((itemSize) => (
                <button key={itemSize} type="button" aria-pressed={size === itemSize} onClick={() => setSize(itemSize)} className={`zk-focus h-12 border text-xs font-black transition ${size === itemSize ? "border-primary bg-primary text-white" : "border-white/15 bg-white/[0.02] hover:border-white/45"}`}>{itemSize}</button>
              ))}
            </div>

            <Button size="lg" className="mt-5 h-14 w-full rounded-none text-xs font-black uppercase tracking-[0.16em]" onClick={() => {
              if (!size) { toast.error("Escolha um tamanho"); return; }
              add({ slug: product.slug, name: product.name, price: product.price, image, size, qty: 1 });
              toast.success("Adicionado à sacola", { description: `${product.name} • Tam ${size}` });
            }}>Adicionar à sacola</Button>

            <div className="mt-7 grid gap-3 border-t border-white/10 pt-6 text-[9px] font-bold uppercase tracking-[0.12em] text-white/45 sm:grid-cols-3">
              <div className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" /> {product.stock} peças em estoque</div>
              <div className="flex gap-2"><Truck className="h-4 w-4 shrink-0 text-primary" /> Frete no WhatsApp</div>
              <div className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" /> Pagamento no WhatsApp</div>
            </div>
          </div>
        </div>

        {relacionados.length > 0 && (
          <section className="mt-20 border-t border-white/10 pt-10 sm:mt-24 sm:pt-12">
            <p className="zk-eyebrow text-primary">Completa o corre</p>
            <h2 className="zk-title mt-3 text-4xl sm:text-5xl">Você também pode gostar</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 lg:grid-cols-3">{relacionados.map((item) => <ProductCard key={item.slug} product={item} />)}</div>
          </section>
        )}
      </div>

      {zoomOpen && (
        <div role="dialog" aria-modal="true" aria-label={`Foto ampliada de ${product.name}`} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4 sm:p-8" onClick={() => setZoomOpen(false)}>
          <button type="button" onClick={() => setZoomOpen(false)} className="zk-focus absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white sm:right-7 sm:top-7" aria-label="Fechar ampliação"><X className="h-5 w-5" /></button>
          <img src={image} alt={product.name} className="max-h-full max-w-full object-contain" onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

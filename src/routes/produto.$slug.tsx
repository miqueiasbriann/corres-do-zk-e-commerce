import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Ruler,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatBRL, getVariantStock } from "@/data/products";
import { productsQueryOptions, useProducts } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/produto/$slug")({
  loader: async ({ params, context }) => {
    const products = await context.queryClient.ensureQueryData(productsQueryOptions);
    const product = products.find((item) => item.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Peça não encontrada — CORRES DO ZK" }, { name: "description", content: "Esta peça não está disponível na CORRES DO ZK." }, { property: "og:title", content: "Peça não encontrada — CORRES DO ZK" }, { property: "og:description", content: "Esta peça não está disponível na CORRES DO ZK." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex" }] };
    const { product } = loaderData;
    return { meta: [
      { title: `${product.name} — CORRES DO ZK` },
      { name: "description", content: product.description },
      { property: "og:title", content: `${product.name} — CORRES DO ZK` },
      { property: "og:description", content: product.description },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
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
  errorComponent: () => <div className="mx-auto max-w-3xl px-5 py-32 text-center">Não foi possível carregar esta peça. Tente novamente.</div>,
  component: Produto,
});

function Produto() {
  const { product } = Route.useLoaderData();
  const products = useProducts();
  const { add, items } = useCart();
  const gallery = useMemo(
    () => Array.from(new Set([...product.images, product.image].filter(Boolean))),
    [product],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(product.colors.length === 1 ? (product.colors[0] ?? null) : null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (activeIndex >= gallery.length) setActiveIndex(0);
  }, [activeIndex, gallery.length]);

  const activeImage = gallery[activeIndex] || product.image;
  const selectedStock = size && color ? getVariantStock(product, size, color) : 0;
  const quantityInCart = size && color
    ? items.find((item) => item.slug === product.slug && item.size === size && item.color === color)?.qty ?? 0
    : 0;
  const atLimit = Boolean(size && color && selectedStock > 0 && quantityInCart >= selectedStock);

  const relacionados = products
    .filter((item) => item.slug !== product.slug && item.category === product.category)
    .slice(0, 3);

  const previousImage = () => setActiveIndex((index) => (index - 1 + gallery.length) % gallery.length);
  const nextImage = () => setActiveIndex((index) => (index + 1) % gallery.length);

  const handleTouchStart = (event: TouchEvent) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStart.current == null || gallery.length < 2) return;
    const end = event.changedTouches[0]?.clientX ?? touchStart.current;
    const delta = end - touchStart.current;
    if (Math.abs(delta) > 45) delta > 0 ? previousImage() : nextImage();
    touchStart.current = null;
  };

  return (
    <div className="bg-[#090909] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-12 lg:px-8">
        <Link to="/loja" className="zk-focus inline-flex min-h-11 items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/45 hover:text-white">
          <ChevronLeft className="h-3.5 w-3.5" /> Voltar à coleção
        </Link>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
          <div className="min-w-0">
            <div
              className="group relative overflow-hidden border border-white/10 bg-[#111]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img src={activeImage} alt={`${product.name} — foto ${activeIndex + 1}`} width={1008} height={1200} className="aspect-[4/5] w-full object-cover" />
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                className="zk-focus absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur"
                aria-label={`Ampliar foto de ${product.name}`}
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              {gallery.length > 1 && (
                <>
                  <button type="button" onClick={previousImage} className="zk-focus absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur" aria-label="Foto anterior">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={nextImage} className="zk-focus absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur" aria-label="Próxima foto">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <span className="absolute bottom-3 left-3 bg-black/70 px-3 py-2 text-[8px] font-black uppercase tracking-[0.18em] text-white/75 backdrop-blur">
                {gallery.length > 1 ? "Deslize para navegar" : "Toque para ampliar"}
              </span>
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Ver foto ${index + 1}`}
                    aria-current={activeIndex === index ? "true" : undefined}
                    className={`zk-focus min-h-14 overflow-hidden border ${activeIndex === index ? "border-primary" : "border-white/12"}`}
                  >
                    <img src={image} alt="" loading="lazy" className="aspect-square h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col justify-center lg:sticky lg:top-24 lg:self-start lg:py-8">
            <div className="flex flex-wrap items-center gap-2">
              <p className="zk-eyebrow text-primary">{product.category} / {product.drop}</p>
              {product.isDemo && <span className="border border-white/15 px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/55">Produto demonstrativo</span>}
            </div>
            <h1 className="zk-title mt-3 break-words text-[3.25rem] leading-[.9] sm:text-6xl lg:text-7xl">{product.name}</h1>
            <p className="mt-5 text-2xl font-black">{formatBRL(product.price)}</p>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/55">{product.description}</p>

            <div className="mt-8">
              <p className="zk-eyebrow text-white/50">Cor</p>
              {product.colors.length === 1 ? (
                <div className="mt-3 flex min-h-12 items-center border border-white/15 bg-white/[0.025] px-4 text-xs font-black uppercase tracking-[0.12em]">
                  {product.colors[0]} <span className="ml-2 text-[9px] font-semibold text-white/35">· cor única</span>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.colors.map((itemColor) => {
                    const available = size
                      ? getVariantStock(product, size, itemColor) > 0
                      : product.variants.some((variant) => variant.color === itemColor && variant.stock > 0);
                    return (
                      <button
                        key={itemColor}
                        type="button"
                        disabled={!available}
                        aria-pressed={color === itemColor}
                        onClick={() => setColor(itemColor)}
                        className={`zk-focus min-h-12 border px-4 text-xs font-black uppercase tracking-[0.1em] transition disabled:cursor-not-allowed disabled:opacity-35 ${color === itemColor ? "border-primary bg-primary text-white" : "border-white/15 bg-white/[0.02] hover:border-white/45"}`}
                      >
                        {itemColor}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <p className="zk-eyebrow text-white/50">Tamanho</p>
              {product.sizeGuide && (
                <button type="button" onClick={() => setGuideOpen(true)} className="zk-focus inline-flex min-h-11 items-center gap-1 px-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white/45 hover:text-white">
                  <Ruler className="h-3.5 w-3.5" /> Guia de medidas
                </button>
              )}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.sizes.map((itemSize) => {
                const available = color
                  ? getVariantStock(product, itemSize, color) > 0
                  : product.variants.some((variant) => variant.size === itemSize && variant.stock > 0);
                return (
                  <button
                    key={itemSize}
                    type="button"
                    disabled={!available}
                    aria-pressed={size === itemSize}
                    onClick={() => setSize(itemSize)}
                    className={`zk-focus h-12 border text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-30 ${size === itemSize ? "border-primary bg-primary text-white" : "border-white/15 bg-white/[0.02] hover:border-white/45"}`}
                  >
                    {itemSize}
                  </button>
                );
              })}
            </div>

            {size && color && (
              <p className={`mt-3 text-[9px] font-bold uppercase tracking-[0.13em] ${selectedStock > 0 ? "text-white/45" : "text-primary"}`}>
                {selectedStock > 0
                  ? product.isDemo
                    ? `Limite demonstrativo desta combinação: ${selectedStock}`
                    : `${selectedStock} disponível(is) nesta combinação`
                  : "Combinação indisponível"}
              </p>
            )}

            <Button
              size="lg"
              disabled={!size || !color || selectedStock <= 0 || atLimit}
              className="mt-5 h-14 w-full rounded-none text-xs font-black uppercase tracking-[0.16em]"
              onClick={() => {
                if (!size) { toast.error("Escolha um tamanho"); return; }
                if (!color) { toast.error("Escolha uma cor"); return; }
                const maxQty = getVariantStock(product, size, color);
                if (maxQty <= 0) { toast.error("Esta combinação está indisponível"); return; }
                if (quantityInCart >= maxQty) { toast.error("Você já atingiu o estoque disponível desta variação"); return; }
                add({
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: activeImage,
                  size,
                  color,
                  qty: 1,
                  maxQty,
                });
                toast.success("Adicionado à sacola", { description: `${product.name} • ${color} • Tam ${size}` });
              }}
            >
              {atLimit ? "Limite da variação atingido" : "Adicionar à sacola"}
            </Button>

            <div className="mt-7 grid gap-3 border-t border-white/10 pt-6 text-[9px] font-bold uppercase tracking-[0.12em] text-white/45 sm:grid-cols-3">
              <div className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" /> {product.isDemo ? "Estoque demonstrativo" : `${product.stock} peças em estoque`}</div>
              <div className="flex gap-2"><Truck className="h-4 w-4 shrink-0 text-primary" /> Frete no WhatsApp</div>
              <div className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" /> Pagamento no WhatsApp</div>
            </div>
          </div>
        </div>

        {relacionados.length > 0 && (
          <section className="mt-20 border-t border-white/10 pt-10 sm:mt-24 sm:pt-12">
            <p className="zk-eyebrow text-primary">Completa o corre</p>
            <h2 className="zk-title mt-3 text-4xl sm:text-5xl">Você também pode gostar</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 lg:grid-cols-3">
              {relacionados.map((item) => <ProductCard key={item.slug} product={item} />)}
            </div>
          </section>
        )}
      </div>

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent
          className="h-dvh w-screen max-w-none overflow-hidden border-0 bg-black/96 p-3 text-white shadow-none sm:h-[92dvh] sm:w-[92vw] sm:max-w-6xl sm:p-6 [&>button]:right-3 [&>button]:top-[max(.75rem,env(safe-area-inset-top))] [&>button]:z-20 [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-white/20 [&>button]:bg-black/70 [&>button]:opacity-100"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <DialogTitle className="sr-only">{product.name} ampliado</DialogTitle>
          <DialogDescription className="sr-only">Visualização ampliada da galeria de fotos do produto.</DialogDescription>
          <div className="relative flex min-h-0 flex-1 items-center justify-center pt-[max(2.75rem,env(safe-area-inset-top))] pb-[max(.5rem,env(safe-area-inset-bottom))]">
            <img src={activeImage} alt={`${product.name} — foto ampliada ${activeIndex + 1}`} className="max-h-full max-w-full object-contain" />
            {gallery.length > 1 && (
              <>
                <button type="button" onClick={previousImage} className="zk-focus absolute left-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 sm:left-4" aria-label="Foto anterior"><ChevronLeft className="h-5 w-5" /></button>
                <button type="button" onClick={nextImage} className="zk-focus absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 sm:right-4" aria-label="Próxima foto"><ChevronRight className="h-5 w-5" /></button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {product.sizeGuide && (
        <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
          <DialogContent className="max-h-[85dvh] max-w-lg overflow-y-auto border-white/15 bg-[#0c0c0c] text-white [&>button]:h-11 [&>button]:w-11">
            <DialogTitle className="zk-title text-3xl">Guia de medidas</DialogTitle>
            <DialogDescription className="whitespace-pre-wrap leading-6 text-white/60">{product.sizeGuide}</DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Instagram, MessageCircle, Play } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { productsQueryOptions, useProducts } from "@/lib/catalog";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions),
  head: () => ({
    meta: [
      { title: "CORRES DO ZK — O CORRE NÃO PARA" },
      { name: "description", content: "Streetwear CORRES DO ZK. O corre não para. O estilo acompanha." },
      { property: "og:title", content: "CORRES DO ZK — O CORRE NÃO PARA" },
      { property: "og:description", content: "O corre não para. O estilo acompanha." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const categoryMeta = [
  { label: "Camisetas", position: "center 24%", state: "available" },
  { label: "Moletons", position: "center 28%", state: "available" },
  { label: "Conjuntos", position: "62% center", state: "available" },
  { label: "Calças", position: "58% 72%", state: "available" },
  { label: "Boné", position: "72% 18%", state: "available" },
  { label: "Acessórios", position: "center 62%", state: "soon" },
] as const;

function Home() {
  const { content } = useSiteContent();
  const products = useProducts();
  const radar = products.slice(0, 4);
  const editorialParts = content.text.editorialTitle.split(" SUA ");

  return (
    <div className="bg-background text-foreground">
      <section className="zk-hero relative isolate overflow-hidden">
        <img
          src={content.images.heroMobile || content.images.hero}
          alt="Campanha CORRES DO ZK"
          width={1672}
          height={941}
          fetchPriority="high"
          className="zk-hero-photo absolute inset-0 h-full w-full object-cover sm:hidden"
        />
        <img
          src={content.images.hero}
          alt=""
          aria-hidden="true"
          width={1672}
          height={941}
          fetchPriority="high"
          className="zk-hero-photo absolute inset-0 hidden h-full w-full object-cover sm:block"
        />

        <div className="zk-hero-shade absolute inset-0 z-[1]" />

        {content.images.mascot && (
          <img src={content.images.mascot} alt="" aria-hidden="true" className="zk-hero-mascot pointer-events-none absolute z-[3] h-auto object-contain" />
        )}

        <div className="zk-hero-inner relative z-[2] mx-auto flex max-w-[1440px] items-center px-4 sm:px-6 lg:px-8">
          <div className="zk-hero-copy min-w-0">
            <img
              src={content.images.logo}
              alt="CORRES DO ZK"
              className="h-auto w-[min(75vw,310px)] object-contain sm:w-[360px] lg:w-[min(42vw,550px)]"
            />
            <h1 className="zk-title mt-6 max-w-[9ch] text-[2.85rem] leading-[.94] text-foreground sm:text-6xl lg:text-[5.5rem]">{content.text.heroTitle}</h1>
            <p className="mt-3 text-base font-black uppercase leading-tight text-foreground sm:text-xl lg:text-2xl">{content.text.heroSubtitle}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
              <Button asChild size="lg" className="h-12 min-w-[164px] rounded-none px-6 text-[10px] font-black uppercase tracking-[0.16em] shadow-[0_14px_35px_rgba(218,25,35,.22)] sm:h-13 sm:px-7 sm:text-[11px]">
                <Link to="/loja">{content.text.heroCta}<ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-8 flex min-w-0 items-end gap-4 sm:mb-10">
            <h2 className="zk-title min-w-0 text-[2.2rem] leading-[.92] text-white sm:text-5xl">Escolha seu <span className="zk-hand text-primary">corre</span></h2>
            <div className="mb-1 h-px min-w-6 flex-1 bg-white/15" />
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-6">
            {categoryMeta.map((category) => {
              const image = content.images.categories[category.label] || content.images.hero;
              const card = (
                <div className="group relative aspect-[.72] min-w-0 overflow-hidden border border-white/12 bg-[#111]">
                  <img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" style={{ objectPosition: category.position }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <p className="break-words text-[10px] font-black uppercase leading-4 tracking-[0.04em] text-white sm:text-sm">{category.label}</p>
                        {category.state === "soon" && <p className="mt-1 text-[8px] font-black uppercase tracking-[0.22em] text-white/60">Em breve</p>}
                      </div>
                      {category.state === "available" && <ArrowRight className="h-4 w-4 shrink-0 text-white/75 transition group-hover:translate-x-1 group-hover:text-primary" />}
                    </div>
                  </div>
                </div>
              );
              return category.state === "available" ? (
                <Link key={category.label} to="/loja" search={{ categoria: category.label }} className="zk-focus block min-w-0">{card}</Link>
              ) : (
                <div key={category.label} aria-label="Acessórios — em breve" className="min-w-0 opacity-75">{card}</div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#090909]">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mb-8 flex min-w-0 items-end gap-4 sm:mb-10">
            <h2 className="zk-title min-w-0 text-[2.2rem] leading-[.92] text-white sm:text-5xl">No <span className="zk-hand text-primary">radar</span></h2>
            <div className="mb-1 h-px min-w-6 flex-1 bg-white/15" />
            <Link to="/loja" className="zk-focus hidden shrink-0 text-[9px] font-black uppercase tracking-[0.2em] text-white/50 transition hover:text-white sm:block">Ver tudo →</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-5">
            {radar.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        </div>
      </section>

      <section className="zk-editorial relative isolate overflow-hidden border-y border-border bg-background">
        <img src={content.images.editorial} alt="Tecido preto com coroa bordada vermelha, corrente e etiqueta CORRES DO ZK" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="zk-editorial-shade absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center sm:px-5">
          <div className="min-w-0">
            <h2 className="zk-title text-[2.7rem] leading-[.94] text-foreground sm:text-6xl">{editorialParts[0]}</h2>
            {editorialParts[1] ? <p className="zk-hand mt-2 text-[2rem] leading-none text-primary sm:text-5xl">SUA {editorialParts[1]}</p> : null}
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0a]">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 py-12 sm:px-6 md:grid-cols-[1.25fr_.75fr] lg:px-8 lg:py-16">
          <div className="border border-white/10 bg-white/[0.025] p-6 sm:p-9">
            <Instagram className="h-5 w-5 text-primary" />
            <p className="zk-eyebrow mt-7 text-white/45">Acompanhe o corre</p>
            <h2 className="zk-title mt-3 break-all text-4xl text-white sm:text-5xl">@corresdozk</h2>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="https://www.instagram.com/corresdozk/" target="_blank" rel="noreferrer" className="zk-focus inline-flex min-h-11 items-center gap-2 border border-white/15 px-4 text-[9px] font-black uppercase tracking-[0.18em] text-white hover:border-primary"><Instagram className="h-4 w-4" /> Instagram</a>
              <a href="https://www.tiktok.com/@corresdozk" target="_blank" rel="noreferrer" className="zk-focus inline-flex min-h-11 items-center gap-2 border border-white/15 px-4 text-[9px] font-black uppercase tracking-[0.18em] text-white hover:border-primary"><Play className="h-4 w-4" /> TikTok</a>
            </div>
          </div>
          <div className="bg-primary p-6 text-white sm:p-9">
            <MessageCircle className="h-5 w-5" />
            <p className="zk-eyebrow mt-7 text-white/65">Finalização</p>
            <p className="zk-title mt-3 text-4xl">Pedido pelo WhatsApp.</p>
            <p className="mt-4 text-sm leading-6 text-white/75">Frete e pagamento são confirmados na conversa.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

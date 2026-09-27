import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Instagram, MessageCircle, Play } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { ZKChromeMark } from "@/components/site/ZKChromeMark";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CORRES DO ZK — O CORRE NÃO PARA" },
      { name: "description", content: "Streetwear CORRES DO ZK. O corre não para. O estilo acompanha." },
      { property: "og:title", content: "CORRES DO ZK — O CORRE NÃO PARA" },
      { property: "og:description", content: "O corre não para. O estilo acompanha." },
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
  const radar = products.slice(0, 4);
  const editorialParts = content.text.editorialTitle.split(" SUA ");
  const productImage = (index: number) => {
    const product = products[index];
    if (!product) return content.images.hero;
    return content.images.products[product.slug]?.[0] || product.image;
  };

  return (
    <div className="bg-background text-foreground">
      <section className="zk-hero relative isolate min-h-[690px] overflow-hidden sm:min-h-[780px] lg:min-h-[calc(100svh-4.35rem)]">
        <img
          src={content.images.heroMobile || content.images.hero}
          alt="Campanha CORRES DO ZK"
          width={1008}
          height={1200}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[61%_center] sm:hidden"
        />
        <img
          src={content.images.hero}
          alt=""
          aria-hidden="true"
          width={1600}
          height={1008}
          fetchPriority="high"
          className="zk-hero-depth absolute inset-0 hidden h-full w-full object-cover object-center sm:block"
        />

        <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(4,4,4,.10)_0%,rgba(4,4,4,.08)_32%,rgba(4,4,4,.42)_66%,rgba(4,4,4,.86)_100%)] sm:bg-[linear-gradient(90deg,rgba(5,5,5,.78)_0%,rgba(5,5,5,.56)_34%,rgba(5,5,5,.12)_68%,rgba(5,5,5,.03)_100%)]" />
        <div className="absolute inset-0 z-[1] zk-grit-overlay" />

        <ZKChromeMark />

        {content.images.mascot && (
          <>
            <img
              src={content.images.mascot}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-[-1.1rem] top-[27%] z-[3] h-auto w-[46vw] max-w-[180px] object-contain drop-shadow-[0_16px_18px_rgba(0,0,0,.52)] sm:hidden"
            />
            <img
              src={content.images.mascot}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 right-[2%] z-[3] hidden h-auto w-[23vw] max-w-[300px] object-contain drop-shadow-[0_24px_26px_rgba(0,0,0,.55)] lg:block"
            />
          </>
        )}

        <div className="relative z-[5] mx-auto flex min-h-[690px] max-w-[1440px] items-end px-4 pb-[max(2.25rem,env(safe-area-inset-bottom))] pt-24 sm:min-h-[780px] sm:px-6 sm:pb-16 lg:min-h-[calc(100svh-4.35rem)] lg:px-8">
          <div className="min-w-0 max-w-3xl">
            <img
              src={content.images.logo}
              alt="CORRES DO ZK"
              className="h-auto w-[min(72vw,270px)] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,.55)] sm:w-[330px] lg:w-[410px]"
            />
            <div className="mt-6 flex max-w-full items-center gap-3 sm:mt-8">
              <span className="h-px w-8 shrink-0 bg-primary sm:w-10" />
              <p className="truncate text-[8px] font-black uppercase tracking-[0.22em] text-white/72 sm:text-[10px] sm:tracking-[0.28em]">{content.text.heroKicker}</p>
            </div>
            <h1 className="zk-title mt-4 max-w-[8ch] break-words text-[clamp(2.8rem,13.5vw,3.65rem)] leading-[.88] text-white sm:max-w-none sm:text-7xl lg:text-[6.9rem]">{content.text.heroTitle}</h1>
            <p className="zk-hand mt-2 max-w-[12ch] text-[clamp(1.9rem,9vw,2.6rem)] leading-[1.02] text-primary sm:max-w-none sm:text-5xl lg:text-6xl">{content.text.heroSubtitle}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
              <Button asChild size="lg" className="h-12 min-w-[164px] rounded-none px-6 text-[10px] font-black uppercase tracking-[0.16em] shadow-[0_14px_35px_rgba(218,25,35,.22)] sm:h-13 sm:px-7 sm:text-[11px]">
                <Link to="/loja">{content.text.heroCta}<ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Link to="/sobre" className="zk-focus inline-flex h-12 min-w-[118px] items-center justify-center border border-white/24 bg-black/18 px-5 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:border-white/50 sm:h-13 sm:px-6">A marca</Link>
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

      <section className="relative isolate overflow-hidden border-y border-white/10 bg-black">
        <div className="grid min-h-[390px] grid-cols-3 sm:min-h-[520px]">
          <img src={productImage(1)} alt="Detalhe de camiseta CORRES DO ZK" loading="lazy" className="h-full min-w-0 w-full object-cover opacity-72" />
          <img src={content.images.editorial} alt="Detalhe editorial CORRES DO ZK" loading="lazy" className="h-full min-w-0 w-full object-cover opacity-60" />
          <img src={productImage(0)} alt="Detalhe de moletom CORRES DO ZK" loading="lazy" className="h-full min-w-0 w-full object-cover opacity-72" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.22),rgba(0,0,0,.58)_48%,rgba(0,0,0,.22))]" />
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center sm:px-5">
          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-[0.24em] text-white/60 sm:text-[9px] sm:tracking-[0.3em]">Detalhes / textura / identidade</p>
            <h2 className="zk-title mt-4 text-[2.9rem] leading-[.9] text-white sm:text-7xl">{editorialParts[0]}</h2>
            {editorialParts[1] ? <p className="zk-hand mt-2 text-[2.2rem] leading-none text-primary sm:text-6xl">SUA {editorialParts[1]}</p> : null}
            <Link to="/loja" className="zk-focus mt-7 inline-flex min-h-11 items-center border-b border-white/45 pb-1 text-[9px] font-black uppercase tracking-[0.18em] text-white transition hover:border-primary hover:text-primary">Explorar coleção <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight, Instagram, Play, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CORRES DO ZK — NASCIDA NA RUA. FEITA PRO SEU CORRE." },
      { name: "description", content: "Streetwear da CORRES DO ZK. Nascida na rua. Feita pro seu corre." },
      { property: "og:title", content: "CORRES DO ZK — NASCIDA NA RUA. FEITA PRO SEU CORRE." },
      { property: "og:description", content: "Nascida na rua. Feita pro seu corre." },
    ],
  }),
  component: Home,
});

const categories = [
  { label: "Camisetas", kicker: "01 / CAMISETAS", state: "available" },
  { label: "Moletons", kicker: "02 / MOLETONS", state: "available" },
  { label: "Conjuntos", kicker: "03 / CONJUNTOS", state: "available" },
  { label: "Calças", kicker: "04 / CALÇAS", state: "available" },
  { label: "Boné", kicker: "05 / BONÉ", state: "available" },
  { label: "Acessórios", kicker: "06 / ACESSÓRIOS", state: "soon" },
] as const;

function Home() {
  const destaque = products.slice(0, 3);

  return (
    <div className="overflow-hidden">
      <section className="zk-grain relative min-h-[72svh] sm:min-h-[calc(100svh-4.5rem)]">
        <img src={heroImg} alt="Campanha CORRES DO ZK" width={1600} height={1008} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,.98)_0%,rgba(8,8,8,.72)_42%,rgba(8,8,8,.12)_82%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />

        <div className="relative mx-auto flex min-h-[72svh] max-w-7xl items-end px-5 pb-10 sm:min-h-[calc(100svh-4.5rem)] sm:px-6 sm:pb-16">
          <div className="max-w-5xl">
            <div className="flex items-center gap-3 text-primary">
              <span className="zk-red-rule" />
              <p className="zk-eyebrow text-primary">CORRES DO ZK / DROP 01</p>
            </div>
            <h1 className="zk-title mt-5 max-w-4xl text-[4rem] leading-[.86] sm:text-7xl lg:text-[8rem]">
              Nascida na rua.
              <br />
              <span className="text-primary">Feita pro seu corre.</span>
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-6 text-white/65 sm:text-base">
              Streetwear autoral para acompanhar seu corre. Peças com presença e identidade.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-7 text-xs font-bold uppercase tracking-[0.16em]">
                <Link to="/loja">Ver coleção <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Link to="/sobre" className="zk-focus inline-flex h-12 items-center border border-white/20 px-6 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:border-primary hover:text-primary">
                Manifesto
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/45">
              <span>Streetwear</span><span>Identidade própria</span><span>Feita pro seu corre</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-7 right-6 hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[0.25em] text-white/45 lg:flex">
          Scroll <ArrowDownRight className="h-3 w-3" />
        </div>
      </section>

      <div className="overflow-hidden border-y border-primary/30 bg-primary py-3">
        <div className="zk-marquee flex w-max gap-10 text-[10px] font-bold uppercase tracking-[0.28em] text-primary-foreground">
          {Array.from({ length: 8 }).map((_, i) => <span key={i}>NASCIDA NA RUA. FEITA PRO SEU CORRE. • DROP LIMITADO • CORRES DO ZK •</span>)}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-8 md:grid-cols-[.75fr_1.25fr] md:items-end">
          <div>
            <p className="zk-eyebrow text-primary">Explore por categoria</p>
            <h2 className="zk-title mt-3 text-5xl sm:text-6xl">A coleção</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground md:justify-self-end">
            Explore as categorias da marca e encontre as peças que já estão disponíveis.
          </p>
        </div>
        <div className="mt-10 grid border-y border-border sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            category.state === "available" ? (
              <Link key={category.label} to="/loja" search={{ categoria: category.label }} className="zk-focus group border-b border-border p-6 transition-colors hover:bg-card sm:border-l lg:border-b-0 lg:border-l lg:first:border-l-0">
                <p className="text-[9px] font-bold tracking-[0.2em] text-primary">{category.kicker}</p>
                <div className="mt-14 flex items-end justify-between gap-3">
                  <h3 className="text-3xl">{category.label}</h3>
                  <ArrowRight className="mb-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ) : (
              <div key={category.label} className="border-b border-border p-6 opacity-45 sm:border-l lg:border-b-0 lg:border-l">
                <p className="text-[9px] font-bold tracking-[0.2em]">{category.kicker}</p>
                <div className="mt-14 flex items-end justify-between gap-3"><h3 className="text-3xl">{category.label}</h3><span className="text-[9px] font-bold uppercase tracking-[0.18em]">Em breve</span></div>
              </div>
            )
          ))}
        </div>
      </section>

      <section className="zk-grid border-y border-border/70 bg-card/25">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28">
          <div className="flex items-end justify-between gap-6">
            <div><p className="zk-eyebrow text-primary">Agora no corre</p><h2 className="zk-title mt-3 text-5xl sm:text-6xl">Lançamentos</h2></div>
            <Link to="/loja" className="zk-focus hidden text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground sm:block">Ver tudo →</Link>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{destaque.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 md:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="zk-eyebrow text-primary">O manifesto</p>
            <h2 className="zk-title mt-4 max-w-md text-5xl sm:text-6xl">Vestir o processo.</h2>
          </div>
          <div className="max-w-2xl space-y-6 text-sm leading-7 text-muted-foreground">
            <p className="text-lg leading-8 text-foreground/80">Nascida na rua. Feita pro seu corre. A CORRES DO ZK transforma rotina, disciplina e identidade em roupa para usar todos os dias.</p>
            <p>Uma identidade própria para acompanhar o seu corre.</p>
            <Link to="/sobre" className="zk-focus inline-flex border-b border-primary pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Conheça a marca</Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24">
          <div className="grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
            <div className="zk-surface relative overflow-hidden p-8 sm:p-12">
              <div className="absolute right-0 top-0 h-28 w-28 bg-primary/10" />
              <Instagram className="h-5 w-5 text-primary" />
              <p className="zk-eyebrow mt-8">Siga o movimento</p>
              <h2 className="zk-title mt-3 text-4xl sm:text-5xl">@corresdozk</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">Bastidores, drops e o corre diário. Encontre a marca no Instagram e TikTok.</p>
              <div className="mt-8 flex gap-3">
                <a href="https://www.instagram.com/corresdozk/" target="_blank" rel="noreferrer" className="zk-focus inline-flex h-11 items-center gap-2 border border-border px-4 text-[10px] font-bold uppercase tracking-[0.16em] hover:border-primary"><Instagram className="h-4 w-4" /> Instagram</a>
                <a href="https://www.tiktok.com/@corresdozk" target="_blank" rel="noreferrer" className="zk-focus inline-flex h-11 items-center gap-2 border border-border px-4 text-[10px] font-bold uppercase tracking-[0.16em] hover:border-primary"><Play className="h-4 w-4" /> TikTok</a>
              </div>
            </div>
            <div className="border border-border bg-primary p-8 text-primary-foreground sm:p-10">
              <Sparkles className="h-5 w-5" />
              <p className="zk-eyebrow mt-8 text-primary-foreground/70">CORRES DO ZK</p>
              <p className="zk-title mt-3 text-4xl">Feita pro seu corre.</p>
              <p className="mt-5 text-sm leading-6 text-primary-foreground/75">Frete e pagamento são confirmados pelo WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

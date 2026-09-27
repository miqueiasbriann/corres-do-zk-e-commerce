import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CORRES DO ZK — Streetwear premium da quebrada" },
      {
        name: "description",
        content:
          "Moletons e camisetas oversized em tiragem limitada. Drops autorais da CORRES DO ZK, com envio para todo o Brasil.",
      },
      { property: "og:title", content: "CORRES DO ZK — Streetwear premium" },
      {
        property: "og:description",
        content:
          "Drops limitados de moletons e camisetas oversized. Feito na quebrada, vestido em todo canto.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const destaque = products.slice(0, 3);

  return (
    <div className="overflow-hidden">
      <section className="zk-grain relative min-h-[min(780px,88svh)]">
        <img
          src={heroImg}
          alt="Campanha CORRES DO ZK"
          width={1600}
          height={1008}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,9,.96)_0%,rgba(10,10,9,.72)_38%,rgba(10,10,9,.18)_78%,rgba(10,10,9,.4)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />

        <div className="relative mx-auto flex min-h-[min(780px,88svh)] max-w-7xl items-end px-5 pb-14 sm:px-6 sm:pb-20">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 text-primary">
              <span className="h-px w-8 bg-primary" />
              <p className="zk-eyebrow text-primary">Drop 01 — Quebrada</p>
            </div>

            <h1 className="zk-title mt-5 max-w-4xl text-6xl sm:text-8xl lg:text-[7.5rem]">
              Sonhos não morrem,
              <br />
              <span className="text-primary">o corre continua.</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
              Oversized de verdade, algodão pesado e tiragens pequenas.
              Uma marca feita para quem transforma caminho difícil em movimento.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 px-6 font-semibold">
                <Link to="/loja">
                  Ver o drop <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/25 bg-black/15 px-6 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              >
                <Link to="/sobre">A marca</Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/15 pt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
              <span>240–480g</span>
              <span>Tiragem limitada</span>
              <span>Feito no Brasil</span>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-primary/30 bg-primary py-3.5">
        <div className="zk-marquee flex w-max gap-10 text-[11px] font-bold uppercase tracking-[0.3em] text-primary-foreground">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>
              Frete grátis acima de R$ 399 • Tiragem limitada • Feito no Brasil •
            </span>
          ))}
        </div>
      </div>

      <section className="zk-grid mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="zk-eyebrow text-primary">Seleção da casa</p>
            <h2 className="zk-title mt-3 text-5xl sm:text-6xl">Destaques</h2>
          </div>
          <Link
            to="/loja"
            className="zk-focus hidden rounded-sm pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground underline decoration-border underline-offset-8 transition-colors hover:text-foreground sm:block"
          >
            Ver tudo
          </Link>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {destaque.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link to="/loja">Ver catálogo completo</Link>
          </Button>
        </div>
      </section>

      <section className="border-y border-border/70 bg-card/45">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24">
          <div className="grid gap-12 md:grid-cols-[.8fr_1.7fr] md:items-start">
            <div>
              <div className="flex items-center gap-3 text-primary">
                <Sparkles className="h-4 w-4" />
                <p className="zk-eyebrow text-primary">Por trás do produto</p>
              </div>
              <h2 className="zk-title mt-4 max-w-sm text-4xl sm:text-5xl">
                Não é só roupa. É identidade.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  t: "Algodão pesado",
                  d: "Malhas de 240g a 480g, costura reforçada e caimento boxy.",
                },
                {
                  t: "Tiragem limitada",
                  d: "Cada drop tem número fechado de peças. Acabou, virou história.",
                },
                {
                  t: "Feito na quebrada",
                  d: "Produção local com parceiros e atenção em cada detalhe.",
                },
              ].map((f, index) => (
                <div
                  key={f.t}
                  className="zk-surface zk-interactive rounded-sm p-6 sm:p-7"
                >
                  <p className="text-[10px] font-bold tracking-[0.2em] text-primary">
                    0{index + 1}
                  </p>
                  <h3 className="mt-8 text-xl">{f.t}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {f.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

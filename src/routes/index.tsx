import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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
    <div>
      <section className="zk-grain relative">
        <img
          src={heroImg}
          alt="Campanha CORRES DO ZK"
          width={1600}
          height={1008}
          className="h-[78vh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-end px-5 pb-16">
          <p className="zk-eyebrow">Drop 01 — Quebrada</p>
          <h1 className="zk-title mt-4 max-w-3xl text-5xl sm:text-7xl lg:text-8xl">
            Sonhos não morrem,
            <br />
            <span className="text-primary">o corre continua</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm text-muted-foreground sm:text-base">
            Peças oversized em algodão pesado, serigrafia manual e tiragem
            limitada. Quando acaba, acabou.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/loja">
                Ver o drop <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/sobre">A marca</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-border bg-primary py-3">
        <div className="zk-marquee flex w-max gap-10 text-xs font-bold uppercase tracking-[0.3em] text-primary-foreground">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>
              Frete grátis acima de R$ 399 • Tiragem limitada • Feito no Brasil •
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="zk-title text-4xl sm:text-5xl">Destaques</h2>
          <Link
            to="/loja"
            className="zk-eyebrow hover:text-foreground"
          >
            Ver tudo
          </Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {destaque.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-3">
          {[
            {
              t: "Algodão pesado",
              d: "Malhas de 240g a 480g, costura reforçada e caimento boxy de verdade.",
            },
            {
              t: "Tiragem limitada",
              d: "Cada drop tem número fechado de peças. Sem reposição, sem repetição.",
            },
            {
              t: "Feito na quebrada",
              d: "Produção local, parceria com costureiras e serígrafos do bairro.",
            },
          ].map((f) => (
            <div key={f.t}>
              <h3 className="text-xl">{f.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

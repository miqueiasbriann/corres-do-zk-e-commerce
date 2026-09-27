import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/data/products";

export const Route = createFileRoute("/loja")({
  head: () => ({
    meta: [
      { title: "Loja — CORRES DO ZK" },
      {
        name: "description",
        content:
          "Moletons, camisetas e acessórios da CORRES DO ZK. Drops limitados com envio para todo o Brasil.",
      },
      { property: "og:title", content: "Loja — CORRES DO ZK" },
      {
        property: "og:description",
        content: "Todas as peças dos drops atuais da CORRES DO ZK.",
      },
    ],
  }),
  component: Loja,
});

const filtros = ["Tudo", "Moletons", "Camisetas", "Acessórios"] as const;

function Loja() {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>("Tudo");
  const lista =
    filtro === "Tudo" ? products : products.filter((p) => p.category === filtro);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
      <p className="zk-eyebrow">Catálogo</p>
      <h1 className="zk-title mt-3 text-5xl sm:text-6xl">Loja</h1>

      <div className="mt-8 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`zk-focus rounded-sm border px-4 py-2.5 text-xs uppercase tracking-[0.2em] transition-all ${
              filtro === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card/40 text-muted-foreground hover:border-primary/45 hover:bg-accent hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {lista.length === 0 && (
        <p className="mt-16 text-sm text-muted-foreground">
          Nada por aqui ainda. Novos drops em breve.
        </p>
      )}
    </div>
  );
}

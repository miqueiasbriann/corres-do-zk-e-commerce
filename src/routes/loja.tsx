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
    <div className="zk-grid min-h-[70vh]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-8 border-b border-border/70 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="zk-eyebrow text-primary">Catálogo / Drop atual</p>
            <h1 className="zk-title mt-3 text-6xl sm:text-7xl">Loja</h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
              Peças pensadas para durar, feitas em pequenas quantidades e
              prontas para acompanhar o corre.
            </p>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {lista.length} {lista.length === 1 ? "peça" : "peças"}
          </p>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filtrar produtos">
          {filtros.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filtro === f}
              onClick={() => setFiltro(f)}
              className={`zk-focus shrink-0 rounded-full border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all ${
                filtro === f
                  ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
                  : "border-border bg-card/60 text-muted-foreground hover:border-primary/45 hover:bg-accent hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        {lista.length === 0 && (
          <div className="mt-16 border border-dashed border-border p-10 text-center">
            <p className="zk-eyebrow">Sem peças nesta seleção</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Novos drops em breve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

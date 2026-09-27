import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/data/products";

export const Route = createFileRoute("/loja")({
  validateSearch: (search: Record<string, unknown>) => ({
    categoria:
      typeof search.categoria === "string" && filtros.includes(search.categoria as (typeof filtros)[number])
        ? (search.categoria as (typeof filtros)[number])
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Coleção — CORRES DO ZK" },
      { name: "description", content: "Coleção CORRES DO ZK: streetwear premium em tiragem limitada." },
    ],
  }),
  component: Loja,
});

const filtros = ["Tudo", "Camisetas", "Moletons", "Conjuntos", "Calças", "Boné", "Acessórios"] as const;

function Loja() {
  const navigate = useNavigate({ from: "/loja" });
  const { categoria } = Route.useSearch();
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>(categoria ?? "Tudo");
  const lista = filtro === "Tudo" ? products : products.filter((p) => p.category === filtro);

  return (
    <div className="min-h-[70vh]">
      <section className="border-b border-border bg-card/35">
        <div className="mx-auto max-w-7xl px-5 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-20">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="zk-eyebrow text-primary">Drop atual / 01</p>
              <h1 className="zk-title mt-3 text-7xl sm:text-8xl">Coleção</h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
                Nascida na rua. Feita pro seu corre. Peças de presença, produzidas em pequenas tiragens.
              </p>
            </div>
            <div className="border-l-2 border-primary pl-5">
              <p className="zk-title text-4xl">{String(lista.length).padStart(2, "0")}</p>
              <p className="zk-eyebrow mt-1">peças na seleção</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Filtrar coleção">
          {filtros.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filtro === f}
              onClick={() => { setFiltro(f); navigate({ search: f === "Tudo" ? {} : { categoria: f } }); }}
              className={`zk-focus shrink-0 border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] transition-all ${filtro === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {lista.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>

        {lista.length === 0 && (
          <div className="mt-16 border border-dashed border-border p-12 text-center">
            <p className="zk-eyebrow text-primary">Em breve</p>
            <p className="mt-3 text-sm text-muted-foreground">Essa categoria entra no próximo drop.</p>
          </div>
        )}
      </div>
    </div>
  );
}

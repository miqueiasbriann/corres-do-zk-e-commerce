import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/data/products";

const filtros = ["Tudo", "Camisetas", "Moletons", "Conjuntos", "Calças", "Boné", "Acessórios"] as const;

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
      { name: "description", content: "Coleção CORRES DO ZK. O corre não para. O estilo acompanha." },
    ],
  }),
  component: Loja,
});

function Loja() {
  const navigate = useNavigate({ from: "/loja" });
  const { categoria } = Route.useSearch();
  const filtro = categoria ?? "Tudo";
  const lista = filtro === "Tudo" ? products : products.filter((product) => product.category === filtro);

  return (
    <div className="min-h-[72vh] bg-[#090909] text-white">
      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#111,#090909)]">
        <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-18 lg:px-8">
          <p className="zk-eyebrow text-primary">Coleção / CORRES DO ZK</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="zk-title text-6xl sm:text-8xl">Seu corre começa aqui.</h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/52">Explore as peças disponíveis e escolha o que acompanha sua rotina.</p>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{String(lista.length).padStart(2, "0")} peças</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="sticky top-[4.35rem] z-30 -mx-4 flex gap-2 overflow-x-auto border-y border-white/10 bg-black/92 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8" role="tablist" aria-label="Filtrar coleção">
          {filtros.map((filtroItem) => (
            <button
              key={filtroItem}
              type="button"
              role="tab"
              aria-selected={filtro === filtroItem}
              onClick={() => navigate({ search: filtroItem === "Tudo" ? {} : { categoria: filtroItem } })}
              className={`zk-focus shrink-0 border px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.18em] transition ${filtro === filtroItem ? "border-primary bg-primary text-white" : "border-white/12 bg-white/[0.025] text-white/55 hover:border-white/35 hover:text-white"}`}
            >
              {filtroItem}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-4">
          {lista.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>

        {lista.length === 0 && (
          <div className="my-16 border border-dashed border-white/15 bg-white/[0.02] p-10 text-center sm:p-14">
            <p className="zk-eyebrow text-primary">{filtro === "Acessórios" ? "Acessórios / Em breve" : "Categoria"}</p>
            <p className="mt-4 text-sm text-white/50">{filtro === "Acessórios" ? "Acessórios — em breve." : "Nenhum produto cadastrado nesta categoria."}</p>
          </div>
        )}
      </div>
    </div>
  );
}

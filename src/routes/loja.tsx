import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/data/products";

const categorias = ["Tudo", "Camisetas", "Moletons", "Conjuntos", "Calças", "Boné", "Acessórios"] as const;
const priceOptions = [
  { value: "all", label: "Todos os preços" },
  { value: "under-200", label: "Até R$ 200" },
  { value: "200-400", label: "R$ 200 a R$ 400" },
  { value: "over-400", label: "Acima de R$ 400" },
] as const;

export const Route = createFileRoute("/loja")({
  validateSearch: (search: Record<string, unknown>): { categoria?: (typeof categorias)[number] } => {
    const raw = search["categoria"];
    return typeof raw === "string" && categorias.includes(raw as (typeof categorias)[number])
      ? { categoria: raw as (typeof categorias)[number] }
      : {};
  },
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
  const categoriaAtiva = categoria ?? "Tudo";
  const [size, setSize] = useState("all");
  const [color, setColor] = useState("all");
  const [price, setPrice] = useState<(typeof priceOptions)[number]["value"]>("all");
  const [sort, setSort] = useState("featured");

  const sizes = useMemo(
    () => Array.from(new Set(products.flatMap((product) => product.sizes))).sort(),
    [],
  );
  const colors = useMemo(
    () => Array.from(new Set(products.flatMap((product) => product.colors))).sort(),
    [],
  );

  const lista = useMemo(() => {
    const filtered = products.filter((product) => {
      if (categoriaAtiva !== "Tudo" && product.category !== categoriaAtiva) return false;
      if (size !== "all" && !product.variants.some((variant) => variant.size === size && variant.stock > 0)) return false;
      if (color !== "all" && !product.variants.some((variant) => variant.color === color && variant.stock > 0)) return false;
      if (price === "under-200" && product.price > 200) return false;
      if (price === "200-400" && (product.price < 200 || product.price > 400)) return false;
      if (price === "over-400" && product.price <= 400) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name, "pt-BR");
      return products.indexOf(a) - products.indexOf(b);
    });
  }, [categoriaAtiva, color, price, size, sort]);

  const hasExtraFilters = size !== "all" || color !== "all" || price !== "all" || sort !== "featured";
  const resetFilters = () => {
    setSize("all");
    setColor("all");
    setPrice("all");
    setSort("featured");
    navigate({ search: {} });
  };

  return (
    <div className="min-h-[72vh] bg-[#090909] text-white">
      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#111,#090909)]">
        <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8">
          <p className="zk-eyebrow text-primary">Coleção / CORRES DO ZK</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div className="min-w-0">
              <h1 className="zk-title max-w-4xl text-[3.25rem] leading-[.9] sm:text-7xl lg:text-8xl">Seu corre começa aqui.</h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/52">Filtre por tamanho, cor e faixa de preço para encontrar a peça certa.</p>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{String(lista.length).padStart(2, "0")} peças</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por categoria">
          {categorias.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={categoriaAtiva === item}
              onClick={() => navigate({ search: item === "Tudo" ? {} : { categoria: item } })}
              className={`zk-focus min-h-11 border px-3.5 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] transition sm:px-4 ${categoriaAtiva === item ? "border-primary bg-primary text-white" : "border-white/12 bg-white/[0.025] text-white/55 hover:border-white/35 hover:text-white"}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-5 border-y border-white/10 bg-white/[0.018] py-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/50"><SlidersHorizontal className="h-4 w-4 text-primary" /> Refine a seleção</p>
            {(hasExtraFilters || categoriaAtiva !== "Tudo") && (
              <button type="button" onClick={resetFilters} className="zk-focus inline-flex min-h-11 items-center gap-2 px-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/55 hover:text-white">
                <RotateCcw className="h-3.5 w-3.5" /> Limpar
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <label className="min-w-0">
              <span className="sr-only">Tamanho</span>
              <select value={size} onChange={(event) => setSize(event.target.value)} className="h-11 w-full min-w-0 border border-white/15 bg-[#101010] px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white outline-none focus:border-primary">
                <option value="all">Tamanho: todos</option>
                {sizes.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="min-w-0">
              <span className="sr-only">Cor</span>
              <select value={color} onChange={(event) => setColor(event.target.value)} className="h-11 w-full min-w-0 border border-white/15 bg-[#101010] px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white outline-none focus:border-primary">
                <option value="all">Cor: todas</option>
                {colors.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="min-w-0">
              <span className="sr-only">Preço</span>
              <select value={price} onChange={(event) => setPrice(event.target.value as (typeof priceOptions)[number]["value"])} className="h-11 w-full min-w-0 border border-white/15 bg-[#101010] px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white outline-none focus:border-primary">
                {priceOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </label>
            <label className="min-w-0">
              <span className="sr-only">Ordenar</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 w-full min-w-0 border border-white/15 bg-[#101010] px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white outline-none focus:border-primary">
                <option value="featured">Ordenar: destaques</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name">Nome A–Z</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-4">
          {lista.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>

        {lista.length === 0 && (
          <div className="my-16 border border-dashed border-white/15 bg-white/[0.02] p-8 text-center sm:p-14">
            <p className="zk-eyebrow text-primary">{categoriaAtiva === "Acessórios" ? "Acessórios / Em breve" : "Sem resultados"}</p>
            <h2 className="zk-title mt-3 text-3xl sm:text-4xl">{categoriaAtiva === "Acessórios" ? "Novidades estão a caminho." : "Nenhuma peça combina com estes filtros."}</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/45">Explore outras peças disponíveis ou limpe os filtros para ver toda a coleção.</p>
            <button type="button" onClick={resetFilters} className="zk-focus mt-6 inline-flex min-h-12 items-center justify-center bg-primary px-6 text-[10px] font-black uppercase tracking-[0.18em] text-white">
              Explorar outras peças
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

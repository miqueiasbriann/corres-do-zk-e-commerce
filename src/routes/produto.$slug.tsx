import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatBRL, getProduct, products } from "@/data/products";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Peça não encontrada — CORRES DO ZK" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — CORRES DO ZK` },
        { name: "description", content: product.description },
        { property: "og:title", content: `${product.name} — CORRES DO ZK` },
        { property: "og:description", content: product.description },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-32 text-center">
      <h1 className="zk-title text-4xl">Peça não encontrada</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Esse item pode ter esgotado ou saído do catálogo.
      </p>
      <Button asChild className="mt-8">
        <Link to="/loja">Voltar para a loja</Link>
      </Button>
    </div>
  ),
  component: Produto,
});

function Produto() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(null);

  const relacionados = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:py-14">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="zk-surface zk-grain overflow-hidden rounded-sm">
          <img
            src={product.image}
            alt={product.name}
            width={1008}
            height={1200}
            className="aspect-[5/6] w-full object-cover"
          />
        </div>

        <div>
          <p className="zk-eyebrow">{product.drop}</p>
          <h1 className="zk-title mt-3 text-4xl sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-2xl font-bold text-primary">
            {formatBRL(product.price)}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <p className="zk-eyebrow mt-10">Tamanho</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`zk-focus h-11 w-14 rounded-sm border text-sm uppercase transition-all ${
                  size === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card/50 hover:border-primary/50 hover:bg-accent"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <Button
            size="lg"
            className="mt-8 w-full sm:w-auto"
            onClick={() => {
              if (!size) {
                toast.error("Escolha um tamanho");
                return;
              }
              add({
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
                size,
                qty: 1,
              });
              toast.success("Adicionado à sacola", {
                description: `${product.name} • Tam ${size}`,
              });
            }}
          >
            Adicionar à sacola
          </Button>

          <ul className="mt-8 grid gap-2 border-t border-border/70 pt-6 text-xs uppercase tracking-[0.15em] text-muted-foreground sm:grid-cols-3">
            <li>{product.stock} peças disponíveis</li>
            <li>Envio em até 3 dias úteis</li>
            <li>Troca gratuita em 7 dias</li>
          </ul>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-24">
          <h2 className="zk-title text-3xl">Combina com</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

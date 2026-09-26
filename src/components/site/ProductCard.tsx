import { Link } from "@tanstack/react-router";
import { formatBRL, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="zk-grain overflow-hidden border border-border bg-card">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1008}
          height={1200}
          className="aspect-[5/6] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">
            {product.name}
          </p>
          <p className="zk-eyebrow mt-1">{product.drop}</p>
        </div>
        <p className="whitespace-nowrap text-sm font-bold text-primary">
          {formatBRL(product.price)}
        </p>
      </div>
    </Link>
  );
}

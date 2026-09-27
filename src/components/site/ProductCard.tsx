import { Link } from "@tanstack/react-router";
import { formatBRL, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="group zk-focus block rounded-sm"
    >
      <div className="zk-surface zk-interactive zk-grain overflow-hidden rounded-sm">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1008}
          height={1200}
          className="aspect-[5/6] w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.04em]">
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

import { Link } from "@tanstack/react-router";
import { formatBRL, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="group zk-focus block rounded-sm"
      aria-label={`Ver ${product.name}`}
    >
      <div className="zk-surface zk-image-frame zk-grain overflow-hidden rounded-sm">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1008}
            height={1200}
            className="aspect-[5/6] w-full object-cover"
          />
          <span className="absolute left-3 top-3 z-10 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
            {product.drop}
          </span>
          {product.stock <= 12 && (
            <span className="absolute bottom-3 left-3 z-10 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-foreground">
              Últimas peças
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.04em] transition-colors group-hover:text-primary">
            {product.name}
          </p>
          <p className="zk-eyebrow mt-1.5">{product.category}</p>
        </div>
        <p className="whitespace-nowrap text-sm font-bold text-primary">
          {formatBRL(product.price)}
        </p>
      </div>
    </Link>
  );
}

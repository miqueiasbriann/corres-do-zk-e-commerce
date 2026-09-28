import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatBRL, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const gallery = product.images;
  const image = gallery[0] || product.image;

  return (
    <Link to="/produto/$slug" params={{ slug: product.slug }} className="group zk-focus block min-w-0" aria-label={`Ver ${product.name}`}>
      <div className="zk-card-3d zk-image-frame relative overflow-hidden border border-white/10 bg-[#111]">
        <img src={image} alt={product.name} loading="lazy" width={1008} height={1200} className="aspect-[4/5] w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        {product.isDemo && (
          <span className="absolute left-2 top-2 z-10 border border-white/20 bg-black/70 px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/85 backdrop-blur sm:left-3 sm:top-3">
            Demonstração
          </span>
        )}
        {!product.isDemo && product.stock <= 12 && (
          <span className="absolute left-2 top-2 z-10 bg-primary px-2 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-white sm:left-3 sm:top-3 sm:text-[9px]">Últimas peças</span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2 sm:mt-4 sm:gap-4">
        <div className="min-w-0">
          <p className="line-clamp-2 text-[11px] font-black uppercase leading-4 tracking-[0.04em] text-white transition-colors group-hover:text-primary sm:text-sm sm:leading-5">{product.name}</p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white/42 sm:text-[10px]">{formatBRL(product.price)}</p>
        </div>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-white/45 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      <p className="mt-2 hidden text-[9px] font-bold uppercase tracking-[0.18em] text-white/55 sm:block">Ver peça →</p>
    </Link>
  );
}

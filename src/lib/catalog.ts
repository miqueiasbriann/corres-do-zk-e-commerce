import { queryOptions, useQuery } from "@tanstack/react-query";
import hoodie from "@/assets/p-hoodie.jpg";
import tee from "@/assets/p-tee.jpg";
import type { Product, ProductCategory, ProductVariant } from "@/data/products";
import { listProductsFn, type ProductRow } from "./catalog.functions";

const fallbackImage = (category: string) => (category === "Moletons" ? hoodie : tee);

function makeVariants(sizes: string[], colors: string[], totalStock: number): ProductVariant[] {
  const pairs = sizes.flatMap((size) => colors.map((color) => ({ size, color })));
  if (pairs.length === 0) return [];
  const base = Math.floor(totalStock / pairs.length);
  const remainder = totalStock % pairs.length;
  return pairs.map((pair, index) => ({ ...pair, stock: base + (index < remainder ? 1 : 0) }));
}

export function rowToProduct(row: ProductRow): Product {
  const sizes = row.sizes?.length ? row.sizes : ["Único"];
  const colors = row.colors?.length ? row.colors : ["Preto"];
  const images = row.images?.length ? row.images : [fallbackImage(row.category)];
  const stock = row.status === "esgotado" ? 0 : row.stock;

  return {
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    category: row.category as ProductCategory,
    image: images[0] ?? fallbackImage(row.category),
    images,
    drop: row.drop_name,
    stock,
    sizes,
    colors,
    variants: makeVariants(sizes, colors, stock),
    description: row.description,
  };
}

export const productsQueryOptions = queryOptions({
  queryKey: ["products"],
  queryFn: async () => (await listProductsFn()).map(rowToProduct),
  staleTime: 30_000,
});

export function useProducts(): Product[] {
  const { data } = useQuery(productsQueryOptions);
  return data ?? [];
}

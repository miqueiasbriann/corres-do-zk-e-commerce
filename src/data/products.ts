import hoodie from "@/assets/p-hoodie.jpg";
import tee from "@/assets/p-tee.jpg";

export type ProductCategory = "Moletons" | "Camisetas" | "Conjuntos" | "Calças" | "Boné" | "Acessórios";

export type ProductVariant = {
  size: string;
  color: string;
  stock: number;
};

export type Product = {
  slug: string;
  name: string;
  price: number;
  category: ProductCategory;
  image: string;
  images: string[];
  drop: string;
  stock: number;
  sizes: string[];
  colors: string[];
  variants: ProductVariant[];
  sizeGuide?: string;
  description: string;
  isDemo?: boolean;
};

export type Coupon = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
};

export const storeConfig = {
  whatsappNumber: "5518997087679",
  paymentMethods: [] as string[],
  coupons: [] as Coupon[],
};

function makeVariants(sizes: string[], color: string, totalStock: number): ProductVariant[] {
  if (sizes.length === 0) return [];
  const base = Math.floor(totalStock / sizes.length);
  const remainder = totalStock % sizes.length;
  return sizes.map((size, index) => ({
    size,
    color,
    stock: base + (index < remainder ? 1 : 0),
  }));
}

function product(input: Omit<Product, "images" | "colors" | "variants"> & { color: string }): Product {
  return {
    ...input,
    images: [input.image],
    colors: [input.color],
    variants: makeVariants(input.sizes, input.color, input.stock),
  };
}

export const products: Product[] = [
  product({
    slug: "moletom-sonhos-nao-morrem",
    name: "Moletom Sonhos Não Morrem",
    price: 429,
    category: "Moletons",
    image: hoodie,
    color: "Preto",
    drop: "Drop 01 — Quebrada",
    stock: 24,
    sizes: ["P", "M", "G", "GG"],
    description:
      "Moletom oversized em algodão pesado 480g, gola canelada e estampa serigrafada à mão. Peça central do primeiro drop.",
    isDemo: true,
  }),
  product({
    slug: "camiseta-osso-heavy",
    name: "Camiseta Osso Heavy",
    price: 189,
    category: "Camisetas",
    image: tee,
    color: "Osso",
    drop: "Drop 01 — Quebrada",
    stock: 58,
    sizes: ["P", "M", "G", "GG", "XGG"],
    description:
      "Camiseta boxy em malha 240g, caimento largo e costura reforçada. Tingimento osso lavado.",
    isDemo: true,
  }),
  product({
    slug: "moletom-poste-de-luz",
    name: "Moletom Poste de Luz",
    price: 449,
    category: "Moletons",
    image: hoodie,
    color: "Preto",
    drop: "Drop 02 — Madrugada",
    stock: 12,
    sizes: ["M", "G", "GG"],
    description:
      "Capuz duplo, bolso canguru profundo e bordado âmbar no peito. Produção limitada.",
    isDemo: true,
  }),
  product({
    slug: "camiseta-zk-classica",
    name: "Camiseta ZK Clássica",
    price: 169,
    category: "Camisetas",
    image: tee,
    color: "Preto",
    drop: "Essenciais",
    stock: 90,
    sizes: ["P", "M", "G", "GG"],
    description:
      "O básico da casa: logo ZK em alto relevo, algodão penteado e modelagem reta.",
    isDemo: true,
  }),
  product({
    slug: "moletom-madrugada",
    name: "Moletom Madrugada",
    price: 399,
    category: "Moletons",
    image: hoodie,
    color: "Preto",
    drop: "Drop 02 — Madrugada",
    stock: 7,
    sizes: ["G", "GG"],
    description:
      "Peça monocromática com lavagem stone e etiqueta tecida na barra.",
    isDemo: true,
  }),
  product({
    slug: "camiseta-corre-diario",
    name: "Camiseta Corre Diário",
    price: 179,
    category: "Camisetas",
    image: tee,
    color: "Preto",
    drop: "Essenciais",
    stock: 41,
    sizes: ["P", "M", "G", "GG"],
    description:
      "Estampa nas costas com tipografia condensada. Feita pra rodar o dia inteiro.",
    isDemo: true,
  }),
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export function getVariantStock(product: Product, size: string, color: string) {
  return product.variants.find((variant) => variant.size === size && variant.color === color)?.stock ?? 0;
}

export const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

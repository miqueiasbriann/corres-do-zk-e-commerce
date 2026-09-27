import hoodie from "@/assets/p-hoodie.jpg";
import tee from "@/assets/p-tee.jpg";

export type Product = {
  slug: string;
  name: string;
  price: number;
  category: "Moletons" | "Camisetas" | "Conjuntos" | "Calças" | "Boné" | "Acessórios";
  image: string;
  drop: string;
  stock: number;
  sizes: string[];
  description: string;
};

export const products: Product[] = [
  {
    slug: "moletom-sonhos-nao-morrem",
    name: "Moletom Sonhos Não Morrem",
    price: 429,
    category: "Moletons",
    image: hoodie,
    drop: "Drop 01 — Quebrada",
    stock: 24,
    sizes: ["P", "M", "G", "GG"],
    description:
      "Moletom oversized em algodão pesado 480g, gola canelada e estampa serigrafada à mão. Peça central do primeiro drop.",
  },
  {
    slug: "camiseta-osso-heavy",
    name: "Camiseta Osso Heavy",
    price: 189,
    category: "Camisetas",
    image: tee,
    drop: "Drop 01 — Quebrada",
    stock: 58,
    sizes: ["P", "M", "G", "GG", "XGG"],
    description:
      "Camiseta boxy em malha 240g, caimento largo e costura reforçada. Tingimento osso lavado.",
  },
  {
    slug: "moletom-poste-de-luz",
    name: "Moletom Poste de Luz",
    price: 449,
    category: "Moletons",
    image: hoodie,
    drop: "Drop 02 — Madrugada",
    stock: 12,
    sizes: ["M", "G", "GG"],
    description:
      "Capuz duplo, bolso canguru profundo e bordado âmbar no peito. Produção limitada.",
  },
  {
    slug: "camiseta-zk-classica",
    name: "Camiseta ZK Clássica",
    price: 169,
    category: "Camisetas",
    image: tee,
    drop: "Essenciais",
    stock: 90,
    sizes: ["P", "M", "G", "GG"],
    description:
      "O básico da casa: logo ZK em alto relevo, algodão penteado e modelagem reta.",
  },
  {
    slug: "moletom-madrugada",
    name: "Moletom Madrugada",
    price: 399,
    category: "Moletons",
    image: hoodie,
    drop: "Drop 02 — Madrugada",
    stock: 7,
    sizes: ["G", "GG"],
    description:
      "Peça monocromática com lavagem stone e etiqueta tecida na barra.",
  },
  {
    slug: "camiseta-corre-diario",
    name: "Camiseta Corre Diário",
    price: 179,
    category: "Camisetas",
    image: tee,
    drop: "Essenciais",
    stock: 41,
    sizes: ["P", "M", "G", "GG"],
    description:
      "Estampa nas costas com tipografia condensada. Feita pra rodar o dia inteiro.",
  },
];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

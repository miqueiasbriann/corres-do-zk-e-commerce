import { supabase } from "@/lib/supabase";

export type AdminProductInput = {
  slug: string;
  name: string;
  price: number;
  sale_price?: number;
  description: string;
  category: string;
  image: string;
  images?: string[];
  stock: number;
  sizes: string[];
  colors: string[];
  variants?: Array<{ size: string; color: string; stock: number }>;
  drop?: string;
  featured?: boolean;
  active?: boolean;
};

function normalizeProduct(product: AdminProductInput) {
  return {
    ...product,
    images: product.images ?? (product.image ? [product.image] : []),
    sizes: product.sizes ?? [],
    colors: product.colors ?? [],
    variants: product.variants ?? [],
    featured: product.featured ?? false,
    active: product.active ?? true,
    sale_price: product.sale_price ?? null,
    drop: product.drop ?? "",
  };
}

export async function listProducts() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function saveProduct(product: AdminProductInput) {
  if (!supabase) throw new Error("Supabase não configurado");

  const payload = normalizeProduct(product);

  const { data, error } = await supabase
    .from("products")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(slug: string) {
  if (!supabase) throw new Error("Supabase não configurado");

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("slug", slug);

  if (error) throw error;
}

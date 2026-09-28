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

  const { data, error } = await supabase
    .from("products")
    .upsert(product)
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

import { supabase } from "@/lib/supabase";

export async function uploadProductImage(file: File) {
  if (!supabase) throw new Error("Supabase não configurado");

  const fileName = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

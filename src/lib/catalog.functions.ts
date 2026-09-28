import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export type ProductRow = {
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  drop_name: string;
  sizes: string[];
  colors: string[];
  stock: number;
  images: string[];
  status: string;
  sort_order: number;
};

export const STORAGE_PREFIX = "storage:";
export const PRODUCT_BUCKET = "product-images";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const listProductsFn = createServerFn({ method: "GET" }).handler(async (): Promise<ProductRow[]> => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug,name,description,category,price,drop_name,sizes,colors,stock,images,status,sort_order")
    .neq("status", "oculto")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  const rows = (data ?? []) as ProductRow[];

  const paths = rows.flatMap((row) =>
    (row.images ?? []).filter((image) => image.startsWith(STORAGE_PREFIX)).map((image) => image.slice(STORAGE_PREFIX.length)),
  );

  if (paths.length === 0) return rows.map((row) => ({ ...row, price: Number(row.price) }));

  const { data: signed } = await supabase.storage.from(PRODUCT_BUCKET).createSignedUrls(paths, 60 * 60 * 24 * 7);
  const map = new Map<string, string>();
  for (const entry of signed ?? []) {
    if (entry.path && entry.signedUrl) map.set(entry.path, entry.signedUrl);
  }

  return rows.map((row) => ({
    ...row,
    price: Number(row.price),
    images: (row.images ?? []).map((image) =>
      image.startsWith(STORAGE_PREFIX) ? map.get(image.slice(STORAGE_PREFIX.length)) ?? "" : image,
    ).filter(Boolean),
  }));
});

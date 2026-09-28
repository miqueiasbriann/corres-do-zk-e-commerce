import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Trash2, Plus } from "lucide-react";
import { products as demoProducts } from "@/data/products";
import { deleteProduct, listProducts, saveProduct, type AdminProductInput } from "@/services/products";
import { uploadProductImage } from "@/services/storage";
import { ProductField } from "@/features/admin/ProductField";
import type { Product } from "@/data/products";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(demoProducts[0] ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listProducts().then((items) => {
      if (items.length) {
        setProducts(items as Product[]);
        setSelectedProduct(items[0] as Product);
      }
    }).catch(() => undefined);
  }, []);

  async function handleSave() {
    if (!selectedProduct) return;
    setSaving(true);
    try {
      const saved = await saveProduct(selectedProduct as AdminProductInput);
      setProducts((items) => items.map((item) => item.slug === selectedProduct.slug ? saved as Product : item));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedProduct) return;
    await deleteProduct(selectedProduct.slug);
    const next = products.filter((item) => item.slug !== selectedProduct.slug);
    setProducts(next);
    setSelectedProduct(next[0] ?? null);
  }

  function createProduct() {
    setSelectedProduct({ ...demoProducts[0], slug: `novo-${Date.now()}`, name: "Novo produto", price: 0, stock: 0, sizes: [], colors: [] });
  }

  function updateField(field: keyof Product, value: string | number | string[]) {
    if (selectedProduct) setSelectedProduct({ ...selectedProduct, [field]: value });
  }

  async function handleImage(file?: File) {
    if (!file || !selectedProduct) return;
    const url = await uploadProductImage(file);
    updateField("image", url);
    updateField("images", [url]);
  }

  return <main className="min-h-screen bg-black px-6 py-10 text-white"><div className="mx-auto max-w-7xl">
    <header className="mb-8"><p className="text-xs tracking-[0.35em] text-red-500">CORRES DO ZK</p><h1 className="mt-3 text-4xl font-black uppercase">Painel Admin</h1></header>
    <button onClick={createProduct} className="mb-6 flex gap-2 rounded-full bg-red-600 px-5 py-3 font-bold"><Plus size={18}/>Novo produto</button>
    <section className="grid gap-6 lg:grid-cols-[360px_1fr]"><aside className="rounded-3xl border border-white/10 bg-white/5 p-4">{products.map((product)=><button key={product.slug} onClick={()=>setSelectedProduct(product)} className="flex w-full gap-3 rounded-2xl p-3 text-left hover:bg-white/10"><img src={product.image} className="h-14 w-14 rounded-xl object-cover"/><span>{product.name}</span></button>)}</aside>
    {selectedProduct && <section className="rounded-3xl border border-white/10 bg-white/5 p-6"><h2 className="text-2xl font-black">Editor de produto</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><ProductField label="Nome" value={selectedProduct.name} onChange={(v)=>updateField("name",v)}/><ProductField label="Preço" type="number" value={selectedProduct.price} onChange={(v)=>updateField("price",Number(v))}/><ProductField label="Estoque" type="number" value={selectedProduct.stock} onChange={(v)=>updateField("stock",Number(v))}/><ProductField label="Categoria" value={selectedProduct.category} onChange={(v)=>updateField("category",v)}/></div><input type="file" accept="image/*" onChange={(e)=>handleImage(e.target.files?.[0])} className="mt-5"/><div className="mt-6 flex gap-3"><button onClick={handleSave} disabled={saving} className="flex gap-2 rounded-full bg-red-600 px-6 py-3 font-bold"><Save size={18}/>{saving?"Salvando":"Salvar"}</button><button onClick={handleDelete} className="flex gap-2 rounded-full border border-red-500 px-6 py-3 text-red-400"><Trash2 size={18}/>Excluir</button></div></section>}</section>
  </div></main>;
}

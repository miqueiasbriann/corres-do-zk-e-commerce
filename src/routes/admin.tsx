import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Trash2, Plus } from "lucide-react";
import { deleteProduct, listProducts, saveProduct, type AdminProductInput } from "@/services/products";
import { uploadProductImage } from "@/services/storage";
import { ProductField } from "@/features/admin/ProductField";
import { ImageGallery } from "@/features/admin/ImageGallery";
import { VariantManager } from "@/features/admin/VariantManager";
import type { Product } from "@/data/products";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listProducts().then((items) => {
      setProducts(items as Product[]);
      setSelectedProduct(items[0] ?? null);
    }).catch(() => undefined);
  }, []);

  function createProduct() {
    setSelectedProduct({
      slug: `novo-${Date.now()}`,
      name: "Novo produto",
      price: 0,
      sale_price: 0,
      stock: 0,
      images: [],
      variants: [],
      featured: false,
      active: true,
      drop: ""
    });
  }

  async function handleSave() {
    if (!selectedProduct) return;
    setSaving(true);
    try {
      const saved = await saveProduct(selectedProduct as AdminProductInput);
      setProducts((items) => {
        const exists = items.some((item) => item.slug === saved.slug);
        return exists ? items.map((item) => item.slug === saved.slug ? saved as Product : item) : [...items, saved as Product];
      });
      setSelectedProduct(saved);
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

  async function handleImage(file?: File) {
    if (!file || !selectedProduct) return;
    const url = await uploadProductImage(file);
    setSelectedProduct({ ...selectedProduct, image: url, images: [...(selectedProduct.images ?? []), url] });
  }

  return <main className="min-h-screen bg-black px-6 py-10 text-white"><div className="mx-auto max-w-7xl">
    <header className="mb-8"><p className="text-xs tracking-[0.35em] text-red-500">CORRES DO ZK</p><h1 className="mt-3 text-4xl font-black uppercase">Painel Admin</h1></header>
    <button onClick={createProduct} className="mb-6 flex gap-2 rounded-full bg-red-600 px-5 py-3 font-bold"><Plus size={18}/>Novo produto</button>
    <section className="grid gap-6 lg:grid-cols-[360px_1fr]"><aside className="rounded-3xl border border-white/10 bg-white/5 p-4">{products.map((product)=><button key={product.slug} onClick={()=>setSelectedProduct(product)} className="flex w-full gap-3 rounded-2xl p-3 text-left hover:bg-white/10"><img src={product.image} className="h-14 w-14 rounded-xl object-cover"/><span>{product.name}</span></button>)}</aside>
    {selectedProduct && <section className="rounded-3xl border border-white/10 bg-white/5 p-6"><h2 className="text-2xl font-black">Editor de produto</h2><div className="mt-5 grid gap-4 md:grid-cols-2">
      <ProductField label="Nome" value={selectedProduct.name} onChange={(v)=>setSelectedProduct({...selectedProduct,name:v})}/>
      <ProductField label="Preço" type="number" value={selectedProduct.price} onChange={(v)=>setSelectedProduct({...selectedProduct,price:Number(v)})}/>
      <ProductField label="Preço promocional" type="number" value={selectedProduct.sale_price ?? 0} onChange={(v)=>setSelectedProduct({...selectedProduct,sale_price:Number(v)})}/>
      <ProductField label="Estoque" type="number" value={selectedProduct.stock} onChange={(v)=>setSelectedProduct({...selectedProduct,stock:Number(v)})}/>
      <ProductField label="Categoria" value={selectedProduct.category} onChange={(v)=>setSelectedProduct({...selectedProduct,category:v})}/>
      <ProductField label="Drop/Coleção" value={selectedProduct.drop ?? ""} onChange={(v)=>setSelectedProduct({...selectedProduct,drop:v})}/>
    </div>
    <label className="mt-4 flex gap-3"><input type="checkbox" checked={!!selectedProduct.featured} onChange={(e)=>setSelectedProduct({...selectedProduct,featured:e.target.checked})}/>Produto em destaque</label>
    <label className="mt-2 flex gap-3"><input type="checkbox" checked={!!selectedProduct.active} onChange={(e)=>setSelectedProduct({...selectedProduct,active:e.target.checked})}/>Produto ativo</label>
    <VariantManager variants={selectedProduct.variants ?? []} onChange={(variants)=>setSelectedProduct({...selectedProduct,variants})}/><input type="file" accept="image/*" onChange={(e)=>handleImage(e.target.files?.[0])} className="mt-5"/><ImageGallery images={selectedProduct.images ?? []} onRemove={(index)=>setSelectedProduct({...selectedProduct,images:selectedProduct.images.filter((_:string,i:number)=>i!==index)})}/><div className="mt-6 flex gap-3"><button onClick={handleSave} disabled={saving} className="flex gap-2 rounded-full bg-red-600 px-6 py-3 font-bold"><Save size={18}/>{saving?"Salvando":"Salvar"}</button><button onClick={handleDelete} className="flex gap-2 rounded-full border border-red-500 px-6 py-3 text-red-400"><Trash2 size={18}/>Excluir</button></div></section>}</section>
  </div></main>;
}

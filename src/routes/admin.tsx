import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImagePlus, Package, Pencil, Save, Trash2, Plus } from "lucide-react";
import { products as demoProducts } from "@/data/products";
import { deleteProduct, listProducts, saveProduct, type AdminProductInput } from "@/services/products";
import { uploadProductImage } from "@/services/storage";
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
      setProducts((current) => current.map((item) => item.slug === selectedProduct.slug ? saved as Product : item));
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
    setSelectedProduct({ ...selectedProduct, image: url, images: [url] });
  }

  function updateField(field: keyof Product, value: string | number) {
    if (!selectedProduct) return;
    setSelectedProduct({ ...selectedProduct, [field]: value });
  }

  function createProduct() {
    setSelectedProduct({ ...demoProducts[0], slug: `novo-${Date.now()}`, name: "Novo produto", price: 0, stock: 0 });
  }

  return <main className="min-h-screen bg-black px-6 py-10 text-white md:px-12"><div className="mx-auto max-w-7xl">
    <header className="mb-10"><p className="text-xs tracking-[0.35em] text-red-500">CORRES DO ZK</p><h1 className="mt-3 text-4xl font-black uppercase">Painel Admin</h1></header>
    <button onClick={createProduct} className="mb-6 flex gap-2 rounded-full bg-red-600 px-5 py-3 font-bold"><Plus size={18}/>Novo produto</button>
    <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4"><h2 className="mb-4 font-bold">Produtos</h2>{products.map((product)=><button key={product.slug} onClick={()=>setSelectedProduct(product)} className="flex w-full gap-3 rounded-2xl p-3 text-left hover:bg-white/10"><img src={product.image} className="h-14 w-14 rounded-xl object-cover"/><span>{product.name}</span></button>)}</div>
      {selectedProduct && <div className="rounded-3xl border border-white/10 bg-white/5 p-6"><h2 className="text-2xl font-black">Editar produto</h2><div className="mt-6 grid gap-4 md:grid-cols-2"><Input label="Nome" value={selectedProduct.name} onChange={(v)=>updateField("name",v)}/><Input label="Preço" value={selectedProduct.price} onChange={(v)=>updateField("price",Number(v))}/><Input label="Estoque" value={selectedProduct.stock} onChange={(v)=>updateField("stock",Number(v))}/><Input label="Categoria" value={selectedProduct.category} onChange={(v)=>updateField("category",v)}/></div><input type="file" accept="image/*" onChange={(e)=>handleImage(e.target.files?.[0])} className="mt-4"/><div className="mt-6 flex gap-3"><button onClick={handleSave} disabled={saving} className="flex gap-2 rounded-full bg-red-600 px-6 py-3 font-bold"><Save size={18}/>Salvar</button><button onClick={handleDelete} className="flex gap-2 rounded-full border border-red-500 px-6 py-3 text-red-400"><Trash2 size={18}/>Excluir</button></div></div>}
    </section>
  </div></main>;
}

function Input({label,value,onChange}:{label:string;value:string|number;onChange:(value:string)=>void}){return <label><span className="text-xs uppercase text-white/50">{label}</span><input className="mt-2 w-full rounded-xl bg-black/40 p-3" value={value} onChange={(e)=>onChange(e.target.value)}/></label>}

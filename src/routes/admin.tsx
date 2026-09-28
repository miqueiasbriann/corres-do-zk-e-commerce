import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImagePlus, Package, Pencil, Save } from "lucide-react";
import { products as demoProducts } from "@/data/products";
import { listProducts, saveProduct, type AdminProductInput } from "@/services/products";
import { uploadProductImage } from "@/services/storage";
import type { Product } from "@/data/products";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(demoProducts[0] ?? null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    try { await saveProduct(selectedProduct as AdminProductInput); }
    finally { setSaving(false); }
  }

  async function handleImage(file?: File) {
    if (!file || !selectedProduct) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setSelectedProduct({ ...selectedProduct, image: url, images: [url] });
    } finally { setUploading(false); }
  }

  function updateField(field: keyof Product, value: string | number) {
    if (!selectedProduct) return;
    setSelectedProduct({ ...selectedProduct, [field]: value });
  }

  return <main className="min-h-screen bg-black px-6 py-10 text-white md:px-12"><div className="mx-auto max-w-7xl">
    <header className="mb-10"><p className="text-xs tracking-[0.35em] text-red-500">CORRES DO ZK</p><h1 className="mt-3 text-4xl font-black uppercase">Painel Admin</h1></header>
    <section className="grid gap-6 md:grid-cols-3"><Card icon={<Package/>} title={String(products.length)} subtitle="Produtos"/><Card icon={<Pencil/>} title="Catálogo" subtitle="Editor ativo"/><Card icon={<ImagePlus/>} title="Upload" subtitle="Imagens"/></section>
    <section className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4"><h2 className="mb-4 font-bold">Produtos</h2>{products.map((product)=><button key={product.slug} onClick={()=>setSelectedProduct(product)} className="flex w-full gap-3 rounded-2xl p-3 text-left hover:bg-white/10"><img src={product.image} className="h-14 w-14 rounded-xl object-cover"/><span>{product.name}</span></button>)}</div>
      {selectedProduct && <div className="rounded-3xl border border-white/10 bg-white/5 p-6"><h2 className="text-2xl font-black">Editar produto</h2><div className="mt-6 grid gap-4 md:grid-cols-2"><Input label="Nome" value={selectedProduct.name} onChange={(v)=>updateField("name",v)}/><Input label="Preço" value={selectedProduct.price} onChange={(v)=>updateField("price",Number(v))}/><Input label="Estoque" value={selectedProduct.stock} onChange={(v)=>updateField("stock",Number(v))}/><Input label="Categoria" value={selectedProduct.category} onChange={(v)=>updateField("category",v)}/></div><label className="mt-4 block"><span className="text-xs uppercase text-white/50">Imagem</span><input type="file" accept="image/*" onChange={(e)=>handleImage(e.target.files?.[0])} className="mt-2"/></label><button onClick={handleSave} disabled={saving || uploading} className="mt-6 flex gap-2 rounded-full bg-red-600 px-6 py-3 font-bold"><Save size={18}/>{saving?"Salvando":"Salvar alterações"}</button></div>}
    </section>
  </div></main>;
}

function Card({icon,title,subtitle}:{icon:React.ReactNode;title:string;subtitle:string}){return <div className="rounded-3xl border border-white/10 bg-white/5 p-6"><div className="text-red-500">{icon}</div><strong className="text-3xl">{title}</strong><p className="text-white/60">{subtitle}</p></div>}
function Input({label,value,onChange}:{label:string;value:string|number;onChange:(value:string)=>void}){return <label><span className="text-xs uppercase text-white/50">{label}</span><input className="mt-2 w-full rounded-xl bg-black/40 p-3" value={value} onChange={(e)=>onChange(e.target.value)}/></label>}

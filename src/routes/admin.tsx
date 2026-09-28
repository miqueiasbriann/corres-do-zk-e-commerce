import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImagePlus, Package, Pencil } from "lucide-react";
import { products as demoProducts } from "@/data/products";
import { listProducts } from "@/services/products";
import type { Product } from "@/data/products";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(demoProducts[0] ?? null);

  useEffect(() => {
    listProducts()
      .then((items) => {
        if (items.length) {
          setProducts(items as Product[]);
          setSelectedProduct(items[0] as Product);
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="text-xs tracking-[0.35em] text-red-500">CORRES DO ZK</p>
          <h1 className="mt-3 text-4xl font-black uppercase">Painel Admin</h1>
          <p className="mt-2 text-white/60">Gerenciamento de produtos da loja.</p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <Card icon={<Package />} title={String(products.length)} subtitle="Produtos" />
          <Card icon={<Pencil />} title="Catálogo" subtitle="Banco conectado" />
          <Card icon={<ImagePlus />} title="Imagens" subtitle="Próxima etapa" />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <h2 className="mb-4 font-bold">Produtos</h2>
            {products.map((product) => (
              <button key={product.slug} onClick={() => setSelectedProduct(product)} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-white/10">
                <img src={product.image} className="h-14 w-14 rounded-xl object-cover" />
                <span className="font-semibold">{product.name}</span>
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            {selectedProduct && <>
              <h2 className="text-2xl font-black">{selectedProduct.name}</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Preço" value={`R$ ${selectedProduct.price}`} />
                <Field label="Estoque" value={String(selectedProduct.stock)} />
                <Field label="Categoria" value={selectedProduct.category} />
                <Field label="Drop" value={selectedProduct.drop} />
              </div>
            </>}
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return <div className="rounded-3xl border border-white/10 bg-white/5 p-6"><div className="mb-4 text-red-500">{icon}</div><strong className="text-3xl">{title}</strong><p className="text-white/60">{subtitle}</p></div>;
}

function Field({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-black/40 p-4"><p className="text-xs uppercase text-white/50">{label}</p><p className="mt-1 font-bold">{value}</p></div>;
}

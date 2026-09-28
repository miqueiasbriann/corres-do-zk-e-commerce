import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/data/products";
import { Package, Pencil, ImagePlus } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-xs tracking-[0.35em] text-red-500">CORRES DO ZK</p>
          <h1 className="mt-3 text-4xl font-black uppercase">Painel Admin</h1>
          <p className="mt-2 text-white/60">
            Gerenciamento de produtos da loja.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <Package className="mb-4 text-red-500" />
            <strong className="text-3xl">{products.length}</strong>
            <p className="text-white/60">Produtos cadastrados</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <Pencil className="mb-4 text-red-500" />
            <strong>Editar catálogo</strong>
            <p className="text-white/60">Preços, estoque e informações.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <ImagePlus className="mb-4 text-red-500" />
            <strong>Imagens</strong>
            <p className="text-white/60">Preparado para upload via storage.</p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10">
          <div className="border-b border-white/10 p-5 font-bold">Produtos</div>
          {products.map((product) => (
            <div key={product.slug} className="flex items-center gap-4 border-b border-white/10 p-5">
              <img src={product.image} className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-bold">{product.name}</p>
                <p className="text-sm text-white/60">R$ {product.price}</p>
              </div>
              <button className="rounded-full border border-white/20 px-4 py-2 text-sm">Editar</button>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

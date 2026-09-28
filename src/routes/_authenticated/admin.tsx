import { createFileRoute } from "@tanstack/react-router";
import { Image, Package, RotateCcw, SwatchBook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatBRL, products, storeConfig } from "@/data/products";
import { type SiteTextKey, useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel — CORRES DO ZK" },
      { name: "description", content: "Painel de conteúdo visual da CORRES DO ZK." },
      { property: "og:title", content: "Painel — CORRES DO ZK" },
      { property: "og:description", content: "Painel de conteúdo visual da CORRES DO ZK." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const textFields: Array<{ key: SiteTextKey; label: string }> = [
  { key: "heroKicker", label: "Linha pequena do banner" },
  { key: "heroTitle", label: "Título principal" },
  { key: "heroSubtitle", label: "Subtítulo" },
  { key: "heroCta", label: "Texto do botão" },
  { key: "editorialTitle", label: "Título editorial" },
];

const imageFields = [
  { key: "logo", label: "Logo com fundo transparente" },
  { key: "hero", label: "Imagem do banner — computador" },
  { key: "heroMobile", label: "Imagem do banner — celular" },
  { key: "mascot", label: "Mascote recortado (PNG/WebP transparente)" },
  { key: "editorial", label: "Imagem editorial" },
] as const;

const categoryNames = ["Camisetas", "Moletons", "Conjuntos", "Calças", "Boné", "Acessórios"];

function Admin() {
  const { content, setText, setImage, setCategoryImage, setProductGallery, resetContent } = useSiteContent();
  const demoCount = products.filter((product) => product.isDemo).length;
  const uniqueDrops = new Set(products.map((product) => product.drop)).size;

  return (
    <div className="min-h-[80vh] bg-[#090909] text-white">
      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#111,#090909)]">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8">
          <p className="zk-eyebrow text-primary">Painel visual</p>
          <h1 className="zk-title mt-3 text-5xl sm:text-7xl">Conteúdo da loja</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">Edite textos, imagens do banner, categorias e galerias sem alterar a estrutura da loja. As alterações visuais deste painel ficam salvas neste navegador.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="border border-white/10 bg-white/[0.025] p-5"><Package className="h-5 w-5 text-primary" /><p className="zk-eyebrow mt-4 text-white/40">Produtos</p><p className="zk-title mt-2 text-3xl">{products.length}</p></div>
          <div className="border border-white/10 bg-white/[0.025] p-5"><SwatchBook className="h-5 w-5 text-primary" /><p className="zk-eyebrow mt-4 text-white/40">Demonstrativos</p><p className="zk-title mt-2 text-3xl">{demoCount}</p></div>
          <div className="border border-white/10 bg-white/[0.025] p-5"><Image className="h-5 w-5 text-primary" /><p className="zk-eyebrow mt-4 text-white/40">Drops cadastrados</p><p className="zk-title mt-2 text-3xl">{uniqueDrops}</p></div>
        </div>

        <section className="border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div><p className="zk-eyebrow text-primary">Banner principal</p><h2 className="zk-title mt-2 text-3xl">Texto e camadas</h2></div>
            <Button type="button" variant="outline" className="min-h-11 rounded-none border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white" onClick={resetContent}><RotateCcw className="mr-2 h-4 w-4" />Restaurar padrão</Button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {textFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input id={field.key} value={content.text[field.key]} onChange={(event) => setText(field.key, event.target.value)} className="h-12" />
              </div>
            ))}
            {imageFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={`image-${field.key}`}>{field.label}</Label>
                <Input id={`image-${field.key}`} value={content.images[field.key]} onChange={(event) => setImage(field.key, event.target.value)} placeholder="URL ou caminho da imagem" className="h-12" />
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-white/40">Para melhor resultado no celular, use uma imagem vertical própria em “Imagem do banner — celular”. O mascote deve ter fundo transparente para não criar uma caixa sobre a fotografia.</p>
        </section>

        <section className="border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <p className="zk-eyebrow text-primary">Categorias</p>
          <h2 className="zk-title mt-2 text-3xl">Fotos dos cards</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {categoryNames.map((category) => (
              <div key={category} className="space-y-2">
                <Label htmlFor={`category-${category}`}>{category}</Label>
                <Input id={`category-${category}`} value={content.images.categories[category] ?? ""} onChange={(event) => setCategoryImage(category, event.target.value)} className="h-12" />
              </div>
            ))}
          </div>
        </section>

        <section className="border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <p className="zk-eyebrow text-primary">Catálogo</p>
          <h2 className="zk-title mt-2 text-3xl">Galerias e variações</h2>
          <p className="mt-3 max-w-2xl text-xs leading-5 text-white/40">Uma URL por linha cria fotos adicionais, miniaturas, zoom e navegação por toque na página do produto.</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {products.map((product) => (
              <div key={product.slug} className="border border-white/10 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase">{product.name}</p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">{product.category} · {product.drop}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-white/45">{formatBRL(product.price)}</span>
                    {product.isDemo && <p className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-primary">Produto demonstrativo</p>}
                  </div>
                </div>

                <Label htmlFor={`product-${product.slug}`} className="mt-5 block text-[9px] uppercase tracking-[0.16em] text-white/45">Fotos — uma URL por linha</Label>
                <Textarea
                  id={`product-${product.slug}`}
                  className="mt-2 min-h-28"
                  value={(content.images.products[product.slug] ?? product.images).join("\n")}
                  onChange={(event) => setProductGallery(product.slug, event.target.value.split(/\r?\n/))}
                />

                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/45">Estoque por combinação</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <span key={`${variant.size}-${variant.color}`} className="border border-white/10 bg-white/[0.025] px-2.5 py-1.5 text-[9px] font-semibold text-white/60">
                        {variant.size} · {variant.color}: {variant.stock}
                      </span>
                    ))}
                  </div>
                  {product.isDemo && <p className="mt-3 text-xs leading-5 text-white/40">Os números acima são demonstrativos e não são apresentados ao cliente como estoque real.</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <p className="zk-eyebrow text-primary">Configuração comercial</p>
          <h2 className="zk-title mt-2 text-3xl">Pagamento e cupons</h2>
          <p className="mt-4 text-sm text-white/55">Formas de pagamento cadastradas: {storeConfig.paymentMethods.length > 0 ? storeConfig.paymentMethods.join(", ") : "nenhuma — será confirmado no WhatsApp"}.</p>
          <p className="mt-2 text-sm text-white/55">Cupons ativos: {storeConfig.coupons.filter((coupon) => coupon.active).length}.</p>
        </section>
      </div>
    </div>
  );
}

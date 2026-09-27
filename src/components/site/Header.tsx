import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { useSiteContent } from "@/lib/site-content";
import { products } from "@/data/products";
import { CartSheet } from "./CartSheet";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  { to: "/loja", label: "Coleção" },
  { to: "/sobre", label: "A marca" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const { count } = useCart();
  const { content } = useSiteContent();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return [];
    return products
      .filter((product) =>
        `${product.name} ${product.category} ${product.drop}`.toLocaleLowerCase("pt-BR").includes(normalized),
      )
      .slice(0, 6);
  }, [query]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.35rem] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-8 lg:gap-12">
            <Link to="/" className="zk-focus shrink-0 rounded-sm" aria-label="CORRES DO ZK — início">
              <img src={content.images.logo} alt="CORRES DO ZK" className="h-11 w-auto max-w-[146px] object-contain sm:h-12 sm:max-w-[168px]" />
            </Link>
            <nav className="hidden items-center gap-9 md:flex" aria-label="Navegação principal">
              {nav.map((item) => (
                <Link key={item.to} to={item.to} className="zk-focus relative rounded-sm py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/65 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-white hover:after:scale-x-100" activeProps={{ className: "text-white after:scale-x-100" }}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSearchOpen((open) => !open)} aria-expanded={searchOpen} aria-label="Pesquisar produtos" className="zk-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition hover:border-primary/70 hover:text-primary">
              {searchOpen ? <X className="h-[18px] w-[18px]" /> : <Search className="h-[18px] w-[18px]" />}
            </button>
            <button type="button" onClick={() => setCartOpen(true)} aria-label={count > 0 ? `Abrir sacola, ${count} itens` : "Abrir sacola"} className="zk-focus relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition hover:border-primary/70 hover:text-primary">
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-white ring-2 ring-black">{count}</span>}
            </button>

            <Sheet>
              <SheetTrigger aria-label="Abrir menu" className="zk-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white md:hidden">
                <Menu className="h-[18px] w-[18px]" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(22rem,90vw)] border-l-white/10 bg-black/98 text-white">
                <div className="px-5 pt-8"><img src={content.images.logo} alt="CORRES DO ZK" className="h-14 w-auto object-contain" /></div>
                <nav className="mt-10 flex flex-col gap-5 px-5" aria-label="Menu mobile">
                  <Link to="/" className="zk-title text-4xl transition-colors hover:text-primary">Início</Link>
                  {nav.map((item) => <Link key={item.to} to={item.to} className="zk-title text-4xl transition-colors hover:text-primary">{item.label}</Link>)}
                  <Link to="/loja" className="mt-4 inline-flex h-13 items-center justify-center bg-primary px-5 text-xs font-black uppercase tracking-[0.18em] text-white">Ver coleção</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-white/10 bg-black/96 shadow-2xl">
            <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
              <label className="relative block">
                <span className="sr-only">Buscar na coleção</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="BUSCAR CAMISETA, MOLETOM, DROP..." className="h-12 w-full border border-white/15 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-primary" />
              </label>
              {query.trim() && (
                <div className="mt-3 border border-white/10 bg-[#0c0c0c]">
                  {results.length > 0 ? results.map((product) => (
                    <Link key={product.slug} to="/produto/$slug" params={{ slug: product.slug }} onClick={() => { setSearchOpen(false); setQuery(""); }} className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-sm last:border-b-0 hover:bg-white/[0.04]">
                      <span className="font-semibold uppercase tracking-[0.03em]">{product.name}</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">{product.category}</span>
                    </Link>
                  )) : <p className="px-4 py-5 text-sm text-white/50">Nenhuma peça encontrada.</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}

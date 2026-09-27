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
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return [];
    return products
      .filter((product) =>
        `${product.name} ${product.category} ${product.drop} ${product.colors.join(" ")}`
          .toLocaleLowerCase("pt-BR")
          .includes(normalized),
      )
      .slice(0, 6);
  }, [query]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/92 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex h-[4.35rem] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-8 lg:gap-12">
            <Link to="/" onClick={closeSearch} className="zk-focus min-w-0 shrink rounded-sm" aria-label="CORRES DO ZK — início">
              <img
                src={content.images.logo}
                alt="CORRES DO ZK"
                className="h-auto max-h-12 w-auto max-w-[142px] object-contain sm:max-w-[170px]"
              />
            </Link>

            <nav className="hidden items-center gap-9 md:flex" aria-label="Navegação principal">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeSearch}
                  className="zk-focus relative rounded-sm py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white/65 transition-colors after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-white hover:after:scale-x-100"
                  activeProps={{ className: "text-white after:scale-x-100" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-expanded={searchOpen}
              aria-controls="site-search"
              aria-label={searchOpen ? "Fechar pesquisa" : "Pesquisar produtos"}
              className="zk-focus inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition hover:border-primary/70 hover:text-primary"
            >
              {searchOpen ? <X className="h-[18px] w-[18px]" /> : <Search className="h-[18px] w-[18px]" />}
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={count > 0 ? `Abrir sacola, ${count} itens` : "Abrir sacola"}
              className="zk-focus relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition hover:border-primary/70 hover:text-primary"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-white ring-2 ring-black">
                  {count}
                </span>
              )}
            </button>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger
                aria-label="Abrir menu"
                className="zk-focus inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white md:hidden"
              >
                <Menu className="h-[18px] w-[18px]" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="h-dvh w-[min(22rem,92vw)] border-l-white/10 bg-black/98 p-0 text-white"
              >
                <div className="px-5 pt-[max(2rem,env(safe-area-inset-top))]">
                  <img src={content.images.logo} alt="CORRES DO ZK" className="h-auto max-h-16 w-auto max-w-[210px] object-contain" />
                </div>
                <nav className="mt-9 flex flex-col gap-2 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]" aria-label="Menu mobile">
                  <Link to="/" onClick={() => setMenuOpen(false)} className="zk-title flex min-h-12 items-center text-4xl transition-colors hover:text-primary">Início</Link>
                  {nav.map((item) => (
                    <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="zk-title flex min-h-12 items-center text-4xl transition-colors hover:text-primary">
                      {item.label}
                    </Link>
                  ))}
                  <Link to="/loja" onClick={() => setMenuOpen(false)} className="mt-5 inline-flex h-12 items-center justify-center bg-primary px-5 text-xs font-black uppercase tracking-[0.18em] text-white">
                    Ver coleção
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {searchOpen && (
          <div id="site-search" className="border-t border-white/10 bg-black/96 shadow-2xl">
            <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
              <label className="relative block">
                <span className="sr-only">Buscar na coleção</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="BUSCAR CAMISETA, MOLETOM, COR..."
                  className="h-12 w-full min-w-0 border border-white/15 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-primary"
                />
              </label>
              {query.trim() && (
                <div className="mt-3 max-h-[50dvh] overflow-y-auto overscroll-contain border border-white/10 bg-[#0c0c0c]">
                  {results.length > 0 ? results.map((product) => (
                    <Link
                      key={product.slug}
                      to="/produto/$slug"
                      params={{ slug: product.slug }}
                      onClick={closeSearch}
                      className="flex min-h-12 items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-sm last:border-b-0 hover:bg-white/[0.04]"
                    >
                      <span className="min-w-0 truncate font-semibold uppercase tracking-[0.03em]">{product.name}</span>
                      <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">{product.category}</span>
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

import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { CartSheet } from "./CartSheet";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Início" },
  { to: "/loja", label: "Coleção" },
  { to: "/sobre", label: "A marca" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="zk-focus rounded-sm" aria-label="CORRES DO ZK — início">
            <span className="zk-title text-xl tracking-tight sm:text-2xl">
              CORRES DO <span className="text-primary">ZK</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="zk-focus rounded-sm py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{
                  className:
                    "zk-focus rounded-sm py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={count > 0 ? `Abrir sacola, ${count} itens` : "Abrir sacola"}
            className="zk-focus relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 transition-all hover:-translate-y-0.5 hover:border-primary/60"
          >
            <ShoppingBag className="h-[17px] w-[17px]" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground ring-2 ring-background">
                {count}
              </span>
            )}
          </button>

          <Sheet>
            <SheetTrigger
              aria-label="Abrir menu"
              className="zk-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 md:hidden"
            >
              <Menu className="h-[17px] w-[17px]" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(22rem,88vw)] border-l-border bg-background/98">
              <nav className="mt-10 flex flex-col gap-5 px-5" aria-label="Menu mobile">
                <p className="zk-eyebrow mb-2 text-primary">CORRES DO ZK</p>
                {nav.map((item) => (
                  <Link key={item.to} to={item.to} className="zk-title text-3xl transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                ))}
                <Link to="/loja" className="mt-4 inline-flex h-12 items-center justify-center bg-primary text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground">
                  Ver coleção
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}

import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { CartSheet } from "./CartSheet";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  { to: "/loja", label: "Loja" },
  { to: "/sobre", label: "A Marca" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/88 shadow-[0_10px_36px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="zk-title zk-focus rounded-sm text-xl tracking-tight sm:text-2xl">
            CORRES <span className="text-primary">DO ZK</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="zk-focus rounded-sm py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{
                  className:
                    "zk-focus rounded-sm py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            aria-label={count > 0 ? `Abrir sacola, ${count} itens` : "Abrir sacola"}
            className="zk-focus relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:bg-accent"
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
              className="zk-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 transition-all hover:border-primary/60 md:hidden"
            >
              <Menu className="h-[17px] w-[17px]" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(22rem,88vw)] border-l-border bg-background/95 backdrop-blur-xl">
              <nav className="mt-10 flex flex-col gap-5 px-5">
                <p className="zk-eyebrow mb-2">Menu</p>
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="zk-title text-3xl text-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

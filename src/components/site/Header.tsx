import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { CartSheet } from "./CartSheet";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const nav = [
  { to: "/loja", label: "Loja" },
  { to: "/sobre", label: "A Marca" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 shadow-[0_8px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <Link to="/" className="zk-title zk-focus rounded-sm text-xl tracking-tight">
            CORRES <span className="text-primary">DO ZK</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="zk-focus rounded-sm py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "zk-focus rounded-sm py-2 text-xs uppercase tracking-[0.2em] text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Abrir sacola"
            className="zk-focus relative inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-card/60 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </button>

          <Sheet>
            <SheetTrigger
              aria-label="Abrir menu"
              className="zk-focus inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-card/60 transition-colors hover:border-primary/50 md:hidden"
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(22rem,88vw)] border-l-border bg-background/95 backdrop-blur-xl">
              <nav className="mt-10 flex flex-col gap-5 px-5">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="zk-title text-2xl text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}

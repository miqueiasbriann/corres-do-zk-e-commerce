import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatBRL } from "@/data/products";
import { useCart } from "@/lib/cart";

export function CartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (value: boolean) => void }) {
  const { items, setQty, remove, total } = useCart();
  const navigate = useNavigate();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-dvh w-full max-w-full flex-col border-l-white/10 bg-[#090909] p-0 text-white sm:max-w-md"
      >
        <SheetHeader className="border-b border-white/10 px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
          <SheetTitle className="zk-title flex items-center gap-3 text-2xl text-white">
            <ShoppingBag className="h-5 w-5 text-primary" /> Sua sacola
          </SheetTitle>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5">
          {items.length === 0 && (
            <div className="flex min-h-56 flex-col items-center justify-center text-center">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <p className="mt-4 font-semibold">Sua sacola está vazia.</p>
              <p className="mt-1 text-sm text-white/45">Explore a coleção para começar.</p>
            </div>
          )}

          {items.map((item) => {
            const reachedLimit = item.qty >= item.maxQty;
            return (
              <div key={`${item.slug}-${item.size}-${item.color}`} className="flex gap-3 border-b border-white/10 pb-4">
                <img src={item.image} alt={item.name} loading="lazy" className="h-24 w-20 shrink-0 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold">{item.name}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white/45">
                    Tam. {item.size} · {item.color}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label={`Diminuir quantidade de ${item.name}`}
                      onClick={() => setQty(item.slug, item.size, item.color, item.qty - 1)}
                      className="zk-focus inline-flex h-11 w-11 items-center justify-center border border-white/15 text-white hover:border-primary"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm" aria-live="polite">{item.qty}</span>
                    <button
                      type="button"
                      aria-label={reachedLimit ? "Quantidade máxima disponível" : `Aumentar quantidade de ${item.name}`}
                      disabled={reachedLimit}
                      onClick={() => setQty(item.slug, item.size, item.color, item.qty + 1)}
                      className="zk-focus inline-flex h-11 w-11 items-center justify-center border border-white/15 text-white hover:border-primary disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remover ${item.name}`}
                      onClick={() => remove(item.slug, item.size, item.color)}
                      className="zk-focus ml-auto inline-flex h-11 w-11 items-center justify-center text-white/45 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {reachedLimit && <p className="mt-2 text-[9px] uppercase tracking-[0.12em] text-primary">Limite desta variação atingido</p>}
                </div>
                <p className="whitespace-nowrap text-xs font-semibold sm:text-sm">{formatBRL(item.price * item.qty)}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-3 border-t border-white/10 px-5 pt-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-end justify-between">
            <span className="zk-eyebrow text-white/45">Subtotal</span>
            <span className="zk-title text-2xl">{formatBRL(total)}</span>
          </div>
          <p className="text-xs leading-5 text-white/45">Frete e pagamento serão confirmados pelo WhatsApp.</p>
          <Button
            className="h-12 w-full rounded-none text-xs font-black uppercase tracking-[0.16em]"
            disabled={items.length === 0}
            onClick={() => {
              onOpenChange(false);
              navigate({ to: "/checkout" });
            }}
          >
            Finalizar pedido
          </Button>
          <Button variant="ghost" className="h-11 w-full text-white hover:bg-white/5 hover:text-white" asChild onClick={() => onOpenChange(false)}>
            <Link to="/loja">Continuar comprando</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

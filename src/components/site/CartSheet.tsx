import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatBRL } from "@/data/products";
import { useCart } from "@/lib/cart";

export function CartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { items, setQty, remove, total } = useCart();
  const navigate = useNavigate();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col border-l-border bg-background sm:max-w-md">
        <SheetHeader className="border-b border-border pb-5">
          <SheetTitle className="zk-title flex items-center gap-3 text-2xl"><ShoppingBag className="h-5 w-5 text-primary" /> Sua sacola</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto px-1 py-5">
          {items.length === 0 && (
            <div className="flex min-h-56 flex-col items-center justify-center text-center">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <p className="mt-4 font-semibold">Sua sacola está vazia.</p>
              <p className="mt-1 text-sm text-muted-foreground">O próximo passo começa na coleção.</p>
            </div>
          )}
          {items.map((item) => (
            <div key={`${item.slug}-${item.size}`} className="flex gap-3 border-b border-border pb-4">
              <img src={item.image} alt={item.name} loading="lazy" className="h-24 w-20 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.name}</p>
                <p className="zk-eyebrow mt-1">Tam {item.size}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button type="button" aria-label={`Diminuir quantidade de ${item.name}`} onClick={() => setQty(item.slug, item.size, item.qty - 1)} className="zk-focus inline-flex h-8 w-8 items-center justify-center border border-border hover:border-primary"><Minus className="h-3 w-3" /></button>
                  <span className="w-6 text-center text-sm">{item.qty}</span>
                  <button type="button" aria-label={`Aumentar quantidade de ${item.name}`} onClick={() => setQty(item.slug, item.size, item.qty + 1)} className="zk-focus inline-flex h-8 w-8 items-center justify-center border border-border hover:border-primary"><Plus className="h-3 w-3" /></button>
                  <button type="button" aria-label={`Remover ${item.name}`} onClick={() => remove(item.slug, item.size)} className="zk-focus ml-auto p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="text-sm font-semibold">{formatBRL(item.price * item.qty)}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3 border-t border-border pt-5">
          <div className="flex items-end justify-between"><span className="zk-eyebrow">Subtotal</span><span className="zk-title text-2xl">{formatBRL(total)}</span></div>
          <p className="text-xs text-muted-foreground">Frete e pagamento serão confirmados pelo WhatsApp.</p>
          <Button className="h-12 w-full text-xs font-bold uppercase tracking-[0.16em]" disabled={items.length === 0} onClick={() => { onOpenChange(false); navigate({ to: "/checkout" }); }}>Finalizar pedido</Button>
          <Button variant="ghost" className="w-full" asChild onClick={() => onOpenChange(false)}><Link to="/loja">Continuar comprando</Link></Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

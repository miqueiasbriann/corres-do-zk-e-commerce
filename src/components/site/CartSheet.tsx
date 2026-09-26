import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatBRL } from "@/data/products";
import { useCart } from "@/lib/cart";

export function CartSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { items, setQty, remove, total, clear } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="zk-title text-2xl">Sua sacola</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-5">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Sacola vazia. Dá uma olhada no drop atual.
            </p>
          )}
          {items.map((item) => (
            <div
              key={`${item.slug}-${item.size}`}
              className="flex gap-3 border-b border-border pb-4"
            >
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="h-24 w-20 object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="zk-eyebrow mt-1">Tam {item.size}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    aria-label="Diminuir"
                    onClick={() => setQty(item.slug, item.size, item.qty - 1)}
                    className="inline-flex h-7 w-7 items-center justify-center border border-border"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm">{item.qty}</span>
                  <button
                    aria-label="Aumentar"
                    onClick={() => setQty(item.slug, item.size, item.qty + 1)}
                    className="inline-flex h-7 w-7 items-center justify-center border border-border"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    aria-label="Remover"
                    onClick={() => remove(item.slug, item.size)}
                    className="ml-auto text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold">
                {formatBRL(item.price * item.qty)}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-border p-5">
          <div className="flex items-center justify-between">
            <span className="zk-eyebrow">Total</span>
            <span className="zk-title text-2xl">{formatBRL(total)}</span>
          </div>
          <Button
            className="w-full"
            disabled={items.length === 0}
            onClick={() => {
              toast.success("Pedido reservado", {
                description: "Finalize o pagamento pelo WhatsApp da marca.",
              });
              clear();
              onOpenChange(false);
            }}
          >
            Finalizar pedido
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            asChild
            onClick={() => onOpenChange(false)}
          >
            <Link to="/loja">Continuar comprando</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

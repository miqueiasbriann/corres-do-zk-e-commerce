import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getVariantStock } from "@/data/products";
import { useProducts } from "@/lib/catalog";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
  maxQty: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (slug: string, size: string, color: string) => void;
  setQty: (slug: string, size: string, color: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "zk-cart";

const sameVariant = (
  item: Pick<CartItem, "slug" | "size" | "color">,
  slug: string,
  size: string,
  color: string,
) => item.slug === slug && item.size === size && item.color === color;

function normalizeStoredItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as Partial<CartItem>;
    if (!item.slug || !item.size || !item.name || typeof item.price !== "number") return [];

    const color = item.color || "Preto";
    const maxQty = Math.max(1, Number(item.maxQty) || 1);

    return [{
      slug: item.slug,
      name: item.name,
      price: item.price,
      image: item.image || "",
      size: item.size,
      color,
      qty: Math.min(Math.max(1, Number(item.qty) || 1), maxQty),
      maxQty,
    }];
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const products = useProducts();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(normalizeStoredItems(JSON.parse(raw)));
    } catch {
      // Keep an empty cart when stored data is invalid.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || !products.length) return;
    setItems((current) => {
      const next = current.flatMap((item) => {
      const product = products.find((entry) => entry.slug === item.slug);
      if (!product) return [];
      const maxQty = getVariantStock(product, item.size, item.color);
      if (maxQty <= 0) return [];
      return [{ ...item, name: product.name, price: product.price, image: product.image, maxQty, qty: Math.min(item.qty, maxQty) }];
      });
      return next.length === current.length && next.every((item, index) => Object.keys(item).every((key) => item[key as keyof CartItem] === current[index]?.[key as keyof CartItem])) ? current : next;
    });
  }, [products, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Shopping remains functional even when browser storage is unavailable.
    }
  }, [hydrated, items]);

  const add = useCallback((item: CartItem) => {
    setItems((current) => {
      const index = current.findIndex((entry) => sameVariant(entry, item.slug, item.size, item.color));
      if (index === -1) {
        return [...current, { ...item, qty: Math.min(Math.max(1, item.qty), item.maxQty) }];
      }

      return current.map((entry, entryIndex) =>
        entryIndex === index
          ? { ...entry, qty: Math.min(entry.qty + item.qty, entry.maxQty) }
          : entry,
      );
    });
  }, []);

  const remove = useCallback((slug: string, size: string, color: string) => {
    setItems((current) => current.filter((item) => !sameVariant(item, slug, size, color)));
  }, []);

  const setQty = useCallback((slug: string, size: string, color: string, qty: number) => {
    setItems((current) =>
      current
        .map((item) =>
          sameVariant(item, slug, size, color)
            ? { ...item, qty: Math.min(Math.max(0, qty), item.maxQty) }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      add,
      remove,
      setQty,
      clear,
      count: items.reduce((sum, item) => sum + item.qty, 0),
      total: items.reduce((sum, item) => sum + item.qty * item.price, 0),
    }),
    [items, add, remove, setQty, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
}

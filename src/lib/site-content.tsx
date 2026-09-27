import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import hero from "@/WhatsApp Image 2026-09-27 at 12.04.13.jpeg";
import editorial from "@/WhatsApp Image 2026-09-27 at 11.53.21.jpeg";
import hoodie from "@/assets/p-hoodie.jpg";
import tee from "@/assets/p-tee.jpg";
import logo from "@/assets/logo-zk-original.webp";
import mascot from "@/WhatsApp Image 2026-09-27 at 11.27.36.jpeg";
import { products } from "@/data/products";

export type SiteTextKey =
  | "heroKicker"
  | "heroTitle"
  | "heroSubtitle"
  | "heroCta"
  | "editorialTitle";

export type SiteContent = {
  text: Record<SiteTextKey, string>;
  images: {
    logo: string;
    hero: string;
    heroMobile: string;
    mascot: string;
    editorial: string;
    categories: Record<string, string>;
    products: Record<string, string[]>;
  };
};

const productImages = Object.fromEntries(products.map((product) => [product.slug, product.images]));

export const defaultSiteContent: SiteContent = {
  text: {
    heroKicker: "CORRES DO ZK / DROP ATUAL",
    heroTitle: "O CORRE NÃO PARA.",
    heroSubtitle: "O ESTILO ACOMPANHA.",
    heroCta: "VER COLEÇÃO",
    editorialTitle: "SEU CORRE. SUA IDENTIDADE.",
  },
  images: {
    logo,
    hero,
    heroMobile: hero,
    mascot,
    editorial,
    categories: {
      Camisetas: tee,
      Moletons: hoodie,
      Conjuntos: hero,
      Calças: hero,
      Boné: hero,
      Acessórios: hoodie,
    },
    products: productImages,
  },
};

type SiteContentContextValue = {
  content: SiteContent;
  setText: (key: SiteTextKey, value: string) => void;
  setImage: (key: "logo" | "hero" | "heroMobile" | "mascot" | "editorial", value: string) => void;
  setCategoryImage: (category: string, value: string) => void;
  setProductGallery: (slug: string, value: string[]) => void;
  resetContent: () => void;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);
const STORAGE_KEY = "zk-site-content-v3";

function normalizeGallery(value: unknown, fallback: string[]) {
  if (Array.isArray(value)) {
    const clean = value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
    return clean.length > 0 ? clean : fallback;
  }
  if (typeof value === "string" && value.trim()) return [value];
  return fallback;
}

function mergeContent(input: Partial<SiteContent> | null | undefined): SiteContent {
  const incomingProducts = input?.images?.products ?? {};
  const mergedProducts = Object.fromEntries(
    Object.entries(defaultSiteContent.images.products).map(([slug, fallback]) => [
      slug,
      normalizeGallery((incomingProducts as Record<string, unknown>)[slug], fallback),
    ]),
  );

  return {
    text: { ...defaultSiteContent.text, ...(input?.text ?? {}) },
    images: {
      ...defaultSiteContent.images,
      ...(input?.images ?? {}),
      categories: {
        ...defaultSiteContent.images.categories,
        ...(input?.images?.categories ?? {}),
      },
      products: mergedProducts,
    },
  };
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const currentRaw = localStorage.getItem(STORAGE_KEY);
      if (currentRaw) setContent(mergeContent(JSON.parse(currentRaw) as Partial<SiteContent>));
    } catch {}
    finally { setHydrated(true); }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(content)); } catch {}
  }, [content, hydrated]);

  const value = useMemo<SiteContentContextValue>(() => ({
    content,
    setText: (key, value) => setContent((current) => ({ ...current, text: { ...current.text, [key]: value } })),
    setImage: (key, value) => setContent((current) => ({ ...current, images: { ...current.images, [key]: value } })),
    setCategoryImage: (category, value) => setContent((current) => ({ ...current, images: { ...current.images, categories: { ...current.images.categories, [category]: value } } })),
    setProductGallery: (slug, value) => setContent((current) => ({ ...current, images: { ...current.images, products: { ...current.images.products, [slug]: value } } })),
    resetContent: () => setContent(defaultSiteContent),
  }), [content]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error("useSiteContent deve ser usado dentro de SiteContentProvider");
  return context;
}

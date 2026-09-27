import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import hero from "@/assets/hero.jpg";
import hoodie from "@/assets/p-hoodie.jpg";
import tee from "@/assets/p-tee.jpg";
import logo from "@/assets/logo-zk.svg";
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
    editorial: string;
    categories: Record<string, string>;
    products: Record<string, string>;
  };
};

const productImages = Object.fromEntries(products.map((product) => [product.slug, product.image]));

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
    editorial: hoodie,
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
  setImage: (key: "logo" | "hero" | "editorial", value: string) => void;
  setCategoryImage: (category: string, value: string) => void;
  setProductImage: (slug: string, value: string) => void;
  resetContent: () => void;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);
const STORAGE_KEY = "zk-site-content-v1";

function mergeContent(input: Partial<SiteContent> | null | undefined): SiteContent {
  return {
    text: { ...defaultSiteContent.text, ...(input?.text ?? {}) },
    images: {
      ...defaultSiteContent.images,
      ...(input?.images ?? {}),
      categories: {
        ...defaultSiteContent.images.categories,
        ...(input?.images?.categories ?? {}),
      },
      products: {
        ...defaultSiteContent.images.products,
        ...(input?.images?.products ?? {}),
      },
    },
  };
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setContent(mergeContent(JSON.parse(raw) as Partial<SiteContent>));
    } catch {
      // Defaults stay active when local content cannot be read.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // The storefront remains usable even if browser storage is unavailable.
    }
  }, [content]);

  const value = useMemo<SiteContentContextValue>(
    () => ({
      content,
      setText: (key, value) =>
        setContent((current) => ({ ...current, text: { ...current.text, [key]: value } })),
      setImage: (key, value) =>
        setContent((current) => ({
          ...current,
          images: { ...current.images, [key]: value },
        })),
      setCategoryImage: (category, value) =>
        setContent((current) => ({
          ...current,
          images: {
            ...current.images,
            categories: { ...current.images.categories, [category]: value },
          },
        })),
      setProductImage: (slug, value) =>
        setContent((current) => ({
          ...current,
          images: {
            ...current.images,
            products: { ...current.images.products, [slug]: value },
          },
        })),
      resetContent: () => setContent(defaultSiteContent),
    }),
    [content],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error("useSiteContent deve ser usado dentro de SiteContentProvider");
  return context;
}

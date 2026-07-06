import data from "@/data/products.json";
import facetsData from "@/data/facets.json";
import namesData from "@/data/names.json";
import type { Product, Facets } from "./types";

// Soulful Spanish names replace factory codes; the code stays on Product.code.
const NAMES = namesData as Record<string, string>;
const products: Product[] = (data as unknown as Omit<Product, "code">[]).map((p) => ({
  ...p,
  code: p.name,
  name: NAMES[String(p.id)] ?? p.name,
}));
export const facets = facetsData as unknown as Facets;

export function getAllProducts(): Product[] {
  return products;
}
export function getProductSlugs(): string[] {
  return products.map((p) => p.slug);
}
export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
export function getBestsellers(n = 8): Product[] {
  return [...products].sort((a, b) => b.totalSales - a.totalSales).slice(0, n);
}
export function getByCategory(category: "sun" | "optical", n?: number): Product[] {
  const list = products.filter((p) => p.category === category);
  return n ? list.slice(0, n) : list;
}
export function getRelated(p: Product, n = 4): Product[] {
  return products
    .filter((x) => x.slug !== p.slug && x.category === p.category)
    .sort(
      (a, b) =>
        Number(b.shape === p.shape) - Number(a.shape === p.shape) ||
        b.totalSales - a.totalSales,
    )
    .slice(0, n);
}

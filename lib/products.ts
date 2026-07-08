import data from "@/data/products.json";
import facetsData from "@/data/facets.json";
import { MODEL_NAMES } from "@/content/model-names";
import type { Product, Facets } from "./types";

// Swap the imported WooCommerce SKU names ("G 9496") for Goya's Mediterranean
// model names ("Lince"), keeping the original SKU as `code` for traceability.
// See scripts/rename-models.mjs and docs/model-names.md for the full directory.
const products = (data as unknown as Product[]).map((p) => {
  const name = MODEL_NAMES[p.id];
  return name ? { ...p, code: p.name, name } : p;
});
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

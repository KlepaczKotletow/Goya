import data from "@/data/products.json";
import facetsData from "@/data/facets.json";
import { MODEL_NAMES } from "@/content/model-names";
import type { Product, Facets } from "./types";

// Two stock photos of an empty case (closed, and open with the pouch) are reused
// across the WooCommerce catalogue as filler. They show no frame at all, so a
// product whose gallery is *only* these has nothing for the customer to look at.
// Listing them means asking 349-499 zl for a product nobody can see.
const PLACEHOLDER_IMAGES = new Set(["/products/575_5.jpg", "/products/575_6.jpg"]);
const isPlaceholder = (src: string) => PLACEHOLDER_IMAGES.has(src);

// Swap the imported WooCommerce SKU names ("G 9496") for Goya's Mediterranean
// model names ("Lince"), keeping the original SKU as `code` for traceability.
// See scripts/rename-models.mjs and docs/model-names.md for the full directory.
// Out-of-stock products are excluded everywhere (listing, PDP, sitemap): the
// source shop can't fulfill them, so we must not sell them. Same for products
// with no real photograph — both filters clear themselves automatically once the
// upstream data improves, so nothing needs un-hiding by hand.
const products = (data as unknown as Product[])
  .filter((p) => p.stockStatus === "instock")
  .filter((p) => p.images.some((i) => !isPlaceholder(i.src)))
  .map((p) => {
    // Keep the real photography first so the hero, thumbnail, OG image and
    // JSON-LD primary image never land on the empty case.
    const images = [...p.images].sort((a, b) => Number(isPlaceholder(a.src)) - Number(isPlaceholder(b.src)));
    const name = MODEL_NAMES[p.id];
    return { ...p, images, ...(name ? { code: p.name, name } : {}) };
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

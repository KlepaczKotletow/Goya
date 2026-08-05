import data from "@/data/products.json";
import facetsData from "@/data/facets.json";
import { MODEL_NAMES } from "@/content/model-names";
import { fetchCatalog } from "./catalog";
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
// This is the *baseline* — structure that must never depend on a spreadsheet:
// images, slugs, specs, variations.
const baseline = (data as unknown as Product[]).map((p) => {
  const name = MODEL_NAMES[p.id];
  return { ...p, ...(name ? { code: p.name, name } : {}) };
});

export const facets = facetsData as unknown as Facets;

/**
 * The catalogue. Supabase is the source of truth; the committed snapshot is the
 * fallback when it is unreachable, so the shop degrades to yesterday's data
 * rather than to an empty grid. Cached for an hour by lib/catalog.ts, so this
 * stays cheap even though every page calls it.
 *
 * Out-of-stock products and products with no real photograph are excluded
 * everywhere — listing, PDP and sitemap. Both filters clear themselves as soon
 * as the underlying data improves; nothing needs un-hiding by hand.
 */
async function catalogue(): Promise<Product[]> {
  const live = await fetchCatalog();
  const source = live ?? baseline;
  return source
    .filter((p) => p.stockStatus === "instock")
    .filter((p) => p.images.some((i) => !isPlaceholder(i.src)))
    .map((p) => ({
      ...p,
      images: [...p.images].sort((a, b) => Number(isPlaceholder(a.src)) - Number(isPlaceholder(b.src))),
    }));
}

export async function getAllProducts(): Promise<Product[]> {
  return catalogue();
}
export async function getProductSlugs(): Promise<string[]> {
  return (await catalogue()).map((p) => p.slug);
}
export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await catalogue()).find((p) => p.slug === slug);
}
export async function getBestsellers(n = 8): Promise<Product[]> {
  return [...(await catalogue())].sort((a, b) => b.totalSales - a.totalSales).slice(0, n);
}
export async function getByCategory(category: "sun" | "optical", n?: number): Promise<Product[]> {
  const list = (await catalogue()).filter((p) => p.category === category);
  return n ? list.slice(0, n) : list;
}
export async function getRelated(p: Product, n = 4): Promise<Product[]> {
  return (await catalogue())
    .filter((x) => x.slug !== p.slug && x.category === p.category)
    .sort(
      (a, b) =>
        Number(b.shape === p.shape) - Number(a.shape === p.shape) ||
        b.totalSales - a.totalSales,
    )
    .slice(0, n);
}

// The catalogue, read from Supabase.
//
// Why a database and not the spreadsheet: 593 images across 177 products (one has
// 11) and 195 variations are one-to-many. A flat sheet is one row per product, so
// those only fit by cramming them into semicolon-joined cells — which is why the
// sheet was missing dimensions, variations, per-image alt text, uv and type.
// Here they are ordinary rows in goya_product_images / goya_product_variations.
//
// Read with the anon key over PostgREST: product data is public, and the tables
// are select-only for anon (no write policy). One request pulls products with
// their images and variations embedded. Cached for an hour, so the site stays
// static and fast and a dashboard edit shows up within the hour without a deploy.
//
// Any failure falls back to the committed data/products.json snapshot rather than
// serving an empty shop.
import type { Product } from "./types";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://mjsaygxzaojmkltufpll.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qc2F5Z3h6YW9qbWtsdHVmcGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzI3OTgsImV4cCI6MjA3MTAwODc5OH0.Hq9NpBgY9I1jNDjiIxT3hgytX-rRMQO3aLKawjN7oWc";
const REVALIDATE_SECONDS = 3600;

type Row = {
  id: number; slug: string; name: string; code: string | null; full_name: string | null;
  type: string | null; category: string; collection: string | null; gender: string | null;
  shape: string | null; material: string | null; polarized: boolean; uv: string | null;
  frame_colors: string[] | null; lens_colors: string[] | null;
  lens_height: number | null; front_width: number | null; temple_length: number | null;
  price_woo: number | null; regular_price: number | null; live_price: number | null;
  lowest_price_30d: number | null; stock_status: string; total_sales: number;
  description: string | null; visible: boolean;
  goya_product_images: { url: string; alt: string | null; position: number }[] | null;
  goya_product_variations: {
    id: number; sku: string | null; price: number | null; image: string | null;
    attributes: { name: string; option: string }[] | null; in_stock: boolean;
  }[] | null;
};

const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : v === null || v === undefined || v === "" ? null : Number(v) || null);

function toProduct(r: Row): Product {
  const images = [...(r.goya_product_images ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((i) => ({ src: i.url, alt: i.alt || r.name }));
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    ...(r.code ? { code: r.code } : {}),
    fullName: r.full_name ?? r.name,
    type: (r.type === "variable" ? "variable" : "simple") as Product["type"],
    category: (r.category === "optical" ? "optical" : "sun") as Product["category"],
    gender: r.gender,
    shape: r.shape,
    frameColors: r.frame_colors ?? [],
    lensColors: r.lens_colors ?? [],
    material: r.material,
    polarized: !!r.polarized,
    uv: r.uv,
    dims: { lensHeight: num(r.lens_height), frontWidth: num(r.front_width), templeLength: num(r.temple_length) },
    priceWoo: num(r.price_woo),
    price: num(r.live_price),
    regularPrice: num(r.regular_price),
    lowestPrice30d: num(r.lowest_price_30d),
    stockStatus: r.stock_status,
    totalSales: r.total_sales ?? 0,
    images,
    description: r.description ?? "",
    variations: (r.goya_product_variations ?? []).map((v) => ({
      id: v.id,
      sku: v.sku,
      price: num(v.price),
      image: v.image,
      attributes: v.attributes ?? [],
      inStock: v.in_stock,
    })),
  };
}

export async function fetchCatalog(): Promise<Product[] | null> {
  const select = "*,goya_product_images(url,alt,position),goya_product_variations(id,sku,price,image,attributes,in_stock)";
  const url = `${SUPABASE_URL}/rest/v1/goya_products?select=${encodeURIComponent(select)}&visible=is.true&order=total_sales.desc`;
  try {
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`http ${res.status}`);
    const rows = (await res.json()) as Row[];
    if (!Array.isArray(rows)) throw new Error("malformed response");
    // A catalogue that suddenly lost most of its rows is far more likely to be a
    // broken query than a deliberate cull — prefer the snapshot over an empty shop.
    if (rows.length < 20) throw new Error(`suspiciously small catalogue (${rows.length})`);
    return rows.map(toProduct);
  } catch (e) {
    console.error("catalogue unavailable, using committed snapshot:", e);
    return null;
  }
}

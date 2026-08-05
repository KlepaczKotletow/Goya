// Live catalogue overrides, read from the "Goya inventory" spreadsheet.
//
// The sheet is the editing surface for anything commercial — price, discount,
// stock, model name, collection. Everything structural (images, slugs, specs)
// stays in data/products.json, because a typo in a cell must never be able to
// 404 a ranked URL or blank a product photo.
//
// Read through the Apps Script web app (scripts/google-apps-script/Kod.gs), which
// returns only website-safe fields — okulary.pl's cost/selling prices never leave
// the spreadsheet. Cached for an hour: the site stays static and fast, and an
// edit shows up within the hour without a redeploy.
//
// Any failure here is non-fatal by design: we fall back to the committed
// snapshot rather than shipping a broken or empty catalogue.
const WEBHOOK = process.env.GOYA_SHEETS_WEBHOOK_URL;
const SECRET = process.env.GOYA_SHEETS_WEBHOOK_SECRET;
const REVALIDATE_SECONDS = 3600;

export type InventoryRow = {
  price: number | null;
  regularPrice: number | null;
  lowestPrice30d: number | null;
  stockStatus: string | null;
  name: string | null;
  collection: string | null;
};

type RawRow = {
  product_id: number;
  new_name?: unknown;
  collection?: unknown;
  new_regular_price?: unknown;
  new_live_price?: unknown;
  lowest_price_30d?: unknown;
  stock_status?: unknown;
};

/** Sheets hands back numbers, numeric strings, or "349 zł" — accept all, reject nonsense. */
function money(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[^\d.,-]/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 && n < 100_000 ? Math.round(n * 100) / 100 : null;
}

function text(v: unknown): string | null {
  const s = typeof v === "string" ? v.trim() : v === null || v === undefined ? "" : String(v).trim();
  return s || null;
}

export async function getInventory(): Promise<Map<number, InventoryRow>> {
  const empty = new Map<number, InventoryRow>();
  if (!WEBHOOK || !SECRET) return empty;

  try {
    const url = `${WEBHOOK}?secret=${encodeURIComponent(SECRET)}`;
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) throw new Error(`http ${res.status}`);
    const body = (await res.json()) as { ok?: boolean; rows?: RawRow[]; error?: string };
    if (!body.ok || !Array.isArray(body.rows)) throw new Error(body.error ?? "malformed feed");

    const map = new Map<number, InventoryRow>();
    for (const r of body.rows) {
      const id = Number(r.product_id);
      if (!Number.isInteger(id)) continue;
      map.set(id, {
        price: money(r.new_live_price),
        regularPrice: money(r.new_regular_price),
        lowestPrice30d: money(r.lowest_price_30d),
        stockStatus: text(r.stock_status),
        name: text(r.new_name),
        collection: text(r.collection),
      });
    }
    // A feed that lost most of its rows is more likely a broken sheet than a
    // deliberate catalogue cull — prefer the snapshot over silently hiding stock.
    if (map.size < 20) throw new Error(`suspiciously small feed (${map.size} rows)`);
    return map;
  } catch (e) {
    console.error("inventory feed unavailable, using committed snapshot:", e);
    return empty;
  }
}

// Order validation and server-side pricing.
//
// The cart lives in localStorage, so nothing the browser reports about money can
// be trusted. The client sends slugs, variation ids and quantities; every price,
// every line total and the order total are recomputed here from the catalogue
// before anything reaches Stripe.
import { getAllProducts } from "./products";
import { priceOf } from "./pricing";
import { absUrl } from "@/content/site";

export type CartRequestItem = { slug: string; variationId: number | null; qty: number };

export type PricedLine = {
  slug: string;
  variationId: number | null;
  name: string;
  variant: string | null;
  image: string | null;
  qty: number;
  /** Unit price in złoty, from the catalogue. */
  price: number;
};

export type Customer = {
  email: string;
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  phone: string;
  delivery: "paczkomat" | "kurier";
  lockerCode: string;
};

/** One cart may not carry more distinct lines than this; the metadata budget is finite. */
const MAX_LINES = 20;
const MAX_QTY = 10;

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function parseCustomer(body: Record<string, unknown>): Customer | null {
  const delivery = body.delivery === "kurier" ? "kurier" : "paczkomat";
  const customer: Customer = {
    email: str(body.email),
    firstName: str(body.firstName, 80),
    lastName: str(body.lastName, 80),
    street: str(body.street),
    postalCode: str(body.postalCode, 12),
    city: str(body.city, 80),
    phone: str(body.phone, 30),
    delivery,
    lockerCode: delivery === "paczkomat" ? str(body.lockerCode, 12).toUpperCase() : "",
  };

  if (!/.+@.+\..+/.test(customer.email)) return null;
  if (!customer.firstName || !customer.lastName || !customer.street || !customer.postalCode || !customer.city) return null;
  // A paczkomat order without a locker code cannot be shipped, so reject it here
  // rather than accepting an order we can't fulfil.
  if (customer.delivery === "paczkomat" && !/^[A-Z]{3}[0-9]{2,3}[A-Z]?$/.test(customer.lockerCode)) return null;
  return customer;
}

export function parseItems(body: Record<string, unknown>): CartRequestItem[] {
  const raw = Array.isArray(body.items) ? body.items : [];
  return raw.slice(0, MAX_LINES).map((i) => {
    const item = (i ?? {}) as Record<string, unknown>;
    const variationId = Number(item.variationId);
    return {
      slug: str(item.slug, 120),
      variationId: Number.isFinite(variationId) && variationId > 0 ? variationId : null,
      qty: Math.max(1, Math.min(MAX_QTY, Number(item.qty) || 1)),
    };
  });
}

export type PricingResult =
  | { ok: true; lines: PricedLine[]; total: number }
  | { ok: false; error: "empty" | "unavailable" };

/**
 * Turn the browser's slug/qty list into priced lines using the live catalogue.
 * Anything sold out, hidden or unknown fails the whole cart — a partially
 * fulfillable order is worse than a clear "one of these is gone".
 */
export async function priceCart(items: CartRequestItem[]): Promise<PricingResult> {
  if (!items.length) return { ok: false, error: "empty" };

  const catalogue = await getAllProducts();
  const bySlug = new Map(catalogue.map((p) => [p.slug, p]));
  const lines: PricedLine[] = [];

  for (const item of items) {
    const product = bySlug.get(item.slug);
    // getAllProducts() already drops out-of-stock products, so a miss here means
    // gone from the catalogue, hidden, or sold out since the cart was filled.
    if (!product) return { ok: false, error: "unavailable" };

    const variation = item.variationId ? product.variations.find((v) => v.id === item.variationId) : null;
    if (item.variationId && (!variation || !variation.inStock)) return { ok: false, error: "unavailable" };

    const image = product.images.find((i) => i.src)?.src ?? null;
    lines.push({
      slug: product.slug,
      variationId: variation?.id ?? null,
      name: product.name,
      // The PDP prices per product, not per variation, so the variant is a label only.
      variant: variation ? variation.attributes.map((a) => a.option).join(" / ") || variation.sku : null,
      image: variation?.image ?? image,
      qty: item.qty,
      price: priceOf(product),
    });
  }

  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  return { ok: true, lines, total };
}

/** Absolute https URL for Stripe's hosted page, which cannot render site-relative paths. */
export function absoluteImage(src: string | null): string | undefined {
  if (!src) return undefined;
  return src.startsWith("http") ? src : absUrl(src);
}

/**
 * Human-quotable order reference: GOYA-260901-K4M2QP.
 * Random rather than sequential — it ends up in customer emails, and a counter
 * would leak how many orders the shop has taken.
 */
export function newOrderNumber(now = new Date()): string {
  const ymd = now.toISOString().slice(2, 10).replace(/-/g, "");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 — these get read aloud
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const suffix = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `GOYA-${ymd}-${suffix}`;
}

/**
 * Compact line list for Stripe metadata, which allows 500 characters per key.
 * JSON would spend a third of that budget on punctuation, so lines are packed
 * as slug~variationId~qty~price~name~variant, separated by pipes.
 */
const clean = (v: string) => v.replace(/[~|]/g, " ").trim();

export function encodeLines(lines: PricedLine[]): string {
  return lines
    .map((l) => [l.slug, l.variationId ?? "", l.qty, l.price, clean(l.name), clean(l.variant ?? "")].join("~"))
    .join("|");
}

export type DecodedLine = { slug: string; variationId: number | null; qty: number; price: number; name: string; variant: string | null };

export function decodeLines(encoded: string): DecodedLine[] {
  if (!encoded) return [];
  return encoded.split("|").map((part) => {
    const [slug, variationId, qty, price, name, variant] = part.split("~");
    return {
      slug: slug ?? "",
      variationId: variationId ? Number(variationId) : null,
      qty: Number(qty) || 1,
      price: Number(price) || 0,
      name: name || slug || "",
      variant: variant || null,
    };
  });
}

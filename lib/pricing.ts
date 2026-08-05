// Premium repositioning: map real WooCommerce prices (79-199 PLN) into a ~400 PLN band.
export const PRICE_TIERS = [
  { max: 109, price: 349 },
  { max: 139, price: 399 },
  { max: 169, price: 449 },
  { max: Infinity, price: 499 },
] as const;

export function premiumPrice(woo: number | null | undefined): number {
  if (!woo || woo <= 0) return 399;
  return (PRICE_TIERS.find((t) => woo <= t.max) ?? PRICE_TIERS[PRICE_TIERS.length - 1]).price;
}

// Catalogue ("compare-at") price for a tasteful savings badge.
export function compareAtPrice(premium: number): number {
  return Math.round((premium * 1.33) / 10) * 10 - 1; // e.g. 449 -> 599
}

type Priced = {
  priceWoo: number | null;
  price?: number | null;
  regularPrice?: number | null;
  lowestPrice30d?: number | null;
};

/** What the customer pays. Sheet value wins; otherwise the tier mapping. */
export function priceOf(p: Priced): number {
  return p.price ?? premiumPrice(p.priceWoo);
}

/**
 * The struck-through price, or null when there is no honest reduction to show.
 *
 * Only returns a value when the sheet carries a real regular price above the
 * selling price. The old `compareAtPrice` multiplier invented a discount on every
 * SKU, which is exactly what Poland's Omnibus rules prohibit — so an unpriced
 * product now shows a single clean price rather than a fabricated saving.
 */
export function regularOf(p: Priced): number | null {
  const price = priceOf(p);
  const regular = p.regularPrice ?? null;
  return regular !== null && regular > price ? regular : null;
}

/** Discount % against the regular price, or 0 when there is nothing genuine to show. */
export function discountOf(p: Priced): number {
  const regular = regularOf(p);
  return regular ? discountPct(priceOf(p), regular) : 0;
}
export function discountPct(premium: number, compareAt: number): number {
  return Math.max(0, Math.round((1 - premium / compareAt) * 100));
}

const fmt = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 });
export function formatPLN(n: number): string {
  return fmt.format(n);
}

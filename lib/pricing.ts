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
export function discountPct(premium: number, compareAt: number): number {
  return Math.max(0, Math.round((1 - premium / compareAt) * 100));
}

const fmt = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 });
export function formatPLN(n: number): string {
  return fmt.format(n);
}

export type Variation = {
  id: number;
  sku: string | null;
  price: number | null;
  image: string | null;
  attributes: { name: string; option: string }[];
  inStock: boolean;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  code?: string; // original WooCommerce SKU-style name, kept for traceability
  fullName: string;
  type: "simple" | "variable";
  category: "sun" | "optical";
  gender: string | null;
  shape: string | null;
  frameColors: string[];
  lensColors: string[];
  material: string | null;
  polarized: boolean;
  uv: string | null;
  dims: { lensHeight: number | null; frontWidth: number | null; templeLength: number | null };
  priceWoo: number | null;
  /** Selling price today, from the inventory sheet. Falls back to the pricing tiers. */
  price?: number | null;
  /** List price the selling price is compared against. Only a real, previously-charged price. */
  regularPrice?: number | null;
  /** Lowest price charged in the last 30 days — required before advertising a reduction (Omnibus). */
  lowestPrice30d?: number | null;
  stockStatus: string;
  totalSales: number;
  images: { src: string; alt: string }[];
  description: string;
  variations: Variation[];
};

export type Facets = {
  count: number;
  sun: number;
  optical: number;
  genders: string[];
  shapes: string[];
  frameColors: string[];
  priceWooRange: [number, number];
  generatedAt: string;
};

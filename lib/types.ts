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
  /** Original factory code, e.g. "G 15217" — kept for search and support. */
  code: string;
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

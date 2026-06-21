import { Suspense } from "react";
import type { Metadata } from "next";
import { getByCategory } from "@/lib/products";
import { Catalog } from "@/components/Catalog";

export const metadata: Metadata = { title: "Okulary korekcyjne", description: "Oprawki korekcyjne Goya na każdy dzień." };

export default function Page() {
  const products = getByCategory("optical");
  return (
    <Suspense>
      <Catalog products={products} lockCategory="optical" title="Korekcyjne" subtitle={`${products.length} oprawek`} />
    </Suspense>
  );
}

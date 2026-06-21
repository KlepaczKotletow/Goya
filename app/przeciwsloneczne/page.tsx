import { Suspense } from "react";
import type { Metadata } from "next";
import { getByCategory } from "@/lib/products";
import { Catalog } from "@/components/Catalog";

export const metadata: Metadata = { title: "Okulary przeciwsłoneczne", description: "Przeciwsłoneczne Goya z filtrem polaryzacyjnym i UV400." };

export default function Page() {
  const products = getByCategory("sun");
  return (
    <Suspense>
      <Catalog products={products} lockCategory="sun" title="Przeciwsłoneczne" subtitle={`${products.length} modeli · polaryzacja + UV400`} />
    </Suspense>
  );
}

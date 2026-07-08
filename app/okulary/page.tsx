import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProducts, facets } from "@/lib/products";
import { Catalog } from "@/components/Catalog";

export const metadata: Metadata = { title: "Okulary", description: "Wszystkie modele Goya - przeciwsłoneczne i korekcyjne." };

export default function Page() {
  return (
    <Suspense>
      <Catalog products={getAllProducts()} title="Wszystkie okulary" subtitle={`${facets.count} modeli`} />
    </Suspense>
  );
}

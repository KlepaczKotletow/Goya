import { Suspense } from "react";
import type { Metadata } from "next";
import { getByCategory } from "@/lib/products";
import { Catalog } from "@/components/Catalog";
import { CatalogFallback } from "@/components/CatalogFallback";
import { JsonLd } from "@/components/JsonLd";
import { itemListLd } from "@/lib/seo";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Okulary korekcyjne — oprawki damskie i męskie",
  description:
    "Oprawki korekcyjne Goya — lekkie, gotowe na Twoje soczewki korekcyjne. Damskie i męskie fasony: prostokątne, kocie oko, owalne. Projektowane w Polsce.",
  alternates: { canonical: "/korekcyjne" },
};

export default async function Page() {
  const products = await getByCategory("optical");
  return (
    <>
      <JsonLd data={itemListLd(products, { name: "Okulary korekcyjne Goya", path: "/korekcyjne" })} />
      <section className="wrap pt-10 md:pt-14">
        <Reveal immediate>
          <p className="eyebrow">Kolekcja</p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">Korekcyjne</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            Lekkie, dobrze wyważone oprawki na co dzień – gotowe na Twoje soczewki korekcyjne. Projektujemy je pod realne twarze i realne życie.
          </p>
        </Reveal>
      </section>
      <Suspense fallback={<CatalogFallback products={products} title="Korekcyjne" hideHeader />}>
        <Catalog products={products} lockCategory="optical" title="Korekcyjne" subtitle={`${products.length} oprawek`} hideHeader />
      </Suspense>
    </>
  );
}

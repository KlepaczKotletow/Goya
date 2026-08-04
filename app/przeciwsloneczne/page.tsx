import { Suspense } from "react";
import type { Metadata } from "next";
import { getByCategory } from "@/lib/products";
import { Catalog } from "@/components/Catalog";
import { CatalogFallback } from "@/components/CatalogFallback";
import { JsonLd } from "@/components/JsonLd";
import { itemListLd } from "@/lib/seo";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Okulary przeciwsłoneczne z polaryzacją i UV400",
  description:
    "Okulary przeciwsłoneczne Goya — filtr polaryzacyjny i pełna ochrona UV400 w każdej parze. Damskie i męskie fasony: aviatory, kocie oko, muchy. Od 349 zł.",
  alternates: { canonical: "/przeciwsloneczne" },
};

export default function Page() {
  const products = getByCategory("sun");
  return (
    <>
      <JsonLd data={itemListLd(products, { name: "Okulary przeciwsłoneczne Goya", path: "/przeciwsloneczne" })} />
      <section className="wrap pt-10 md:pt-14">
        <Reveal immediate>
          <p className="eyebrow">Kolekcja</p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">Przeciwsłoneczne</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            Każda para z filtrem polaryzacyjnym – tnie odblaski od jezdni, wody i śniegu, a UV400 zatrzymuje 100% promieni UVA i UVB.
          </p>
        </Reveal>
      </section>
      <Suspense fallback={<CatalogFallback products={products} title="Przeciwsłoneczne" hideHeader />}>
        <Catalog products={products} lockCategory="sun" title="Przeciwsłoneczne" subtitle={`${products.length} modeli · polaryzacja + UV400`} hideHeader />
      </Suspense>
    </>
  );
}

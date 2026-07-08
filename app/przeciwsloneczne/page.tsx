import { Suspense } from "react";
import type { Metadata } from "next";
import { getByCategory } from "@/lib/products";
import { Catalog } from "@/components/Catalog";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Okulary przeciwsłoneczne", description: "Przeciwsłoneczne Goya z filtrem polaryzacyjnym i UV400." };

export default function Page() {
  const products = getByCategory("sun");
  return (
    <>
      <section className="wrap pt-10 md:pt-14">
        <Reveal>
          <p className="eyebrow">Kolekcja</p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">Przeciwsłoneczne</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            Każda para z filtrem polaryzacyjnym - tnie odblaski od jezdni, wody i śniegu, a UV400 zatrzymuje 100% promieni UVA i UVB.
          </p>
        </Reveal>
      </section>
      <Suspense>
        <Catalog products={products} lockCategory="sun" title="Przeciwsłoneczne" subtitle={`${products.length} modeli · polaryzacja + UV400`} hideHeader />
      </Suspense>
    </>
  );
}

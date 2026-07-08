import { Suspense } from "react";
import type { Metadata } from "next";
import { getByCategory } from "@/lib/products";
import { Catalog } from "@/components/Catalog";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Okulary korekcyjne", description: "Oprawki korekcyjne Goya na każdy dzień." };

export default function Page() {
  const products = getByCategory("optical");
  return (
    <>
      <section className="wrap pt-10 md:pt-14">
        <Reveal>
          <p className="eyebrow">Kolekcja</p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">Korekcyjne</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            Lekkie, dobrze wyważone oprawki na co dzień - gotowe na Twoje soczewki korekcyjne. Projektujemy je pod realne twarze i realne życie.
          </p>
        </Reveal>
      </section>
      <Suspense>
        <Catalog products={products} lockCategory="optical" title="Korekcyjne" subtitle={`${products.length} oprawek`} hideHeader />
      </Suspense>
    </>
  );
}

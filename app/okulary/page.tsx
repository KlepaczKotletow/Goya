import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProducts, facets } from "@/lib/products";
import { Catalog } from "@/components/Catalog";
import { JsonLd } from "@/components/JsonLd";
import { itemListLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Okulary — przeciwsłoneczne i korekcyjne",
  description:
    "Wszystkie okulary Goya — przeciwsłoneczne z polaryzacją i UV400 oraz oprawki korekcyjne. Polska marka, lekkie oprawy, uczciwa cena. Filtruj po fasonie, płci i kolorze.",
  alternates: { canonical: "/okulary" },
};

const INTRO =
  "Pełny katalog okularów Goya — przeciwsłoneczne z filtrem polaryzacyjnym i pełną ochroną UV400 oraz lekkie oprawki korekcyjne. Filtruj po fasonie, płci i kolorze, żeby szybko znaleźć swój model.";

export default function Page() {
  const products = getAllProducts();
  return (
    <>
      <JsonLd data={itemListLd(products, { name: "Wszystkie okulary Goya", path: "/okulary" })} />
      <Suspense>
        <Catalog products={products} title="Wszystkie okulary" subtitle={`${facets.count} modeli`} intro={INTRO} />
      </Suspense>
    </>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import { getByCategory } from "@/lib/products";
import { Catalog } from "@/components/Catalog";
import { JsonLd } from "@/components/JsonLd";
import { itemListLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Okulary korekcyjne — oprawki damskie i męskie",
  description:
    "Oprawki korekcyjne Goya — lekkie, gotowe na Twoje soczewki korekcyjne. Damskie i męskie fasony: prostokątne, kocie oko, owalne. Projektowane w Polsce.",
  alternates: { canonical: "/korekcyjne" },
};

const INTRO =
  "Oprawki korekcyjne Goya to lekkie konstrukcje gotowe na montaż Twoich soczewek korekcyjnych. Wybierz fason i kolor — od klasycznych prostokątnych po kobiece kocie oko — i wykończysz oprawę u swojego optyka.";

export default function Page() {
  const products = getByCategory("optical");
  return (
    <>
      <JsonLd data={itemListLd(products, { name: "Okulary korekcyjne Goya", path: "/korekcyjne" })} />
      <Suspense>
        <Catalog
          products={products}
          lockCategory="optical"
          title="Korekcyjne"
          subtitle={`${products.length} modeli · lekkie oprawki`}
          intro={INTRO}
        />
      </Suspense>
    </>
  );
}

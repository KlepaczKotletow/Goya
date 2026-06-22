import { Suspense } from "react";
import type { Metadata } from "next";
import { getByCategory } from "@/lib/products";
import { Catalog } from "@/components/Catalog";
import { JsonLd } from "@/components/JsonLd";
import { itemListLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Okulary przeciwsłoneczne z polaryzacją i UV400",
  description:
    "Okulary przeciwsłoneczne Goya — filtr polaryzacyjny i pełna ochrona UV400 w każdej parze. Damskie i męskie fasony: aviatory, kocie oko, muchy. Od 349 zł.",
  alternates: { canonical: "/przeciwsloneczne" },
};

const INTRO =
  "Okulary przeciwsłoneczne Goya mają filtr polaryzacyjny, który realnie tnie odblaski od jezdni, wody i śniegu, oraz pełną ochronę UV400 — nie tylko ciemniejsze szkło. Wybierz fason: aviatory, kocie oko, muchy, prostokątne i więcej.";

export default function Page() {
  const products = getByCategory("sun");
  return (
    <>
      <JsonLd data={itemListLd(products, { name: "Okulary przeciwsłoneczne Goya", path: "/przeciwsloneczne" })} />
      <Suspense>
        <Catalog
          products={products}
          lockCategory="sun"
          title="Przeciwsłoneczne"
          subtitle={`${products.length} modeli · polaryzacja + UV400`}
          intro={INTRO}
        />
      </Suspense>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { listCollections, plural, type CollectionDef } from "@/lib/collections";
import { getAllProducts } from "@/lib/products";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kolekcje okularów — fasony, kolory i zastosowania",
  description:
    "Wszystkie kolekcje Goya w jednym miejscu: fasony od aviatorów po kocie oko, okulary damskie i męskie, polaryzacyjne i dla kierowców.",
  alternates: { canonical: "/kolekcje" },
};

const KIND_LABELS: Record<CollectionDef["kind"], string> = {
  shape: "Fasony",
  gender: "Dla niej i dla niego",
  category: "Przeciwsłoneczne i korekcyjne",
  polarized: "Polaryzacja",
  usecase: "Zastosowania",
  color: "Kolory",
};
const KIND_ORDER: CollectionDef["kind"][] = ["shape", "gender", "category", "polarized", "usecase", "color"];

export default async function Page() {
  const all = await listCollections();
  const catalogue = await getAllProducts();
  const countFor = new Map(all.map((c) => [c.slug, catalogue.filter(c.filter).length]));
  const groups = KIND_ORDER.map((kind) => ({
    kind,
    items: all.filter((c) => c.kind === kind),
  })).filter((g) => g.items.length > 0);

  const crumbs = [
    { name: "Strona główna", path: "/" },
    { name: "Kolekcje", path: "/kolekcje" },
  ];

  return (
    <div className="wrap py-8 md:py-12">
      <JsonLd data={[breadcrumbLd(crumbs)]} />

      <nav aria-label="Okruszki" className="text-xs text-stone">
        <Link href="/" className="hover:text-ink">Strona główna</Link>
        {" / "}
        <span className="text-ink-soft">Kolekcje</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl">Kolekcje</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Wszystkie sposoby na znalezienie swojej pary — według fasonu, przeznaczenia i koloru.
          Każda kolekcja to realny wybór z naszego katalogu, z polaryzacją i UV400 w przeciwsłonecznych.
        </p>
      </header>

      {groups.map((g) => (
        <section key={g.kind} className="mt-12">
          <h2 className="mb-5 font-display text-2xl">{KIND_LABELS[g.kind]}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((c) => {
              const count = countFor.get(c.slug) ?? 0;
              return (
                <Link
                  key={c.slug}
                  href={`/kolekcje/${c.slug}`}
                  className="group rounded-[16px] border border-line bg-paper p-5 transition hover:border-ink"
                >
                  <p className="font-display text-xl leading-snug">{c.h1}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{c.description}</p>
                  <p className="mt-3 text-xs text-stone">
                    {count} {plural(count, "model", "modele", "modeli")} →
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

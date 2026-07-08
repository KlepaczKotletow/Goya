import type { Metadata } from "next";
import Link from "next/link";
import { listGuides } from "@/lib/guides";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Poradnik — jak dobrać okulary",
  description:
    "Poradnik Goya: jak dobrać okulary do kształtu twarzy, czym różni się polaryzacja od UV400 i jak wybrać oprawki. Praktyczne wskazówki i dopasowane modele.",
  alternates: { canonical: "/poradnik" },
};

export default function Page() {
  const guides = listGuides();
  const pillar = guides.find((g) => g.kind === "pillar");
  const faceShapes = guides.filter((g) => g.kind === "face-shape");
  const articles = guides.filter((g) => g.kind === "article");

  return (
    <div className="wrap py-10 md:py-14">
      <JsonLd
        data={breadcrumbLd([
          { name: "Strona główna", path: "/" },
          { name: "Poradnik", path: "/poradnik" },
        ])}
      />
      <header className="max-w-2xl">
        <p className="eyebrow">Poradnik</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">Jak dobrać okulary</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Praktyczne przewodniki, które pomogą Ci wybrać oprawę dopasowaną do twarzy i zrozumieć, za co naprawdę płacisz w
          dobrych okularach przeciwsłonecznych.
        </p>
      </header>

      {pillar && (
        <Link
          href={`/poradnik/${pillar.slug}`}
          className="group mt-10 block rounded-[20px] border border-line bg-paper p-7 transition hover:border-ink/30 md:p-10"
        >
          <p className="eyebrow">Przewodnik główny</p>
          <h2 className="mt-2 max-w-2xl font-display text-2xl md:text-3xl">{pillar.h1}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{pillar.lead}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
            Czytaj <ArrowIcon className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      )}

      <section className="mt-12">
        <h2 className="mb-5 font-display text-2xl">Dobór okularów do kształtu twarzy</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {faceShapes.map((g) => (
            <Link
              key={g.slug}
              href={`/poradnik/${g.slug}`}
              className="group rounded-[16px] border border-line p-6 transition hover:border-ink/30"
            >
              <h3 className="font-display text-xl leading-snug">{g.h1}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{g.description}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
                Czytaj <ArrowIcon className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {articles.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 font-display text-2xl">Wiedza o okularach</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {articles.map((g) => (
              <Link
                key={g.slug}
                href={`/poradnik/${g.slug}`}
                className="group rounded-[16px] border border-line p-6 transition hover:border-ink/30"
              >
                <h3 className="font-display text-xl leading-snug">{g.h1}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{g.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
                  Czytaj <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

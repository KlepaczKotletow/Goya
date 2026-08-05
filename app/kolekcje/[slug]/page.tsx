import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, listCollections, collectionProducts, collectionFacts } from "@/lib/collections";
import { ProductGrid } from "@/components/ProductGrid";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, itemListLd, faqPageLd } from "@/lib/seo";
import { FAQS } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await listCollections()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const def = await getCollection(slug);
  if (!def) return {};
  return {
    title: def.title,
    description: def.description,
    alternates: { canonical: `/kolekcje/${slug}` },
    openGraph: { title: def.title, description: def.description, url: `/kolekcje/${slug}`, type: "website" },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const def = await getCollection(slug);
  if (!def) notFound();

  const products = await collectionProducts(def);
  const facts = collectionFacts(def, products);
  const faqs = [...(def.faqs ?? []), ...FAQS];

  // Cross-links to sibling collections (internal PageRank + discovery).
  const related = (await listCollections())
    .filter((c) => c.slug !== def.slug && (c.parent.path === def.parent.path || c.kind === def.kind))
    .slice(0, 8);

  const crumbs = [
    { name: "Strona główna", path: "/" },
    def.parent,
    { name: def.h1, path: `/kolekcje/${slug}` },
  ];

  return (
    <div className="wrap py-8 md:py-12">
      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          itemListLd(products, { name: def.h1, path: `/kolekcje/${slug}` }),
          faqPageLd(faqs),
        ]}
      />

      <nav aria-label="Okruszki" className="text-xs text-stone">
        {crumbs.map((c, i) => (
          <span key={c.path}>
            {i > 0 && " / "}
            {i < crumbs.length - 1 ? (
              <Link href={c.path} className="hover:text-ink">{c.name}</Link>
            ) : (
              <span className="text-ink-soft">{c.name}</span>
            )}
          </span>
        ))}
      </nav>

      <header className="mt-4 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl">{def.h1}</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">{def.lead}</p>
        {facts && <p className="mt-3 leading-relaxed text-ink-soft">{facts}</p>}
      </header>

      <section className="mt-10">
        <ProductGrid products={products} priorityCount={4} />
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 font-display text-2xl">Zobacz też</h2>
          <div className="flex flex-wrap gap-2.5">
            {related.map((c) => (
              <Link
                key={c.slug}
                href={`/kolekcje/${c.slug}`}
                className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
              >
                {c.h1}
              </Link>
            ))}
            <Link
              href={def.parent.path}
              className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
            >
              {def.parent.name} — wszystkie
            </Link>
          </div>
        </section>
      )}

      <section className="mt-16 max-w-3xl">
        <h2 className="mb-5 font-display text-2xl md:text-3xl">Najczęstsze pytania</h2>
        <FaqList items={faqs} />
      </section>
    </div>
  );
}

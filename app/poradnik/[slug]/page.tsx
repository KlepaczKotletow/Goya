import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, listGuides, guideProducts } from "@/lib/guides";
import { getCollection } from "@/lib/collections";
import { ProductGrid } from "@/components/ProductGrid";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, faqPageLd } from "@/lib/seo";
import { SITE, absUrl } from "@/content/site";
import { ArrowIcon } from "@/components/icons";

type Params = { params: Promise<{ slug: string }> };

const MONTHS_PL = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
function updatedLabel(ym: string): { iso: string; pretty: string } {
  const [y, m] = ym.split("-").map(Number);
  return { iso: `${ym}-01`, pretty: `${MONTHS_PL[(m ?? 1) - 1]} ${y}` };
}

export function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/poradnik/${slug}` },
    openGraph: {
      title: g.title,
      description: g.description,
      url: `/poradnik/${slug}`,
      type: "article",
      publishedTime: `${g.published ?? g.updated}-01`,
      modifiedTime: `${g.updated}-01`,
      authors: [SITE.name],
      section: "Poradnik",
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const { iso: modifiedIso, pretty } = updatedLabel(g.updated);
  const publishedIso = updatedLabel(g.published ?? g.updated).iso;
  const canonical = absUrl(`/poradnik/${slug}`);
  const ogImage = absUrl(`/poradnik/${slug}/opengraph-image`);
  const orgId = `${absUrl("/")}#organization`;
  const wordCount = [g.lead, ...g.sections.flatMap((sec) => [sec.h2, ...sec.body])].join(" ").trim().split(/\s+/).length;

  const products = guideProducts(g);
  const related = (g.relatedCollections ?? []).map(getCollection).filter(Boolean);
  const relatedGuides = [
    ...listGuides().filter((x) => x.slug !== g.slug && x.kind === "pillar"),
    ...listGuides().filter((x) => x.slug !== g.slug && x.kind === "face-shape"),
    ...listGuides().filter((x) => x.slug !== g.slug && x.kind === "article"),
  ].slice(0, 4);

  const crumbs = [
    { name: "Strona główna", path: "/" },
    { name: "Poradnik", path: "/poradnik" },
    { name: g.h1, path: `/poradnik/${slug}` },
  ];

  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: g.h1,
    description: g.description,
    inLanguage: "pl-PL",
    datePublished: publishedIso,
    dateModified: modifiedIso,
    author: { "@id": orgId },
    publisher: { "@id": orgId },
    image: ogImage,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    wordCount,
  };

  return (
    <article className="wrap py-8 md:py-12">
      <JsonLd data={[blogPostingLd, breadcrumbLd(crumbs), ...(g.faqs ? [faqPageLd(g.faqs)] : [])]} />

      <nav aria-label="Okruszki" className="text-xs text-stone">
        {crumbs.map((c, i) => (
          <span key={c.path}>
            {i > 0 && " / "}
            {i < crumbs.length - 1 ? <Link href={c.path} className="hover:text-ink">{c.name}</Link> : <span className="text-ink-soft">{c.name}</span>}
          </span>
        ))}
      </nav>

      <header className="mt-4 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl">{g.h1}</h1>
        <p className="mt-2 text-xs text-stone">Ostatnia aktualizacja: {pretty}</p>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">{g.lead}</p>
      </header>

      <div className="mt-10 max-w-3xl space-y-10">
        {g.sections.map((s) => (
          <section key={s.h2}>
            <h2 className="font-display text-2xl md:text-3xl">{s.h2}</h2>
            <div className="mt-3 space-y-3">
              {s.body.map((p, i) => (
                <p key={i} className="leading-relaxed text-ink-soft">{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {products.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-2 font-display text-2xl md:text-3xl">Dopasowane modele Goya</h2>
          <p className="mb-6 max-w-2xl text-ink-soft">Wybrane oprawy w fasonach, które najlepiej pasują do tej twarzy.</p>
          <ProductGrid products={products} priorityCount={4} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <div className="flex flex-wrap gap-2.5">
            {related.map((c) => (
              <Link
                key={c!.slug}
                href={`/kolekcje/${c!.slug}`}
                className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
              >
                {c!.h1}
              </Link>
            ))}
          </div>
        </section>
      )}

      {g.faqs && g.faqs.length > 0 && (
        <section className="mt-14 max-w-3xl">
          <h2 className="mb-5 font-display text-2xl md:text-3xl">Najczęstsze pytania</h2>
          <FaqList items={g.faqs} />
        </section>
      )}

      {relatedGuides.length > 0 && (
        <section className="mt-14 max-w-3xl border-t border-line pt-10">
          <h2 className="mb-5 font-display text-2xl md:text-3xl">Powiązane poradniki</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {relatedGuides.map((r) => (
              <li key={r.slug}>
                <Link href={`/poradnik/${r.slug}`} className="group flex items-start gap-2 text-ink-soft transition hover:text-ink">
                  <ArrowIcon className="mt-1 shrink-0 transition-transform group-hover:translate-x-1" />
                  <span>{r.h1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-14">
        <Link href="/poradnik" className="text-sm link-underline">← Wróć do poradnika</Link>
      </section>
    </article>
  );
}

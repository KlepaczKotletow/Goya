import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProductSlugs, getRelated, getBestsellers } from "@/lib/products";
import { ProductView } from "@/components/ProductView";
import { ProductCarousel } from "@/components/pdp/ProductCarousel";
import { TrustBand } from "@/components/pdp/TrustBand";
import { Faq } from "@/components/pdp/Faq";
import { JsonLd } from "@/components/JsonLd";
import { productLd, breadcrumbLd, faqPageLd, productMetaDescription } from "@/lib/seo";
import { CATEGORY_LABELS } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const desc = productMetaDescription(p);
  return {
    // Layout template appends " · Goya" — keep the brand out of the page part.
    title: `${p.name} — ${p.category === "sun" ? "okulary przeciwsłoneczne z polaryzacją" : "oprawki korekcyjne"}`,
    description: desc,
    alternates: { canonical: `/okulary/${slug}` },
    openGraph: {
      title: `Goya ${p.name}`,
      description: desc,
      url: `/okulary/${slug}`,
      type: "website",
      images: p.images[0]?.src ? [p.images[0].src] : [],
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = getRelated(product, 4);
  const recommended = getBestsellers(8).filter((p) => p.slug !== product.slug).slice(0, 4);

  const categoryPath = product.category === "sun" ? "/przeciwsloneczne" : "/korekcyjne";
  const crumbs = [
    { name: "Strona główna", path: "/" },
    { name: CATEGORY_LABELS[product.category], path: categoryPath },
    { name: product.name, path: `/okulary/${slug}` },
  ];

  return (
    <div className="pb-24 md:pb-10">
      <JsonLd data={[productLd(product), breadcrumbLd(crumbs), faqPageLd()]} />
      <ProductView product={product} />
      <div className="mt-10 border-t border-line md:mt-0">
        <ProductCarousel
          title="Dopasuj do siebie"
          products={related}
          href={product.category === "sun" ? "/przeciwsloneczne" : "/korekcyjne"}
        />
      </div>
      <TrustBand />
      <ProductCarousel title="Polecane dla Ciebie" products={recommended} href="/okulary" />
      <Faq />
    </div>
  );
}

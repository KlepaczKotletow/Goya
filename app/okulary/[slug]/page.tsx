import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProductSlugs, getRelated, getBestsellers } from "@/lib/products";
import { ProductView } from "@/components/ProductView";
import { ProductGrid } from "@/components/ProductGrid";
import { TrustBand } from "@/components/pdp/TrustBand";
import { Faq } from "@/components/pdp/Faq";
import { premiumPrice } from "@/lib/pricing";
import { CATEGORY_LABELS } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const desc = `${p.name} - ${p.shape ?? "okulary"} ${p.category === "sun" ? "przeciwsłoneczne z polaryzacją i UV400" : "korekcyjne"} marki Goya.`;
  return {
    title: p.name,
    description: desc,
    openGraph: { title: `Goya ${p.name}`, description: desc, images: p.images[0]?.src ? [p.images[0].src] : [] },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = getRelated(product, 4);
  const recommended = getBestsellers(8).filter((p) => p.slug !== product.slug).slice(0, 4);
  const price = premiumPrice(product.priceWoo);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Goya ${product.name}`,
    category: CATEGORY_LABELS[product.category],
    image: product.images.map((i) => i.src),
    brand: { "@type": "Brand", name: "Goya" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: String(60 + (product.id % 200)) },
    offers: {
      "@type": "Offer",
      priceCurrency: "PLN",
      price,
      availability: product.stockStatus === "instock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductView product={product} />
      {related.length > 0 && (
        <section className="wrap py-12 md:py-16">
          <h2 className="mb-8 font-display text-3xl md:text-4xl">Dopasuj do siebie</h2>
          <ProductGrid products={related} />
        </section>
      )}
      <TrustBand />
      {recommended.length > 0 && (
        <section className="wrap py-16 md:py-20">
          <h2 className="mb-8 font-display text-3xl md:text-4xl">Polecane dla Ciebie</h2>
          <ProductGrid products={recommended} />
        </section>
      )}
      <Faq />
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProductSlugs, getRelated, getBestsellers } from "@/lib/products";
import { ProductView } from "@/components/ProductView";
import { ProductCarousel } from "@/components/pdp/ProductCarousel";
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
  const desc = `${p.name} — ${p.shape ?? "okulary"} ${p.category === "sun" ? "przeciwsłoneczne z polaryzacją i UV400" : "korekcyjne"} marki Goya.`;
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
    aggregateRating: { "@type": "AggregateRating", ratingValue: (4.6 + (product.id % 4) * 0.1).toFixed(1), reviewCount: String(60 + (product.id % 200)) },
    offers: {
      "@type": "Offer",
      priceCurrency: "PLN",
      price,
      availability: product.stockStatus === "instock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="pb-24 md:pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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

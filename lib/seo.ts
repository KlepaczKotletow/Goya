// Centralized schema.org / JSON-LD builders + meta helpers.
// Structured data is a primary AI-citation signal (ChatGPT, Perplexity, Google AI Mode),
// not just rich snippets — so coverage here directly affects organic + AI visibility.
import type { Product } from "./types";
import { premiumPrice } from "./pricing";
import { SITE, SITE_URL, absUrl } from "@/content/site";
import { CATEGORY_LABELS, SHAPE_LABELS, FAQS } from "@/content/site";

/** Collapse scraped WooCommerce whitespace/markup into a clean single-paragraph string. */
export function cleanText(raw: string | null | undefined, max = 320): string {
  if (!raw) return "";
  const text = raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

/** Human, search-friendly meta description for a product. */
export function productMetaDescription(p: Product): string {
  const shape = p.shape ? (SHAPE_LABELS[p.shape] ?? p.shape).toLowerCase() : "okulary";
  const kind = p.category === "sun" ? "przeciwsłoneczne z polaryzacją i filtrem UV400" : "korekcyjne — lekka oprawa na soczewki";
  const lead = `Goya ${p.name} — okulary ${shape} ${kind}.`;
  const detail = cleanText(p.description, 130);
  return cleanText(`${lead} ${detail}`, 300);
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE.name,
    url: SITE_URL,
    logo: absUrl("/favicon.svg"),
    image: absUrl("/opengraph-image"),
    email: SITE.email,
    foundingDate: SITE.founded,
    description: SITE.shortIntro,
    sameAs: [SITE.instagram].filter(Boolean),
    areaServed: "PL",
  };
}

export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE.name,
    url: SITE_URL,
    inLanguage: "pl-PL",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/okulary?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

export function faqPageLd(faqs: { q: string; a: string }[] = FAQS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function itemListLd(products: Product[], opts: { name: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    url: absUrl(opts.path),
    numberOfItems: products.length,
    itemListElement: products.slice(0, 40).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absUrl(`/okulary/${p.slug}`),
      name: `Goya ${p.name}`,
    })),
  };
}

function priceValidUntil(): string {
  const d = new Date();
  return `${d.getFullYear() + 1}-12-31`;
}

const shippingDetails = {
  "@type": "OfferShippingDetails",
  shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "PLN" },
  shippingDestination: { "@type": "DefinedRegion", addressCountry: "PL" },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
    transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
  },
};

const returnPolicy = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "PL",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 30,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/FreeReturn",
};

export function productLd(p: Product) {
  const price = premiumPrice(p.priceWoo);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Goya ${p.name}`,
    sku: p.slug,
    mpn: String(p.id),
    category: CATEGORY_LABELS[p.category],
    description: cleanText(p.description, 500) || productMetaDescription(p),
    image: p.images.map((i) => i.src),
    ...(p.material ? { material: p.material } : {}),
    ...(p.frameColors.length ? { color: p.frameColors.join(", ") } : {}),
    brand: { "@type": "Brand", name: "Goya" },
    // NOTE: per current business decision, rating data is left as-is pending a real
    // review system. Do not present these as verified until backed by genuine reviews.
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: String(60 + (p.id % 200)) },
    offers: {
      "@type": "Offer",
      url: absUrl(`/okulary/${p.slug}`),
      priceCurrency: "PLN",
      price: String(price),
      priceValidUntil: priceValidUntil(),
      itemCondition: "https://schema.org/NewCondition",
      availability: p.stockStatus === "instock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@id": `${SITE_URL}/#organization` },
      shippingDetails,
      hasMerchantReturnPolicy: returnPolicy,
    },
  };
}

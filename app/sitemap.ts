import type { MetadataRoute } from "next";
import { getAllProducts, facets } from "@/lib/products";
import { listCollections } from "@/lib/collections";
import { listGuides } from "@/lib/guides";
import { SITE_URL } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const catalogMod = new Date(facets.generatedAt);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1, lastModified: catalogMod },
    { url: `${base}/okulary`, changeFrequency: "weekly", priority: 0.9, lastModified: catalogMod },
    { url: `${base}/przeciwsloneczne`, changeFrequency: "weekly", priority: 0.9, lastModified: catalogMod },
    { url: `${base}/korekcyjne`, changeFrequency: "weekly", priority: 0.9, lastModified: catalogMod },
    { url: `${base}/kolekcje`, changeFrequency: "weekly", priority: 0.7, lastModified: catalogMod },
    { url: `${base}/poradnik`, changeFrequency: "monthly", priority: 0.6, lastModified: catalogMod },
    { url: `${base}/o-marce`, changeFrequency: "yearly", priority: 0.5, lastModified: catalogMod },
    { url: `${base}/regulamin`, changeFrequency: "yearly", priority: 0.3, lastModified: catalogMod },
    { url: `${base}/polityka-prywatnosci`, changeFrequency: "yearly", priority: 0.3, lastModified: catalogMod },
    { url: `${base}/zwroty`, changeFrequency: "yearly", priority: 0.3, lastModified: catalogMod },
  ];

  const collections: MetadataRoute.Sitemap = listCollections().map((c) => ({
    url: `${base}/kolekcje/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: catalogMod,
  }));

  const guides: MetadataRoute.Sitemap = listGuides().map((g) => ({
    url: `${base}/poradnik/${g.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: new Date(`${g.updated}-01`),
  }));

  const products: MetadataRoute.Sitemap = getAllProducts().map((p) => ({
    url: `${base}/okulary/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: catalogMod,
    // Self-hosted paths need absolutising for image sitemap entries.
    images: p.images[0]?.src
      ? [p.images[0].src.startsWith("http") ? p.images[0].src : `${base}${p.images[0].src}`]
      : undefined,
  }));

  return [...staticRoutes, ...collections, ...guides, ...products];
}

import type { MetadataRoute } from "next";
import { getProductSlugs } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://goya.pl";
  const routes = ["", "/okulary", "/przeciwsloneczne", "/korekcyjne", "/o-marce", "/ulubione"].map((r) => ({
    url: `${base}${r}`,
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.7,
  }));
  const products = getProductSlugs().map((slug) => ({
    url: `${base}/okulary/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...routes, ...products];
}

import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: { root },
  images: {
    // Product photos are mirrored into public/products/ by scripts/localize-images.mjs.
    // okulary.pl stays allow-listed so a freshly fetched, not-yet-localized snapshot
    // still renders instead of throwing.
    remotePatterns: [
      { protocol: "https", hostname: "okulary.pl" },
      { protocol: "https", hostname: "www.okulary.pl" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

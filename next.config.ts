import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: { root },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "okulary.pl" },
      { protocol: "https", hostname: "www.okulary.pl" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

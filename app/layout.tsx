import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { JsonLd } from "@/components/JsonLd";
import { organizationLd, webSiteLd } from "@/lib/seo";
import { SITE, SITE_URL } from "@/content/site";

// Self-hosted via next/font (no render-blocking external stylesheet, no layout shift).
// latin-ext subset is required for Polish diacritics (ą ć ę ł ń ó ś ż ź).
const display = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--ff-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--ff-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Goya — Okulary przeciwsłoneczne z polaryzacją i UV400", template: "%s · Goya" },
  description: SITE.shortIntro,
  alternates: { canonical: "/" },
  applicationName: SITE.name,
  openGraph: {
    title: "Goya — Okulary z polaryzacją",
    description: SITE.shortIntro,
    type: "website",
    locale: "pl_PL",
    siteName: SITE.name,
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image", title: "Goya — Okulary z polaryzacją", description: SITE.shortIntro },
  icons: { icon: "/favicon.svg" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`h-full ${display.variable} ${sans.variable}`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-paper"
        >
          Przejdź do treści
        </a>
        <JsonLd data={[organizationLd(), webSiteLd()]} />
        <CartProvider>
          <ScrollProgress />
          <Header />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

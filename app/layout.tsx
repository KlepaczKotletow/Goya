import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://goya.pl"),
  title: { default: "Goya — Światło i luz. Okulary z polaryzacją", template: "%s · Goya" },
  description: SITE.shortIntro,
  openGraph: { title: "Goya", description: SITE.shortIntro, type: "website", locale: "pl_PL", siteName: "Goya" },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Hanken+Grotesk:ital,wght@0,300..800;1,300..800&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <ScrollProgress />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

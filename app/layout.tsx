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
  title: { default: "Goya — Okulary z polaryzacją", template: "%s · Goya" },
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
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=Inter:wght@400..700&display=swap"
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

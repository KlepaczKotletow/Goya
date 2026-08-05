import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { WishlistView } from "@/components/WishlistView";

// User-specific, client-rendered shell with no stable server content → keep out of the index.
export const metadata: Metadata = {
  title: "Ulubione",
  robots: { index: false, follow: true },
};

export default async function Page() {
  return <WishlistView products={await getAllProducts()} />;
}

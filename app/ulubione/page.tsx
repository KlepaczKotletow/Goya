import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { WishlistView } from "@/components/WishlistView";

export const metadata: Metadata = { title: "Ulubione" };

export default function Page() {
  return <WishlistView products={getAllProducts()} />;
}

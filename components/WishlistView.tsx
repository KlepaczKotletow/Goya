"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";
import { ProductGrid } from "./ProductGrid";

export function WishlistView({ products }: { products: Product[] }) {
  const { wishlist, hydrated } = useCart();
  if (!hydrated) return <div className="wrap min-h-[40vh] py-24" />;
  const items = products.filter((p) => wishlist.includes(p.slug));
  return (
    <div className="wrap py-12 md:py-16">
      <p className="eyebrow">Twoja lista</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Ulubione</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-stone">Nie masz jeszcze ulubionych modeli.</p>
          <Link href="/okulary" className="mt-5 inline-block rounded-full bg-ink px-7 py-3 text-sm text-paper transition hover:bg-rust">
            Przeglądaj okulary
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <ProductGrid products={items} />
        </div>
      )}
    </div>
  );
}

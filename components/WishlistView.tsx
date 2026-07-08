"use client";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";
import { ProductGrid } from "./ProductGrid";
import { ButtonLink } from "./Button";
import { HeartIcon } from "./icons";

export function WishlistView({ products }: { products: Product[] }) {
  const { wishlist, hydrated } = useCart();
  const items = hydrated ? products.filter((p) => wishlist.includes(p.slug)) : [];
  return (
    <div className="wrap py-12 md:py-16">
      <p className="eyebrow">Twoja lista</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Ulubione</h1>
      {!hydrated ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-[16px] bg-linen" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <HeartIcon className="h-10 w-10 text-clay" />
          <p className="mt-5 font-display text-2xl md:text-3xl">Twoja lista jest pusta</p>
          <p className="mt-2 max-w-sm text-ink-soft">Zapisuj modele sercem - wrócą tutaj, gdy będziesz gotów wybrać.</p>
          <ButtonLink href="/okulary" variant="accent" size="lg" className="mt-7">Przeglądaj okulary</ButtonLink>
        </div>
      ) : (
        <div className="mt-8">
          <ProductGrid products={items} />
        </div>
      )}
    </div>
  );
}

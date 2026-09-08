"use client";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { priceOf, regularOf, discountOf, formatPLN } from "@/lib/pricing";
import { imageAt, fieldTint } from "@/lib/utils";
import { useCartActions, useIsWished } from "@/lib/cart";
import { SHAPE_LABELS, COLOR_HEX } from "@/content/site";
import { HeartIcon } from "./icons";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  // Narrow subscriptions on purpose: this component exists once per product, so
  // it must not re-render when a line is added or the drawer opens. Actions are
  // stable, and the wishlist hook watches one boolean about this product.
  const { toggleWish, add } = useCartActions();
  const img = imageAt(product.images, 0);
  const img2 = imageAt(product.images, 1);
  const hasSecond = Boolean(img2 && img2 !== img);
  const wished = useIsWished(product.slug);
  const price = priceOf(product);
  const compareAt = regularOf(product);
  const pct = discountOf(product);
  const meta = [product.shape ? SHAPE_LABELS[product.shape] ?? product.shape : "Okulary", product.gender].filter(Boolean).join(" · ");
  const colors = product.frameColors.slice(0, 5);
  const tint = fieldTint(product.id);
  // Variable products need a color/variant choice → send to the PDP instead of an ambiguous line.
  const hasVariants = product.variations.length > 1;

  return (
    <div className="group relative">
      <Link href={`/okulary/${product.slug}`} className="block">
        <div
          className="relative aspect-square overflow-hidden rounded-[var(--radius)] shadow-card ring-1 ring-ink/[0.06] transition-[transform,box-shadow] duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-lift"
          style={{ backgroundColor: tint }}
        >
          {img && (
            <Image
              src={img}
              alt={product.images[0]?.alt || product.name}
              fill
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              className={`object-contain p-6 mix-blend-multiply transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.05] ${hasSecond ? "group-hover:opacity-0" : ""}`}
              priority={priority}
            />
          )}
          {hasSecond && (
            /* Hover-swap image, and only where hover exists. It is revealed by
               group-hover, so on a touch device it can never be seen — but it was
               still a DOM node, a mix-blend-multiply blend group, and a real image
               download: measured on the live catalogue, 100 of these on top of the
               149 primary images. `hidden` gives it no layout box, so iOS neither
               composites it nor fetches it. The same [@media(hover:hover)] query
               already gates the hover CTA below, so an iPad — touch, but wider
               than md — is handled correctly too. */
            <Image
              src={img2 as string}
              alt=""
              fill
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              className="absolute inset-0 hidden object-contain p-6 mix-blend-multiply opacity-0 transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-100 [@media(hover:hover)]:block"
            />
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWish(product.slug);
            }}
            aria-label={wished ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
            // No backdrop-blur. This button repeats once per card, so a catalogue
            // page carried 149 backdrop-filter layers — measured on the live site.
            // Each one is a region iOS Safari must sample and blur, and they are
            // also the backdrop that the cart drawer's overlay then has to blur
            // through, which is why they hurt a flow they are not even part of.
            // At 90% paper over a tinted card the blur was doing almost nothing
            // visible anyway; the extra 10% opacity replaces it.
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-ink transition hover:bg-paper"
            style={{ color: wished ? "var(--color-terracotta)" : undefined }}
          >
            <HeartIcon filled={wished} className="h-[17px] w-[17px]" />
          </button>
          {pct > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-terracotta px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide text-paper">
              −{pct}%
            </span>
          )}
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-[transform,opacity] duration-300 ease-out [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 max-md:hidden">
            {hasVariants ? (
              <span className="block w-full rounded-full bg-ink py-3 text-center text-xs font-medium tracking-wide text-paper shadow-lg transition group-hover:bg-rust">
                Wybierz model
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  add({ slug: product.slug, name: product.name, price, regularPrice: compareAt, image: img });
                }}
                className="w-full rounded-full bg-ink py-3 text-xs font-medium tracking-wide text-paper shadow-lg transition hover:bg-rust"
              >
                Dodaj do koszyka
              </button>
            )}
          </div>
        </div>
      </Link>
      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/okulary/${product.slug}`} className="font-display text-[1.1rem] leading-tight">
            {product.name}
          </Link>
          <p className="mt-0.5 truncate text-xs text-stone">{meta}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end pt-0.5 leading-tight">
          <span className="text-sm tabular-nums">{formatPLN(price)}</span>
          {pct > 0 && (
            <span className="text-xs text-stone line-through tabular-nums">{formatPLN(compareAt as number)}</span>
          )}
        </div>
      </div>
      {colors.length > 1 && (
        <div className="mt-2 flex items-center gap-1.5">
          {colors.map((c) => (
            <span
              key={c}
              title={c}
              className="h-3 w-3 rounded-full ring-1 ring-ink/15"
              style={{
                background:
                  c === "Wielokolorowy"
                    ? "conic-gradient(from 0deg,#c2542a,#e2b53d,#3f7d54,#2f5fae,#6b4e9b,#c2542a)"
                    : COLOR_HEX[c] ?? "#b9a48c",
              }}
            />
          ))}
        </div>
      )}
      {hasVariants ? (
        <Link
          href={`/okulary/${product.slug}`}
          className="mt-3 block w-full rounded-full border border-ink/15 py-3 text-center text-[0.8rem] font-medium tracking-wide text-ink transition hover:border-ink hover:bg-ink hover:text-paper md:hidden"
        >
          Wybierz model
        </Link>
      ) : (
        <button
          onClick={() => add({ slug: product.slug, name: product.name, price, regularPrice: compareAt, image: img })}
          className="mt-3 w-full rounded-full border border-ink/15 py-3 text-[0.8rem] font-medium tracking-wide text-ink transition hover:border-ink hover:bg-ink hover:text-paper md:hidden"
        >
          Dodaj do koszyka
        </button>
      )}
    </div>
  );
}

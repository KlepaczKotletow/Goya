"use client";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { premiumPrice, compareAtPrice, discountPct, formatPLN } from "@/lib/pricing";
import { imageAt, fieldTint } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { SHAPE_LABELS, COLOR_HEX } from "@/content/site";

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21s-7.4-4.55-10-9.3C.4 8.4 2 5 5.2 5c2 0 3.3 1.05 3.9 2.05.6 1 .9 1 .9 1s.3 0 .9-1C11.5 6.05 12.8 5 14.8 5 18 5 19.6 8.4 18 11.7 15.4 16.45 12 21 12 21z" />
    </svg>
  );
}

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { toggleWish, isWished, add } = useCart();
  const img = imageAt(product.images, 0);
  const img2 = imageAt(product.images, 1);
  const hasSecond = Boolean(img2 && img2 !== img);
  const wished = isWished(product.slug);
  const price = premiumPrice(product.priceWoo);
  const compareAt = compareAtPrice(price);
  const pct = discountPct(price, compareAt);
  const meta = [product.shape ? SHAPE_LABELS[product.shape] ?? product.shape : "Okulary", product.gender].filter(Boolean).join(" · ");
  const colors = product.frameColors.slice(0, 5);
  const tint = fieldTint(product.id);

  return (
    <div className="group relative">
      <Link href={`/okulary/${product.slug}`} className="block">
        <div
          className="relative aspect-square overflow-hidden rounded-[var(--radius)] ring-1 ring-black/[0.04] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_26px_44px_-26px_rgba(38,34,31,0.45)]"
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
            <Image
              src={img2 as string}
              alt=""
              fill
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              className="absolute inset-0 object-contain p-6 mix-blend-multiply opacity-0 transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-100"
            />
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWish(product.slug);
            }}
            aria-label={wished ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-paper/80 text-ink backdrop-blur transition hover:bg-paper"
            style={{ color: wished ? "var(--color-terracotta)" : undefined }}
          >
            <Heart filled={wished} />
          </button>
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {pct > 0 && (
              <span className="rounded-full bg-terracotta px-2.5 py-1 text-[0.6rem] font-semibold tracking-wide text-paper">
                −{pct}%
              </span>
            )}
            {product.category === "sun" && product.polarized && (
              <span className="rounded-full bg-ink/85 px-2.5 py-1 text-[0.6rem] uppercase tracking-wider text-paper">
                Polaryzacja
              </span>
            )}
          </div>
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 ease-out [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 max-md:hidden">
            <button
              onClick={(e) => {
                e.preventDefault();
                add({ slug: product.slug, name: product.name, price, image: img });
              }}
              className="w-full rounded-full bg-ink py-3 text-xs font-medium tracking-wide text-paper shadow-lg transition hover:bg-rust"
            >
              Dodaj do koszyka
            </button>
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
            <span className="text-xs text-stone line-through tabular-nums">{formatPLN(compareAt)}</span>
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
      <button
        onClick={() => add({ slug: product.slug, name: product.name, price, image: img })}
        className="mt-3 w-full rounded-full border border-ink/15 py-2.5 text-xs font-medium tracking-wide text-ink transition hover:border-ink hover:bg-ink hover:text-paper md:hidden"
      >
        Dodaj do koszyka
      </button>
    </div>
  );
}

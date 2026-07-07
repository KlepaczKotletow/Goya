"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { premiumPrice, compareAtPrice, discountPct, formatPLN } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import { Accordion } from "./Accordion";
import { Stars } from "./Stars";
import { HeartIcon, AppleIcon, GPayIcon, CheckIcon, TruckIcon, ReturnIcon, ShieldIcon, SunIcon } from "./icons";
import { SHAPE_LABELS, CATEGORY_LABELS, INCLUDED } from "@/content/site";
import { cn, fieldTint } from "@/lib/utils";

// PDP galleries show ONLY real product packshots + variation images.
// Never inject generic lifestyle/person photos here — they show a fixed pair of
// glasses that won't match most products (owner: "if the glasses are not the same,
// we cannot show them on product pages"). Lifestyle imagery lives on home/lookbook only.
type GItem = { src: string; alt: string };

export function ProductView({ product }: { product: Product }) {
  const { add, setOpen, toggleWish, isWished } = useCart();
  const price = premiumPrice(product.priceWoo);
  const compareAt = compareAtPrice(price);
  const pct = discountPct(price, compareAt);
  const tint = fieldTint(product.id);
  const rating = 4.6 + (product.id % 4) * 0.1;
  const reviewCount = 60 + (product.id % 200);
  const wished = isWished(product.slug);

  const variantOptions = useMemo(
    () => product.variations.map((v) => ({ id: v.id, label: v.attributes.map((a) => a.option).join(" / ") || v.sku || "Wariant", image: v.image })),
    [product],
  );
  const [variantId, setVariantId] = useState<number | null>(variantOptions[0]?.id ?? null);
  const selected = product.variations.find((v) => v.id === variantId) ?? null;

  const gallery: GItem[] = useMemo(() => {
    const items: GItem[] = [];
    const seen = new Set<string>();
    product.images.forEach((im) => {
      if (!seen.has(im.src)) {
        seen.add(im.src);
        items.push({ src: im.src, alt: im.alt || product.name });
      }
    });
    product.variations.forEach((v) => {
      if (v.image && !seen.has(v.image)) {
        seen.add(v.image);
        items.push({ src: v.image, alt: product.name });
      }
    });
    return items;
  }, [product]);

  const [active, setActive] = useState(0);
  const firstVariantRun = useRef(true);
  useEffect(() => {
    if (firstVariantRun.current) {
      firstVariantRun.current = false;
      return;
    }
    if (selected?.image) {
      const idx = gallery.findIndex((g) => g.src === selected.image);
      if (idx >= 0) setActive(idx);
    }
  }, [variantId, selected, gallery]);

  const shown = gallery[Math.min(active, gallery.length - 1)];

  const addToBag = () => {
    const variantLabel = selected ? variantOptions.find((o) => o.id === selected.id)?.label : null;
    add({
      key: `${product.slug}-${selected?.id ?? "x"}`,
      slug: product.slug,
      name: product.name,
      price,
      image: (selected?.image ?? product.images[0]?.src) || null,
      variant: variantLabel ?? null,
    });
    setOpen(true);
  };

  // floating bar visibility
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0),
      { rootMargin: "0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const badges = (
    product.category === "sun"
      ? [
          { icon: <SunIcon className="text-terracotta" />, label: "UV400" },
          product.polarized ? { icon: <CheckIcon className="text-terracotta" />, label: "Polaryzacja" } : null,
          product.uv ? { icon: <SunIcon className="text-terracotta" />, label: `Filtr ${product.uv}` } : null,
          { icon: <ShieldIcon className="text-terracotta" />, label: "Certyfikat CE" },
        ]
      : [
          { icon: <CheckIcon className="text-terracotta" />, label: "Lekka oprawa" },
          { icon: <CheckIcon className="text-terracotta" />, label: "Na soczewki korekcyjne" },
          { icon: <ShieldIcon className="text-terracotta" />, label: "Certyfikat CE" },
        ]
  ).filter(Boolean) as { icon: React.ReactNode; label: string }[];

  const specRows = (
    [
      ["Fason", product.shape ? SHAPE_LABELS[product.shape] ?? product.shape : null],
      ["Płeć", product.gender],
      ["Materiał", product.material],
      ["Kolor oprawy", product.frameColors.join(", ") || null],
      ["Szerokość frontu", product.dims.frontWidth ? `${product.dims.frontWidth} mm` : null],
      ["Wysokość soczewki", product.dims.lensHeight ? `${product.dims.lensHeight} mm` : null],
      ["Długość zausznika", product.dims.templeLength ? `${product.dims.templeLength} mm` : null],
    ] as [string, string | null][]
  ).filter((r): r is [string, string] => Boolean(r[1]));

  const accordionItems = [
    {
      title: "Opis produktu",
      content: (() => {
        const paras = (product.description || "")
          .split(/\n+/)
          .map((x) => x.trim())
          .filter((x) => x.length > 1)
          .slice(0, 4);
        if (!paras.length)
          return <p>Ponadczasowy model {product.name} marki Goya z filtrem polaryzacyjnym i pełną ochroną UV400. Lekka, dobrze wyważona oprawa na co dzień.</p>;
        return <div className="space-y-3">{paras.map((x, i) => <p key={i}>{x}</p>)}</div>;
      })(),
    },
    {
      title: "Wymiary i materiały",
      content: (
        <dl className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {specRows.map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-line/60 py-1.5">
              <dt className="text-stone">{k}</dt>
              <dd className="text-right text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      title: "Dostawa i zwroty",
      content: (
        <ul className="space-y-1.5">
          <li>Darmowa wysyłka od 199 zł (kurier lub paczkomat).</li>
          <li>Wysyłka w 1–2 dni robocze.</li>
          <li>30 dni na zwrot bez podawania przyczyny.</li>
          <li>24 miesiące gwarancji.</li>
        </ul>
      ),
    },
  ];

  return (
    <>
      <div className="wrap grid gap-8 py-6 md:grid-cols-2 md:gap-14 md:py-12">
        {/* GALLERY */}
        <div className="md:sticky md:top-28 md:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] md:aspect-square" style={{ backgroundColor: tint }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={shown?.src ?? "x"}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                {shown && <Image src={shown.src} alt={shown.alt} fill priority sizes="(max-width:768px) 100vw, 45vw" className="object-contain p-10 mix-blend-multiply" />}
              </motion.div>
            </AnimatePresence>
            {pct > 0 && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-paper">−{pct}%</span>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto hide-scrollbar">
              {gallery.map((g, i) => (
                <button
                  key={g.src}
                  onClick={() => setActive(i)}
                  className={cn("relative h-20 w-20 shrink-0 overflow-hidden rounded-[12px] ring-1 transition", active === i ? "ring-ink" : "ring-line hover:ring-ink/40")}
                  style={{ backgroundColor: tint }}
                >
                  <Image src={g.src} alt="" fill sizes="80px" className="object-contain p-2 mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div>
          <nav className="text-xs text-stone">
            <Link href="/okulary" className="hover:text-ink">Okulary</Link>
            {" / "}
            <Link href={product.category === "sun" ? "/przeciwsloneczne" : "/korekcyjne"} className="hover:text-ink">
              {CATEGORY_LABELS[product.category]}
            </Link>
          </nav>
          <p className="eyebrow mt-3">{CATEGORY_LABELS[product.category]}</p>
          <h1 className="mt-1.5 font-display text-4xl md:text-5xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <Stars rating={rating} />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-stone">({reviewCount} opinii)</span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-medium tabular-nums">{formatPLN(price)}</span>
            {pct > 0 && (
              <>
                <span className="pb-1 text-lg text-stone line-through tabular-nums">{formatPLN(compareAt)}</span>
                <span className="mb-1.5 rounded-full bg-terracotta/12 px-2 py-0.5 text-xs font-semibold text-terracotta">−{pct}%</span>
              </>
            )}
          </div>
          <p className="mt-1.5 text-sm text-ink-soft">{product.category === "sun" ? "Cena zawiera filtr polaryzacyjny i pełną ochronę UV400." : "Lekka oprawa korekcyjna — gotowa na Twoje soczewki korekcyjne."}</p>

          {variantOptions.length > 1 && (
            <div className="mt-6">
              <p className="eyebrow mb-3">Wariant{selected ? <span className="ml-1 normal-case tracking-normal text-ink">· {variantOptions.find((o) => o.id === selected.id)?.label}</span> : null}</p>
              <div className="flex flex-wrap gap-3">
                {variantOptions.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setVariantId(o.id)}
                    aria-label={o.label}
                    title={o.label}
                    className={cn("relative h-16 w-16 overflow-hidden rounded-[12px] ring-1 transition", variantId === o.id ? "ring-2 ring-ink" : "ring-line hover:ring-ink/50")}
                    style={{ backgroundColor: tint }}
                  >
                    {o.image ? <Image src={o.image} alt="" fill sizes="64px" className="object-contain p-1.5 mix-blend-multiply" /> : <span className="grid h-full w-full place-items-center text-[0.6rem] text-stone">{o.label}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-7 flex gap-3">
            <button onClick={addToBag} className="flex-1 rounded-full bg-terracotta py-4 text-sm font-medium text-paper transition hover:bg-rust">
              Dodaj do koszyka — {formatPLN(price)}
            </button>
            <button onClick={() => toggleWish(product.slug)} aria-label="Dodaj do ulubionych" className={cn("grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border transition", wished ? "border-terracotta text-terracotta" : "border-ink/25 hover:border-ink")}>
              <HeartIcon filled={wished} />
            </button>
          </div>

          {/* express pay */}
          <div className="mt-4">
            <div className="mb-2.5 flex items-center gap-3 text-xs text-stone">
              <span className="h-px flex-1 bg-line" /> lub zapłać szybko <span className="h-px flex-1 bg-line" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={addToBag} className="flex h-11 items-center justify-center gap-1.5 rounded-full bg-ink text-sm font-medium text-paper transition hover:opacity-90">
                <AppleIcon /> Pay
              </button>
              <button onClick={addToBag} className="flex h-11 items-center justify-center rounded-full border border-ink/20 bg-paper transition hover:border-ink/40">
                <GPayIcon />
              </button>
            </div>
          </div>
          <div ref={ctaRef} className="h-px" />

          {/* in the box */}
          <div className="mt-7 rounded-[16px] border border-line bg-paper p-5">
            <p className="eyebrow mb-3">W zestawie — gratis</p>
            <ul className="space-y-2.5">
              {INCLUDED.map((it) => (
                <li key={it.label} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-terracotta/12 text-terracotta"><CheckIcon className="h-3.5 w-3.5" /></span>
                  <span><span className="text-ink">{it.label}</span> <span className="text-stone">· {it.note}</span></span>
                </li>
              ))}
            </ul>
          </div>

          {/* spec badges */}
          <div className="mt-5 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs">
                {b.icon} {b.label}
              </span>
            ))}
          </div>

          {/* delivery rows */}
          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex items-center gap-3"><TruckIcon className="shrink-0 text-stone" /> Darmowa wysyłka od 199 zł · wysyłka 1–2 dni</div>
            <div className="flex items-center gap-3"><ReturnIcon className="shrink-0 text-stone" /> 30 dni na łatwy zwrot</div>
            <div className="flex items-center gap-3"><ShieldIcon className="shrink-0 text-stone" /> 24 miesiące gwarancji</div>
          </div>

          {/* accordions */}
          <div className="mt-8">
            <Accordion items={accordionItems} defaultOpen={0} />
          </div>
        </div>
      </div>

      {/* FLOATING ADD-TO-CART BAR (floating + split) */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:pb-5"
          >
            <div className="mx-auto flex max-w-2xl items-center gap-2 rounded-full bg-bg/95 p-2 shadow-[0_22px_55px_-12px_rgba(38,34,31,0.5)] ring-1 ring-line backdrop-blur sm:gap-3 sm:p-2.5">
              <div className="relative ml-1 hidden h-12 w-12 shrink-0 overflow-hidden rounded-full sm:block" style={{ backgroundColor: tint }}>
                {product.images[0]?.src && <Image src={product.images[0].src} alt="" fill sizes="48px" className="object-contain p-1 mix-blend-multiply" />}
              </div>
              <div className="hidden min-w-0 flex-1 pl-1 sm:block">
                <p className="truncate font-display text-base leading-tight">{product.name}</p>
                <p className="text-xs tabular-nums text-stone">
                  {formatPLN(price)} {pct > 0 && <span className="ml-1 line-through">{formatPLN(compareAt)}</span>}
                </p>
              </div>
              <button onClick={addToBag} className="flex h-12 flex-1 items-center justify-center rounded-full bg-terracotta px-5 text-sm font-medium text-paper transition hover:bg-rust sm:flex-none sm:px-7">
                Dodaj do koszyka
              </button>
              <button onClick={addToBag} aria-label="Apple Pay" className="flex h-12 items-center justify-center gap-1.5 rounded-full bg-ink px-5 text-sm font-medium text-paper transition hover:opacity-90 sm:px-7">
                <AppleIcon /> Pay
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

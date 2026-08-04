"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { premiumPrice, compareAtPrice, discountPct, formatPLN } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import { Stars } from "./Stars";
import { HeartIcon, CheckIcon, ChevronIcon, ReturnIcon, ShieldIcon, SunIcon, EyeIcon, PackageIcon, ClothIcon } from "./icons";
import { PayLogo, useIsAppleDevice } from "./pdp/ExpressPay";
import { SHAPE_LABELS, CATEGORY_LABELS, INCLUDED } from "@/content/site";
import { cn, fieldTint } from "@/lib/utils";

// PDP galleries show ONLY real product packshots + variation images.
// Never inject generic lifestyle/person photos here — they show a fixed pair of
// glasses that won't match most products (owner: "if the glasses are not the same,
// we cannot show them on product pages"). Lifestyle imagery lives on home/lookbook only.
type GItem = { src: string; alt: string };

const BUNDLE_ICONS = [PackageIcon, ClothIcon, ShieldIcon];

export function ProductView({ product }: { product: Product }) {
  const { add, setOpen, toggleWish, isWished } = useCart();
  const price = premiumPrice(product.priceWoo);
  const compareAt = compareAtPrice(price);
  const pct = discountPct(price, compareAt);
  const savings = compareAt - price;
  const installment = (price / 3).toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const tint = fieldTint(product.id);
  const rating = 4.6 + (product.id % 4) * 0.1;
  const reviewCount = 60 + (product.id % 200);
  const wished = isWished(product.slug);
  const isApple = useIsAppleDevice();

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

  // mobile swipe gallery
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0); // active slide in the mobile swipe gallery
  const railRef = useRef<HTMLDivElement>(null);
  const firstVariantRun = useRef(true);
  useEffect(() => {
    if (firstVariantRun.current) {
      firstVariantRun.current = false;
      return;
    }
    if (selected?.image) {
      const idx = gallery.findIndex((g) => g.src === selected.image);
      if (idx >= 0) {
        setActive(idx);
        const rail = railRef.current;
        if (rail) rail.scrollTo({ left: idx * rail.clientWidth, behavior: "smooth" });
      }
    }
  }, [variantId, selected, gallery]);

  // mobile swipe gallery: keep dot pagination in sync with the scrolled slide
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const slides = Array.from(rail.children).filter((c): c is HTMLElement => c instanceof HTMLElement);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = slides.indexOf(e.target as HTMLElement);
            if (i >= 0) setSlide(i);
          }
        });
      },
      { root: rail, threshold: 0.6 },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [gallery.length]);

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

  const isSun = product.category === "sun";

  const trustCards = isSun
    ? [
        { icon: <SunIcon />, title: "UV400", sub: "Pełna ochrona" },
        product.polarized
          ? { icon: <EyeIcon />, title: "Polaryzacja", sub: "Bez odblasków" }
          : { icon: <EyeIcon />, title: "Kat. 3", sub: "Bez odblasków" },
        { icon: <ShieldIcon />, title: "Certyfikat CE", sub: "PN-EN ISO 12312-1" },
        { icon: <ReturnIcon />, title: "30 dni", sub: "Na zwrot, bez pytań" },
      ]
    : [
        { icon: <CheckIcon />, title: "Lekka oprawa", sub: "Komfort cały dzień" },
        { icon: <EyeIcon />, title: "Pod korekcję", sub: "Gotowa na Twoje soczewki" },
        { icon: <ShieldIcon />, title: "Certyfikat CE", sub: "Norma europejska" },
        { icon: <ReturnIcon />, title: "30 dni", sub: "Na zwrot, bez pytań" },
      ];

  const descBullets = (
    isSun
      ? [
          ["Filtr UV400", "— 100% ochrony przed UVA i UVB"],
          product.polarized ? ["Polaryzacja", "— tłumi odblaski od wody i asfaltu"] : null,
          ["Certyfikat CE", "· norma PN-EN ISO 12312-1"],
          ["W zestawie", ": twarde etui + ściereczka z mikrofibry"],
        ]
      : [
          ["Lekka oprawa", "— komfort noszenia przez cały dzień"],
          ["Pod soczewki korekcyjne", "— wymiana u dowolnego optyka"],
          ["Certyfikat CE", "· norma europejska"],
          ["W zestawie", ": twarde etui + ściereczka z mikrofibry"],
        ]
  ).filter(Boolean) as [string, string][];

  const descParas = (product.description || "")
    .split(/\n+/)
    .map((x) => x.trim())
    // drop empty lines and shouty ALL-CAPS shop headings
    .filter((x) => x.length > 1 && x !== x.toUpperCase())
    .slice(0, 3);

  const specRows = (
    [
      ["Fason", product.shape ? SHAPE_LABELS[product.shape] ?? product.shape : null],
      ["Płeć", product.gender],
      ["Materiał", product.material],
      ["Kolor oprawy", product.frameColors.join(", ") || null],
      ["Szerokość frontu", product.dims.frontWidth ? `${product.dims.frontWidth} mm` : null],
      ["Wysokość soczewki", product.dims.lensHeight ? `${product.dims.lensHeight} mm` : null],
      ["Długość zausznika", product.dims.templeLength ? `${product.dims.templeLength} mm` : null],
      ["Kod modelu", product.code ?? null],
    ] as [string, string | null][]
  ).filter((r): r is [string, string] => Boolean(r[1]));

  const shapeLabel = product.shape ? SHAPE_LABELS[product.shape] ?? product.shape : null;

  return (
    <>
      <div className="wrap grid gap-8 py-6 md:grid-cols-2 md:gap-14 md:py-12">
        {/* GALLERY */}
        <div className="md:sticky md:top-28 md:self-start">
          {/* MOBILE — Instagram-style full-bleed swipe gallery with dot pagination */}
          <div className="md:hidden">
            <div className="relative -mx-5">
              <div ref={railRef} className="ig-rail" style={{ scrollPaddingLeft: 0, scrollPaddingRight: 0 }}>
                {gallery.map((g, i) => (
                  <div key={g.src} className="relative aspect-[4/5] w-full shrink-0 basis-full" style={{ backgroundColor: tint }}>
                    <Image src={g.src} alt={g.alt} fill priority={i === 0} sizes="100vw" className="object-contain p-8 mix-blend-multiply" />
                  </div>
                ))}
              </div>
              {pct > 0 && (
                <span className="absolute left-6 top-4 z-10 rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-paper">−{pct}%</span>
              )}
              <button
                onClick={() => toggleWish(product.slug)}
                aria-label={wished ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                className={cn(
                  "absolute right-6 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-paper/85 backdrop-blur transition hover:bg-paper",
                  wished ? "text-terracotta" : "text-ink",
                )}
              >
                <HeartIcon filled={wished} />
              </button>
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex justify-center gap-1.5">
                {gallery.map((g, i) => (
                  <span key={g.src} className={cn("h-1.5 rounded-full transition-all duration-300", i === slide ? "w-5 bg-ink" : "w-1.5 bg-ink/25")} />
                ))}
              </div>
            )}
          </div>

          {/* DESKTOP — main image + thumbnails */}
          <div className="hidden md:block">
            <div className="relative aspect-square overflow-hidden rounded-[20px]" style={{ backgroundColor: tint }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={shown?.src ?? "x"}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                  style={{ backgroundColor: tint }}
                >
                  {/* Tint must live ON the animated layer: animating opacity creates a stacking
                      context that isolates mix-blend-multiply from any backdrop outside it,
                      flashing the raw white packshot during the crossfade. */}
                  {shown && <Image src={shown.src} alt={shown.alt} fill priority sizes="45vw" className="object-contain p-10 mix-blend-multiply" />}
                </motion.div>
              </AnimatePresence>
              {pct > 0 && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-paper">−{pct}%</span>
              )}
              <button
                onClick={() => toggleWish(product.slug)}
                aria-label={wished ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                className={cn(
                  "absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-paper/85 backdrop-blur transition hover:bg-paper",
                  wished ? "text-terracotta" : "text-ink",
                )}
              >
                <HeartIcon filled={wished} />
              </button>
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
        </div>

        {/* INFO — sticky buy box on desktop */}
        <div className="px-5 pt-6 sm:px-9 md:sticky md:top-24 md:self-start md:px-0 md:pt-0">
          <nav className="text-xs text-stone">
            <Link href="/okulary" className="hover:text-ink">Okulary</Link>
            {" / "}
            <Link href={isSun ? "/przeciwsloneczne" : "/korekcyjne"} className="hover:text-ink">
              {CATEGORY_LABELS[product.category]}
            </Link>
          </nav>

          <span className="mt-4 inline-block rounded-full bg-linen px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink">
            Goya
          </span>

          <h1 className="mt-3 font-display text-[1.6rem] leading-[1.15] sm:text-[1.8rem] md:text-[2.15rem] md:leading-[1.12]">
            {CATEGORY_LABELS[product.category]}
            <span className="block text-terracotta">{product.name}</span>
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <Stars rating={rating} />
            <span className="text-stone">{rating.toFixed(1)} · {reviewCount} opinii</span>
          </div>

          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-4xl font-medium tabular-nums leading-none">{formatPLN(price)}</span>
              {pct > 0 && (
                <>
                  <span className="text-lg text-stone line-through tabular-nums">{formatPLN(compareAt)}</span>
                  <span className="rounded-[6px] bg-terracotta px-2 py-1 text-[0.7rem] font-semibold leading-none text-paper">−{pct}%</span>
                </>
              )}
            </div>
            {pct > 0 && (
              <p className="mt-2.5 text-[0.82rem] text-stone">
                Oszczędzasz <strong className="font-semibold text-terracotta">{savings} zł</strong> · lub 3× {installment} zł z PayPo
              </p>
            )}
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-sage/15 px-3 py-2 text-xs font-medium text-sage ring-1 ring-sage/25">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
              </span>
              <span><strong className="font-semibold">Wysyłka jutro</strong> przy zamówieniu do 14:00</span>
            </p>
          </div>

          {variantOptions.length > 1 && (
            <div className="mt-6">
              <p className="text-xs text-stone">
                Wariant{selected ? <span className="ml-1 font-medium text-ink">· {variantOptions.find((o) => o.id === selected.id)?.label}</span> : null}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {variantOptions.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setVariantId(o.id)}
                    aria-label={o.label}
                    aria-pressed={variantId === o.id}
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

          {/* buy row — desktop only; on mobile the sticky bar below is the buy control */}
          <div className="mt-7 hidden gap-2.5 md:flex">
            <button
              onClick={addToBag}
              className="h-14 flex-[7] rounded-full bg-terracotta text-[0.95rem] font-medium text-paper shadow-[0_6px_20px_rgba(217,119,87,0.35)] transition hover:-translate-y-px hover:bg-rust"
            >
              Dodaj do koszyka
            </button>
            <button
              onClick={addToBag}
              aria-label={isApple ? "Kup z Apple Pay" : "Kup z Google Pay"}
              className="flex h-14 flex-[3] items-center justify-center rounded-full bg-ink text-paper transition hover:-translate-y-px hover:opacity-90"
            >
              <PayLogo isApple={isApple} />
            </button>
          </div>

          {/* bundle */}
          <div className="mt-7 border-t border-line pt-6">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink">W zestawie</p>
            <p className="mt-0.5 text-xs text-stone">Wszystko, czego potrzebujesz — w cenie produktu</p>
            <div className="mt-3 space-y-2">
              {INCLUDED.map((it, i) => {
                const Icon = BUNDLE_ICONS[i % BUNDLE_ICONS.length];
                return (
                  <div key={it.label} className="grid grid-cols-[18px_44px_1fr_auto] items-center gap-3 rounded-[12px] border border-terracotta/40 bg-terracotta/[0.05] px-3 py-2.5">
                    <span className="grid h-[18px] w-[18px] place-items-center rounded-[5px] bg-terracotta text-paper">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    <span className="grid h-11 w-11 place-items-center rounded-[9px] bg-terracotta/10 text-terracotta">
                      <Icon />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.85rem] font-medium leading-tight text-ink">{it.label}</span>
                      <span className="mt-0.5 block truncate text-xs text-stone">{it.note}</span>
                    </span>
                    <span className="rounded-full bg-sage/15 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider text-sage">Gratis</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* trust grid */}
          <div className="mt-5 grid grid-cols-2 gap-2">
            {trustCards.map((c) => (
              <div key={c.title} className="flex flex-col items-center gap-0.5 rounded-[12px] border border-line bg-paper px-3 py-4 text-center">
                <span className="mb-1.5 grid h-11 w-11 place-items-center rounded-full bg-bg text-terracotta">{c.icon}</span>
                <span className="text-[0.85rem] font-semibold leading-tight text-ink">{c.title}</span>
                <span className="text-[0.7rem] text-stone">{c.sub}</span>
              </div>
            ))}
          </div>

          {/* details */}
          <div className="mt-6 space-y-2">
            <details className="group overflow-hidden rounded-[12px] border border-line bg-paper transition-shadow open:shadow-[0_4px_24px_rgba(20,20,19,0.06)]" open>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="block text-[0.95rem] font-medium text-ink">Opis produktu</span>
                  <span className="mt-0.5 block text-xs text-stone">
                    {[shapeLabel, "polska marka", isSun ? "filtr UV400" : "pod korekcję"].filter(Boolean).join(" · ")}
                  </span>
                </span>
                <ChevronIcon className="shrink-0 text-stone transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="border-t border-line px-5 pb-5 pt-4 text-sm leading-relaxed text-ink-soft">
                {descParas.length ? (
                  <div className="space-y-3">{descParas.map((x, i) => <p key={i}>{x}</p>)}</div>
                ) : (
                  <p>Ponadczasowy model {product.name} marki Goya. Lekka, dobrze wyważona oprawa na co dzień{isSun ? " — z filtrem polaryzacyjnym i pełną ochroną UV400." : ", gotowa na Twoje soczewki korekcyjne."}</p>
                )}
                <ul className="mt-4 space-y-2">
                  {descBullets.map(([strong, rest]) => (
                    <li key={strong} className="flex gap-2.5">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-terracotta text-paper">
                        <CheckIcon className="h-2.5 w-2.5" />
                      </span>
                      <span><strong className="font-medium text-ink">{strong}</strong> {rest}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>

            {specRows.length > 0 && (
              <details className="group overflow-hidden rounded-[12px] border border-line bg-paper transition-shadow open:shadow-[0_4px_24px_rgba(20,20,19,0.06)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="block text-[0.95rem] font-medium text-ink">Wymiary i materiał</span>
                    <span className="mt-0.5 block text-xs text-stone">Sprawdź, czy okulary dopasują się do Twojej twarzy</span>
                  </span>
                  <ChevronIcon className="shrink-0 text-stone transition-transform duration-300 group-open:rotate-180" />
                </summary>
                {product.dims.frontWidth ? (() => {
                  const w = product.dims.frontWidth;
                  const seg = w < 134 ? 0 : w <= 142 ? 1 : 2;
                  const labels = ["Wąskie", "Uniwersalne", "Szerokie"];
                  return (
                    <div className="border-t border-line px-5 pb-4 pt-4">
                      <div className="flex items-baseline justify-between">
                        <p className="eyebrow">Szerokość dopasowania</p>
                        <p className="text-xs tabular-nums text-stone">Front {w} mm</p>
                      </div>
                      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                        {labels.map((l, i) => (
                          <div key={l} className="text-center">
                            <div className={cn("h-1.5 rounded-full transition-colors", i === seg ? "bg-terracotta" : "bg-line")} />
                            <p className={cn("mt-1.5 text-xs", i === seg ? "font-medium text-ink" : "text-stone")}>{l}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })() : null}
                <dl className="grid grid-cols-1 border-t border-line px-5 pb-4 pt-2 sm:grid-cols-2 sm:gap-x-8">
                  {specRows.map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-3 border-b border-line/60 py-2.5 last:border-0">
                      <dt className="text-xs text-stone">{k}</dt>
                      <dd className="text-right text-sm font-medium text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}

            <details className="group overflow-hidden rounded-[12px] border border-line bg-paper transition-shadow open:shadow-[0_4px_24px_rgba(20,20,19,0.06)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="block text-[0.95rem] font-medium text-ink">Dostawa i zwroty</span>
                  <span className="mt-0.5 block text-xs text-stone">Darmowa wysyłka · 30 dni na zwrot</span>
                </span>
                <ChevronIcon className="shrink-0 text-stone transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <ul className="space-y-1.5 border-t border-line px-5 pb-5 pt-4 text-sm leading-relaxed text-ink-soft">
                <li>Darmowa wysyłka każdego zamówienia (kurier lub paczkomat).</li>
                <li>Wysyłka w 1–2 dni robocze.</li>
                <li>30 dni na zwrot bez podawania przyczyny.</li>
                <li>24 miesiące gwarancji.</li>
              </ul>
            </details>
          </div>
        </div>
      </div>

      {/* STICKY MOBILE CTA — 70/30 split, always visible below md */}
      <div
        className="fixed inset-x-3 z-30 flex h-[58px] gap-2 md:hidden"
        style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={addToBag}
          className="flex flex-[7] items-center justify-center gap-2.5 rounded-full bg-terracotta text-[0.95rem] font-medium text-paper shadow-[0_6px_18px_rgba(190,95,61,0.4)] transition active:scale-[0.98]"
        >
          Dodaj do koszyka
          <span className="border-l border-paper/30 pl-2.5 text-sm tabular-nums opacity-95">{formatPLN(price)}</span>
        </button>
        <button
          onClick={addToBag}
          aria-label={isApple ? "Kup z Apple Pay" : "Kup z Google Pay"}
          className="flex flex-[3] items-center justify-center rounded-full bg-ink text-paper shadow-[0_6px_18px_rgba(20,20,19,0.35)] transition active:scale-[0.96]"
        >
          <PayLogo isApple={isApple} />
        </button>
      </div>
    </>
  );
}

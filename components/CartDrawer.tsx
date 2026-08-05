"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { formatPLN } from "@/lib/pricing";
import { INCLUDED } from "@/content/site";
import { cn } from "@/lib/utils";
import { PayLogo, useIsAppleDevice } from "./pdp/ExpressPay";
import { CloseIcon, ArrowIcon, CheckIcon, TruckIcon, ReturnIcon, ShieldIcon, BagIcon } from "./icons";

const EASE = [0.22, 1, 0.36, 1] as const;

const TRUST = [
  { icon: TruckIcon, label: "Darmowa\nwysyłka" },
  { icon: ReturnIcon, label: "30 dni\nna zwrot" },
  { icon: ShieldIcon, label: "24 mies.\ngwarancji" },
];

export function CartDrawer() {
  const { open, setOpen, lines, remove, setQty, subtotal, count } = useCart();
  const reduce = useReducedMotion();
  const isApple = useIsAppleDevice();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Savings shown only where a real list price was carried over from the product.
  const compareTotal = lines.reduce((s, l) => s + (l.regularPrice ?? l.price) * l.qty, 0);
  const savings = Math.max(0, compareTotal - subtotal);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[27rem] flex-col bg-bg shadow-[-40px_0_90px_-32px_rgba(38,34,31,0.4)]"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "tween", duration: 0.5, ease: EASE }}
          >
            {/* HEADER */}
            <header className="flex items-center justify-between px-6 pb-4 pt-6">
              <div className="flex items-baseline gap-2.5">
                <h2 className="font-display text-2xl leading-none">Koszyk</h2>
                {count > 0 && <span className="text-sm tabular-nums text-stone">{count} {count === 1 ? "produkt" : "produkty"}</span>}
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Zamknij koszyk"
                className="grid h-10 w-10 place-items-center rounded-full text-stone transition-colors hover:bg-linen hover:text-ink"
              >
                <CloseIcon />
              </button>
            </header>

            {lines.length === 0 ? (
              <EmptyState onClose={() => setOpen(false)} reduce={!!reduce} />
            ) : (
              <>
                {/* FREE-SHIPPING REASSURANCE — always free, no threshold, no surprises */}
                <div className="mx-6 mb-2 flex items-center gap-3 rounded-2xl bg-sage/[0.12] px-4 py-3 ring-1 ring-inset ring-sage/25">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sage/20 text-sage">
                    <TruckIcon />
                  </span>
                  <p className="text-[0.82rem] leading-snug text-ink">
                    <span className="font-semibold">Darmowa wysyłka</span> w każdej parze — bez progu i dopłat.
                  </p>
                </div>

                {/* LINES */}
                <div className="flex-1 overflow-y-auto px-6 [scrollbar-width:thin]">
                  <motion.ul layout className="divide-y divide-line/60">
                    <AnimatePresence initial={false} mode="popLayout">
                      {lines.map((l) => {
                        const wasPrice = l.regularPrice ?? null;
                        return (
                          <motion.li
                            key={l.key}
                            layout
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                            exit={reduce ? { opacity: 0 } : { opacity: 0, x: 40, transition: { duration: 0.25 } }}
                            transition={{ duration: 0.45, ease: EASE }}
                            className="flex gap-4 py-4"
                          >
                            {/* Double-bezel image tile */}
                            <Link
                              href={`/okulary/${l.slug}`}
                              onClick={() => setOpen(false)}
                              className="group relative h-[4.5rem] w-[4.5rem] shrink-0 rounded-[16px] bg-paper p-1 ring-1 ring-inset ring-line/70 transition-shadow hover:shadow-[0_6px_20px_-8px_rgba(38,34,31,0.25)]"
                            >
                              <div className="relative h-full w-full overflow-hidden rounded-[12px]">
                                {l.image && (
                                  <Image
                                    src={l.image}
                                    alt={l.name}
                                    fill
                                    sizes="72px"
                                    className="object-contain p-1.5 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
                                  />
                                )}
                              </div>
                            </Link>

                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-start justify-between gap-2">
                                <Link
                                  href={`/okulary/${l.slug}`}
                                  onClick={() => setOpen(false)}
                                  className="font-display text-[1.05rem] leading-tight transition-colors hover:text-terracotta"
                                >
                                  {l.name}
                                </Link>
                                <button
                                  onClick={() => remove(l.key)}
                                  aria-label={`Usuń ${l.name}`}
                                  className="-mr-1 -mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-stone transition-colors hover:bg-linen hover:text-terracotta"
                                >
                                  <CloseIcon className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              {l.variant && <p className="mt-0.5 text-xs text-stone">{l.variant}</p>}

                              <div className="mt-auto flex items-center justify-between pt-3">
                                {/* Quantity stepper */}
                                <div className="flex items-center rounded-full bg-linen/70 p-0.5 ring-1 ring-inset ring-line">
                                  <button
                                    onClick={() => setQty(l.key, l.qty - 1)}
                                    className="grid h-7 w-7 place-items-center rounded-full text-stone transition-colors hover:bg-paper hover:text-ink active:scale-95"
                                    aria-label="Zmniejsz ilość"
                                  >
                                    −
                                  </button>
                                  <span className="w-7 text-center text-sm font-medium tabular-nums">{l.qty}</span>
                                  <button
                                    onClick={() => setQty(l.key, l.qty + 1)}
                                    className="grid h-7 w-7 place-items-center rounded-full text-stone transition-colors hover:bg-paper hover:text-ink active:scale-95"
                                    aria-label="Zwiększ ilość"
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="text-right leading-tight">
                                  <p className="text-[0.95rem] font-medium tabular-nums text-ink">{formatPLN(l.price * l.qty)}</p>
                                  {wasPrice !== null && wasPrice > l.price && (
                                    <p className="text-xs tabular-nums text-stone line-through">{formatPLN(wasPrice * l.qty)}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </motion.ul>

                  {/* FREE GIFTS — reinforces value, feels generous */}
                  <div className="mb-2 mt-4 rounded-2xl bg-paper/60 p-4 ring-1 ring-inset ring-line/70">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink">W zestawie — gratis</p>
                    <ul className="mt-2.5 space-y-1.5">
                      {INCLUDED.map((it) => (
                        <li key={it.label} className="flex items-center gap-2.5 text-[0.82rem] text-ink-soft">
                          <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-terracotta text-paper">
                            <CheckIcon className="h-2.5 w-2.5" />
                          </span>
                          {it.label}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* TRUST ROW */}
                  <div className="mb-4 grid grid-cols-3 gap-2">
                    {TRUST.map(({ icon: Icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl px-1 py-3 text-center">
                        <span className="text-terracotta"><Icon /></span>
                        <span className="whitespace-pre-line text-[0.62rem] font-medium uppercase leading-tight tracking-wide text-stone">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER — sticky summary + checkout */}
                <footer className="border-t border-line/80 bg-bg/95 px-6 pb-6 pt-4 backdrop-blur">
                  {savings > 0 && (
                    <div className="mb-2 flex items-center justify-between rounded-full bg-terracotta/[0.08] px-3.5 py-2 text-[0.8rem]">
                      <span className="font-medium text-terracotta">Twoja oszczędność</span>
                      <span className="font-semibold tabular-nums text-terracotta">−{formatPLN(savings)}</span>
                    </div>
                  )}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-stone">Suma</p>
                      <p className="font-display text-[1.7rem] leading-none tabular-nums">{formatPLN(subtotal)}</p>
                    </div>
                    <p className="pb-1 text-xs text-stone">z VAT · darmowa wysyłka</p>
                  </div>

                  {/* Checkout (60%) + express pay (40%) on one axis — compact footer */}
                  <div className="mt-3.5 flex gap-2.5">
                    <Link
                      href="/kasa"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex h-[3.4rem] flex-[3] items-center justify-center gap-2 rounded-full bg-terracotta text-[0.95rem] font-medium text-paper",
                        "shadow-[0_10px_28px_-10px_rgba(217,119,87,0.6)] transition-[transform,box-shadow,background-color] duration-300 ease-out",
                        "hover:-translate-y-px hover:bg-rust active:scale-[0.99]",
                      )}
                    >
                      Przejdź do kasy
                      <ArrowIcon className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href="/kasa"
                      onClick={() => setOpen(false)}
                      aria-label={isApple ? "Zapłać z Apple Pay" : "Zapłać z Google Pay"}
                      className="flex h-[3.4rem] flex-[2] items-center justify-center rounded-full bg-ink text-paper transition-transform duration-200 ease-out hover:-translate-y-px active:scale-[0.99]"
                    >
                      <PayLogo isApple={isApple} />
                    </Link>
                  </div>

                  <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.7rem] text-stone">
                    <ShieldIcon className="h-3.5 w-3.5" />
                    Bezpieczne płatności · zamów dziś, wyślemy jutro
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyState({ onClose, reduce }: { onClose: () => void; reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
      className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center"
    >
      <span className="grid h-20 w-20 place-items-center rounded-full bg-linen text-stone">
        <BagIcon className="h-8 w-8" />
      </span>
      <div>
        <p className="font-display text-xl text-ink">Twój koszyk czeka</p>
        <p className="mt-1.5 text-sm text-stone">Dobierz oprawę, którą pokochasz — darmowa wysyłka i 30 dni na zwrot.</p>
      </div>
      <Link
        href="/okulary"
        onClick={onClose}
        className="group flex h-12 items-center gap-2 rounded-full bg-ink pl-6 pr-2 text-sm font-medium text-paper transition-transform duration-200 ease-out hover:-translate-y-px active:scale-[0.98]"
      >
        Przeglądaj okulary
        <span className="grid h-9 w-9 place-items-center rounded-full bg-paper/15 transition-transform duration-300 ease-out group-hover:translate-x-0.5">
          <ArrowIcon className="h-4 w-4" />
        </span>
      </Link>
    </motion.div>
  );
}

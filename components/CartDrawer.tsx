"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { formatPLN } from "@/lib/pricing";
import { CloseIcon } from "./icons";

export function CartDrawer() {
  const { open, setOpen, lines, remove, setQty, subtotal, count } = useCart();
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-line bg-bg shadow-[-40px_0_80px_-32px_rgba(38,34,31,0.28)]"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-xl">Koszyk{count > 0 ? ` (${count})` : ""}</h2>
              <button onClick={() => setOpen(false)} aria-label="Zamknij" className="p-1.5 text-stone hover:text-ink">
                <CloseIcon />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <p className="text-stone">Twój koszyk jest pusty.</p>
                <Link
                  href="/okulary"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-ink px-7 py-3 text-sm text-paper transition hover:bg-rust"
                >
                  Przeglądaj okulary
                </Link>
              </div>
            ) : (
              <>
                {(() => {
                  const FREE = 199;
                  const remaining = Math.max(0, FREE - subtotal);
                  const pct = Math.min(100, (subtotal / FREE) * 100);
                  return (
                    <div className="border-b border-line px-5 py-3.5">
                      <p className="text-xs text-ink-soft">
                        {remaining > 0 ? (
                          <>Do darmowej wysyłki brakuje <span className="font-medium tabular-nums text-ink">{formatPLN(remaining)}</span></>
                        ) : (
                          <>Wysyłka gratis - odblokowana</>
                        )}
                      </p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-linen">
                        <div className="h-full rounded-full bg-terracotta transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })()}
                <div className="flex-1 overflow-y-auto px-5">
                  {lines.map((l) => (
                    <div key={l.key} className="flex gap-3 border-b border-line/70 py-4">
                      <Link href={`/okulary/${l.slug}`} onClick={() => setOpen(false)} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[10px] bg-paper">
                        {l.image && <Image src={l.image} alt={l.name} fill className="object-contain p-1.5" sizes="80px" />}
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <Link href={`/okulary/${l.slug}`} onClick={() => setOpen(false)} className="link-underline font-display text-[1.05rem] leading-tight">{l.name}</Link>
                          <button onClick={() => remove(l.key)} className="text-xs text-stone hover:text-terracotta">
                            Usuń
                          </button>
                        </div>
                        {l.variant && <p className="mt-0.5 text-xs text-stone">{l.variant}</p>}
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-line">
                            <button onClick={() => setQty(l.key, l.qty - 1)} className="px-3 py-1 text-stone hover:text-ink" aria-label="Mniej">−</button>
                            <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                            <button onClick={() => setQty(l.key, l.qty + 1)} className="px-3 py-1 text-stone hover:text-ink" aria-label="Więcej">+</button>
                          </div>
                          <span className="text-sm tabular-nums">{formatPLN(l.price * l.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <footer className="border-t border-line px-5 py-5">
                  <div className="flex justify-between">
                    <span className="text-stone">Suma</span>
                    <span className="text-lg tabular-nums">{formatPLN(subtotal)}</span>
                  </div>
                  <button className="mt-4 w-full rounded-full bg-terracotta py-3.5 text-sm font-medium text-paper transition hover:bg-rust active:scale-[0.98]">
                    Przejdź do kasy
                  </button>
                  <p className="mt-2.5 text-center text-[0.7rem] text-stone">
                    Płatności online wkrótce - to wersja pokazowa sklepu.
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

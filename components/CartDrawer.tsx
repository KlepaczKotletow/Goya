"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { formatPLN } from "@/lib/pricing";
import { CloseIcon } from "./icons";

export function CartDrawer() {
  const { open, setOpen, lines, remove, setQty, subtotal, count } = useCart();

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
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-bg shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
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
                <div className="flex-1 overflow-y-auto px-5">
                  {lines.map((l) => (
                    <div key={l.key} className="flex gap-3 border-b border-line/70 py-4">
                      <div className="relative h-20 w-20 shrink-0 rounded-[10px] bg-paper">
                        {l.image && <Image src={l.image} alt={l.name} fill className="object-contain p-1.5" sizes="80px" />}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <p className="font-display text-[1.05rem] leading-tight">{l.name}</p>
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
                  <p className="mt-1 text-right text-xs text-sage">Darmowa wysyłka</p>
                  <Link
                    href="/kasa"
                    onClick={() => setOpen(false)}
                    className="mt-3 block w-full rounded-full bg-terracotta py-3.5 text-center text-sm font-medium text-paper transition hover:bg-rust"
                  >
                    Przejdź do kasy
                  </Link>
                  <p className="mt-2.5 text-center text-[0.7rem] text-stone">
                    Darmowa wysyłka · 30 dni na zwrot · bezpieczne zakupy.
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

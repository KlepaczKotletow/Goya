"use client";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { useDialog } from "@/lib/useDialog";
import { formatPLN } from "@/lib/pricing";
import { CloseIcon } from "./icons";

export function CartDrawer() {
  const { open, setOpen, lines, remove, setQty, subtotal, count } = useCart();
  const panelRef = useDialog<HTMLElement>(open, () => setOpen(false));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-mar-deep/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Koszyk"
            tabIndex={-1}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-bg shadow-2xl outline-none"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-xl">Koszyk{count > 0 ? ` (${count})` : ""}</h2>
              <button onClick={() => setOpen(false)} aria-label="Zamknij" className="-mr-2 flex h-11 w-11 items-center justify-center text-stone hover:text-ink">
                <CloseIcon />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <p className="text-stone">Twój koszyk jest pusty.</p>
                <Link
                  href="/okulary"
                  onClick={() => setOpen(false)}
                  className="rounded-[2px] bg-mar px-7 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-mar-deep"
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
                          <button onClick={() => remove(l.key)} className="-m-2 p-2 text-xs text-stone hover:text-terra">
                            Usuń
                          </button>
                        </div>
                        {l.variant && <p className="mt-0.5 text-xs text-stone">{l.variant}</p>}
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-[2px] border border-line">
                            <button onClick={() => setQty(l.key, l.qty - 1)} className="flex h-11 w-11 items-center justify-center text-stone hover:text-ink" aria-label="Mniej">−</button>
                            <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                            <button onClick={() => setQty(l.key, l.qty + 1)} className="flex h-11 w-11 items-center justify-center text-stone hover:text-ink" aria-label="Więcej">+</button>
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
                  <button className="mt-4 min-h-[48px] w-full rounded-[2px] bg-mar py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-mar-deep">
                    Przejdź do kasy
                  </button>
                  <p className="mt-2.5 text-center text-[0.7rem] text-stone">
                    Płatności online wkrótce — to wersja pokazowa sklepu.
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

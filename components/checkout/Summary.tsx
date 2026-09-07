"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPLN } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { TruckIcon, ReturnIcon, ShieldIcon, ChevronIcon } from "../icons";

// Order summary. One component, two shapes:
//  - mobile: a collapsed drawer above the form, so the total is visible without
//    pushing the first field below the fold
//  - desktop: an always-open sticky rail
//
// Open state is CSS-gated (`hidden lg:block`) rather than JS-gated so the
// desktop rail is expanded in the server HTML, before hydration.

export function Summary({ deliveryLabel }: { deliveryLabel: string }) {
  const { lines, subtotal, setQty, remove } = useCart();
  const [open, setOpen] = useState(false);
  const count = lines.reduce((n, l) => n + l.qty, 0);

  return (
    <section aria-label="Twoje zamówienie" className="rounded-[16px] border border-line lg:border-0">
      {/* Mobile toggle. Hidden on desktop, where the rail is always open. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left lg:hidden"
      >
        <span className="flex items-center gap-2 text-sm text-ink">
          Twoje zamówienie
          <span className="text-stone">({count})</span>
          <ChevronIcon className={cn("h-4 w-4 text-stone transition-transform", open && "rotate-180")} />
        </span>
        <span className="font-display text-lg tabular-nums">{formatPLN(subtotal)}</span>
      </button>

      <h2 className="mb-4 hidden font-display text-xl lg:block">Twoje zamówienie</h2>

      <div className={cn(open ? "block" : "hidden", "lg:block")}>
        <ul className="divide-y divide-line border-t border-line lg:rounded-[16px] lg:border lg:border-line">
          {lines.map((l) => (
            <li key={l.key} className="flex gap-3 p-3.5">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[10px] bg-paper">
                {l.image && <Image src={l.image} alt={l.name} fill className="object-contain p-1.5" sizes="64px" />}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <p className="truncate font-display text-base leading-tight">{l.name}</p>
                  <button
                    type="button"
                    onClick={() => remove(l.key)}
                    aria-label={`Usuń ${l.name} z koszyka`}
                    className="shrink-0 text-xs text-stone hover:text-terracotta"
                  >
                    Usuń
                  </button>
                </div>
                {l.variant && <p className="mt-0.5 truncate text-xs text-stone">{l.variant}</p>}
                <div className="mt-auto flex items-center justify-between pt-1.5">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      onClick={() => setQty(l.key, l.qty - 1)}
                      className="px-2.5 py-1 text-stone hover:text-ink"
                      aria-label="Zmniejsz ilość"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(l.key, l.qty + 1)}
                      className="px-2.5 py-1 text-stone hover:text-ink"
                      aria-label="Zwiększ ilość"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm tabular-nums">{formatPLN(l.price * l.qty)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 px-3.5 pb-3.5 text-sm lg:px-0 lg:pb-0">
          <div className="flex justify-between">
            <dt className="text-stone">Wartość produktów</dt>
            <dd className="tabular-nums">{formatPLN(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">{deliveryLabel}</dt>
            <dd className="text-sage">Bezpłatnie</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt className="font-medium text-ink">Razem</dt>
            <dd className="font-display text-lg tabular-nums">{formatPLN(subtotal)}</dd>
          </div>
        </dl>
      </div>

      <div className="hidden gap-2.5 pt-5 text-xs text-ink-soft lg:grid">
        <p className="flex items-center gap-2.5"><TruckIcon className="h-4 w-4 shrink-0 text-stone" /> Darmowa dostawa · 1–2 dni robocze</p>
        <p className="flex items-center gap-2.5"><ReturnIcon className="h-4 w-4 shrink-0 text-stone" /> 30 dni na zwrot bez podania przyczyny</p>
        <p className="flex items-center gap-2.5"><ShieldIcon className="h-4 w-4 shrink-0 text-stone" /> 24 miesiące gwarancji</p>
      </div>
    </section>
  );
}

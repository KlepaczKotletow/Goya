"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPLN } from "@/lib/pricing";
import { TruckIcon, ReturnIcon, ShieldIcon } from "./icons";

export function Checkout() {
  const { lines, subtotal, setQty, remove, clear, hydrated } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Demo order flow — no payment processor wired yet. Record intent and confirm.
    clear();
    router.push("/kasa/sukces");
  };

  if (!hydrated) return <div className="py-20 text-center text-stone">Ładowanie koszyka…</div>;

  if (!lines.length) {
    return (
      <div className="flex flex-col items-center gap-5 py-20 text-center">
        <p className="text-lg text-stone">Twój koszyk jest pusty.</p>
        <Link href="/okulary" className="rounded-full bg-ink px-7 py-3 text-sm text-paper transition hover:bg-rust">
          Przeglądaj okulary
        </Link>
      </div>
    );
  }

  const field = "w-full rounded-[12px] border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink";

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.2fr_1fr]">
      {/* Shipping form */}
      <form onSubmit={placeOrder} className="order-2 md:order-1">
        <h2 className="mb-5 font-display text-2xl">Dane do wysyłki</h2>
        <div className="grid gap-3">
          <input required type="email" placeholder="E-mail" className={field} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Imię" className={field} />
            <input required placeholder="Nazwisko" className={field} />
          </div>
          <input required placeholder="Ulica i numer" className={field} />
          <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
            <input required placeholder="Kod" className={field} />
            <input required placeholder="Miasto" className={field} />
          </div>
          <input placeholder="Telefon (opcjonalnie)" className={field} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-terracotta py-3.5 text-sm font-medium text-paper transition hover:bg-rust disabled:opacity-60"
        >
          {submitting ? "Składanie zamówienia…" : `Złóż zamówienie — ${formatPLN(subtotal)}`}
        </button>
        <p className="mt-3 text-center text-[0.7rem] text-stone">
          Składając zamówienie, akceptujesz regulamin i politykę prywatności.
        </p>
      </form>

      {/* Order summary */}
      <div className="order-1 md:order-2 md:sticky md:top-28 md:self-start">
        <h2 className="mb-5 font-display text-2xl">Twoje zamówienie</h2>
        <div className="divide-y divide-line rounded-[16px] border border-line">
          {lines.map((l) => (
            <div key={l.key} className="flex gap-4 p-4">
              <div className="relative h-20 w-20 shrink-0 rounded-[10px] bg-paper">
                {l.image && <Image src={l.image} alt={l.name} fill className="object-contain p-1.5" sizes="80px" />}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <p className="font-display text-lg leading-tight">{l.name}</p>
                  <button onClick={() => remove(l.key)} className="text-xs text-stone hover:text-terracotta">Usuń</button>
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

        <div className="mt-5 rounded-[16px] border border-line bg-paper p-5">
          <div className="flex justify-between text-sm">
            <span className="text-stone">Wartość produktów</span>
            <span className="tabular-nums">{formatPLN(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-stone">Wysyłka</span>
            <span className="text-sage">Gratis</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 text-lg">
            <span>Razem</span>
            <span className="tabular-nums">{formatPLN(subtotal)}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-2.5 text-sm text-ink-soft">
          <div className="flex items-center gap-3"><TruckIcon className="shrink-0 text-stone" /> Darmowa wysyłka · 1–2 dni robocze</div>
          <div className="flex items-center gap-3"><ReturnIcon className="shrink-0 text-stone" /> 30 dni na zwrot bez podawania przyczyny</div>
          <div className="flex items-center gap-3"><ShieldIcon className="shrink-0 text-stone" /> 24 miesiące gwarancji</div>
        </div>
      </div>
    </div>
  );
}

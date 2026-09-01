"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { formatPLN } from "@/lib/pricing";

export type CheckoutState = "paid" | "pending" | "unfinished" | "unknown";

const COPY: Record<CheckoutState, { icon: string; tone: string; title: string; body: string }> = {
  paid: {
    icon: "✓",
    tone: "bg-sage/15 text-sage",
    title: "Dziękujemy za zamówienie!",
    body: "Płatność została potwierdzona. Potwierdzenie wysyłamy mailem, a paczkę nadajemy w 1–2 dni robocze.",
  },
  pending: {
    icon: "⏳",
    tone: "bg-terracotta/10 text-terracotta",
    title: "Czekamy na potwierdzenie płatności",
    body: "Twój bank jeszcze potwierdza przelew — przy BLIK-u i Przelewach24 trwa to zwykle chwilę. Zamówienie przyjmujemy do realizacji, gdy tylko płatność dotrze, i damy Ci znać mailem.",
  },
  unfinished: {
    icon: "!",
    tone: "bg-stone/15 text-stone",
    title: "Płatność nie została dokończona",
    body: "Nic nie zostało pobrane, a Twój koszyk czeka nietknięty. Możesz spróbować ponownie — zajmie to chwilę.",
  },
  unknown: {
    icon: "?",
    tone: "bg-stone/15 text-stone",
    title: "Nie znaleźliśmy tej płatności",
    body: "Jeśli pieniądze zostały pobrane, potwierdzenie dotrze mailem. W razie wątpliwości napisz do nas — sprawdzimy status zamówienia.",
  },
};

export function CheckoutSuccess({
  state,
  orderNumber = null,
  total = 0,
  email = null,
}: {
  state: CheckoutState;
  orderNumber?: string | null;
  total?: number;
  email?: string | null;
}) {
  const { clear } = useCart();
  // Empty the cart only once the money is on its way. An abandoned or failed
  // payment must leave the cart intact, or the customer has to rebuild it.
  const settled = state === "paid" || state === "pending";
  useEffect(() => {
    if (settled) clear();
  }, [settled, clear]);

  const copy = COPY[state];

  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <div className={`grid h-16 w-16 place-items-center rounded-full text-3xl ${copy.tone}`}>{copy.icon}</div>
      <h1 className="font-display text-4xl md:text-5xl">{copy.title}</h1>
      <p className="max-w-md text-ink-soft">{copy.body}</p>

      {orderNumber && (
        <dl className="mt-2 grid gap-1 rounded-[16px] border border-line px-6 py-4 text-sm">
          <div className="flex items-center justify-between gap-8">
            <dt className="text-stone">Numer zamówienia</dt>
            <dd className="font-medium tabular-nums">{orderNumber}</dd>
          </div>
          {total > 0 && (
            <div className="flex items-center justify-between gap-8">
              <dt className="text-stone">Kwota</dt>
              <dd className="tabular-nums">{formatPLN(total)}</dd>
            </div>
          )}
          {email && (
            <div className="flex items-center justify-between gap-8">
              <dt className="text-stone">Potwierdzenie na</dt>
              <dd>{email}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {state === "unfinished" && (
          <Link href="/kasa" className="rounded-full bg-terracotta px-7 py-3 text-sm text-paper transition hover:bg-rust">
            Wróć do płatności
          </Link>
        )}
        <Link href="/okulary" className="rounded-full bg-ink px-7 py-3 text-sm text-paper transition hover:bg-rust">
          Wróć do sklepu
        </Link>
      </div>
    </div>
  );
}

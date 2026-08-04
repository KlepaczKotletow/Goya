"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";

export function CheckoutSuccess() {
  const { clear } = useCart();
  // Order stored via /api/order → empty the local cart.
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-sage/15 text-3xl text-sage">✓</div>
      <h1 className="font-display text-4xl md:text-5xl">Dziękujemy za zamówienie!</h1>
      <p className="max-w-md text-ink-soft">
        Twoje zamówienie dotarło do nas. Odezwiemy się mailowo, aby potwierdzić szczegóły płatności i wysyłki.
      </p>
      <Link href="/okulary" className="mt-2 rounded-full bg-ink px-7 py-3 text-sm text-paper transition hover:bg-rust">
        Wróć do sklepu
      </Link>
    </div>
  );
}

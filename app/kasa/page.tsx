import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";

export const metadata: Metadata = {
  title: "Kasa",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ platnosc?: string }>;
}) {
  // Stripe sends cancelled payments back here. The cart is still intact, so the
  // only thing missing is telling the customer that — silence reads as an error.
  const cancelled = (await searchParams).platnosc === "anulowana";

  return (
    <div className="wrap py-10 md:py-14">
      <h1 className="mb-8 font-display text-4xl md:text-5xl">Kasa</h1>
      {cancelled && (
        <p
          role="status"
          className="mb-8 rounded-[12px] border border-line bg-paper px-4 py-3 text-sm text-ink-soft"
        >
          Płatność została przerwana — nic nie zostało pobrane. Twój koszyk czeka nietknięty, możesz spróbować ponownie.
        </p>
      )}
      <Checkout />
    </div>
  );
}

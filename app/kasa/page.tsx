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

  // A checkout is not a page anyone browses, so its title does not need to
  // behave like one. At py-10 with a 36px h1 and mb-8 this header spent 108px —
  // a sixth of a 667px phone screen — restating the word the customer just
  // tapped, before the first field. Full size returns from md.
  return (
    <div className="wrap py-5 md:py-14">
      <h1 className="mb-4 font-display text-2xl md:mb-8 md:text-5xl">Kasa</h1>
      {cancelled && (
        <p
          role="status"
          className="mb-5 rounded-[12px] border border-line bg-paper px-4 py-3 text-sm text-ink-soft md:mb-8"
        >
          Płatność została przerwana — nic nie zostało pobrane. Twój koszyk czeka nietknięty, możesz spróbować ponownie.
        </p>
      )}
      <Checkout />
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { Checkout } from "@/components/Checkout";
import { CancelledNotice } from "@/components/checkout/CancelledNotice";

export const metadata: Metadata = {
  title: "Kasa",
  robots: { index: false, follow: false },
};

// No `searchParams` here on purpose. Awaiting it made this a dynamic route, and
// a dynamic route is not prefetched by the drawer's <Link href="/kasa"> and is
// not served from the edge — measured live: `x-vercel-cache: MISS`, executed in
// iad1 (US East), 241ms TTFB, versus a prerendered 108ms for /okulary. Stripe's
// cancelled-payment redirect is now read on the client instead, so the whole
// route prerenders and the tap becomes a client-side transition.
//
// A checkout is not a page anyone browses, so its title does not need to behave
// like one. At py-10 with a 36px h1 and mb-8 this header spent 108px — a sixth
// of a 667px phone screen — restating the word the customer just tapped, before
// the first field. Full size returns from md.
export default function Page() {
  return (
    <div className="wrap py-5 md:py-14">
      <h1 className="mb-4 font-display text-2xl md:mb-8 md:text-5xl">Kasa</h1>
      <Suspense fallback={null}>
        <CancelledNotice />
      </Suspense>
      <Checkout />
    </div>
  );
}

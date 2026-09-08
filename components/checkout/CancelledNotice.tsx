"use client";

import { useSearchParams } from "next/navigation";

/**
 * "Stripe sent you back without charging you" notice.
 *
 * This is a client component purely so that /kasa can stay a *static* route.
 * Reading `searchParams` in the page's server component opts the whole route
 * out of static generation, and a dynamic route is neither prefetched by the
 * <Link> in the cart drawer nor served from the edge: measured on the live
 * deploy, /kasa came back `x-vercel-cache: MISS` from `iad1` (US East) at 241ms
 * TTFB, against 108ms and a prerender hit for /okulary. Every tap on "Przejdź
 * do kasy" from Poland was paying an Atlantic round trip before anything drew.
 *
 * Must be rendered inside a <Suspense> boundary — without one, useSearchParams
 * deopts the entire page to client-side rendering and the route stays dynamic,
 * which would buy nothing.
 */
export function CancelledNotice() {
  const cancelled = useSearchParams().get("platnosc") === "anulowana";
  if (!cancelled) return null;

  return (
    <p
      role="status"
      className="mb-5 rounded-[12px] border border-line bg-paper px-4 py-3 text-sm text-ink-soft md:mb-8"
    >
      Płatność została przerwana — nic nie zostało pobrane. Twój koszyk czeka nietknięty, możesz spróbować ponownie.
    </p>
  );
}

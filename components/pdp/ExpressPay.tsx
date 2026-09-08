"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Elements, ExpressCheckoutElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js";
import { getStripe } from "@/lib/stripe-client";
import { cn } from "@/lib/utils";

// Real one-tap Apple Pay / Google Pay.
//
// This file used to only *draw a logo* chosen from the user agent — the button
// ran the same "add to cart" as the button beside it. It now mounts Stripe's
// Express Checkout Element, which renders whichever wallet the visitor actually
// has, or nothing at all if they have none.
//
// Money: the wallet sheet shows an amount the browser supplied, but the charge
// is created server-side in /api/express/intent from the catalogue. A tampered
// client can change the displayed number, never the charged one.
//
// Deferred-intent flow (`mode: "payment"` on the provider, PaymentIntent created
// inside onConfirm) rather than the clientSecret flow — otherwise every product
// page view would create an abandoned PaymentIntent.

export type ExpressLine = { slug: string; variationId: number | null; qty: number };

type Props = {
  /** Cart lines to charge for. */
  lines: ExpressLine[];
  /** Total in złoty, for display in the wallet sheet only. */
  amount: number;
  /** Rendered when no wallet is available — never leave a dead space. */
  fallback: React.ReactNode;
  /**
   * Show the "courier only" caption under the button. Off where the slot sits in
   * a flex row beside another button: the caption adds ~30px to this item only,
   * so the whole row grows and leaves dead space under its shorter sibling.
   */
  note?: boolean;
  /**
   * Wait 600ms before painting the fallback. That grace exists to stop a mount
   * that races the first paint from flashing the fallback and then swapping it
   * for a wallet button. A caller that already delays mounting until its own
   * animation has finished has nothing to hide, and the grace would instead
   * leave a visible hole while the page sits still — so it can opt out.
   */
  grace?: boolean;
  className?: string;
};

/** Stripe wants the smallest unit; PLN has two decimals. */
const toMinor = (pln: number) => Math.round(pln * 100);

export function ExpressPay({ lines, amount, fallback, note = true, grace = true, className }: Props) {
  const stripePromise = getStripe();

  // No publishable key at build time — the button can never work, so don't
  // render an Elements tree at all.
  if (!stripePromise) return <>{fallback}</>;

  // Stripe throws "Invalid value for elements(): amount must be greater than 0",
  // which would take the tree down. An empty cart or an unpriced product is a
  // normal state, so degrade instead of crashing.
  if (!Number.isFinite(amount) || amount <= 0) return <>{fallback}</>;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: toMinor(amount),
        currency: "pln",
        locale: "pl",
        appearance: { variables: { borderRadius: "9999px" } },
      }}
    >
      <ExpressInner lines={lines} amount={amount} fallback={fallback} note={note} grace={grace} className={className} />
    </Elements>
  );
}

function ExpressInner({ lines, amount, fallback, note = true, grace = true, className }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  // The only state that matters: has Stripe confirmed a usable wallet. Until it
  // has, the fallback holds the space — so there is never a moment with neither
  // a wallet button nor a working buy button, whatever Stripe does or does not
  // call. That also makes a silent onReady (no wallet at all) a non-event.
  const [ready, setReady] = useState(false);
  // Brief grace before painting the fallback. Stripe's ready fires in a few
  // hundred ms, so on a wallet device Apple Pay wins the race and there is no
  // visible swap; without this the fallback paints first and is replaced, which
  // reads as a flicker. The slot has a min-height, so nothing shifts either way.
  const [settling, setSettling] = useState(grace);
  useEffect(() => {
    if (!grace) return;
    const t = setTimeout(() => setSettling(false), 600);
    return () => clearTimeout(t);
  }, [grace]);

  const options = useMemo(
    () =>
      ({
        // One row, wallets only. Never render a "pay by card" button here — that
        // is what the main checkout is for.
        buttonType: { applePay: "buy", googlePay: "buy" } as const,
        buttonTheme: { applePay: "black", googlePay: "black" } as const,
        // buttonHeight must be 40-55; Stripe throws outside that range. The Apple
        // Pay wordmark scales with it, so this also sizes the label. Matches the
        // 48px of the buy buttons it sits beside.
        buttonHeight: 48,
        // NEVER set overflow:"never" together with maxRows > 0. Stripe rejects the
        // combination — and rejects it SILENTLY: no throw, no console warning, no
        // loaderror, and `ready` never fires. Since the button is only revealed in
        // onReady, that left the wallet permanently hidden on every browser,
        // iPhone Safari included. Omitting overflow defaults it to "auto".
        layout: { maxColumns: 1, maxRows: 1 } as const,
        paymentMethods: {
          applePay: "auto",
          googlePay: "auto",
          link: "never",
          amazonPay: "never",
          paypal: "never",
          klarna: "never",
        } as const,
        // Collected from the wallet sheet rather than asked for again.
        emailRequired: true,
        phoneNumberRequired: true,
        billingAddressRequired: true,
        shippingAddressRequired: true,
        allowedShippingCountries: ["PL"],
        // Required by contract whenever shippingAddressRequired is true: "you must
        // also supply a valid shippingRates option". It does not affect rendering,
        // but Apple Pay's sheet needs a shipping method to display and Stripe
        // supplies no default — the first entry becomes the preselected one.
        // Delivery is free here, so the amount is 0 gr.
        shippingRates: [
          {
            id: "goya-free",
            displayName: "Dostawa kurierem",
            amount: 0,
            deliveryEstimate: {
              minimum: { unit: "business_day" as const, value: 1 },
              maximum: { unit: "business_day" as const, value: 2 },
            },
          },
        ],
      }),
    [],
  );

  const onConfirm = useCallback(
    async (event: StripeExpressCheckoutElementConfirmEvent) => {
      if (!stripe || !elements) return;

      // Runs the element's own validation and collects the payment method.
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error("express submit failed:", submitError.message);
        return;
      }

      const addr = event.shippingAddress?.address;
      const res = await fetch("/api/express/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines,
          claimedAmount: toMinor(amount),
          email: event.billingDetails?.email ?? "",
          name: event.shippingAddress?.name ?? event.billingDetails?.name ?? "",
          phone: event.billingDetails?.phone ?? "",
          line1: addr?.line1 ?? "",
          line2: addr?.line2 ?? "",
          postalCode: addr?.postal_code ?? "",
          city: addr?.city ?? "",
          country: addr?.country ?? "PL",
        }),
      });

      const data = (await res.json().catch(() => null)) as { clientSecret?: string; error?: string } | null;
      if (!res.ok || !data?.clientSecret) {
        // Abort the wallet sheet rather than letting it spin, and send the
        // customer somewhere that can explain what happened.
        event.paymentFailed({ reason: "fail" });
        router.push(data?.error === "unavailable" ? "/kasa?platnosc=niedostepne" : "/kasa?platnosc=blad");
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: { return_url: `${window.location.origin}/kasa/sukces` },
        redirect: "if_required",
      });

      if (error) {
        event.paymentFailed({ reason: "fail" });
        return;
      }
      // The webhook is what records the order; this is only where to send them.
      router.push("/kasa/sukces?platnosc=ok");
    },
    [stripe, elements, lines, amount, router],
  );

  return (
    <div className={cn("relative min-h-12", className)}>
      {/* The element must always occupy a real box, because Stripe measures its
          container to lay the wallet button out and will render nothing into a
          zero-height one.

          This was `absolute` with no inset, which collapses to 0 height (measured
          on production: 176x0, and 0x0 in the cart). So Stripe rendered no button,
          reported no available wallet, and this component concluded "no wallet"
          and kept it hidden — hidden because not ready, never ready because
          hidden. It failed on every device, Apple Pay included.

          `inset-0` pins it to the slot, whose height comes from the fallback
          rendered underneath, so there is always something real to measure. */}
      <div className={cn(ready ? "relative" : "pointer-events-none absolute inset-0 opacity-0")}>
        <ExpressCheckoutElement
          options={options}
          onReady={({ availablePaymentMethods }) => {
            // Stripe reports availability as { applePay: false, googlePay: false,
            // link: false } — the keys are always present, so counting them says
            // nothing. Only a truthy VALUE means a usable wallet. Getting this
            // wrong renders an empty element and suppresses the fallback, i.e.
            // blank space where the buy button should be.
            const usable =
              !!availablePaymentMethods && Object.values(availablePaymentMethods).some(Boolean);
            setReady(usable);
          }}
          onLoadError={() => setReady(false)}
          onConfirm={onConfirm}
        />
      </div>
      {!ready && !settling && fallback}
      {ready && note && (
        <p className="mt-1.5 text-center text-[0.68rem] leading-snug text-stone">
          Szybka płatność – dostawa kurierem. Paczkomat wybierzesz w kasie.
        </p>
      )}
    </div>
  );
}

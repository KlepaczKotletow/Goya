import type { Metadata } from "next";
import { CheckoutSuccess, type CheckoutState } from "@/components/CheckoutSuccess";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Dziękujemy za zamówienie",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Result = { state: CheckoutState; orderNumber: string | null; total: number; email: string | null };

const UNKNOWN: Result = { state: "unknown", orderNumber: null, total: 0, email: null };

/**
 * Ask Stripe what actually happened. Kept out of the component so the network
 * call can have a try/catch without wrapping JSX in one — rendering errors would
 * escape it anyway, and the lint rule is right to say so.
 */
async function readSession(sessionId: string | undefined): Promise<Result> {
  if (!sessionId || !stripe) return UNKNOWN;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const common = {
      orderNumber: session.metadata?.order_number ?? session.client_reference_id ?? null,
      total: (session.amount_total ?? 0) / 100,
      email: session.customer_details?.email ?? null,
    };
    if (session.status !== "complete") return { ...common, state: "unfinished" };
    // BLIK and Przelewy24 settle after the redirect, so "complete but unpaid" is
    // a normal, hopeful state rather than a failure.
    return { ...common, state: session.payment_status === "paid" ? "paid" : "pending" };
  } catch (e) {
    console.error("could not read checkout session:", e);
    return UNKNOWN;
  }
}

// What the customer sees after Stripe sends them back. Deliberately read-only:
// the order is recorded by the webhook, never here, because this page only runs
// if the browser happens to follow the redirect — and plenty of customers close
// the tab the moment the bank app says "zapłacono".
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const result = await readSession((await searchParams).session_id);
  return (
    <div className="wrap">
      <CheckoutSuccess {...result} />
    </div>
  );
}

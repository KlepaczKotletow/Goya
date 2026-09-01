import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe, readChunked } from "@/lib/stripe";
import { decodeLines } from "@/lib/order";
import { claimPayment, recordOrder } from "@/lib/intake";

// Stripe's word on what actually got paid.
//
// This is the only place an order becomes real. The browser never gets to say
// "paid" — it can be closed, refreshed or lied to — so the success page is
// cosmetic and this handler is the source of truth.
//
// BLIK and Przelewy24 settle asynchronously: `checkout.session.completed`
// arrives with payment_status "unpaid" and the money lands minutes later as
// `checkout.session.async_payment_succeeded`. Handling only the first event is
// the classic way to ship a shop that silently drops most Polish payments.

export const runtime = "nodejs";
/** Stripe signs the exact bytes it sent, so the body must never be re-serialised. */
export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

function metadataOf(session: Stripe.Checkout.Session): Record<string, string> {
  return (session.metadata ?? {}) as Record<string, string>;
}

async function fulfil(session: Stripe.Checkout.Session): Promise<void> {
  const meta = metadataOf(session);
  const orderNumber = meta.order_number || session.client_reference_id || session.id;
  const total = (session.amount_total ?? 0) / 100;

  const claim = await claimPayment(session.id, orderNumber, total);
  if (claim === "duplicate") {
    console.log(`stripe webhook: ${session.id} already fulfilled, skipping`);
    return;
  }
  if (claim === "failed") {
    // Losing a paid order is worse than writing it twice, so carry on and let
    // the duplicate be spotted in the sheet.
    console.error(`stripe webhook: could not claim ${session.id}, recording anyway`);
  }

  const lines = decodeLines(readChunked("lines_", meta));
  const ok = await recordOrder({
    orderNumber,
    stripeSessionId: session.id,
    paymentStatus: session.payment_status ?? "paid",
    email: session.customer_details?.email ?? session.customer_email ?? "",
    firstName: meta.first_name ?? "",
    lastName: meta.last_name ?? "",
    street: meta.street ?? "",
    postalCode: meta.postal_code ?? "",
    city: meta.city ?? "",
    phone: meta.phone ?? "",
    delivery: meta.delivery === "kurier" ? "kurier" : "paczkomat",
    lockerCode: meta.locker_code ?? "",
    items: lines.map((l) => ({
      slug: l.slug,
      name: l.name,
      variant: l.variant,
      qty: l.qty,
      price: l.price,
    })),
    subtotal: total,
  });

  // A 500 makes Stripe retry, which is exactly what we want when the sheet is
  // down — the claim above keeps the retry from double-posting.
  if (!ok) throw new Error(`order ${orderNumber} could not be recorded`);
  console.log(`stripe webhook: recorded ${orderNumber} (${total} zł)`);
}

export async function POST(req: Request) {
  if (!stripe || !WEBHOOK_SECRET) {
    console.error("stripe webhook called without STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "missing signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, signature, WEBHOOK_SECRET);
  } catch (e) {
    // Either someone is posting fake orders or the secret is wrong. Both are 400.
    console.error("stripe webhook signature rejected:", e);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        // Cards and wallets are paid on the spot; BLIK/P24 arrive here unpaid
        // and come back as async_payment_succeeded once the bank confirms.
        if (session.payment_status === "paid") await fulfil(session);
        else console.log(`stripe webhook: ${session.id} pending (${session.payment_status})`);
        break;
      }
      case "checkout.session.async_payment_succeeded":
        await fulfil(event.data.object);
        break;
      case "checkout.session.async_payment_failed":
        console.warn(`stripe webhook: async payment failed for ${event.data.object.id}`);
        break;
      default:
        break;
    }
  } catch (e) {
    console.error(`stripe webhook: handling ${event.type} failed:`, e);
    return NextResponse.json({ error: "handler_failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

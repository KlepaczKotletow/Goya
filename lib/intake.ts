// Where paid orders and newsletter signups go.
//
// Primary: a Google Apps Script web app that appends rows to the spreadsheet
// "Goya — Zamówienia i newsletter" (see scripts/google-apps-script/Kod.gs).
// That is the destination Filip actually works in.
//
// Fallback: the Supabase tables, kept only so nothing is lost while the webhook
// is not yet deployed or is temporarily failing.
//
// Only *paid* orders arrive here — the Stripe webhook is the caller. Unpaid and
// abandoned carts stay in Stripe, which is why the sheet no longer fills up with
// orders nobody ever paid for.
import { supabaseInsert, supabaseInsertUnique } from "./supabase";

const WEBHOOK = process.env.GOYA_SHEETS_WEBHOOK_URL;
const SECRET = process.env.GOYA_SHEETS_WEBHOOK_SECRET;

type Kind = "order" | "newsletter";

async function toSheet(kind: Kind, payload: Record<string, unknown>): Promise<boolean> {
  if (!WEBHOOK || !SECRET) return false;
  try {
    const res = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Apps Script answers the POST with a 302 to script.googleusercontent.com;
      // fetch follows it by default, so the body below is the final JSON.
      body: JSON.stringify({ ...payload, kind, secret: SECRET }),
    });
    if (!res.ok) throw new Error(`http ${res.status}`);
    const body = (await res.json()) as { ok?: boolean; error?: string };
    if (!body.ok) throw new Error(body.error ?? "sheet rejected the row");
    return true;
  } catch (e) {
    console.error(`sheets intake failed (${kind}):`, e);
    return false;
  }
}

export type PaidOrder = {
  orderNumber: string;
  stripeSessionId: string;
  paymentStatus: string;
  email: string; firstName: string; lastName: string; street: string;
  postalCode: string; city: string; phone: string;
  company: string; nip: string; apartment: string; notes: string;
  newsletter: boolean;
  delivery: "paczkomat" | "kurier"; lockerCode: string; lockerAddress: string;
  items: { slug: string; name: string; variant: string | null; qty: number; price: number }[];
  subtotal: number;
};

/**
 * Claim a Stripe session before recording it.
 *
 * Stripe redelivers webhook events on any non-2xx and occasionally on success,
 * and the sheet has no notion of a duplicate row — so the claim is what stops
 * one payment becoming two orders. A storage failure returns "failed", and the
 * caller deliberately continues: a duplicate row is recoverable, a lost paid
 * order is not.
 */
export async function claimPayment(sessionId: string, orderNumber: string, amount: number) {
  return supabaseInsertUnique("goya_payments", {
    session_id: sessionId,
    order_number: orderNumber,
    amount,
  });
}

/** Returns true if the record landed somewhere durable. */
export async function recordOrder(order: PaidOrder): Promise<boolean> {
  if (await toSheet("order", order)) return true;
  return supabaseInsert("goya_orders", {
    order_number: order.orderNumber,
    stripe_session_id: order.stripeSessionId,
    payment_status: order.paymentStatus,
    status: "opłacone",
    email: order.email,
    first_name: order.firstName,
    last_name: order.lastName,
    street: order.street,
    postal_code: order.postalCode,
    city: order.city,
    phone: order.phone || null,
    // First-class columns, not buried in the items blob: where the parcel goes
    // is the one thing you must be able to read at a glance to ship it.
    delivery: order.delivery,
    locker_code: order.lockerCode || null,
    locker_address: order.lockerAddress || null,
    company: order.company || null,
    nip: order.nip || null,
    apartment: order.apartment || null,
    notes: order.notes || null,
    newsletter: order.newsletter,
    items: { lines: order.items },
    subtotal: order.subtotal,
  });
}

export async function recordNewsletter(email: string): Promise<boolean> {
  if (await toSheet("newsletter", { email })) return true;
  return supabaseInsert("goya_newsletter", { email });
}

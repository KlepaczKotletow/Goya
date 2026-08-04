// Where orders and newsletter signups go.
//
// Primary: a Google Apps Script web app that appends rows to the spreadsheet
// "Goya — Zamówienia i newsletter" (see scripts/google-apps-script/Kod.gs).
// That is the destination Filip actually works in.
//
// Fallback: the Supabase tables, kept only so nothing is lost while the webhook
// is not yet deployed or is temporarily failing. Once the sheet has been taking
// orders reliably, delete lib/supabase.ts and the goya_* tables.
import { supabaseInsert } from "./supabase";

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

/** Returns true if the record landed somewhere durable. */
export async function recordOrder(order: {
  email: string; firstName: string; lastName: string; street: string;
  postalCode: string; city: string; phone: string;
  delivery: "paczkomat" | "kurier"; lockerCode: string;
  items: { slug: string; name: string; variant: string | null; qty: number; price: number }[];
  subtotal: number;
}): Promise<boolean> {
  if (await toSheet("order", order)) return true;
  return supabaseInsert("goya_orders", {
    email: order.email,
    first_name: order.firstName,
    last_name: order.lastName,
    street: order.street,
    postal_code: order.postalCode,
    city: order.city,
    phone: order.phone || null,
    // The Supabase fallback predates delivery options; keep the columns it has
    // and carry the new fields inside items' sibling payload so nothing is lost.
    items: { lines: order.items, delivery: order.delivery, lockerCode: order.lockerCode || null },
    subtotal: order.subtotal,
  });
}

export async function recordNewsletter(email: string): Promise<boolean> {
  if (await toSheet("newsletter", { email })) return true;
  return supabaseInsert("goya_newsletter", { email });
}

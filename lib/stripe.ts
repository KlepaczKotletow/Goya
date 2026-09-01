// Stripe client, server-side only.
//
// The key is absent in local dev and on any deploy that has not been wired to
// the client's Stripe account yet, so this exports null rather than throwing at
// import time — the checkout route turns that into a clean 503 and the rest of
// the shop keeps working.
import Stripe from "stripe";

const SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export const stripe = SECRET_KEY ? new Stripe(SECRET_KEY) : null;

/**
 * Metadata values are capped at 500 characters, so long payloads are split
 * across keys. Eight keys cover the largest cart the checkout accepts (20 lines)
 * with room to spare — a truncated payload would decode into a broken order.
 */
export function chunkMetadata(prefix: string, value: string, maxKeys = 8): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < maxKeys && i * 500 < value.length; i++) {
    out[`${prefix}${i}`] = value.slice(i * 500, (i + 1) * 500);
  }
  return out;
}

/** Reassemble a value written by chunkMetadata. */
export function readChunked(prefix: string, metadata: Record<string, string> | null): string {
  if (!metadata) return "";
  let out = "";
  for (let i = 0; ; i++) {
    const part = metadata[`${prefix}${i}`];
    if (part === undefined) return out;
    out += part;
  }
}

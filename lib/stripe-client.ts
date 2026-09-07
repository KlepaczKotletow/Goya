"use client";
// Browser-side Stripe.js loader.
//
// Mirrors lib/stripe.ts: a missing publishable key is a normal state (local dev,
// a preview that has not been wired to the Stripe account), not a crash. Callers
// fall back to the ordinary "go to checkout" button rather than rendering a dead
// wallet button.
//
// NEXT_PUBLIC_* is inlined at build time, so changing this key in Vercel needs a
// redeploy, not just a save.
import { loadStripe, type Stripe } from "@stripe/stripe-js";

const KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

let promise: Promise<Stripe | null> | null = null;

/**
 * `null`                      — no key configured; never render the wallet button.
 * `Promise<Stripe | null>`    — resolves to null when Stripe.js itself is blocked
 *                               (ad blocker, offline, CSP). `<Elements stripe={null}>`
 *                               simply never mounts a child, which the readiness
 *                               timeout in ExpressPay turns into the fallback.
 *
 * loadStripe is SSR-safe: it resolves null when there is no `window`.
 */
export function getStripe(): Promise<Stripe | null> | null {
  if (!KEY) return null;
  promise ??= loadStripe(KEY);
  return promise;
}

export const hasStripeKey = Boolean(KEY);

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
//
// `/pure`, not the package root. The root module injects Stripe.js from a
// top-level `Promise.resolve().then(...)`, i.e. as an import side effect — so
// merely importing this file downloaded js.stripe.com and opened its
// fraud-detection iframe on EVERY route, homepage included, and did it even
// when no key is configured and the guard below returns null. Measured on a
// production build: `js.stripe.com/dahlia/stripe.js` + an `m-outer` iframe on
// `/` with no publishable key present. The `/pure` build only loads the script
// when loadStripe() is actually called.
import { loadStripe } from "@stripe/stripe-js/pure";
// Types only — `import type` is erased at compile time, so this does not pull
// the side-effecting root module back in.
import type { Stripe } from "@stripe/stripe-js";

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

import { NextResponse } from "next/server";
import { stripe, chunkMetadata } from "@/lib/stripe";
import { encodeLines, newOrderNumber, parseItems, priceCart } from "@/lib/order";
import { vEmail } from "@/lib/validate";

// Creates the PaymentIntent behind the Apple Pay / Google Pay button.
//
// Called from onConfirm, i.e. after the customer has authorised the wallet sheet
// but before anything is charged. The wallet sheet showed an amount the browser
// supplied; the amount charged is the one computed here, from the catalogue.
// That gap is the whole security model: a tampered client can change what the
// sheet displays, never what is taken.
//
// Orders become real in the Stripe webhook, not here — same as hosted Checkout.

export const runtime = "nodejs";

/** The wallet returns one name string; orders and shipping labels want two fields. */
function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  if (!stripe) {
    console.error("express intent called without STRIPE_SECRET_KEY");
    return NextResponse.json({ error: "payments_unavailable" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const priced = await priceCart(parseItems(body));
  if (!priced.ok) {
    return NextResponse.json({ error: priced.error }, { status: priced.error === "unavailable" ? 409 : 400 });
  }

  // What the browser claimed the total was. Purely a cross-check so a mismatch
  // is caught and logged rather than silently charging a different number than
  // the wallet sheet displayed.
  const claimed = Number(body.claimedAmount);
  const amount = Math.round(priced.total * 100);
  if (Number.isFinite(claimed) && Math.round(claimed) !== amount) {
    console.warn(`express intent: client claimed ${claimed}, catalogue says ${amount}`);
    return NextResponse.json({ error: "price_changed", amount }, { status: 409 });
  }

  const email = str(body.email);
  if (vEmail(email)) return NextResponse.json({ error: "missing_email" }, { status: 400 });

  const { firstName, lastName } = splitName(str(body.name, 160));
  const orderNumber = newOrderNumber();

  try {
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "pln",
      // Wallets ride on the card payment method; letting Stripe pick automatically
      // would also offer redirect methods the express sheet cannot complete.
      payment_method_types: ["card"],
      description: `Goya ${orderNumber}`,
      receipt_email: email,
      shipping: {
        name: str(body.name, 160) || `${firstName} ${lastName}`.trim(),
        phone: str(body.phone, 30),
        address: {
          line1: str(body.line1, 120),
          line2: str(body.line2, 120),
          postal_code: str(body.postalCode, 12),
          city: str(body.city, 80),
          country: str(body.country, 2).toUpperCase() || "PL",
        },
      },
      metadata: {
        // The webhook uses this to tell an express order apart from a hosted
        // Checkout one, so the same payment is never recorded twice.
        checkout: "express",
        order_number: orderNumber,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: str(body.phone, 30),
        street: [str(body.line1, 120), str(body.line2, 120)].filter(Boolean).join(", "),
        postal_code: str(body.postalCode, 12),
        city: str(body.city, 80),
        // The wallet sheet has no field for a locker code, so express orders are
        // always courier. Paczkomat stays available through /kasa.
        delivery: "kurier",
        locker_code: "",
        newsletter: "nie",
        ...chunkMetadata("lines_", encodeLines(priced.lines)),
      },
    });

    if (!intent.client_secret) throw new Error("stripe returned an intent without a client_secret");
    return NextResponse.json({ clientSecret: intent.client_secret, orderNumber, amount }, { status: 200 });
  } catch (e) {
    console.error("express payment intent failed:", e);
    return NextResponse.json({ error: "stripe_failed" }, { status: 502 });
  }
}

import { NextResponse } from "next/server";
import { stripe, chunkMetadata } from "@/lib/stripe";
import { absoluteImage, encodeLines, newOrderNumber, parseCustomer, parseItems, priceCart } from "@/lib/order";
import { SITE_URL } from "@/content/site";

// Starts a payment: validates the order, prices it against the catalogue and
// hands the customer to Stripe Checkout. Nothing is written to the order log
// here — an unpaid order is Stripe's business until the webhook says otherwise,
// which is what keeps the sheet free of abandoned carts.

/**
 * Where Stripe should send the customer back to. The configured production
 * origin wins; otherwise fall back to the host actually serving the request, so
 * preview deployments redirect to themselves instead of to production.
 */
function originFor(req: Request): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return SITE_URL;
  try {
    return new URL(req.url).origin;
  } catch {
    return SITE_URL;
  }
}

export async function POST(req: Request) {
  if (!stripe) {
    console.error("checkout called without STRIPE_SECRET_KEY");
    return NextResponse.json({ error: "payments_unavailable" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const customer = parseCustomer(body);
  if (!customer) return NextResponse.json({ error: "missing fields" }, { status: 400 });

  const priced = await priceCart(parseItems(body));
  if (!priced.ok) {
    return NextResponse.json({ error: priced.error }, { status: priced.error === "unavailable" ? 409 : 400 });
  }

  const orderNumber = newOrderNumber();
  const origin = originFor(req);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "pl",
      submit_type: "pay",
      customer_email: customer.email,
      client_reference_id: orderNumber,
      // Payment methods come from the Stripe Dashboard (BLIK, Przelewy24, cards,
      // Apple/Google Pay), so enabling one there needs no deploy here.
      line_items: priced.lines.map((line) => ({
        quantity: line.qty,
        price_data: {
          currency: "pln",
          unit_amount: Math.round(line.price * 100),
          product_data: {
            name: line.variant ? `${line.name} — ${line.variant}` : line.name,
            images: [absoluteImage(line.image)].filter((v): v is string => Boolean(v)),
          },
        },
      })),
      success_url: `${origin}/kasa/sukces?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/kasa?platnosc=anulowana`,
      metadata: {
        order_number: orderNumber,
        first_name: customer.firstName,
        last_name: customer.lastName,
        street: customer.street,
        postal_code: customer.postalCode,
        city: customer.city,
        phone: customer.phone,
        delivery: customer.delivery,
        locker_code: customer.lockerCode,
        ...chunkMetadata("lines_", encodeLines(priced.lines)),
      },
      payment_intent_data: {
        description: `Goya ${orderNumber}`,
        metadata: { order_number: orderNumber },
      },
    });

    if (!session.url) throw new Error("stripe returned a session without a url");
    return NextResponse.json({ url: session.url, orderNumber }, { status: 200 });
  } catch (e) {
    console.error("stripe checkout session failed:", e);
    return NextResponse.json({ error: "stripe_failed" }, { status: 502 });
  }
}

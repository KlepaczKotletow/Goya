import { NextResponse } from "next/server";
import { recordOrder } from "@/lib/intake";

type OrderItem = { slug: string; name: string; variant?: string | null; qty: number; price: number };

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const email = str(body.email);
  const firstName = str(body.firstName, 80);
  const lastName = str(body.lastName, 80);
  const street = str(body.street);
  const postalCode = str(body.postalCode, 12);
  const city = str(body.city, 80);
  const phone = str(body.phone, 30);
  const delivery = body.delivery === "kurier" ? "kurier" : "paczkomat";
  const lockerCode = delivery === "paczkomat" ? str(body.lockerCode, 12).toUpperCase() : "";
  const rawItems = Array.isArray(body.items) ? (body.items as OrderItem[]) : [];
  const items = rawItems.slice(0, 50).map((i) => ({
    slug: str(i.slug),
    name: str(i.name),
    variant: i.variant ? str(i.variant, 80) : null,
    qty: Math.max(1, Math.min(99, Number(i.qty) || 1)),
    price: Number(i.price) || 0,
  }));
  const subtotal = Number(body.subtotal) || 0;

  if (!/.+@.+\..+/.test(email) || !firstName || !lastName || !street || !postalCode || !city || !items.length) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  // A paczkomat order without a locker code cannot be shipped, so reject it here
  // rather than accepting an order we can't fulfil.
  if (delivery === "paczkomat" && !/^[A-Z]{3}[0-9]{2,3}[A-Z]?$/.test(lockerCode)) {
    return NextResponse.json({ error: "invalid locker code" }, { status: 400 });
  }

  const ok = await recordOrder({
    email, firstName, lastName, street, postalCode, city, phone, delivery, lockerCode, items, subtotal,
  });
  if (!ok) return NextResponse.json({ error: "store failed" }, { status: 502 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

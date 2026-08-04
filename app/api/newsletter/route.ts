import { NextResponse } from "next/server";
import { recordNewsletter } from "@/lib/intake";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
  if (!/.+@.+\..+/.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
  const ok = await recordNewsletter(email);
  if (!ok) return NextResponse.json({ error: "store failed" }, { status: 502 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

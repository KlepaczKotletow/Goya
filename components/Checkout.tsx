"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPLN } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { TruckIcon, ReturnIcon, ShieldIcon } from "./icons";

export function Checkout() {
  const { lines, subtotal, setQty, remove, clear, hydrated } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Paczkomaty are the default delivery expectation in Poland, so offer them
  // first — not having the option at all is a bigger drop-off than the extra field.
  const [delivery, setDelivery] = useState<"paczkomat" | "kurier">("paczkomat");

  // No payment processor wired yet: the order (address + items) is stored via
  // /api/order so it can be confirmed manually; payment happens off-site for now.
  const placeOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: f.get("email"),
          firstName: f.get("firstName"),
          lastName: f.get("lastName"),
          street: f.get("street"),
          postalCode: f.get("postalCode"),
          city: f.get("city"),
          phone: f.get("phone"),
          delivery,
          lockerCode: delivery === "paczkomat" ? String(f.get("lockerCode") ?? "").toUpperCase() : "",
          items: lines.map((l) => ({ slug: l.slug, name: l.name, variant: l.variant, qty: l.qty, price: l.price })),
          subtotal,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      clear();
      router.push("/kasa/sukces");
    } catch {
      setSubmitting(false);
      setError("Nie udało się złożyć zamówienia. Spróbuj ponownie za chwilę.");
    }
  };

  if (!hydrated) return <div className="py-20 text-center text-stone">Ładowanie koszyka…</div>;

  if (!lines.length) {
    return (
      <div className="flex flex-col items-center gap-5 py-20 text-center">
        <p className="text-lg text-stone">Twój koszyk jest pusty.</p>
        <Link href="/okulary" className="rounded-full bg-ink px-7 py-3 text-sm text-paper transition hover:bg-rust">
          Przeglądaj okulary
        </Link>
      </div>
    );
  }

  // text-base below md: fonts under 16px make iOS Safari zoom the viewport on focus.
  const field = "w-full rounded-[12px] border border-line bg-paper px-4 py-3 text-base outline-none focus:border-ink md:text-sm";

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.2fr_1fr]">
      {/* Shipping form */}
      <form onSubmit={placeOrder} className="order-2 md:order-1">
        <h2 className="mb-5 font-display text-2xl">Dane do wysyłki</h2>
        <div className="grid gap-3">
          <input required type="email" name="email" autoComplete="email" placeholder="E-mail" className={field} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input required name="firstName" autoComplete="given-name" placeholder="Imię" className={field} />
            <input required name="lastName" autoComplete="family-name" placeholder="Nazwisko" className={field} />
          </div>
          <input required name="street" autoComplete="street-address" placeholder="Ulica i numer" className={field} />
          <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
            <input required name="postalCode" autoComplete="postal-code" placeholder="Kod" className={field} />
            <input required name="city" autoComplete="address-level2" placeholder="Miasto" className={field} />
          </div>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder={delivery === "paczkomat" ? "Telefon (do powiadomień z paczkomatu)" : "Telefon (opcjonalnie)"}
            required={delivery === "paczkomat"}
            className={field}
          />
        </div>

        <h2 className="mb-4 mt-8 font-display text-2xl">Dostawa</h2>
        <div className="grid gap-3">
          {([
            { id: "paczkomat", label: "Paczkomat InPost", note: "24/7, odbiór w 1–2 dni robocze" },
            { id: "kurier", label: "Kurier pod adres", note: "Dostawa w 1–2 dni robocze" },
          ] as const).map((o) => (
            <label
              key={o.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-[12px] border px-4 py-3.5 transition-colors",
                delivery === o.id ? "border-ink bg-paper" : "border-line hover:border-ink/40",
              )}
            >
              <input
                type="radio"
                name="delivery"
                value={o.id}
                checked={delivery === o.id}
                onChange={() => setDelivery(o.id)}
                className="h-4 w-4 shrink-0 accent-[var(--color-terracotta,#b85c38)]"
              />
              <span className="flex-1">
                <span className="block text-[0.95rem] font-medium text-ink">{o.label}</span>
                <span className="mt-0.5 block text-xs text-stone">{o.note}</span>
              </span>
              <span className="text-sm text-sage">Gratis</span>
            </label>
          ))}
        </div>

        {delivery === "paczkomat" && (
          <div className="mt-3">
            <input
              required
              name="lockerCode"
              placeholder="Kod paczkomatu (np. WAW01A)"
              pattern="[A-Za-z]{3}[0-9]{2,3}[A-Za-z]?"
              title="Podaj kod paczkomatu, np. WAW01A"
              className={cn(field, "uppercase placeholder:normal-case")}
            />
            <p className="mt-2 text-xs text-stone">
              Nie znasz kodu?{" "}
              <a
                href="https://inpost.pl/znajdz-paczkomat"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-ink"
              >
                Znajdź paczkomat na mapie
              </a>
              . Adres powyżej zostaw jako dane do faktury.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-terracotta py-3.5 text-sm font-medium text-paper transition hover:bg-rust disabled:opacity-60"
        >
          {submitting ? "Składanie zamówienia…" : `Złóż zamówienie — ${formatPLN(subtotal)}`}
        </button>
        {error && (
          <p role="alert" className="mt-3 text-center text-sm text-terracotta">
            {error}
          </p>
        )}
        <p className="mt-3 text-center text-[0.7rem] text-stone">
          Składając zamówienie, akceptujesz regulamin i politykę prywatności.
        </p>
      </form>

      {/* Order summary */}
      <div className="order-1 md:order-2 md:sticky md:top-28 md:self-start">
        <h2 className="mb-5 font-display text-2xl">Twoje zamówienie</h2>
        <div className="divide-y divide-line rounded-[16px] border border-line">
          {lines.map((l) => (
            <div key={l.key} className="flex gap-4 p-4">
              <div className="relative h-20 w-20 shrink-0 rounded-[10px] bg-paper">
                {l.image && <Image src={l.image} alt={l.name} fill className="object-contain p-1.5" sizes="80px" />}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <p className="font-display text-lg leading-tight">{l.name}</p>
                  <button onClick={() => remove(l.key)} className="text-xs text-stone hover:text-terracotta">Usuń</button>
                </div>
                {l.variant && <p className="mt-0.5 text-xs text-stone">{l.variant}</p>}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-line">
                    <button onClick={() => setQty(l.key, l.qty - 1)} className="px-3 py-1.5 text-stone hover:text-ink" aria-label="Mniej">−</button>
                    <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                    <button onClick={() => setQty(l.key, l.qty + 1)} className="px-3 py-1.5 text-stone hover:text-ink" aria-label="Więcej">+</button>
                  </div>
                  <span className="text-sm tabular-nums">{formatPLN(l.price * l.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[16px] border border-line bg-paper p-5">
          <div className="flex justify-between text-sm">
            <span className="text-stone">Wartość produktów</span>
            <span className="tabular-nums">{formatPLN(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-stone">{delivery === "paczkomat" ? "Paczkomat InPost" : "Kurier"}</span>
            <span className="text-sage">Gratis</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 text-lg">
            <span>Razem</span>
            <span className="tabular-nums">{formatPLN(subtotal)}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-2.5 text-sm text-ink-soft">
          <div className="flex items-center gap-3"><TruckIcon className="shrink-0 text-stone" /> Darmowa dostawa · 1–2 dni robocze</div>
          <div className="flex items-center gap-3"><ReturnIcon className="shrink-0 text-stone" /> 30 dni na zwrot bez podawania przyczyny</div>
          <div className="flex items-center gap-3"><ShieldIcon className="shrink-0 text-stone" /> 24 miesiące gwarancji</div>
        </div>
      </div>
    </div>
  );
}

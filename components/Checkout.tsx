"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useCart } from "@/lib/cart";
import { formatPLN } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { ShieldIcon, TruckIcon, ReturnIcon, ArrowIcon } from "./icons";
import { Field, TextArea, Segmented, CheckRow, OptionCard, ReviewRow } from "./checkout/Field";
import { Summary } from "./checkout/Summary";
import {
  maskNip, maskPhone, maskPostcode,
  vCity, vCompany, vEmail, vName, vNip, vPhone, vPostcode, vStreet,
} from "@/lib/validate";
import type { LockerPoint } from "@/lib/inpost";

// Leaflet touches `window` at import time, so the picker cannot be server
// rendered — and this keeps the map out of the checkout bundle until the
// customer actually needs it.
const LockerPicker = dynamic(() => import("./checkout/LockerPicker"), {
  ssr: false,
  loading: () => <div className="mt-3 h-[280px] animate-pulse rounded-[14px] bg-linen/60 md:h-[320px]" />,
});

type Errors = Record<string, string | null>;
const STEPS = ["Twoje dane", "Dostawa", "Płatność"] as const;

/**
 * Desktop is a single screen; mobile is three steps. The two differ in what is
 * *visible*, which CSS handles on its own — this hook is read only inside event
 * handlers and effects, where hydration has certainly finished. The server
 * snapshot is `false` so the server HTML and the first client render agree by
 * construction rather than by a user-agent guess.
 */
function useIsDesktop(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(min-width: 1024px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}

export function Checkout() {
  const { lines, subtotal, hydrated } = useCart();
  const desktop = useIsDesktop();

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [err, setErr] = useState<Errors>({});
  const headingRef = useRef<HTMLHeadingElement>(null);

  // step 0 — who
  const [customerType, setCustomerType] = useState<"private" | "company">("private");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // step 1 — where
  const [delivery, setDelivery] = useState<"paczkomat" | "kurier">("paczkomat");
  const [locker, setLocker] = useState<LockerPoint | null>(null);
  // Escape hatch. Paczkomat is the default delivery here, so if InPost's API is
  // unreachable the map alone would turn the most common path into a dead end.
  const [manualOpen, setManualOpen] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [manualBusy, setManualBusy] = useState(false);
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);

  // step 2 — consents
  const [terms, setTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const setFieldError = (k: string) => (v: string | null) => setErr((e) => ({ ...e, [k]: v }));

  // A company buying to a Paczkomat still needs an invoice address, so the
  // address block appears on the paczkomat path too when "Firma" is selected.
  const needsAddress = delivery === "kurier" || customerType === "company";

  const validateStep = useCallback(
    (s: 0 | 1 | 2): Errors => {
      const e: Errors = {};
      if (s === 0) {
        e.firstName = vName("imię")(firstName);
        e.lastName = vName("nazwisko")(lastName);
        e.email = vEmail(email);
        e.phone = vPhone(phone);
        if (customerType === "company") {
          e.company = vCompany(company);
          e.nip = vNip(nip);
        }
      }
      if (s === 1) {
        if (delivery === "paczkomat") e.locker = locker ? null : "Wybierz Paczkomat z mapy";
        if (needsAddress) {
          e.street = vStreet(street);
          e.postalCode = vPostcode(postalCode);
          e.city = vCity(city);
        }
      }
      if (s === 2) e.terms = terms ? null : "Zaakceptuj regulamin, aby złożyć zamówienie";
      return e;
    },
    [firstName, lastName, email, phone, customerType, company, nip, delivery, locker, needsAddress, street, postalCode, city, terms],
  );

  // Move focus to the new step's heading so a screen reader announces it and a
  // keyboard user does not land back at the top of the document.
  useEffect(() => {
    if (!desktop) headingRef.current?.focus();
  }, [step, desktop]);

  const submit = async () => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, firstName, lastName, phone,
          customerType,
          company: customerType === "company" ? company : "",
          nip: customerType === "company" ? nip : "",
          street: needsAddress ? street : "",
          apartment: needsAddress ? apartment : "",
          postalCode: needsAddress ? postalCode : "",
          city: needsAddress ? city : "",
          notes,
          newsletter,
          terms,
          delivery,
          lockerCode: delivery === "paczkomat" ? (locker?.code ?? "") : "",
          locker: delivery === "paczkomat" ? locker : null,
          items: lines.map((l) => ({ slug: l.slug, variationId: l.variationId ?? null, qty: l.qty })),
        }),
      });
      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (res.status === 409) throw new Error("unavailable");
      if (res.status === 503) throw new Error("payments_unavailable");
      if (!res.ok || !data?.url) throw new Error("failed");
      // A full page load, not router.push — the destination is Stripe's domain.
      window.location.href = data.url;
    } catch (e) {
      setSubmitting(false);
      const reason = e instanceof Error ? e.message : "failed";
      setServerError(
        reason === "unavailable"
          ? "Któraś z pozycji w koszyku przestała być dostępna. Odśwież stronę i spróbuj ponownie."
          : reason === "payments_unavailable"
            ? "Płatności są chwilowo niedostępne. Spróbuj ponownie za kilka minut."
            : "Nie udało się rozpocząć płatności. Spróbuj ponownie za chwilę.",
      );
    }
  };

  const advance = () => {
    // On desktop every section is on screen, so everything is validated at once.
    const found = desktop
      ? { ...validateStep(0), ...validateStep(1), ...validateStep(2) }
      : validateStep(step);
    setErr((prev) => ({ ...prev, ...found }));

    if (Object.values(found).some(Boolean)) {
      requestAnimationFrame(() => {
        document.querySelector('[aria-invalid="true"], [role="alert"]')?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
      return;
    }
    if (!desktop && step < 2) {
      setStep((s) => (s + 1) as 0 | 1 | 2);
      return;
    }
    void submit();
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

  // Visibility is CSS, not JS: a ≥1024px viewport shows all three sections on
  // the first paint, before any JavaScript runs, and a phone shows one.
  const section = (s: 0 | 1 | 2) => cn(step === s ? "block" : "hidden", "lg:block");
  const deliveryLabel = delivery === "paczkomat" ? "Paczkomat InPost" : "Kurier";

  const addressBlock = (
    <div className="grid gap-3">
      <Field
        label="Ulica i numer" value={street} onChange={setStreet} name="street"
        hint="np. Kwiatowa 12" autoComplete="address-line1" maxLength={120}
        validate={vStreet} error={err.street} setError={setFieldError("street")}
      />
      <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
        <Field
          label="Kod pocztowy" value={postalCode} name="postalCode"
          onChange={(v) => {
            setPostalCode(v);
            // Fill the city once, and only into an empty field, so we never
            // overwrite something the customer typed themselves.
            if (v.length === 6 && !city) void fillCityFrom(v, setCity);
          }}
          mask={maskPostcode} hint="00-000" inputMode="numeric"
          autoComplete="postal-code" maxLength={6}
          validate={vPostcode} error={err.postalCode} setError={setFieldError("postalCode")}
        />
        <Field
          label="Miasto" value={city} onChange={setCity} name="city"
          autoComplete="address-level2" autoCapitalize="words" maxLength={80}
          validate={vCity} error={err.city} setError={setFieldError("city")}
        />
      </div>
      <Field
        label="Mieszkanie, piętro (opcjonalnie)" value={apartment} onChange={setApartment}
        name="apartment" hint="np. m. 14" autoComplete="address-line2" maxLength={40}
      />
      <p className="text-xs text-stone">Wpisz kod pocztowy, a miasto uzupełnimy automatycznie.</p>
    </div>
  );

  const notesBlock = (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-ink">Uwagi</h3>
        {!notesOpen && (
          <button type="button" onClick={() => setNotesOpen(true)} className="text-xs text-stone underline underline-offset-2 hover:text-ink">
            Dodaj
          </button>
        )}
      </div>
      {notesOpen ? (
        <div className="mt-2">
          <TextArea label="Uwagi do zamówienia" value={notes} onChange={setNotes} name="notes" />
        </div>
      ) : (
        <p className="mt-1 text-xs text-stone">Np. wskazówki dla kuriera. Pole opcjonalne.</p>
      )}
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-x-12">
      {/* DOM order puts the summary first so mobile gets the collapsed drawer
          above the form; on desktop it moves to the right column. */}
      <aside className="mb-6 lg:sticky lg:top-28 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:self-start">
        <Summary deliveryLabel={deliveryLabel} />
      </aside>

      <div className="lg:col-start-1 lg:row-start-1">
        {/* Mobile progress. Hidden on desktop, where nothing is sequential. */}
        <div className="mb-6 lg:hidden">
          <div className="flex gap-1.5" role="presentation">
            {STEPS.map((s, i) => (
              <span key={s} className={cn("h-1 flex-1 rounded-full transition-colors", i <= step ? "bg-terracotta" : "bg-line")} />
            ))}
          </div>
          <p className="mt-2 text-xs text-stone">
            Krok {step + 1} z 3 · {STEPS[step]}
          </p>
        </div>

        <div key={step}>
          {/* ---------- 1 · Twoje dane ---------- */}
          <section className={section(0)} aria-labelledby="ck-dane">
            <h2
              id="ck-dane"
              ref={step === 0 ? headingRef : null}
              tabIndex={-1}
              className="mb-4 font-display text-2xl outline-none"
            >
              <span className="hidden lg:inline text-stone">1 · </span>Twoje dane
            </h2>

            <div className="mb-4">
              <Segmented
                label="Rodzaj klienta"
                value={customerType}
                onChange={setCustomerType}
                options={[
                  { value: "private", label: "Osoba prywatna" },
                  { value: "company", label: "Firma" },
                ]}
              />
            </div>

            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Imię" value={firstName} onChange={setFirstName} name="firstName"
                  autoComplete="given-name" autoCapitalize="words" maxLength={80}
                  validate={vName("imię")} error={err.firstName} setError={setFieldError("firstName")}
                />
                <Field
                  label="Nazwisko" value={lastName} onChange={setLastName} name="lastName"
                  autoComplete="family-name" autoCapitalize="words" maxLength={80}
                  validate={vName("nazwisko")} error={err.lastName} setError={setFieldError("lastName")}
                />
              </div>

              {customerType === "company" && (
                <>
                  <Field
                    label="Nazwa firmy" value={company} onChange={setCompany} name="company"
                    autoComplete="organization" autoCapitalize="words" maxLength={120}
                    validate={vCompany} error={err.company} setError={setFieldError("company")}
                  />
                  <Field
                    label="NIP" value={nip} onChange={setNip} name="nip"
                    mask={maskNip} hint="000-000-00-00" inputMode="numeric"
                    autoComplete="off" maxLength={13}
                    validate={vNip} error={err.nip} setError={setFieldError("nip")}
                  />
                  <p className="text-xs text-stone">Fakturę wystawimy na te dane i wyślemy e-mailem.</p>
                </>
              )}

              <Field
                label="Adres e-mail" value={email} onChange={setEmail} name="email"
                type="email" hint="jan@przyklad.pl" inputMode="email" autoComplete="email"
                autoCapitalize="none" spellCheck={false} maxLength={200}
                validate={vEmail} error={err.email} setError={setFieldError("email")}
              />
              <Field
                label="Numer telefonu" value={phone} onChange={setPhone} name="phone"
                type="tel" mask={maskPhone} adorn="+48" hint="600 700 800"
                inputMode="tel" autoComplete="tel-national" maxLength={11}
                validate={vPhone} error={err.phone} setError={setFieldError("phone")}
              />
            </div>
            <p className="mt-3 text-xs text-stone">
              Na ten adres wyślemy potwierdzenie zamówienia, a SMS-em – kod odbioru i numer do śledzenia przesyłki.
            </p>
          </section>

          {/* ---------- 2 · Dostawa ---------- */}
          <section className={cn(section(1), "lg:mt-10")} aria-labelledby="ck-dostawa">
            <h2
              id="ck-dostawa"
              ref={step === 1 ? headingRef : null}
              tabIndex={-1}
              className="mb-4 font-display text-2xl outline-none"
            >
              <span className="hidden lg:inline text-stone">2 · </span>Dostawa
            </h2>

            <div role="radiogroup" aria-label="Sposób dostawy" className="grid gap-3">
              <OptionCard
                selected={delivery === "paczkomat"}
                onSelect={() => setDelivery("paczkomat")}
                title="Paczkomat InPost"
                note="Odbiór 24/7 · 1–2 dni robocze"
                badge="Najczęściej wybierane"
                price="Bezpłatnie"
              />
              <OptionCard
                selected={delivery === "kurier"}
                onSelect={() => setDelivery("kurier")}
                title="Kurier pod adres"
                note="Dostawa w 1–2 dni robocze"
                price="Bezpłatnie"
              />
            </div>

            {delivery === "paczkomat" && (
              <div className="mt-4">
                {locker ? (
                  <div className="flex items-start gap-3 rounded-[12px] border border-ink bg-paper px-4 py-3">
                    <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-[0.7rem] text-paper">
                      ✓
                    </span>
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="block font-medium text-ink">Paczkomat {locker.code}</span>
                      <span className="mt-0.5 block text-xs text-stone">
                        {locker.street}, {locker.postCode} {locker.city}
                        {locker.hours && ` · ${locker.hours}`}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setLocker(null)}
                      className="shrink-0 text-xs text-stone underline underline-offset-2 hover:text-ink"
                    >
                      Zmień
                    </button>
                  </div>
                ) : (
                  <>
                    <LockerPicker
                      value={locker}
                      onSelect={(p) => {
                        setLocker(p);
                        setFieldError("locker")(null);
                      }}
                    />
                    {err.locker && (
                      <p role="alert" className="mt-2 text-xs text-terracotta">
                        {err.locker}
                      </p>
                    )}
                    <div className="mt-3">
                      {manualOpen ? (
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <input
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                            placeholder="Kod Paczkomatu, np. WAW198M"
                            autoCapitalize="characters"
                            maxLength={24}
                            className="w-full rounded-[12px] border border-line bg-paper px-4 py-3 text-base uppercase outline-none placeholder:normal-case focus:border-ink"
                          />
                          <button
                            type="button"
                            disabled={manualBusy || !manualCode.trim()}
                            onClick={() => void useManualCode(manualCode, setLocker, setFieldError("locker"), setManualBusy)}
                            className="whitespace-nowrap rounded-[12px] bg-ink px-5 py-3 text-sm text-paper transition hover:bg-rust disabled:opacity-50"
                          >
                            {manualBusy ? "Sprawdzam…" : "Użyj kodu"}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setManualOpen(true)}
                          className="text-xs text-stone underline underline-offset-2 hover:text-ink"
                        >
                          Znasz kod Paczkomatu? Wpisz go ręcznie
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {needsAddress && (
              <div className="mt-6">
                {delivery === "paczkomat" && (
                  <>
                    <h3 className="mb-1 text-sm font-medium text-ink">Dane do faktury</h3>
                    <p className="mb-3 text-xs text-stone">
                      Adres potrzebny tylko do faktury – paczka trafi do wybranego Paczkomatu.
                    </p>
                  </>
                )}
                {addressBlock}
              </div>
            )}

            {notesBlock}
          </section>

          {/* ---------- 3 · Płatność ---------- */}
          <section className={cn(section(2), "lg:mt-10")} aria-labelledby="ck-platnosc">
            <h2
              id="ck-platnosc"
              ref={step === 2 ? headingRef : null}
              tabIndex={-1}
              className="mb-4 font-display text-2xl outline-none"
            >
              <span className="hidden lg:inline text-stone">3 · </span>Płatność
            </h2>

            <div className="rounded-[12px] border border-line bg-paper px-4 py-3.5 text-sm text-ink-soft">
              <p>
                Płatność obsługuje Stripe. Metodę wybierzesz na następnej stronie – BLIK, Przelewy24, karta,
                Apple&nbsp;Pay i Google&nbsp;Pay.
              </p>
              <p className="mt-2 flex items-center gap-2 text-xs text-stone">
                <ShieldIcon className="h-4 w-4 shrink-0" />
                Połączenie szyfrowane. Nie przechowujemy danych karty.
              </p>
            </div>

            {/* Mobile-only recap: on desktop every answer is already on screen. */}
            {!desktop && (
              <div className="mt-5 rounded-[12px] border border-line px-4">
                <ReviewRow label="Odbiorca" onEdit={() => setStep(0)}>
                  {firstName} {lastName}
                  {customerType === "company" && company && (
                    <span className="mt-0.5 block text-xs text-stone">{company} · NIP {nip}</span>
                  )}
                  <span className="mt-0.5 block text-xs text-stone">
                    {email}
                    {phone && ` · +48 ${phone}`}
                  </span>
                </ReviewRow>
                <ReviewRow label="Dostawa" onEdit={() => setStep(1)}>
                  {deliveryLabel}
                  <span className="mt-0.5 block text-xs text-stone">
                    {delivery === "paczkomat" && locker
                      ? `${locker.code} · ${locker.street}, ${locker.city}`
                      : [street, apartment].filter(Boolean).join(", ") + `, ${postalCode} ${city}`}
                  </span>
                </ReviewRow>
                {notes && (
                  <ReviewRow label="Uwagi" onEdit={() => setStep(1)}>
                    {notes}
                  </ReviewRow>
                )}
              </div>
            )}

            <div className="mt-5 grid gap-1">
              {/* Two separate consents, and the newsletter box stays unticked:
                  Prawo komunikacji elektronicznej requires per-channel consent,
                  and the wording has to name the channel. */}
              <CheckRow
                checked={terms}
                onChange={(v) => {
                  setTerms(v);
                  if (v) setFieldError("terms")(null);
                }}
                error={err.terms}
                name="terms"
              >
                Akceptuję <Link href="/regulamin" className="link-underline text-ink">regulamin</Link> i{" "}
                <Link href="/polityka-prywatnosci" className="link-underline text-ink">politykę prywatności</Link>.
              </CheckRow>
              <CheckRow checked={newsletter} onChange={setNewsletter} name="newsletter">
                Chcę dostawać e-maile o nowościach i promocjach. Zgodę mogę wycofać w każdej chwili.
              </CheckRow>
            </div>
          </section>
        </div>

        {/* Sticky, not fixed: a fixed bar on mobile Safari stacks against the
            browser chrome and clips the last field. Sticky participates in
            layout, so it cannot cover content. */}
        <div
          className={cn(
            "sticky bottom-0 z-30 -mx-5 mt-6 border-t border-line bg-bg/92 px-5 pt-3 backdrop-blur-md",
            "pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
            "sm:-mx-9 sm:px-9",
            "lg:static lg:mx-0 lg:mt-8 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none",
          )}
        >
          {serverError && (
            <p role="alert" className="mb-2 text-center text-sm text-terracotta">
              {serverError}
            </p>
          )}
          <button
            type="button"
            onClick={advance}
            disabled={submitting}
            aria-label={submitting ? "Przekierowujemy do płatności" : undefined}
            className={cn(
              "group flex h-[3.4rem] w-full items-center justify-center gap-2 rounded-full bg-terracotta text-[0.95rem] font-medium text-paper",
              "shadow-[0_10px_28px_-10px_rgba(217,119,87,0.6)] transition hover:-translate-y-px hover:bg-rust",
              "active:scale-[0.995] disabled:opacity-60 disabled:hover:translate-y-0",
            )}
          >
            {submitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-paper/30 border-t-paper" />
            ) : (
              <>
                <span className="lg:hidden">{step < 2 ? "Dalej" : "Kupuję i płacę"}</span>
                <span className="hidden lg:inline">Kupuję i płacę</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{formatPLN(subtotal)}</span>
                <ArrowIcon className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          {!desktop && step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 0 | 1 | 2)}
              className="mt-2 w-full py-2 text-center text-sm text-stone hover:text-ink"
            >
              Wróć
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-2.5 text-xs text-ink-soft lg:hidden">
          <p className="flex items-center gap-2.5"><TruckIcon className="h-4 w-4 shrink-0 text-stone" /> Darmowa dostawa · 1–2 dni robocze</p>
          <p className="flex items-center gap-2.5"><ReturnIcon className="h-4 w-4 shrink-0 text-stone" /> 30 dni na zwrot bez podania przyczyny</p>
          <p className="flex items-center gap-2.5"><ShieldIcon className="h-4 w-4 shrink-0 text-stone" /> 24 miesiące gwarancji</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Resolve a hand-typed Paczkomat code against InPost and select it.
 *
 * If the lookup fails but the code is well formed, it is accepted anyway with
 * only the code filled in: a customer who knows their locker should not be
 * blocked from ordering because InPost's API is having a bad minute. The server
 * re-checks the format, and the code alone is enough to ship.
 */
async function useManualCode(
  raw: string,
  setLocker: (p: LockerPoint) => void,
  clearError: (e: string | null) => void,
  setBusy: (v: boolean) => void,
) {
  const code = raw.trim().toUpperCase();
  if (!code) return;
  setBusy(true);
  try {
    const res = await fetch(`/api/paczkomaty?code=${encodeURIComponent(code)}`);
    const data = (await res.json().catch(() => null)) as { points?: LockerPoint[] } | null;
    const found = data?.points?.[0];
    if (found) {
      setLocker(found);
      clearError(null);
      return;
    }
  } catch {
    /* fall through to the offline shape below */
  } finally {
    setBusy(false);
  }
  if (/^[A-Z0-9]{3,12}(-[A-Z0-9]{1,10})?$/.test(code)) {
    setLocker({ code, street: "", postCode: "", city: "", lat: 0, lng: 0, hours: "", description: "" });
    clearError(null);
  } else {
    clearError("Sprawdź kod – np. WAW198M");
  }
}

/**
 * Fill the city from a postcode, reusing the locker index rather than shipping a
 * second dataset. Silent on failure: an unfilled city is a minor inconvenience,
 * an error message about it is noise.
 */
async function fillCityFrom(postcode: string, setCity: (v: string) => void) {
  try {
    const res = await fetch(`/api/paczkomaty?q=${encodeURIComponent(postcode)}`);
    if (!res.ok) return;
    const data = (await res.json()) as { points: { city: string }[] };
    const found = data.points[0]?.city;
    if (found) setCity(found);
  } catch {
    /* ignore */
  }
}

"use client";
import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/content/site";
import { ArrowIcon } from "./icons";
import { SocialLinks } from "./SocialLinks";

const cols = [
  {
    title: "Sklep",
    links: [
      { label: "Wszystkie okulary", href: "/okulary" },
      { label: "Przeciwsłoneczne", href: "/przeciwsloneczne" },
      { label: "Korekcyjne", href: "/korekcyjne" },
      { label: "Okulary Aviator", href: "/kolekcje/okulary-aviator" },
      { label: "Okulary kocie oko", href: "/kolekcje/okulary-kocie-oko" },
      { label: "Polaryzacyjne", href: "/kolekcje/okulary-polaryzacyjne" },
      { label: "Wszystkie kolekcje", href: "/kolekcje" },
    ],
  },
  {
    title: "Marka i poradnik",
    links: [
      { label: "O Goya", href: "/o-marce" },
      { label: "Poradnik", href: "/poradnik" },
      { label: "Jak dobrać okulary", href: "/poradnik/jak-dobrac-okulary-do-ksztaltu-twarzy" },
      { label: "Polaryzacja a UV400", href: "/poradnik/polaryzacja-czy-uv400" },
      { label: "Ulubione", href: "/ulubione" },
    ],
  },
  {
    title: "Informacje",
    links: [
      { label: "Regulamin", href: "/regulamin" },
      { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
      { label: "Dostawa i zwroty", href: "/zwroty" },
    ],
  },
];

export function Footer() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const subscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setFailed(false);
    const email = new FormData(e.currentTarget).get("email");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };
  return (
    <footer className="mt-24 border-t border-line bg-paper">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr]">
        <div>
          {/* A file, not an inline <svg> like the header: the lockup is 6.8 kB of path
              data, it sits below the fold on every route, and as a static asset it is
              fetched once and cached instead of riding along in each page's HTML.
              Width and height are the intrinsic 1280x443 ratio, so nothing shifts. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- next/image would
              route a vector through the raster optimizer, which needs
              dangerouslyAllowSVG and gains nothing on a 7 kB SVG. */}
          <img
            src="/logo-goya.svg"
            alt="Goya — hand made"
            width={172}
            height={60}
            loading="lazy"
            decoding="async"
            className="w-[172px]"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-soft">{SITE.shortIntro}</p>
          <SocialLinks className="mt-5" />
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="eyebrow mb-4">{c.title}</p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-0.5 text-ink-soft transition hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="eyebrow mb-4">Newsletter</p>
          <p className="mb-3 text-sm text-ink-soft">Nowe modele i ciche wyprzedaże. Bez spamu.</p>
          {sent ? (
            <p className="text-sm text-sage">Dzięki! Trzymaj oko na skrzynce.</p>
          ) : (
            <form onSubmit={subscribe} className="flex items-center gap-2 border-b border-ink/30 pb-2">
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Twój e-mail"
                className="w-full bg-transparent text-base outline-none placeholder:text-stone md:text-sm"
              />
              <button aria-label="Zapisz się" disabled={busy} className="text-ink transition hover:text-terracotta disabled:opacity-50">
                <ArrowIcon />
              </button>
            </form>
          )}
          {failed && <p className="mt-2 text-xs text-terracotta">Nie udało się zapisać. Spróbuj ponownie.</p>}
          <p className="mt-2.5 text-[0.7rem] leading-snug text-stone">
            Zapisując się akceptujesz <Link href="/polityka-prywatnosci" className="link-underline">Politykę prywatności</Link>.
          </p>
        </div>
      </div>
      {/* pb-20 on phones clears the product page's fixed buy bar. That bar is
          64px tall including its offset and lives outside <main>, so the PDP's
          own pb-24 reserve cannot reach the footer: measured at the bottom of a
          product page, the bar sat directly over "© Goya", Regulamin,
          Prywatność and Kontakt. The extra space costs nothing on other routes —
          it is the last row of the document. */}
      <div className="wrap flex flex-col items-center justify-between gap-3 border-t border-line pb-20 pt-6 text-xs text-stone md:flex-row md:pb-6">
        <p>© {new Date().getFullYear()} {SITE.name}. Zaprojektowane w Polsce.</p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          <Link href="/regulamin" className="transition hover:text-ink">Regulamin</Link>
          <Link href="/polityka-prywatnosci" className="transition hover:text-ink">Prywatność</Link>
          <a href={`mailto:${SITE.email}`} className="transition hover:text-ink">Kontakt</a>
          <span>Wersja pokazowa</span>
        </div>
      </div>
    </footer>
  );
}

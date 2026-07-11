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
  return (
    <footer className="mt-24 border-t border-line bg-paper">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr]">
        <div>
          <p className="font-display text-3xl">{SITE.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">{SITE.shortIntro}</p>
          <SocialLinks className="mt-5" />
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="eyebrow mb-4">{c.title}</p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-soft transition hover:text-ink">
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="flex items-center gap-2 border-b border-ink/30 pb-2"
            >
              <input required type="email" placeholder="Twój e-mail" className="w-full bg-transparent text-sm outline-none placeholder:text-stone" />
              <button aria-label="Zapisz się" className="text-ink transition hover:text-terracotta">
                <ArrowIcon />
              </button>
            </form>
          )}
          <p className="mt-2.5 text-[0.7rem] leading-snug text-stone">
            Zapisując się akceptujesz <Link href="/polityka-prywatnosci" className="link-underline">Politykę prywatności</Link>.
          </p>
        </div>
      </div>
      <div className="wrap flex flex-col items-center justify-between gap-3 border-t border-line py-6 text-xs text-stone md:flex-row">
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

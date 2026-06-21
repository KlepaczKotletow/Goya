"use client";
import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/content/site";
import { ArrowIcon } from "./icons";

const cols = [
  {
    title: "Sklep",
    links: [
      { label: "Wszystkie okulary", href: "/okulary" },
      { label: "Przeciwsłoneczne", href: "/przeciwsloneczne" },
      { label: "Korekcyjne", href: "/korekcyjne" },
      { label: "Bestsellery", href: "/okulary?sort=popular" },
    ],
  },
  {
    title: "Marka",
    links: [
      { label: "O Goya", href: "/o-marce" },
      { label: "Ulubione", href: "/ulubione" },
    ],
  },
];

export function Footer() {
  const [sent, setSent] = useState(false);
  return (
    <footer className="mt-24 border-t border-line bg-paper">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <p className="font-display text-3xl">{SITE.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">{SITE.shortIntro}</p>
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
        </div>
      </div>
      <div className="wrap flex flex-col items-center justify-between gap-2 border-t border-line py-6 text-xs text-stone md:flex-row">
        <p>© {new Date().getFullYear()} {SITE.name}. Zaprojektowane w Polsce.</p>
        <p>Wersja pokazowa — bez płatności i wysyłki.</p>
      </div>
    </footer>
  );
}

"use client";
import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/content/site";
import { Logo } from "./Logo";
import { ArrowIcon } from "./icons";

const cols = [
  {
    title: "Sklep",
    links: [
      { label: "Wszystkie okulary", href: "/okulary" },
      { label: "Przeciwsłoneczne", href: "/przeciwsloneczne" },
      { label: "Korekcyjne", href: "/korekcyjne" },
      { label: "Kolekcje", href: "/#kolekcje" },
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
    <footer className="mt-24 bg-mar-deep text-bg">
      {/* Pocztówka od Goya — newsletter as a postcard */}
      <div className="wrap pt-14 md:pt-20">
        <div className="relative rounded-[6px] border border-dashed border-bg/30 p-6 md:p-10">
          <span aria-hidden className="absolute right-5 top-5 hidden h-12 w-12 items-center justify-center rounded-[2px] border border-dashed border-bg/30 sm:flex">
            <span className="h-6 w-6 rounded-full bg-sol" />
          </span>
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="geotag text-sol">Pocztówka od Goya</p>
              <p className="mt-3 font-display text-2xl italic leading-snug text-bg md:text-3xl">
                Nowe kolekcje, ciche wyprzedaże i −10% na start.
              </p>
              <p className="mt-2 text-sm text-bg/70">Bez spamu. Tylko dobre światło, raz na jakiś czas.</p>
            </div>
            {sent ? (
              <p className="text-sm text-sol">Dzięki! Sprawdź skrzynkę — pocztówka już leci.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="flex items-center gap-2 border-b border-bg/40 pb-2 md:w-full md:max-w-md md:justify-self-end"
              >
                <input
                  required
                  type="email"
                  placeholder="Twój e-mail"
                  className="w-full bg-transparent py-2 text-base outline-none placeholder:text-bg/50"
                />
                <button aria-label="Zapisz się" className="flex h-11 w-11 items-center justify-center text-bg transition hover:text-sol">
                  <ArrowIcon />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="wrap grid gap-12 py-14 md:grid-cols-[1.6fr_1fr_1fr] md:py-16">
        <div>
          <Logo className="text-3xl" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-bg/70">{SITE.shortIntro}</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="geotag mb-4 text-bg/50">{c.title}</p>
            <ul className="flex flex-col gap-3 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-bg/75 transition hover:text-sol">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="wrap flex flex-col items-center justify-between gap-2 border-t border-bg/15 py-6 text-xs text-bg/50 md:flex-row">
        <p>© {new Date().getFullYear()} {SITE.name}. Zaprojektowane w Polsce, pod hiszpańskie światło.</p>
        <p>Wersja pokazowa — bez płatności i wysyłki.</p>
      </div>
    </footer>
  );
}

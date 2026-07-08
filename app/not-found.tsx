import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";

export const metadata: Metadata = { title: "Nie znaleziono strony" };

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[62vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Błąd 404</p>
      <p className="mt-4 font-display leading-none text-terracotta [font-size:clamp(4.5rem,15vw,9rem)]">404</p>
      <h1 className="mt-4 font-display text-3xl md:text-4xl">Nie znaleźliśmy tej strony</h1>
      <p className="mt-3 max-w-md text-ink-soft">
        Strona mogła zostać przeniesiona albo nigdy nie istniała. Wróćmy do patrzenia szerzej.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/okulary" variant="accent" size="lg">Przeglądaj okulary</ButtonLink>
        <ButtonLink href="/" variant="outline" size="lg">Strona główna</ButtonLink>
      </div>
    </section>
  );
}

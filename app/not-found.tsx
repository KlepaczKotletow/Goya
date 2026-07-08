import Link from "next/link";
import { ButtonLink } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Błąd 404</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl">Nie ma tu nic do zobaczenia</h1>
      <p className="mt-4 max-w-md text-ink-soft">
        Ta strona nie istnieje albo została przeniesiona. Wróć do katalogu i znajdź swoją parę.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/okulary" variant="accent" size="lg">Zobacz okulary</ButtonLink>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-full border border-ink/25 px-8 text-[0.95rem] font-medium transition hover:border-ink"
        >
          Strona główna
        </Link>
      </div>
    </div>
  );
}

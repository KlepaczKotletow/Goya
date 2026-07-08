import type { ReactNode } from "react";

export function ContentPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="wrap py-12 md:py-16">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">{title}</h1>
      {updated && <p className="mt-3 text-sm text-stone">Ostatnia aktualizacja: {updated}</p>}
      <div className="mt-8 max-w-2xl leading-relaxed text-ink-soft [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-ink [&_li]:mt-1 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}

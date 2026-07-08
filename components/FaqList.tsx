// Server-rendered FAQ (native <details>) — content lives in the HTML, no JS needed.
// Pair with faqPageLd() so the visible Q&A and FAQPage schema stay 1:1.
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-[16px] border border-line">
      {items.map((f) => (
        <details key={f.q} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg leading-snug marker:hidden">
            {f.q}
            <span aria-hidden className="shrink-0 text-xl text-stone transition-transform duration-300 group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 leading-relaxed text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

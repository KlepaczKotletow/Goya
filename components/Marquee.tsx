export function Marquee({ items, variant = "default" }: { items: string[]; variant?: "default" | "bold" }) {
  const row = [...items, ...items];

  if (variant === "bold") {
    return (
      <div className="relative flex overflow-hidden bg-ink py-5 text-paper select-none md:py-7">
        <div className="flex shrink-0 animate-marquee whitespace-nowrap">
          {row.map((t, i) => (
            <span key={i} className="mx-6 font-display text-2xl tracking-tight md:mx-10 md:text-4xl">
              {t} <span className="ml-6 text-terracotta md:ml-10">✦</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex overflow-hidden border-y border-line bg-paper py-4 select-none">
      <div className="flex shrink-0 animate-marquee whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="mx-7 text-sm uppercase tracking-[0.22em] text-stone">
            {t} <span className="ml-7 text-terracotta">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

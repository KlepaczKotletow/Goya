export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
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

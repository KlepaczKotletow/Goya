import { StarIcon } from "./icons";

export function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const row = (filled: boolean) => (
    <span className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} filled={filled} />
      ))}
    </span>
  );
  return (
    <span
      className="relative inline-flex text-terracotta"
      style={{ fontSize: size }}
      role="img"
      aria-label={`Ocena ${rating.toFixed(1)} na 5`}
    >
      <span className="text-terracotta/25">{row(false)}</span>
      <span className="absolute left-0 top-0 h-full overflow-hidden" style={{ width: `${pct}%` }}>
        {row(true)}
      </span>
    </span>
  );
}

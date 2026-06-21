import { StarIcon } from "./icons";

export function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-terracotta" style={{ fontSize: size }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} filled={i < Math.round(rating)} />
      ))}
    </span>
  );
}

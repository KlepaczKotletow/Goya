import { cn } from "@/lib/utils";

/* Editorial fingerprint: place + golden-hour timestamp on campaign photos. */
export function Geotag({
  place,
  time,
  tone = "light",
  className,
}: {
  place: string;
  time: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "geotag pointer-events-none absolute bottom-4 right-4 z-10",
        tone === "light" ? "text-white/85 [text-shadow:0_1px_10px_rgba(18,48,63,0.45)]" : "text-ink-soft",
        className,
      )}
    >
      {place} · {time}
    </span>
  );
}

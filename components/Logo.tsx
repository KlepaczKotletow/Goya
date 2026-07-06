import { cn } from "@/lib/utils";

/* GOYA wordmark — the "o" is a sun-gold disc. */
export function Logo({ className }: { className?: string }) {
  return (
    <span aria-label="Goya" className={cn("font-display tracking-tight", className)}>
      <span aria-hidden="true">
        G
        <span className="mx-[0.03em] inline-block h-[0.5em] w-[0.5em] rounded-full bg-sol align-baseline" />
        ya
      </span>
    </span>
  );
}

import { COLOR_HEX } from "@/content/site";
import { cn } from "@/lib/utils";

export function ColorSwatch({ name, size = 16, className }: { name: string; size?: number; className?: string }) {
  const hex = COLOR_HEX[name] ?? "#b9a48c";
  const multi = name === "Wielokolorowy";
  return (
    <span
      title={name}
      aria-label={name}
      className={cn("inline-block rounded-full ring-1 ring-ink/15", className)}
      style={{
        width: size,
        height: size,
        background: multi
          ? "conic-gradient(from 0deg, #c65a2e, #e2b53d, #3f7d54, #2f5fae, #6b4e9b, #c65a2e)"
          : hex,
      }}
    />
  );
}

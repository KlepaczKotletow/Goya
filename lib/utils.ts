import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function imageAt(images: { src: string }[], i: number): string | null {
  return images?.[i]?.src ?? images?.[0]?.src ?? null;
}

// Polish plural: plural(3, "model", "modele", "modeli") -> "modele"
export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const d10 = n % 10;
  const d100 = n % 100;
  if (d10 >= 2 && d10 <= 4 && !(d100 >= 12 && d100 <= 14)) return few;
  return many;
}

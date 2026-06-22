import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function imageAt(images: { src: string }[], i: number): string | null {
  return images?.[i]?.src ?? images?.[0]?.src ?? null;
}

// Light warm color fields so white-bg packshots (and thin metal frames) read clearly under mix-blend-multiply.
const FIELD_TINTS = ["#f0e9db", "#efe7d8", "#f2ebde", "#ece4d4", "#f1e6dd", "#eee6d4"];
export function fieldTint(seed: number): string {
  return FIELD_TINTS[Math.abs(seed) % FIELD_TINTS.length];
}

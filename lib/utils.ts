import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function imageAt(images: { src: string }[], i: number): string | null {
  return images?.[i]?.src ?? images?.[0]?.src ?? null;
}

// Light warm color fields so white-bg packshots (and thin metal frames) read clearly under mix-blend-multiply.
const FIELD_TINTS = ["#f1e9dc", "#e8ece1", "#f2ebdf", "#ede5d6", "#f1e7df", "#e8ece2"];
export function fieldTint(seed: number): string {
  return FIELD_TINTS[Math.abs(seed) % FIELD_TINTS.length];
}

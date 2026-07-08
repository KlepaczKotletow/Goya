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

// WooCommerce copy often arrives SHOUTING IN ALL CAPS. Soften predominantly-uppercase
// text to sentence case while preserving a small allowlist of real acronyms.
const KEEP_UPPER = new Set(["GOYA", "UV400", "UV-400", "UV", "UVA", "UVB", "UVC", "CE", "PL", "HD"]);
export function humanizeCaps(text: string): string {
  const letters = (text.match(/\p{L}/gu) ?? []).length;
  const uppers = (text.match(/\p{Lu}/gu) ?? []).length;
  if (!letters || uppers / letters < 0.6) return text; // not shouting - leave as-is
  const lowered = text.replace(/[\p{L}][\p{L}-]*/gu, (w) =>
    KEEP_UPPER.has(w.toLocaleUpperCase("pl")) ? w.toLocaleUpperCase("pl") : w.toLocaleLowerCase("pl"),
  );
  return lowered.replace(/(^|[.!?]\s+)(\p{L})/gu, (_m, pre, ch) => pre + ch.toLocaleUpperCase("pl"));
}

// Input masks and validators for the checkout.
//
// Shared by the client (live feedback as you type) and the server (lib/order.ts),
// so a field can never pass in the browser and fail silently on submit.
//
// Error wording follows one rule: an empty required field gets an imperative
// ("Podaj numer telefonu"), a malformed value gets the rule it broke
// ("Numer telefonu ma 9 cyfr"). Telling someone "pole wymagane" when they typed
// eight digits is what makes forms feel hostile.

/* ---------- masks ---------- */
// Every mask is idempotent: running it on already-formatted text is a no-op.
// That matters because browsers autofill formatted values and React re-runs the
// mask on the result.

/** 00-000 */
export const maskPostcode = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 5);
  return d.length > 2 ? `${d.slice(0, 2)}-${d.slice(2)}` : d;
};

/** 600 700 800 — the 9-digit national part, without the +48 prefix. */
export const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 9);
  return d.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
};

/** 000-000-00-00 */
export const maskNip = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 8) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8)}`;
};

/* ---------- validators: Polish message, or null when valid ---------- */

export type Validator = (v: string) => string | null;

export const vEmail: Validator = (v) => {
  const s = v.trim();
  if (!s) return "Podaj adres e-mail";
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(s)) return "Sprawdź adres e-mail";
  return null;
};

export const vPhone: Validator = (v) => {
  const d = v.replace(/\D/g, "");
  if (!d) return "Podaj numer telefonu";
  // Polish mobiles and landlines never start with 0 in the national format;
  // people habitually type the old 0-prefix, so name that specifically.
  if (d.startsWith("0")) return "Wpisz numer bez zera na początku";
  if (d.length !== 9) return "Numer telefonu ma 9 cyfr";
  return null;
};

export const vPostcode: Validator = (v) => {
  const s = v.trim();
  if (!s) return "Podaj kod pocztowy";
  if (!/^\d{2}-\d{3}$/.test(s)) return "Kod pocztowy ma format 00-000";
  return null;
};

/** Names carry a field label so the message names the field the user is looking at. */
export const vName = (label: string): Validator => (v) => {
  const s = v.trim();
  if (!s) return `Podaj ${label}`;
  if (s.length < 2) return "To za krótkie";
  return null;
};

export const vStreet: Validator = (v) => {
  const s = v.trim();
  if (!s) return "Podaj ulicę i numer";
  if (!/\d/.test(s)) return "Dodaj numer budynku";
  return null;
};

export const vCity: Validator = (v) => (v.trim() ? null : "Podaj miasto");
export const vCompany: Validator = (v) => (v.trim() ? null : "Podaj nazwę firmy");

/**
 * NIP with its checksum — catches a transposed digit before the order is placed
 * rather than when the invoice bounces.
 */
export const vNip: Validator = (v) => {
  const d = v.replace(/\D/g, "");
  if (!d) return "Podaj NIP";
  if (d.length !== 10) return "NIP ma 10 cyfr";
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const sum = weights.reduce((acc, w, i) => acc + w * Number(d[i]), 0);
  // A remainder of 10 can never match a single check digit, so such a number is
  // invalid by construction rather than merely mismatched.
  if (sum % 11 !== Number(d[9])) return "Nieprawidłowy NIP – sprawdź cyfry";
  return null;
};

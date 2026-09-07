// Builds data/inpost-cities.json — a city-name → centroid index for the checkout
// locker search.
//
// Why this exists: ShipX's `city=` filter is exact, case-sensitive AND
// diacritic-sensitive. Measured against the live API:
//
//   Warszawa -> 1482 hits      warszawa -> 0      WARSZAWA -> 0
//   Gdańsk   ->  393 hits      Gdansk   -> 0      gdańsk   -> 0
//   Łódź     ->  508 hits      lodz     -> 0
//
// So free-text city search against `city=` is unusable — nobody types "Łódź"
// with both diacritics. Instead we resolve the typed name to a coordinate here
// and hand that to `relative_point`, which is forgiving and returns results
// sorted by real distance.
//
// The source is the bulk file InPost's own widget falls back to (~8 MB). It is
// only ever a *centroid index*: the live API remains the source of truth for
// which lockers exist and whether they are operating. Re-run when it drifts:
//
//   node scripts/build-city-index.mjs
import { writeFile } from "node:fs/promises";

const SOURCE = "https://inpost.pl/sites/default/files/points.json";
const OUT = new URL("../data/inpost-cities.json", import.meta.url);

/** Fold a Polish city name to a plain-ASCII search key. */
export function citySlug(s) {
  return s
    .toLowerCase()
    .replaceAll("ą", "a").replaceAll("ć", "c").replaceAll("ę", "e")
    .replaceAll("ł", "l").replaceAll("ń", "n").replaceAll("ó", "o")
    .replaceAll("ś", "s").replaceAll("ż", "z").replaceAll("ź", "z")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`points.json: HTTP ${res.status}`);
const raw = await res.json();
const items = Array.isArray(raw) ? raw : (raw.items ?? []);
console.log(`source rows: ${items.length}`);

// t=1 → automat (not PaczkoPunkt), s=1 → Operating.
const sums = new Map();
for (const p of items) {
  if (p.t !== 1 || p.s !== 1) continue;
  const city = p.c;
  const lat = p.l?.a;
  const lng = p.l?.o;
  if (!city || typeof lat !== "number" || typeof lng !== "number") continue;
  const key = p.g || citySlug(city);
  const acc = sums.get(key) ?? { key, city, lat: 0, lng: 0, n: 0 };
  acc.lat += lat;
  acc.lng += lng;
  acc.n += 1;
  sums.set(key, acc);
}

// [slug, display name, lat, lng, locker count] — a tuple per row keeps the file
// about a third the size of an object-per-city, and it is only read by the server.
const rows = [...sums.values()]
  .map((a) => [a.key, a.city, +(a.lat / a.n).toFixed(5), +(a.lng / a.n).toFixed(5), a.n])
  .sort((a, b) => b[4] - a[4]);

await writeFile(OUT, JSON.stringify(rows));
console.log(`cities: ${rows.length} → ${OUT.pathname}`);
console.log("largest:", rows.slice(0, 5).map((r) => `${r[1]} (${r[4]})`).join(", "));

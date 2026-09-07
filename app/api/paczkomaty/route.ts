import { NextResponse } from "next/server";
import { lockerByCode, lockersByPostCode, lockersNear, type LockerPoint } from "@/lib/inpost";
import cities from "@/data/inpost-cities.json";

// Locker search for the checkout picker.
//
// The browser never talks to InPost directly: proxying keeps the customer's IP
// and coordinates off a third party while they are mid-payment, and lets one
// cached response serve everyone searching the same place.

export const runtime = "nodejs";

/** [slug, display name, lat, lng, locker count] — see scripts/build-city-index.mjs. */
type CityRow = [string, string, number, number, number];
const CITIES = cities as CityRow[];

function slug(s: string): string {
  return s
    .toLowerCase()
    .replaceAll("ą", "a").replaceAll("ć", "c").replaceAll("ę", "e")
    .replaceAll("ł", "l").replaceAll("ń", "n").replaceAll("ó", "o")
    .replaceAll("ś", "s").replaceAll("ż", "z").replaceAll("ź", "z")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Resolve a typed place name to a coordinate.
 * Exact slug first, then prefix — and among prefix matches the city with the
 * most lockers wins, so "war" lands on Warszawa rather than Warka. CITIES is
 * pre-sorted by locker count, so the first prefix hit is already the biggest.
 */
function resolveCity(q: string): CityRow | null {
  const key = slug(q);
  if (!key) return null;
  return CITIES.find((c) => c[0] === key) ?? CITIES.find((c) => c[0].startsWith(key)) ?? null;
}

const isPostCode = (q: string) => /^\d{2}-?\d{3}$/.test(q.trim());

export async function GET(req: Request) {
  const url = new URL(req.url);
  // Number(null) is 0, not NaN, so a plain Number() on a missing param would
  // read as the valid coordinate 0,0 and search the Gulf of Guinea.
  const num = (k: string): number | null => {
    const raw = url.searchParams.get(k);
    if (raw === null || raw.trim() === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };
  const lat = num("lat");
  const lng = num("lng");
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 80);
  const code = (url.searchParams.get("code") ?? "").trim().slice(0, 24).toUpperCase();

  try {
    // 0. Exact locker code, for the manual-entry fallback in the checkout.
    if (code) {
      const point = await lockerByCode(code);
      return json(point ? [point] : [], point ? point.city : null);
    }

    // 1. Coordinates — "use my location", the most precise route.
    if (lat !== null && lng !== null && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return json(await lockersNear(lat, lng), null);
    }

    if (!q) return NextResponse.json({ error: "empty_query" }, { status: 400 });

    // 2. A postcode is unambiguous, and ShipX matches it with or without the dash.
    if (isPostCode(q)) {
      const byCode = await lockersByPostCode(q);
      if (byCode.length) return json(byCode, `w okolicy ${q}`);
      // Sparse postcode: fall through to the city centroid rather than dead-ending.
    }

    // 3. Free text → city centroid → positional search. ShipX's own `city=` filter
    //    is case- and diacritic-exact, so "lodz" would return nothing there.
    const city = resolveCity(q);
    if (!city) return json([], null);
    return json(await lockersNear(city[2], city[3]), city[1]);
  } catch (e) {
    console.error("paczkomaty lookup failed:", e);
    return NextResponse.json({ error: "upstream_unavailable" }, { status: 502 });
  }
}

function json(points: LockerPoint[], place: string | null) {
  return NextResponse.json(
    { points, place },
    // Locker locations change on the order of weeks; a day of shared cache is
    // safe and keeps repeat searches off InPost entirely.
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}

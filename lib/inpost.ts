// InPost pickup points, read from ShipX.
//
// https://api-shipx-pl.easypack24.net/v1/points is public, unauthenticated and
// CORS-open — the same data InPost's own Geowidget renders. We query it from the
// server rather than the browser so the customer's IP and coordinates never reach
// InPost while they are on the checkout page, and so responses can be cached.
//
// The official Geowidget (api.inpost.pl) is the alternative. It needs a business
// account and a token locked to fixed referrers, which breaks every Vercel
// preview URL, so it is deliberately not used here. Both produce the same
// LockerPoint shape, so swapping later touches only this file.

/** A pickup point the customer can choose. */
export type LockerPoint = {
  /** ShipX `name` — the code printed on the locker, e.g. "WAW198M". */
  code: string;
  /** Street and building, e.g. "Marszałkowska 94". */
  street: string;
  postCode: string;
  city: string;
  lat: number;
  lng: number;
  /** e.g. "24/7" or "PN-PT 11-19 SB 11-15". */
  hours: string;
  /** Where to look once you are there, e.g. "Przy Novotel Warsaw Centrum". */
  description: string;
  /** Metres from the search origin. Absent when the search was not positional. */
  distance?: number;
};

const SHIPX = "https://api-shipx-pl.easypack24.net/v1/points";

// parcel_locker_only  → automats, not PaczkoPunkty in shops with limited hours.
// functions=parcel_collect → the point can hand a prepaid parcel over. Without
//   it the list includes send-only points the customer could not collect from.
// status=Operating → InPost also publishes NonOperating and Overloaded points.
const BASE_QUERY = "type=parcel_locker_only&functions=parcel_collect&status=Operating";
const FIELDS = "name,location,address,address_details,opening_hours,location_description,distance";

type ShipXItem = {
  name?: string;
  location?: { latitude?: number; longitude?: number };
  address?: { line1?: string; line2?: string };
  address_details?: { city?: string; post_code?: string; street?: string; building_number?: string };
  opening_hours?: string;
  location_description?: string;
  distance?: number;
};

function toPoint(i: ShipXItem): LockerPoint | null {
  const lat = i.location?.latitude;
  const lng = i.location?.longitude;
  if (!i.name || typeof lat !== "number" || typeof lng !== "number") return null;
  const d = i.address_details ?? {};
  const street = [d.street, d.building_number].filter(Boolean).join(" ") || i.address?.line1 || "";
  return {
    code: i.name,
    street,
    postCode: d.post_code ?? "",
    city: d.city ?? "",
    lat,
    lng,
    hours: i.opening_hours ?? "",
    description: i.location_description ?? "",
    ...(typeof i.distance === "number" ? { distance: i.distance } : {}),
  };
}

/**
 * ShipX answers a missing resource with HTTP 200 and a 404 *in the body*, so
 * `res.ok` alone means nothing. Everything goes through here.
 */
async function shipx(query: string, revalidate: number): Promise<ShipXItem[]> {
  const res = await fetch(`${SHIPX}?${query}`, {
    headers: { Accept: "application/json" },
    next: { revalidate },
  });
  const body = (await res.json().catch(() => null)) as
    | { items?: ShipXItem[]; status?: number; error?: string }
    | null;
  if (!body || (typeof body.status === "number" && body.status >= 400)) {
    throw new Error(`shipx ${body?.status ?? res.status}: ${body?.error ?? "unreadable response"}`);
  }
  return Array.isArray(body.items) ? body.items : [];
}

/** Lockers near a coordinate, nearest first. */
export async function lockersNear(lat: number, lng: number, limit = 24): Promise<LockerPoint[]> {
  // max_distance is mandatory alongside relative_point. 25 km covers rural Poland
  // without returning a different voivodeship in a city.
  const q = `${BASE_QUERY}&fields=${FIELDS}&relative_point=${lat},${lng}&max_distance=25000&per_page=${limit}`;
  return (await shipx(q, 3600)).map(toPoint).filter((p): p is LockerPoint => p !== null);
}

/** Lockers in a postcode. Accepts "00-510" or "00510". */
export async function lockersByPostCode(postCode: string, limit = 24): Promise<LockerPoint[]> {
  const q = `${BASE_QUERY}&fields=${FIELDS}&post_code=${encodeURIComponent(postCode)}&per_page=${limit}`;
  return (await shipx(q, 3600)).map(toPoint).filter((p): p is LockerPoint => p !== null);
}

/**
 * One point by its code, for re-validating a chosen locker server-side.
 * Returns null when the code does not exist or is no longer operating.
 */
export async function lockerByCode(code: string): Promise<LockerPoint | null> {
  const items = await shipx(
    `${BASE_QUERY}&fields=${FIELDS}&name=${encodeURIComponent(code)}&per_page=1`,
    3600,
  ).catch(() => [] as ShipXItem[]);
  return items.length ? toPoint(items[0]) : null;
}

/** Render a point the way it should read in an order confirmation or an email. */
export function formatLocker(p: LockerPoint): string {
  return `Paczkomat ${p.code}, ${p.street}, ${p.postCode} ${p.city}`;
}

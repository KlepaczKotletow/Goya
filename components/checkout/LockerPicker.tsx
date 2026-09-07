"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LockerPoint } from "@/lib/inpost";
import { cn } from "@/lib/utils";
import InPostGeowidget, { hasGeowidget } from "./InPostGeowidget";

// Map + list picker for InPost lockers.
//
// Loaded through next/dynamic with ssr:false from the checkout — Leaflet touches
// `window` at import time, and this keeps ~42 KB out of the checkout bundle until
// the customer actually opens the picker.
//
// Leaflet is driven imperatively rather than through react-leaflet: markers and
// fitBounds are all we need, and one useEffect is fewer moving parts than an
// extra ESM dependency.

// Swap providers with one env var. OpenStreetMap's tile policy has no SLA and
// singles out commercial use, so this is deliberately not hardcoded.
const TILE_URL = process.env.NEXT_PUBLIC_MAP_TILE_URL ?? "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** Terracotta teardrop. L.Icon.Default rebuilds image paths at runtime and breaks under bundlers. */
function pinHtml(selected: boolean, label: string): string {
  const fill = selected ? "#141413" : "#d97757";
  return `<svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 22 14 22s14-11.5 14-22c0-7.7-6.3-14-14-14z" fill="${fill}"/>
    <text x="14" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#faf9f5"
      font-family="system-ui, sans-serif">${label}</text>
  </svg>`;
}

type Props = {
  value: LockerPoint | null;
  onSelect: (p: LockerPoint) => void;
};

export default function LockerPicker({ value, onSelect }: Props) {
  // When a geowidget token is configured, show InPost's own map instead of
  // ours. Both hand back the same LockerPoint shape, so nothing downstream —
  // the checkout, the order payload, the webhook — knows which one ran.
  if (hasGeowidget) return <InPostGeowidget onSelect={onSelect} />;
  return <SelfHostedPicker value={value} onSelect={onSelect} />;
}

function SelfHostedPicker({ value, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [points, setPoints] = useState<LockerPoint[]>([]);
  const [place, setPlace] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [locating, setLocating] = useState(false);

  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<Marker[]>([]);

  const search = useCallback(async (params: string) => {
    setState("loading");
    try {
      const res = await fetch(`/api/paczkomaty?${params}`);
      if (!res.ok) throw new Error(`http ${res.status}`);
      const data = (await res.json()) as { points: LockerPoint[]; place: string | null };
      setPoints(data.points);
      setPlace(data.place);
      setState("done");
    } catch {
      setPoints([]);
      setState("error");
    }
  }, []);

  // Search as they type. A locker picker that waits for Enter or a button press
  // is a picker half the customers never see results from — and it removes any
  // dependence on Enter inside the surrounding payment <form>.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) return;
    const t = setTimeout(() => void search(`q=${encodeURIComponent(q)}`), 350);
    return () => clearTimeout(t);
  }, [query, search]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        void search(`lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
      },
      // Denied or unavailable is not an error worth shouting about — the text
      // search is right there.
      () => setLocating(false),
      { timeout: 8000, maximumAge: 300000 },
    );
  };

  // Create the map once, after Leaflet's CSS is in.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !mapEl.current || map.current) return;
      // Centred on Poland until the first search.
      map.current = L.map(mapEl.current, { scrollWheelZoom: false, attributionControl: true }).setView(
        [52.0, 19.4],
        5,
      );
      L.tileLayer(TILE_URL, { maxZoom: 18, attribution: ATTRIBUTION }).addTo(map.current);
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Redraw markers whenever the result set or the selection changes.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const L = await import("leaflet");
      const m = map.current;
      if (cancelled || !m) return;

      markers.current.forEach((mk) => mk.remove());
      markers.current = [];
      if (!points.length) return;

      points.forEach((p, i) => {
        const selected = value?.code === p.code;
        const marker = L.marker([p.lat, p.lng], {
          icon: L.divIcon({
            html: pinHtml(selected, String(i + 1)),
            className: "",
            iconSize: [28, 36],
            iconAnchor: [14, 36],
          }),
          zIndexOffset: selected ? 1000 : 0,
          keyboard: true,
          alt: `${p.code}, ${p.street}`,
        })
          .addTo(m)
          .on("click", () => onSelect(p));
        markers.current.push(marker);
      });

      m.fitBounds(
        points.map((p) => [p.lat, p.lng] as [number, number]),
        { padding: [36, 36], maxZoom: 15 },
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [points, value, onSelect]);

  // Pan to a point chosen from the list so the map agrees with the list.
  useEffect(() => {
    if (value && map.current) map.current.panTo([value.lat, value.lng]);
  }, [value]);

  return (
    <div className="mt-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="locker-search">
          Miasto lub kod pocztowy
        </label>
        <input
          id="locker-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          // Results arrive on a debounce, so Enter has nothing to trigger — but it
          // must never reach the surrounding checkout <form> and submit the order.
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          enterKeyHint="search"
          autoComplete="postal-code"
          placeholder="Miasto lub kod pocztowy"
          className="w-full rounded-[12px] border border-line bg-paper px-4 py-3 text-base outline-none focus:border-ink md:text-sm"
        />
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="whitespace-nowrap rounded-[12px] border border-line px-4 py-3 text-sm text-ink transition hover:border-ink disabled:opacity-50"
        >
          {locating ? "Lokalizuję…" : "Blisko mnie"}
        </button>
      </div>

      <div
        ref={mapEl}
        role="application"
        aria-label="Mapa paczkomatów"
        className="mt-3 h-[280px] w-full overflow-hidden rounded-[14px] border border-line md:h-[320px]"
      />

      {state === "error" && (
        <p role="alert" className="mt-3 text-sm text-terracotta">
          Nie udało się pobrać listy Paczkomatów. Sprawdź połączenie i spróbuj ponownie albo wpisz kod Paczkomatu
          ręcznie poniżej.
        </p>
      )}

      {state === "done" && !points.length && (
        <p role="status" className="mt-3 text-sm text-stone">
          Nie znaleźliśmy paczkomatów dla „{query}”. Spróbuj wpisać kod pocztowy.
        </p>
      )}

      {points.length > 0 && (
        <>
          <p className="mt-3 text-xs text-stone">
            {place ? `Najbliższe paczkomaty – ${place}.` : "Najbliższe paczkomaty."} Wybierz punkt na mapie lub z listy.
          </p>
          <ul className="mt-2 max-h-[260px] divide-y divide-line overflow-y-auto rounded-[14px] border border-line">
            {points.map((p, i) => {
              const selected = value?.code === p.code;
              return (
                <li key={p.code}>
                  <button
                    type="button"
                    onClick={() => onSelect(p)}
                    aria-pressed={selected}
                    className={cn(
                      "flex w-full items-start gap-3 px-3 py-3 text-left transition-colors",
                      selected ? "bg-terracotta/10" : "hover:bg-linen/50",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.7rem] font-semibold",
                        selected ? "bg-ink text-paper" : "bg-terracotta text-paper",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink">
                        {p.street}
                        {p.description && <span className="font-normal text-stone"> · {p.description}</span>}
                      </span>
                      <span className="mt-0.5 block text-xs text-stone">
                        {p.postCode} {p.city} · {p.code}
                        {p.hours && ` · ${p.hours}`}
                      </span>
                    </span>
                    {typeof p.distance === "number" && (
                      <span className="shrink-0 text-xs tabular-nums text-stone">
                        {p.distance < 1000 ? `${p.distance} m` : `${(p.distance / 1000).toFixed(1)} km`}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

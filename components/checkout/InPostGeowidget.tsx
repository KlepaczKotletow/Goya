"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import type { LockerPoint } from "@/lib/inpost";

// InPost's own Geowidget — their map, their branding, their data.
//
// Only mounted when NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN is set; otherwise the
// checkout falls back to our own map over the same public ShipX points. The
// token comes from manager.paczkomaty.pl and is designed to be public, but it
// is locked to a referrer domain, so it works on okularygoya.pl and not on
// per-deploy Vercel preview URLs.
//
// THE ELEMENT MUST NOT BE WRITTEN IN JSX. React 19 assigns unknown props to a
// custom element as properties when the key exists on it (`key in domElement`),
// and this element declares token/language/config/onpoint as getter-only
// accessors in a "use strict" bundle — so `<inpost-geowidget token={…}>` throws
// during commit and unmounts the tree. It only misbehaves once the script is
// already loaded (second mount, client nav, warm cache), which is exactly the
// case local testing misses. Creating the node and calling setAttribute avoids
// the property path entirely.

const TOKEN = process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN;
export const hasGeowidget = Boolean(TOKEN);

/** The widget hands back a ShipX point, the same shape our own API returns. */
type ShipXPoint = {
  name?: string;
  location?: { latitude?: number; longitude?: number };
  address_details?: { street?: string; building_number?: string; post_code?: string; city?: string };
  opening_hours?: string;
  location_description?: string;
};

function toLockerPoint(p: ShipXPoint): LockerPoint | null {
  const lat = p.location?.latitude;
  const lng = p.location?.longitude;
  if (!p.name || typeof lat !== "number" || typeof lng !== "number") return null;
  const d = p.address_details ?? {};
  return {
    code: p.name,
    street: [d.street, d.building_number].filter(Boolean).join(" "),
    postCode: d.post_code ?? "",
    city: d.city ?? "",
    lat,
    lng,
    hours: p.opening_hours ?? "",
    description: p.location_description ?? "",
  };
}

export default function InPostGeowidget({ onSelect }: { onSelect: (p: LockerPoint) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  // Kept in a ref so the mount effect never re-runs and re-creates the element:
  // its disconnectedCallback removes a freshly-allocated arrow function, so it
  // never actually detaches its `message` listener. Every remount leaks one.
  const handler = useRef(onSelect);
  // Kept current in an effect, not during render — a ref write during render is
  // a side effect and React may discard or replay that render.
  useEffect(() => {
    handler.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    let el: HTMLElement | null = null;

    const mount = () => {
      if (mounted.current || !host.current || !customElements.get("inpost-geowidget")) return;
      mounted.current = true;

      el = document.createElement("inpost-geowidget");
      el.setAttribute("token", TOKEN!);
      el.setAttribute("language", "pl");
      // Prepaid parcels collected by the customer — not send-only points.
      el.setAttribute("config", "parcelCollect");
      // Load-bearing: the element gates incoming postMessages on
      // `event.data.eventTarget === this.id`.
      el.id = "goya-geowidget";
      // An unknown element is display:inline with no height, and the iframe is
      // sized as a percentage of it, so without this the map is invisible.
      el.style.display = "block";
      el.style.height = "100%";

      // Preferred over the `onpoint` attribute: that resolves a *global* by
      // name, whereas this callback list runs first and needs no globals.
      el.addEventListener("inpost.geowidget.init", (e) => {
        const api = (e as CustomEvent).detail?.api;
        api?.addPointSelectedCallback?.((raw: ShipXPoint) => {
          const point = toLockerPoint(raw);
          if (point) handler.current(point);
        });
      });

      host.current.appendChild(el);
    };

    mount();
    void customElements.whenDefined("inpost-geowidget").then(mount);

    return () => {
      el?.remove();
      mounted.current = false;
    };
  }, []);

  return (
    <>
      {/* afterInteractive, not beforeInteractive: the latter must live in the
          root layout, which would pull InPost's script onto every page.
          next/script dedupes by src, so this loads once. */}
      <Script src="https://geowidget.inpost.pl/inpost-geowidget.js" strategy="afterInteractive" />
      <div
        ref={host}
        aria-label="Mapa Paczkomatów InPost"
        // svh rather than vh so the iOS URL bar collapsing does not jump the map.
        className="mt-3 h-[min(70svh,520px)] w-full overflow-hidden rounded-[14px] border border-line"
      />
    </>
  );
}

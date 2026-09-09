import { ImageResponse } from "next/og";
import { LOGO_LOCKUP } from "@/content/logo";

export const alt = "Goya — okulary z polaryzacją i UV400";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded default OG card for the homepage and any route without its own image.
// Copy is kept diacritic-free because next/og's default font lacks some Polish glyphs.
//
// The wordmark goes in as an <img> data URI, not as text: next/og has no access to the
// brand face, and satori cannot render a JSX <svg> — but it does hand an <img> SVG
// straight to resvg, which honours the evenodd fill the traced outlines need.
const LOGO_SRC = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_LOCKUP.viewBox}"><path fill="#d97757" fill-rule="evenodd" d="${LOGO_LOCKUP.d}"/></svg>`,
).toString("base64")}`;

const LOGO_W = 560;
const LOGO_H = Math.round((LOGO_W * LOGO_LOCKUP.height) / LOGO_LOCKUP.width);

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f0eee6",
          color: "#141413",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 8, color: "#66635b" }}>
          POLARYZACJA · UV400
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <img src={LOGO_SRC} width={LOGO_W} height={LOGO_H} alt="Goya" />
          <div style={{ display: "flex", fontSize: 44, marginTop: 40, color: "#141413" }}>
            <span>Okulary z</span>
            <span style={{ color: "#d97757", marginLeft: 12 }}>polaryzacja</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#66635b" }}>
          <span>Okulary zaprojektowane w Polsce</span>
          <span>od 349 zl</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

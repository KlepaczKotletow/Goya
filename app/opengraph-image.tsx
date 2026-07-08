import { ImageResponse } from "next/og";

export const alt = "Goya — okulary z polaryzacją i UV400";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded default OG card for the homepage and any route without its own image.
// Copy is kept diacritic-free because next/og's default font lacks some Polish glyphs.
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
          <div style={{ fontSize: 180, fontWeight: 700, lineHeight: 1, letterSpacing: -4 }}>Goya</div>
          <div style={{ display: "flex", fontSize: 44, marginTop: 16, color: "#141413" }}>
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

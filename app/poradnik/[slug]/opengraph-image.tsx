import { ImageResponse } from "next/og";
import { getGuide, listGuides } from "@/lib/guides";

export const alt = "Goya — poradnik o okularach";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}

// next/og's default font lacks Polish glyphs — strip diacritics so the title renders cleanly.
function deburr(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L");
}

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  const title = deburr(g?.h1 ?? "Poradnik Goya");
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
          PORADNIK · GOYA
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1040 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#66635b" }}>
          <span>Jak dobrac dobre okulary</span>
          <span>goya.pl</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";

export const metadata: Metadata = {
  title: "Kasa",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="wrap py-10 md:py-14">
      <h1 className="mb-8 font-display text-4xl md:text-5xl">Kasa</h1>
      <Checkout />
    </div>
  );
}

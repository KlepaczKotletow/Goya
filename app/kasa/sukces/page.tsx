import type { Metadata } from "next";
import { CheckoutSuccess } from "@/components/CheckoutSuccess";

export const metadata: Metadata = {
  title: "Dziękujemy za zamówienie",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="wrap">
      <CheckoutSuccess />
    </div>
  );
}

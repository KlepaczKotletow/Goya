"use client";
import { Accordion } from "../Accordion";
import { FAQS } from "@/content/site";

export function Faq() {
  return (
    <section className="wrap py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">Najczęstsze pytania</h2>
        </div>
        <Accordion items={FAQS.map((f) => ({ title: f.q, content: f.a }))} defaultOpen={-1} />
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { facets } from "@/lib/products";
import { TRUST_STATS } from "@/content/site";

export const metadata: Metadata = {
  title: "O marce Goya — polska marka okularów z polaryzacją",
  description:
    "Goya to polska marka okularów: prawdziwy filtr polaryzacyjny i UV400, czysty design i uczciwa cena bez dopłaty za logo. Poznaj naszą historię.",
  alternates: { canonical: "/o-marce" },
};

const values = [
  { t: "Polaryzacja, nie marketing", d: "Każdy model przeciwsłoneczny ma realny filtr polaryzacyjny — mniej odblasków, większy kontrast, mniej zmęczone oczy." },
  { t: "UV400 w standardzie", d: "Pełna ochrona przed promieniowaniem UVA i UVB — w każdej parze, bez wyjątków." },
  { t: "Uczciwa cena", d: "Płacisz za soczewki, oprawę i projekt — nie za logo. To nasza zasada od pierwszego modelu." },
  { t: "Zaprojektowane w Polsce", d: "Fasony dobieramy pod realne twarze i realne życie — od miasta po wakacje." },
];

export default function Page() {
  return (
    <>
      {/* INTRO */}
      <section className="wrap grid items-center gap-10 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-20">
        <Reveal>
          <p className="eyebrow">O marce</p>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.95]">
            Dobre okulary nie muszą kosztować <span className="italic text-terracotta">fortuny</span>.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
            Goya to polska marka okularów stworzona wokół jednego przekonania: jakość soczewek, lekkość oprawy i czysty,
            ponadczasowy design powinny być dostępne bez dopłaty za metkę. Nie ścigamy się na logotypy — projektujemy
            okulary, które dobrze wyglądają, dobrze chronią i dobrze leżą.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
            <Image src="/hero/campaign-duo.jpg" alt="Goya — para w okularach" fill sizes="(max-width:768px) 100vw, 45vw" className="object-cover" />
          </div>
        </Reveal>
      </section>

      {/* FULL-WIDTH IMAGE BAND */}
      <section className="wrap pb-16 md:pb-24">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] sm:aspect-[16/9]">
            <Image src="/hero/campaign-terrace.jpg" alt="Goya — w prawdziwym życiu" fill sizes="(max-width:1320px) 100vw, 1320px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
            <p className="absolute bottom-0 max-w-md p-7 font-display text-2xl text-paper md:p-10 md:text-4xl">
              Okulary na pełne słońce i całe lato.
            </p>
          </div>
        </Reveal>
      </section>

      {/* VALUES */}
      <section className="border-y border-line bg-paper py-16 md:py-24">
        <div className="wrap">
          <Reveal className="mb-12">
            <p className="eyebrow">Dlaczego Goya</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Cztery rzeczy, na których nie idziemy na skróty</h2>
          </Reveal>
          <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.06}>
                <p className="font-display text-2xl md:text-3xl">
                  <span className="mr-3 text-terracotta">0{i + 1}</span>
                  {v.t}
                </p>
                <p className="mt-3 max-w-md leading-relaxed text-ink-soft">{v.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POLARIZATION EXPLAINER */}
      <section className="wrap grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
            <Image src="/hero/sun-women.jpg" alt="Goya — okulary z polaryzacją" fill sizes="(max-width:768px) 100vw, 45vw" className="object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">Polaryzacja</p>
          <h2 className="mt-3 font-display text-3xl leading-tight md:text-[2.6rem]">Co naprawdę robi filtr polaryzacyjny?</h2>
          <p className="mt-5 leading-relaxed text-ink-soft">
            Polaryzacja to nie „ciemniejsze szkło". To filtr, który wycina poziome odblaski odbite od jezdni, wody i śniegu.
            Efekt? Wyższy kontrast, żywsze kolory i oczy, które nie męczą się po godzinie w słońcu.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-terracotta" /> Mniej odblasków za kierownicą i nad wodą</li>
            <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-terracotta" /> Wyraźniejszy obraz i lepszy kontrast</li>
            <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-terracotta" /> Pełna ochrona UV400 w każdej parze</li>
          </ul>
        </Reveal>
      </section>

      {/* STATS */}
      <section className="border-y border-line bg-ink text-paper">
        <div className="wrap grid grid-cols-2 gap-8 py-14 md:grid-cols-4 md:py-16">
          {TRUST_STATS.map((s) => (
            <Reveal key={s.label}>
              <p className="font-display text-4xl text-paper md:text-5xl">{s.value}</p>
              <p className="mt-2 text-xs text-paper/60">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="wrap grid gap-6 py-16 text-center md:py-24">
        <Reveal>
          <p className="font-display text-3xl md:text-5xl">{facets.count} modeli. Jeden standard jakości.</p>
          <p className="mx-auto mt-4 max-w-xl text-ink-soft">
            Od kocich oczu po aviatory, od miejskich oprawek korekcyjnych po wakacyjne lustrzanki.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <ButtonLink href="/okulary" variant="accent" size="lg">Zobacz kolekcję</ButtonLink>
            <ButtonLink href="/przeciwsloneczne" variant="outline" size="lg">Przeciwsłoneczne</ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { getBestsellers, getByCategory, facets } from "@/lib/products";
import { imageAt } from "@/lib/utils";
import { ButtonLink } from "@/components/Button";
import { ProductGrid } from "@/components/ProductGrid";
import { Reveal } from "@/components/Reveal";
import { RiseWord } from "@/components/RiseWord";
import { Marquee } from "@/components/Marquee";
import { LookbookFeed } from "@/components/LookbookFeed";
import { Seal } from "@/components/Seal";
import { ArrowIcon, SunIcon, ShieldIcon, CheckIcon, ReturnIcon } from "@/components/icons";
import { SHAPE_LABELS, REASSURANCE } from "@/content/site";
import { SHAPE_COLLECTION } from "@/lib/collections";

export default function Home() {
  const bestsellers = getBestsellers(8);
  const hero = bestsellers[0];
  const heroImg = hero ? imageAt(hero.images, 0) : null;
  const sun = getByCategory("sun", 1)[0];
  const optical = getByCategory("optical", 1)[0];
  const shapeTiles = ["Aviator", "Kocie", "Prostokątne", "Okrągłe", "Muchy", "Nerdy"]
    .map((s) => ({ shape: s, product: getBestsellers(200).find((p) => p.shape === s && imageAt(p.images, 0)) }))
    .filter((t) => t.product);

  return (
    <>
      {/* HERO - sky / freedom */}
      <section className="relative h-[90vh] min-h-[560px] w-full overflow-hidden">
        <Image src="/hero/sky-hero.jpg" alt="Goya - okulary z polaryzacją" fill priority sizes="100vw" className="object-cover object-[72%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/45 via-ink/10 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="wrap w-full">
            <div className="max-w-2xl">
              <Reveal immediate>
                <p className="text-[0.72rem] uppercase tracking-[0.25em] text-paper/90">Polaryzacja · UV400</p>
              </Reveal>
              <h1 className="mt-4 font-display text-[clamp(3.4rem,9.5vw,7rem)] leading-[0.84] text-paper">
                <RiseWord delay={0.08}>Patrz</RiseWord>
                <br />
                <RiseWord delay={0.18} className="italic text-terracotta">szerzej.</RiseWord>
              </h1>
              <Reveal immediate delay={0.3}>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/90">
                  Polaryzacyjne soczewki tną odblaski i wyostrzają każdy detal. Lekkie oprawy projektowane w Polsce - od 349 zł.
                </p>
              </Reveal>
              <Reveal immediate delay={0.38}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href="/okulary" variant="accent" size="lg">Odkryj kolekcję</ButtonLink>
                  <Link href="/przeciwsloneczne" className="inline-flex h-12 items-center justify-center rounded-full border border-paper/60 px-8 text-[0.95rem] font-medium text-paper transition hover:bg-paper hover:text-ink">
                    Przeciwsłoneczne
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {hero && heroImg && (
          <div className="absolute bottom-10 right-[6%] z-10 hidden md:block">
            <Reveal immediate delay={0.5}>
              <div className="w-64 rounded-[22px] border border-white/25 bg-[rgba(250,249,245,0.14)] p-4 text-paper shadow-[0_24px_60px_-18px_rgba(38,34,31,0.6)] ring-1 ring-inset ring-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[14px] bg-paper">
                    <Image src={heroImg} alt={hero.name} fill sizes="56px" className="object-contain p-1.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg leading-tight">Goya {hero.name}</p>
                    <p className="text-xs text-paper/80">Polaryzacja · UV400</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm">od <strong>349 zł</strong></span>
                  <Link href={`/okulary/${hero.slug}`} className="rounded-full bg-paper px-4 py-1.5 text-xs font-medium text-ink transition hover:bg-terracotta hover:text-paper">Zobacz</Link>
                </div>
              </div>
            </Reveal>
          </div>
        )}

        {/* Signature - the rotating Goya seal (decorative: must never intercept clicks on the CTAs underneath) */}
        <div className="pointer-events-none absolute bottom-10 left-[6%] z-10 hidden lg:block">
          <Reveal immediate delay={0.6}>
            <Seal className="h-28 w-28 text-paper/85" letterSizeClassName="text-3xl" />
          </Reveal>
        </div>
      </section>

      <Marquee items={["Filtr polaryzacyjny", "UV400", "Zaprojektowane w Polsce", "30 dni na zwrot", "Lekkie oprawy", "Darmowa wysyłka"]} />

      {/* BESTSELLERS */}
      <section className="wrap py-16 md:py-24">
        <Reveal className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Najczęściej wybierane</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Bestsellery</h2>
          </div>
          <Link href="/okulary" className="hidden items-center gap-1.5 text-sm link-underline sm:inline-flex">
            Zobacz wszystkie <ArrowIcon />
          </Link>
        </Reveal>
        <ProductGrid products={bestsellers} priorityCount={4} stagger />
      </section>

      {/* LOOKBOOK — "Tak się je nosi" UGC feed */}
      <LookbookFeed />

      {/* BRAND TEASER — "Nasza historia" */}
      <section className="border-t border-line bg-paper">
        <div className="wrap grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
              <Image src="/hero/campaign-duo.jpg" alt="Goya - para w okularach" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Nasza historia</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.04] md:text-[3rem]">
              Dobre okulary nie&nbsp;muszą kosztować <span className="italic text-terracotta">fortuny</span>.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Goya powstała z prostego przekonania: jakość soczewek, lekkość oprawy i czysty design powinny być dostępne bez
              dopłaty za metkę. Każdy model dobieramy pod realne twarze i realne życie.
            </p>
            <ButtonLink href="/o-marce" variant="ghost" className="mt-5 px-0">
              Poznaj markę <ArrowIcon />
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* EDITORIAL LIFESTYLE BAND */}
      <section className="wrap pb-16 md:pb-24">
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] sm:aspect-[16/10]">
            <Image src="/hero/campaign-terrace.jpg" alt="Goya - w prawdziwym życiu" fill sizes="(max-width:1320px) 100vw, 1320px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute bottom-0 max-w-lg p-7 md:p-12">
              <h2 className="font-display text-3xl leading-[1.05] text-paper md:text-5xl">Zaprojektowane na prawdziwe życie.</h2>
              <p className="mt-3 max-w-sm text-paper/85">
                Od porannych dojazdów po wakacyjne popołudnia - okulary, które chronią i dobrze wyglądają.
              </p>
              <ButtonLink href="/okulary" variant="accent" className="mt-6">Zobacz kolekcję</ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CATEGORY SPLIT */}
      <section className="wrap grid gap-5 pb-16 md:grid-cols-2 md:pb-24">
        {[
          { p: sun, href: "/przeciwsloneczne", label: "Przeciwsłoneczne", sub: `${facets.sun} modeli z polaryzacją`, tint: "radial-gradient(120% 100% at 30% 0%, #e3ddd0, #d9cfbc)" },
          { p: optical, href: "/korekcyjne", label: "Korekcyjne", sub: `${facets.optical} oprawek na każdy dzień`, tint: "radial-gradient(120% 100% at 30% 0%, #ece7dc, #e7e2d6)" },
        ].map((c) => (
          <Reveal key={c.href}>
            <Link href={c.href} className="group relative block overflow-hidden rounded-[22px]">
              <div className="flex aspect-[4/3] flex-col" style={{ background: c.tint }}>
                <div className="relative min-h-0 flex-1">
                  {c.p && imageAt(c.p.images, 0) && (
                    <Image src={imageAt(c.p.images, 0) as string} alt={c.label} fill sizes="(max-width:768px) 100vw, 50vw" className="object-contain p-7 md:p-10 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105" />
                  )}
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl">{c.label}</h3>
                  <p className="mt-1 text-sm text-ink/70">{c.sub}</p>
                  <span className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-medium">
                    Odkryj <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>

      {/* SHOP BY SHAPE */}
      <section className="wrap py-16 md:py-24">
        <Reveal className="mb-10">
          <p className="eyebrow">Po kształcie</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">Znajdź swój fason</h2>
          <p className="mt-3 max-w-md text-ink-soft">Sześć fasonów dopasowanych do kształtu twarzy.</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {shapeTiles.map((t, i) => (
            <Reveal key={t.shape} delay={i * 0.05}>
              <Link href={`/kolekcje/${SHAPE_COLLECTION[t.shape] ?? "okulary-aviator"}`} className="group block">
                <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[var(--radius)] bg-linen">
                  <Image src={imageAt(t.product!.images, 0) as string} alt={t.shape} fill sizes="(max-width:768px) 50vw, 16vw" className="object-contain p-6 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110" />
                </div>
                <p className="mt-3 text-center font-display text-lg">{SHAPE_LABELS[t.shape] ?? t.shape}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* REASSURANCE - trust band */}
      <section className="border-t border-line bg-paper">
        <div className="wrap grid grid-cols-2 gap-x-6 gap-y-10 py-16 md:grid-cols-4 md:gap-x-0 md:divide-x md:divide-line">
          {REASSURANCE.map((r, i) => {
            const Icon = [SunIcon, ShieldIcon, CheckIcon, ReturnIcon][i] ?? CheckIcon;
            return (
              <Reveal key={r.title} delay={i * 0.06} className="md:px-8 md:first:pl-0 md:last:pr-0">
                <Icon className="text-terracotta" />
                <p className="mt-3 font-display text-lg">{r.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{r.text}</p>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}

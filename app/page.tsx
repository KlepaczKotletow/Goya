import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { getAllProducts, getBestsellers, facets } from "@/lib/products";
import { plural } from "@/lib/utils";
import { premiumPrice, formatPLN } from "@/lib/pricing";
import { ButtonLink } from "@/components/Button";
import { ProductRail } from "@/components/ProductRail";
import { Reveal } from "@/components/Reveal";
import { RiseWord } from "@/components/RiseWord";
import { Geotag } from "@/components/Geotag";
import { ArrowIcon } from "@/components/icons";
import { COLLECTIONS, REASSURANCE, TECH_SPECS, REVIEWS } from "@/content/site";

/* Lookbook — each photo links to the collection whose frames it shows. */
const LOOKBOOK = [
  { src: "/hero/lifestyle-muchy-w.jpg", geo: ["Cala d'Or", "18:44"], label: "Vela", href: "/przeciwsloneczne?shape=Muchy" },
  { src: "/hero/lifestyle-nerdy-m.jpg", geo: ["Ronda", "17:21"], label: "Nerdy", href: "/okulary?shape=Nerdy" },
  { src: "/hero/lifestyle-okragle-w.jpg", geo: ["Palamós", "10:05"], label: "Luna", href: "/okulary?shape=Okr%C4%85g%C5%82e" },
  { src: "/hero/lifestyle-prostokatne-w.jpg", geo: ["Vejer", "16:02"], label: "Faro", href: "/okulary?shape=Prostok%C4%85tne" },
];

/* Art-directed hero: 16:9 golden-hour promenade on desktop, 9:16 rooftop portrait on mobile. */
function HeroPicture() {
  const common = { alt: "Goya — okulary przeciwsłoneczne w hiszpańskim świetle", sizes: "100vw" };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, width: 2000, height: 1125, src: "/hero/hero-luz.jpg" });
  const {
    props: { srcSet: mobile, alt, ...rest },
  } = getImageProps({ ...common, width: 1125, height: 2000, src: "/hero/hero-luz-mobile.jpg" });
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop} />
      <img
        {...rest}
        srcSet={mobile}
        alt={alt}
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[50%_38%] md:object-[62%_center]"
      />
    </picture>
  );
}

export default function Home() {
  const all = getAllProducts();
  const bestsellers = getBestsellers(8);
  const sunPicks = bestsellers.filter((p) => p.category === "sun").slice(0, 2);
  const collections = COLLECTIONS.map((c) => ({
    ...c,
    count: all.filter(
      (p) => (!c.category || p.category === c.category) && (!c.shape || p.shape === c.shape),
    ).length,
  }));

  return (
    <>
      {/* HERO — Światło i luz */}
      <section className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-[86svh] md:min-h-[600px]">
          <HeroPicture />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-mar-deep/45 via-mar-deep/10 to-transparent md:block" />
          <Geotag place="Cadaqués" time="19:42" />
          {/* Desktop copy over the photo */}
          <div className="absolute inset-0 hidden items-end md:flex">
            <div className="wrap w-full pb-16">
              <div className="max-w-2xl">
                <Reveal immediate>
                  <p className="geotag text-white/90">Polaryzacja · UV400 · Zaprojektowane w Polsce</p>
                </Reveal>
                <h1 className="mt-4 text-[clamp(3.2rem,7.5vw,6.2rem)] leading-[0.98] text-white [text-shadow:0_2px_28px_rgba(18,48,63,0.35)]">
                  <RiseWord delay={0.08}>Światło</RiseWord>{" "}
                  <RiseWord delay={0.18} className="italic">i luz.</RiseWord>
                </h1>
                <Reveal immediate delay={0.3}>
                  <p className="mt-5 max-w-md text-lg leading-relaxed text-white/90">
                    Okulary z polaryzacją i UV400 w standardzie — na miasto, podróż i długie popołudnia na słońcu. Od 349 zł.
                  </p>
                </Reveal>
                <Reveal immediate delay={0.38}>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink href="/#kolekcje" variant="accent" size="lg">Poznaj kolekcje</ButtonLink>
                    <ButtonLink
                      href="/przeciwsloneczne"
                      size="lg"
                      className="border border-white/60 bg-transparent text-white hover:bg-white hover:text-ink"
                    >
                      Przeciwsłoneczne
                    </ButtonLink>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile copy below the photo, on solid ivory */}
        <div className="wrap pb-2 pt-7 md:hidden">
          <p className="geotag text-stone">Polaryzacja · UV400 · Zaprojektowane w Polsce</p>
          <h1 className="mt-3 text-[clamp(2.9rem,13vw,3.6rem)] leading-[1]">
            Światło <span className="italic">i luz.</span>
          </h1>
          <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
            Okulary z polaryzacją i UV400 w standardzie — na miasto, podróż i długie popołudnia na słońcu. Od 349 zł.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-2.5">
            <ButtonLink href="/#kolekcje" variant="accent" size="lg" className="w-full">Poznaj kolekcje</ButtonLink>
            <ButtonLink href="/przeciwsloneczne" variant="outline" size="lg" className="w-full">Przeciwsłoneczne</ButtonLink>
          </div>
        </div>
      </section>

      <div className="wrap mt-10 md:mt-0"><hr className="horizon" /></div>

      {/* SPIS KOLEKCJI — magazine table of contents */}
      <section id="kolekcje" className="wrap scroll-mt-24 py-14 md:py-24">
        <Reveal className="mb-8 flex items-end justify-between gap-4 md:mb-12">
          <div>
            <p className="eyebrow">Kolekcje · Lato 2026</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Spis treści lata</h2>
          </div>
          <p className="hidden max-w-[15rem] text-right text-sm text-ink-soft sm:block">
            Sześć kolekcji nazwanych po hiszpańsku — jak wakacje, które się nie kończą.
          </p>
        </Reveal>
        <div className="border-t border-line">
          {collections.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.04}>
              <Link
                href={c.href}
                className="group grid min-h-[64px] grid-cols-[2.2rem_1fr_auto] items-center gap-3 border-b border-line py-4 pr-1 transition-colors duration-300 hover:bg-blask md:grid-cols-[3rem_1fr_1fr_auto] md:py-5"
              >
                <span className="geotag text-stone">0{i + 1}</span>
                <span className="min-w-0">
                  <span className="font-display text-3xl italic leading-none tracking-tight md:text-[2.6rem]">
                    {c.name}
                    <span className="ml-3 hidden align-middle text-xs not-italic tracking-normal text-stone lg:inline">
                      ({c.meaning})
                    </span>
                  </span>
                  <span className="mt-1.5 block truncate text-xs text-ink-soft md:hidden">{c.tagline}</span>
                </span>
                <span className="hidden text-sm text-ink-soft md:block">{c.tagline}</span>
                <span className="flex items-center gap-2 text-sm text-stone">
                  <span className="tabular-nums">{c.count} {plural(c.count, "model", "modele", "modeli")}</span>
                  <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1 group-hover:text-mar" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BESTSELLERY — snap rail */}
      <section className="wrap pb-16 md:pb-24">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Najczęściej wybierane</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Bestsellery</h2>
          </div>
          <Link href="/okulary" className="link-underline hidden items-center gap-1.5 text-sm sm:inline-flex">
            Zobacz wszystkie <ArrowIcon />
          </Link>
        </Reveal>
        <ProductRail products={bestsellers} priorityCount={2} />
        <Link href="/okulary" className="link-underline mt-6 inline-flex items-center gap-1.5 text-sm sm:hidden">
          Zobacz wszystkie <ArrowIcon />
        </Link>
      </section>

      {/* TECHNIKA BEZ WYKŁADU */}
      <section className="border-y border-line bg-paper">
        <div className="wrap grid items-center gap-10 py-14 md:grid-cols-2 md:gap-14 md:py-24">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]">
              <Image
                src="/hero/tech-macro.jpg"
                alt="Polaryzacyjna soczewka Goya z lustrzanym odbiciem w pełnym słońcu"
                fill
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover"
              />
              <Geotag place="Altea" time="16:10" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Technika bez wykładu</p>
            <h2 className="mt-3 text-3xl leading-[1.05] md:text-[2.6rem]">
              Polaryzacja i UV400 <span className="italic">w każdej parze.</span>
            </h2>
            <dl className="mt-7 border-t border-line">
              {TECH_SPECS.map((s) => (
                <div key={s.label} className="grid grid-cols-[minmax(8rem,auto)_1fr] gap-4 border-b border-line py-3.5 text-sm">
                  <dt className="font-semibold">{s.label}</dt>
                  <dd className="text-ink-soft">{s.value}</dd>
                </div>
              ))}
            </dl>
            <ButtonLink href="/o-marce" variant="ghost" className="mt-5 px-0">
              Jak działa polaryzacja <ArrowIcon />
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* REPORTAŻ — godzina złota (dark) */}
      <section className="bg-mar-deep text-bg">
        <div className="wrap py-14 md:py-24">
          <Reveal className="mb-8 md:mb-10">
            <p className="geotag text-sol">Reportaż · Costa de la Luz</p>
            <h2 className="mt-4 max-w-3xl text-3xl leading-[1.08] text-bg md:text-[2.9rem]">
              „Godzina złota trwa tu <span className="italic text-sol">cały dzień</span> — szkoda mrużyć oczy.”
            </h2>
          </Reveal>
          <Reveal>
            <div className="relative overflow-hidden rounded-[6px]">
              <div className="relative aspect-[4/5] sm:aspect-[16/9]">
                <Image
                  src="/hero/campaign-terrace.jpg"
                  alt="Kolacja na tarasie nad morzem o zachodzie słońca"
                  fill
                  sizes="(max-width:1320px) 100vw, 1320px"
                  className="object-cover"
                />
              </div>
              <Geotag place="Tarifa" time="20:37" />
              {/* Shoppable chips */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                {sunPicks.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/okulary/${p.slug}`}
                    className="flex min-h-[44px] items-center gap-2 rounded-[2px] bg-bg/95 px-3.5 py-2 text-ink shadow-lg backdrop-blur transition hover:bg-bg"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-sol" />
                    <span className="text-xs font-semibold">{p.name}</span>
                    <span className="font-display text-xs">{formatPLN(premiumPrice(p.priceWoo))}</span>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8">
              <ButtonLink
                href="/przeciwsloneczne"
                size="lg"
                className="border border-bg/50 bg-transparent text-bg hover:bg-bg hover:text-ink"
              >
                Zobacz przeciwsłoneczne
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DWA ŚWIATY — sun / optical doors */}
      <section className="wrap grid gap-5 py-14 md:grid-cols-2 md:py-24">
        {[
          {
            img: "/hero/sun-men.jpg",
            label: "Przeciwsłoneczne",
            sub: `${facets.sun} modeli z polaryzacją`,
            href: "/przeciwsloneczne",
            geo: ["Mallorca", "19:05"],
          },
          {
            img: "/hero/optical-women.jpg",
            label: "Korekcyjne · Alba",
            sub: `${facets.optical} oprawek na każdy dzień`,
            href: "/korekcyjne",
            geo: ["Nerja", "10:15"],
          },
        ].map((c, i) => (
          <Reveal key={c.href} delay={i * 0.06}>
            <Link href={c.href} className="group relative block overflow-hidden rounded-[6px]">
              <div className="relative aspect-[4/5] md:aspect-[3/4]">
                <Image
                  src={c.img}
                  alt={c.label}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mar-deep/70 via-mar-deep/10 to-transparent" />
                <Geotag place={c.geo[0]} time={c.geo[1]} className="bottom-auto top-4" />
                <div className="absolute bottom-0 p-6 text-white md:p-8">
                  <h3 className="text-3xl md:text-4xl">{c.label}</h3>
                  <p className="mt-1 text-sm text-white/80">{c.sub}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.08em]">
                    Odkryj <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>

      {/* LOOKBOOK — Goya w kadrze */}
      <section className="wrap pb-14 md:pb-24">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Lookbook · Lato 2026</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Goya w kadrze</h2>
          </div>
        </Reveal>
        <div className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:-mx-9 sm:px-9 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
          {LOOKBOOK.map((l, i) => (
            <Reveal key={l.src} delay={i * 0.05} className="w-[70%] shrink-0 snap-start md:w-auto">
              <Link href={l.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[6px]">
                  <Image
                    src={l.src}
                    alt={`Goya — ${l.label}`}
                    fill
                    sizes="(max-width:768px) 70vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mar-deep/50 via-transparent to-transparent" />
                  <Geotag place={l.geo[0]} time={l.geo[1]} className="bottom-auto top-4" />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 font-display text-lg italic text-white">
                    {l.label}
                    <ArrowIcon className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PAS ZAUFANIA */}
      <section className="border-y border-line bg-paper">
        <div className="wrap grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-4 md:py-12">
          {REASSURANCE.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.05}>
              <p className="text-sm font-semibold">{r.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{r.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* OPINIE JAK CYTATY */}
      <section className="wrap py-14 md:py-24">
        <Reveal className="mb-8 md:mb-12">
          <p className="eyebrow">Opinie</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Z listów do redakcji</h2>
        </Reveal>
        <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.05}>
              <hr className="horizon mb-6" />
              <blockquote className="font-display text-xl italic leading-snug md:text-2xl">„{r.text}”</blockquote>
              <p className="mt-4 text-sm text-stone">{r.name} · {r.city}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

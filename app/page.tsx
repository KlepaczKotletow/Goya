import Image from "next/image";
import Link from "next/link";
import { getBestsellers, getByCategory, facets } from "@/lib/products";
import { imageAt } from "@/lib/utils";
import { ButtonLink } from "@/components/Button";
import { ProductGrid } from "@/components/ProductGrid";
import { Reveal } from "@/components/Reveal";
import { RiseWord } from "@/components/RiseWord";
import { Marquee } from "@/components/Marquee";
import { ParallaxImage } from "@/components/Parallax";
import { ArrowIcon } from "@/components/icons";
import { SHAPE_LABELS, REASSURANCE } from "@/content/site";

const LOOKBOOK = [
  { src: "/hero/sun-women.jpg", label: "Przeciwsłoneczne", href: "/przeciwsloneczne" },
  { src: "/hero/optical-men.jpg", label: "Korekcyjne", href: "/korekcyjne" },
  { src: "/hero/sun-men.jpg", label: "Męskie", href: "/okulary?gender=M%C4%99skie" },
  { src: "/hero/optical-women.jpg", label: "Damskie", href: "/okulary?gender=Damskie" },
];

export default function Home() {
  const bestsellers = getBestsellers(8);
  const hero = bestsellers[0];
  const heroImg = hero ? imageAt(hero.images, 0) : null;
  const polarizedSun = getByCategory("sun").filter((p) => p.polarized).length;
  const shapeTiles = ["Aviator", "Kocie", "Prostokątne", "Okrągłe", "Muchy", "Nerdy"]
    .map((s) => ({ shape: s, product: getBestsellers(200).find((p) => p.shape === s && imageAt(p.images, 0)) }))
    .filter((t) => t.product);

  const splits = [
    { src: "/hero/sun-women.jpg", focal: "60% 30%", href: "/przeciwsloneczne", kicker: "Przeciwsłoneczne", title: "Tnij\nodblaski.", sub: `${polarizedSun} modeli z polaryzacją` },
    { src: "/hero/optical-men.jpg", focal: "50% 35%", href: "/korekcyjne", kicker: "Korekcyjne", title: "Patrz\nostro.", sub: `${facets.optical} oprawek na każdy dzień` },
  ];

  return (
    <>
      {/* ───────── HERO — full-bleed cinematic poster ───────── */}
      <section className="grain relative flex h-[100svh] min-h-[600px] w-full items-end overflow-hidden bg-ink">
        <ParallaxImage src="/hero/sky-hero.jpg" alt="Goya — okulary z polaryzacją" priority focal="80% 40%" range={6} />
        {/* cinematic scrims for type legibility */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-ink/85 via-ink/15 to-ink/30" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-ink/65 via-ink/5 to-transparent" />

        <div className="wrap relative z-[2] w-full pb-14 md:pb-20">
          <Reveal immediate>
            <p className="text-[0.72rem] uppercase tracking-[0.32em] text-paper/80">Polaryzacja · UV400 · Polska marka</p>
          </Reveal>
          <h1 className="display-poster mt-5 text-paper [text-shadow:0_4px_44px_rgba(10,10,14,0.45)] text-[clamp(3.6rem,13vw,11rem)]">
            <RiseWord delay={0.06}>Patrz</RiseWord>
            <br />
            <RiseWord delay={0.18} className="italic text-terracotta">szerzej.</RiseWord>
          </h1>
          <Reveal immediate delay={0.34} className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-lg leading-relaxed text-paper/90">
              Polaryzacyjne soczewki tną odblaski i wyostrzają każdy detal. Lekkie oprawy projektowane w Polsce — od 349 zł.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/okulary" variant="accent" size="lg">Odkryj kolekcję</ButtonLink>
              <Link
                href="/przeciwsloneczne"
                className="inline-flex h-12 items-center justify-center rounded-full border border-paper/50 px-8 text-[0.95rem] font-medium text-paper backdrop-blur-sm transition hover:bg-paper hover:text-ink"
              >
                Przeciwsłoneczne
              </Link>
            </div>
          </Reveal>
        </div>

        {/* floating product chip */}
        {hero && heroImg && (
          <div className="absolute right-[5%] top-[16%] z-[2] hidden lg:block">
            <Reveal immediate delay={0.6}>
              <Link
                href={`/okulary/${hero.slug}`}
                className="group block w-60 rounded-[22px] border border-white/25 bg-white/10 p-4 text-paper shadow-[0_24px_60px_-18px_rgba(10,10,14,0.7)] backdrop-blur-md transition hover:bg-white/15"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[14px] bg-paper">
                    <Image src={heroImg} alt={hero.name} fill sizes="56px" className="object-contain p-1.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg leading-tight">Goya {hero.name}</p>
                    <p className="text-xs text-paper/80">Bestseller · Polaryzacja</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm">od <strong>349 zł</strong></span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-paper px-4 py-1.5 text-xs font-medium text-ink transition group-hover:bg-terracotta group-hover:text-paper">
                    Zobacz <ArrowIcon className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        )}

        {/* scroll cue */}
        <div className="absolute bottom-7 right-[5%] z-[2] hidden items-center gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-paper/70 md:flex">
          Przewiń
          <span className="relative block h-12 w-px bg-paper/40">
            <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 animate-[scroll-cue_2.2s_ease-in-out_infinite] bg-paper motion-reduce:hidden" />
          </span>
        </div>
      </section>

      <Marquee
        variant="bold"
        items={["Filtr polaryzacyjny", "UV400", "Zaprojektowane w Polsce", "30 dni na zwrot", "Lekkie oprawy", "Darmowa wysyłka od 199 zł"]}
      />

      {/* ───────── MANIFESTO — oversized statement ───────── */}
      <section className="wrap py-20 md:py-32">
        <Reveal>
          <p className="eyebrow">Dlaczego Goya</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="display-poster mt-6 max-w-5xl text-[clamp(2.3rem,6.6vw,5.4rem)]">
            Dobre patrzenie nie jest <span className="italic text-rust">luksusem</span>. To codzienność.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
            Filtr polaryzacyjny w standardzie, lekka oprawa i ponadczasowy design — w cenie, która nie onieśmiela.
          </p>
        </Reveal>
      </section>

      {/* ───────── BESTSELLERS ───────── */}
      <section className="wrap pb-16 md:pb-24">
        <Reveal className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Najczęściej wybierane</p>
            <h2 className="mt-3 display-poster text-[clamp(2.4rem,6vw,4.5rem)]">Bestsellery</h2>
          </div>
          <Link href="/okulary" className="hidden items-center gap-1.5 text-sm link-underline sm:inline-flex">
            Zobacz wszystkie <ArrowIcon />
          </Link>
        </Reveal>
        <ProductGrid products={bestsellers} priorityCount={0} stagger />
      </section>

      {/* ───────── FULL-BLEED CAMPAIGN POSTER ───────── */}
      <section className="grain relative flex h-[90svh] min-h-[540px] w-full items-end overflow-hidden bg-ink">
        <ParallaxImage src="/hero/campaign-terrace.jpg" alt="Goya — kampania lato '26" focal="center" range={9} />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-ink/45 to-transparent" />
        <div className="wrap relative z-[2] w-full pb-14 md:pb-20">
          <Reveal>
            <p className="eyebrow text-paper/70">Lato &rsquo;26 · Kampania</p>
            <h2 className="display-poster mt-5 max-w-3xl text-paper [text-shadow:0_4px_40px_rgba(10,10,14,0.4)] text-[clamp(2.6rem,8vw,6.5rem)]">
              Zaprojektowane na&nbsp;prawdziwe życie.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/85">
              Od porannych dojazdów po wakacyjne popołudnia — okulary, które chronią i&nbsp;dobrze wyglądają.
            </p>
            <ButtonLink href="/okulary" variant="accent" size="lg" className="mt-8">Zobacz kolekcję</ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* ───────── FULL-BLEED SPLIT — sun / optical ───────── */}
      <section className="grid w-full grid-cols-1 md:grid-cols-2">
        {splits.map((c, i) => (
          <Link key={c.href} href={c.href} className="group relative flex h-[72svh] min-h-[460px] items-end overflow-hidden bg-ink">
            <Image
              src={c.src}
              alt={c.kicker}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              style={{ objectPosition: c.focal }}
              className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent transition-opacity duration-500 group-hover:from-ink/70" />
            <div className="relative z-[1] p-8 md:p-12">
              <p className="eyebrow text-paper/70">{c.kicker}</p>
              <h3 className="display-poster mt-3 whitespace-pre-line text-paper text-[clamp(2.4rem,5.5vw,4.5rem)]">{c.title}</h3>
              <p className="mt-3 text-sm text-paper/80">{c.sub}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-paper">
                Odkryj <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </div>
            <span className="pointer-events-none absolute right-6 top-6 z-[1] font-display text-lg text-paper/30">0{i + 1}</span>
          </Link>
        ))}
      </section>

      {/* ───────── SHOP BY SHAPE ───────── */}
      <section className="wrap py-16 md:py-24">
        <Reveal className="mb-10">
          <p className="eyebrow">Po kształcie</p>
          <h2 className="mt-3 display-poster text-[clamp(2.4rem,6vw,4.5rem)]">Znajdź swój fason</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {shapeTiles.map((t, i) => (
            <Reveal key={t.shape} delay={i * 0.05}>
              <Link href={`/okulary?shape=${encodeURIComponent(t.shape)}`} className="group block">
                <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[var(--radius)] bg-linen">
                  <Image src={imageAt(t.product!.images, 0) as string} alt={t.shape} fill sizes="(max-width:768px) 50vw, 16vw" className="object-contain p-6 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110" />
                </div>
                <p className="mt-3 text-center font-display text-lg">{SHAPE_LABELS[t.shape] ?? t.shape}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── LOOKBOOK ───────── */}
      <section className="border-y border-line bg-paper py-16 md:py-24">
        <div className="wrap">
          <Reveal className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Lookbook</p>
              <h2 className="mt-3 display-poster text-[clamp(2.4rem,6vw,4.5rem)]">Goya w kadrze</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {LOOKBOOK.map((l, i) => (
              <Reveal key={l.src} delay={i * 0.06}>
                <Link href={l.href} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[16px]">
                    <Image src={l.src} alt={l.label} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 font-display text-xl text-paper">
                      {l.label} <ArrowIcon className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── BRAND STORY — full-bleed editorial ───────── */}
      <section className="relative grid w-full items-stretch md:grid-cols-2">
        <div className="relative min-h-[60svh] overflow-hidden bg-clay md:min-h-[80svh]">
          <Image src="/hero/campaign-duo.jpg" alt="Goya — para w okularach" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="flex items-center bg-bg px-6 py-16 sm:px-10 md:px-14 md:py-24">
          <div className="max-w-xl">
            <p className="eyebrow">Nasza historia</p>
            <h2 className="mt-5 display-poster text-[clamp(2.2rem,5.4vw,4.2rem)]">
              Dobre okulary nie&nbsp;muszą kosztować <span className="italic text-rust">fortuny</span>.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              Goya powstała z prostego przekonania: jakość soczewek, lekkość oprawy i czysty design powinny być dostępne bez
              dopłaty za metkę. Każdy model dobieramy pod realne twarze i realne życie.
            </p>
            <ButtonLink href="/o-marce" variant="outline" className="mt-7">
              Poznaj markę <ArrowIcon />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ───────── CLOSING POSTER — giant wordmark ───────── */}
      <section className="grain relative w-full overflow-hidden bg-ink py-24 text-paper md:py-36">
        <div className="wrap relative z-[2] text-center">
          <Reveal>
            <p className="eyebrow text-paper/60">Polska marka okularów</p>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="display-poster mx-auto mt-6 max-w-5xl text-[clamp(2.3rem,6.4vw,5.2rem)]">
              Spójrz <span className="italic text-terracotta">inaczej</span> — od&nbsp;349&nbsp;zł.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <ButtonLink href="/okulary" variant="accent" size="lg" className="mt-10">Odkryj kolekcję</ButtonLink>
          </Reveal>
        </div>
        <span
          aria-hidden
          className="display-poster text-outline pointer-events-none absolute inset-x-0 -bottom-[6vw] z-0 text-center text-paper/15 text-[30vw] leading-none"
        >
          GOYA
        </span>
      </section>

      {/* ───────── REASSURANCE ───────── */}
      <section className="wrap grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-4">
        {REASSURANCE.map((r, i) => (
          <Reveal key={r.title} delay={i * 0.06}>
            <p className="font-display text-xl">{r.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.text}</p>
          </Reveal>
        ))}
      </section>
    </>
  );
}

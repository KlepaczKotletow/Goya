import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { GlassesIcon, ArrowIcon } from "./icons";

// Real-people / UGC shots — "this is how you wear them".
// Each card links to the CONCRETE model shown in the photo. Matches were made by
// visually comparing each frame against real packshots (see match/ montages);
// the two frames with no catalog equivalent were re-shot wearing the real model
// (packshot-referenced) so the photo genuinely matches the linked product.
type Shot = { src: string; model: string; slug: string; alt: string };

const SHOTS: Shot[] = [
  { src: "/ugc/ugc-duo.jpg", model: "G 193", slug: "goya-g-193-cz-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Kobieta w czarnych prostokątnych okularach przeciwsłonecznych Goya G 193, uśmiech w słońcu" },
  { src: "/ugc/ugc-cafe.jpg", model: "G 1905", slug: "goya-g1905-c1-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Mężczyzna w złotych aviatorach Goya G 1905 przy oknie kawiarni" },
  { src: "/ugc/ugc-oversized.jpg", model: "G 185", slug: "goya-g-185-cz-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Kobieta w dużych okularach przeciwsłonecznych Goya G 185 na tarasie kawiarni" },
  { src: "/ugc/ugc-mirror.jpg", model: "G 164", slug: "goya-g-164-cz-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Kobieta w czarnych prostokątnych okularach Goya G 164 — selfie w lustrze" },
  { src: "/ugc/ugc-car.jpg", model: "G 15217", slug: "goya-g-15217-cz-okulary-przeciwsloneczne-kocie-oczy-z-filtrem-polaryzacyjnym", alt: "Kobieta w okularach kocie oczy Goya G 15217 w samochodzie" },
  { src: "/ugc/ugc-street.jpg", model: "G 93304", slug: "goya-okulary-korekcyjne-g-93304-c2", alt: "Mężczyzna w przezroczystych okrągłych oprawkach korekcyjnych Goya G 93304 na ulicy" },
  { src: "/ugc/ugc-beach.jpg", model: "A 0736", slug: "goya-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym-goya-a-0736", alt: "Kobieta w okrągłych okularach przeciwsłonecznych Goya A 0736 na plaży o zachodzie słońca" },
  { src: "/ugc/ugc-tortoise.jpg", model: "G 1000", slug: "goya-okulary-przeciwsloneczne-z-filtrem-uv-g-1000-br", alt: "Mężczyzna w brązowych prostokątnych okularach przeciwsłonecznych Goya G 1000 na ulicy" },
  { src: "/ugc/ugc-round.jpg", model: "G 942115", slug: "goya-okulary-korekcyjne-g-942115-c1", alt: "Kobieta w okrągłych złotych oprawkach korekcyjnych Goya G 942115 przy herbacie" },
  { src: "/ugc/ugc-park.jpg", model: "G 182", slug: "goya-g-182-zx-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Kobieta w bursztynowych okularach przeciwsłonecznych Goya G 182 w parku" },
  { src: "/ugc/ugc-sofa.jpg", model: "G 89087", slug: "goya-okulary-korekcyjne-g-89087-c3", alt: "Mężczyzna w czarnych okrągłych oprawkach korekcyjnych Goya G 89087 w domu" },
];

const hrefFor = (s: Shot) => `/okulary/${s.slug}`;

export function LookbookFeed() {
  return (
    <section className="border-y border-line bg-paper py-16 md:py-24">
      <div className="wrap">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Prawdziwe kadry</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Tak się je nosi</h2>
            <p className="mt-2 max-w-md text-ink-soft">
              Prawdziwi ludzie, prawdziwe oprawy — bez retuszu i sesji. Dotknij kadru, żeby zobaczyć dokładny model.
            </p>
          </div>
          <Link
            href="/okulary"
            className="hidden items-center gap-2 rounded-full border border-ink/25 px-5 py-2.5 text-sm font-medium transition hover:bg-ink hover:text-paper sm:inline-flex"
          >
            Wszystkie okulary <ArrowIcon />
          </Link>
        </Reveal>
      </div>

      {/* full-bleed Instagram-style rail: buttery momentum + snap on touch */}
      <Reveal className="wrap">
        <ul
          className="ig-rail -mx-5 gap-3 px-5 pb-2 sm:-mx-9 sm:gap-4 sm:px-9"
          aria-label="Klienci Goya — zobacz podobne oprawy"
        >
          {SHOTS.map((shot) => (
            <li key={shot.src} className="w-[68vw] max-w-[300px] sm:w-[248px]">
              <Link
                href={hrefFor(shot)}
                aria-label={`Goya ${shot.model} — zobacz model`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-[18px] bg-linen"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(max-width:640px) 68vw, 248px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/5" />
                {/* shop-the-look tag: the glasses are the hero */}
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-ink/55 py-1.5 pl-2.5 pr-3 text-paper backdrop-blur-md">
                    <GlassesIcon className="h-4 w-4 shrink-0" />
                    <span className="truncate text-[0.8rem] font-medium leading-none">Goya {shot.model}</span>
                    <ArrowIcon className="h-3.5 w-3.5 shrink-0 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="wrap mt-8">
        <Reveal>
          <Link href="/okulary" className="inline-flex items-center gap-1.5 text-sm link-underline">
            Zobacz całą kolekcję <ArrowIcon />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

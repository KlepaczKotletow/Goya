import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { GlassesIcon, ArrowIcon } from "./icons";

// Real-people / UGC shots — "this is how you wear them".
// Each card links to the CONCRETE model shown in the photo. Every frame is
// generated packshot-referenced (nano_banana_2, the real product image as the
// reference) so the person genuinely wears the exact model you can buy.
// Labels use the model's display name (matches the PDP).
type Shot = { src: string; model: string; slug: string; alt: string };

const SHOTS: Shot[] = [
  { src: "/ugc/ugc-terrace.jpg", model: "Almendra", slug: "goya-g-205-z-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Kobieta w brązowych okularach kocie oczy Goya Almendra na słonecznym tarasie kawiarni" },
  { src: "/ugc/ugc-marina.jpg", model: "Noble", slug: "goya-g-189-czm-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Mężczyzna w czarnych sportowych okularach przeciwsłonecznych Goya Noble w marinie przy żaglówkach" },
  { src: "/ugc/ugc-rooftop.jpg", model: "Trigo", slug: "goya-g-195-cz-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Kobieta w dużych okularach muchy Goya Trigo na dachu o zachodzie słońca" },
  { src: "/ugc/ugc-street.jpg", model: "Chispa", slug: "goya-okulary-korekcyjne-g-93304-c2", alt: "Mężczyzna w przezroczystych okrągłych oprawkach korekcyjnych Goya Chispa na ulicy" },
  { src: "/ugc/ugc-pool.jpg", model: "Luz", slug: "goya-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym-goya-a-0711", alt: "Kobieta w brązowych kwadratowych okularach przeciwsłonecznych Goya Luz przy basenie" },
  { src: "/ugc/ugc-cafe.jpg", model: "Tossa", slug: "goya-g1905-c1-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Mężczyzna w złotych aviatorach Goya Tossa przy oknie kawiarni" },
  { src: "/ugc/ugc-citystreet.jpg", model: "Céfiro", slug: "goya-g-172-br-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Kobieta w brązowych prostokątnych okularach przeciwsłonecznych Goya Céfiro na miejskiej ulicy" },
  { src: "/ugc/ugc-mountain.jpg", model: "Ronda", slug: "okulary-przeciwsloneczne-polaryzacyjne-dla-kierowcow-pilotki-lustrzanki-goya-g-217-n", alt: "Mężczyzna w lustrzanych aviatorach Goya Ronda na górskim punkcie widokowym" },
  { src: "/ugc/ugc-oversized.jpg", model: "Miel", slug: "goya-g-185-cz-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Kobieta w dużych okularach przeciwsłonecznych Goya Miel na tarasie kawiarni" },
  { src: "/ugc/ugc-roadtrip.jpg", model: "Vuelo", slug: "okulary-przeciwsloneczne-polaryzacyjne-dla-kierowcow-goya-g-55007-br", alt: "Mężczyzna w brązowych aviatorach Goya Vuelo przy zabytkowym aucie na nadmorskiej drodze" },
  { src: "/ugc/ugc-market.jpg", model: "Brisa", slug: "goya-g-183-zx-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Kobieta w okrągłych okularach przeciwsłonecznych Goya Brisa na targu kwiatowym" },
  { src: "/ugc/ugc-round.jpg", model: "Tarifa", slug: "goya-okulary-korekcyjne-g-942115-c1", alt: "Kobieta w okrągłych złotych oprawkach korekcyjnych Goya Tarifa przy herbacie" },
  { src: "/ugc/ugc-window.jpg", model: "Azahar", slug: "okulary-przeciwsloneczne-polaryzacyjne-kujonki-goya-g-221", alt: "Kobieta w okularach przeciwsłonecznych Goya Azahar w kawiarni przy oknie" },
  { src: "/ugc/ugc-car.jpg", model: "Amapola", slug: "goya-g-15217-cz-okulary-przeciwsloneczne-kocie-oczy-z-filtrem-polaryzacyjnym", alt: "Kobieta w okularach kocie oczy Goya Amapola w samochodzie" },
  { src: "/ugc/ugc-sofa.jpg", model: "Jávea", slug: "goya-okulary-korekcyjne-g-89087-c3", alt: "Mężczyzna w czarnych okrągłych oprawkach korekcyjnych Goya Jávea w domu" },
  { src: "/ugc/ugc-tortoise.jpg", model: "Lumbre", slug: "goya-okulary-przeciwsloneczne-z-filtrem-uv-g-1000-br", alt: "Mężczyzna w brązowych prostokątnych okularach przeciwsłonecznych Goya Lumbre na ulicy" },
  { src: "/ugc/ugc-beach.jpg", model: "Verbena", slug: "goya-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym-goya-a-0736", alt: "Kobieta w okrągłych okularach przeciwsłonecznych Goya Verbena na plaży o zachodzie słońca" },
  { src: "/ugc/ugc-duo.jpg", model: "Getaria", slug: "goya-g-193-cz-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Kobieta w czarnych prostokątnych okularach przeciwsłonecznych Goya Getaria, uśmiech w słońcu" },
  { src: "/ugc/ugc-mirror.jpg", model: "Poniente", slug: "goya-g-164-cz-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Kobieta w czarnych prostokątnych okularach Goya Poniente — selfie w lustrze" },
  { src: "/ugc/ugc-park.jpg", model: "Aire", slug: "goya-g-182-zx-okulary-przeciwsloneczne-z-filtrem-polaryzacyjnym", alt: "Kobieta w bursztynowych okularach przeciwsłonecznych Goya Aire w parku" },
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

import type { Product } from "./types";
import { getAllProducts } from "./products";
import { priceOf, formatPLN } from "./pricing";
import { SHAPE_LABELS } from "@/content/site";

// SEO landing pages at /kolekcje/<slug>. PDPs occupy /okulary/<slug>, so facet pages
// live under their own segment with keyword-rich slugs (the proven Shopify /collections/ pattern).
// Each maps 1:1 to a real Polish search intent (shape × gender × sun/Rx × use-case).

export type CollectionDef = {
  slug: string;
  kind: "shape" | "gender" | "category" | "polarized" | "usecase" | "color";
  /** Server-side filter over the catalog. */
  filter: (p: Product) => boolean;
  h1: string;
  /** <title> (template appends " · Goya"). */
  title: string;
  /** meta description. */
  description: string;
  /** Unique editorial lead paragraph (passage-extractable for AI answers). */
  lead: string;
  /** Optional extra FAQ entries specific to this collection. */
  faqs?: { q: string; a: string }[];
  parent: { name: string; path: string };
};

const isSun = (p: Product) => p.category === "sun";
const isOptical = (p: Product) => p.category === "optical";
const gender = (g: string) => (p: Product) => p.gender === g;
const shape = (s: string) => (p: Product) => p.shape === s;
const and = (...fns: ((p: Product) => boolean)[]) => (p: Product) => fns.every((f) => f(p));

const OKULARY = { name: "Okulary", path: "/okulary" };
const SUN = { name: "Przeciwsłoneczne", path: "/przeciwsloneczne" };
const OPT = { name: "Korekcyjne", path: "/korekcyjne" };

export const COLLECTIONS: CollectionDef[] = [
  // ── Shapes ──────────────────────────────────────────────────────────────
  {
    slug: "okulary-aviator",
    kind: "shape",
    filter: shape("Aviator"),
    h1: "Okulary Aviator (pilotki)",
    title: "Okulary Aviator — pilotki damskie i męskie",
    description: "Okulary Aviator (pilotki) Goya — klasyczna kropla z polaryzacją i UV400. Lekkie oprawy projektowane w Polsce. Damskie i męskie.",
    lead: "Aviator, czyli pilotki, to ponadczasowy kształt z charakterystyczną kroplą i cienką oprawą. W Goya każda para łączy ten klasyczny fason z filtrem polaryzacyjnym, który tnie odblaski od jezdni i wody — dlatego pilotki sprawdzają się też za kierownicą.",
    parent: SUN,
  },
  {
    slug: "okulary-kocie-oko",
    kind: "shape",
    filter: shape("Kocie"),
    h1: "Okulary kocie oko (cat eye)",
    title: "Okulary kocie oko (cat eye) damskie",
    description: "Okulary kocie oko (cat eye) Goya — uniesione narożniki, kobiecy charakter, polaryzacja i UV400. Wyszczuplają twarz i dodają wyrazu.",
    lead: "Kocie oko (cat eye) to fason z uniesionymi górnymi narożnikami, który optycznie unosi i wyszczupla twarz. To jeden z najczęściej wybieranych kształtów damskich — u Goya dostępny z soczewkami polaryzacyjnymi i pełną ochroną UV400.",
    parent: SUN,
  },
  {
    slug: "okulary-prostokatne",
    kind: "shape",
    filter: shape("Prostokątne"),
    h1: "Okulary prostokątne",
    title: "Okulary prostokątne — damskie i męskie",
    description: "Okulary prostokątne Goya — wyrazista, geometryczna oprawa z polaryzacją i UV400. Dobrze równoważą okrągłe i owalne rysy twarzy.",
    lead: "Prostokątne oprawy mają mocną, geometryczną linię, która kontrastuje z miękkimi rysami i dodaje twarzy struktury. To pewny wybór dla okrągłej i owalnej twarzy — a w wersji przeciwsłonecznej Goya zawsze z polaryzacją.",
    parent: OKULARY,
  },
  {
    slug: "okulary-okragle",
    kind: "shape",
    filter: shape("Okrągłe"),
    h1: "Okulary okrągłe",
    title: "Okulary okrągłe — retro i nowoczesne",
    description: "Okulary okrągłe Goya — lekki, retro charakter z polaryzacją i UV400. Łagodzą kanciaste, kwadratowe rysy twarzy.",
    lead: "Okrągłe oprawy mają artystyczny, lekko retro charakter i świetnie łagodzą kanciaste rysy — najlepiej pasują do kwadratowej i prostokątnej twarzy. Goya łączy ten fason z polaryzacją i pełną ochroną UV400.",
    parent: OKULARY,
  },
  {
    slug: "okulary-muchy",
    kind: "shape",
    filter: shape("Muchy"),
    h1: "Okulary muchy (oversize)",
    title: "Okulary muchy / oversize damskie",
    description: "Okulary muchy (oversize) Goya — duże, zasłaniające oprawy z polaryzacją i UV400. Maksimum ochrony i wyrazisty, modowy look.",
    lead: "Muchy to duże, oversize'owe oprawy, które zasłaniają więcej skóry wokół oczu i dają maksymalną ochronę przed słońcem. To zdecydowanie modowy fason — u Goya z soczewkami polaryzacyjnymi i filtrem UV400.",
    parent: SUN,
  },
  {
    slug: "okulary-owalne",
    kind: "shape",
    filter: shape("Owalne"),
    h1: "Okulary owalne",
    title: "Okulary owalne — damskie i męskie",
    description: "Okulary owalne Goya — miękka, klasyczna linia oprawy z polaryzacją i UV400. Uniwersalny fason pasujący do większości typów twarzy.",
    lead: "Owalne oprawy mają miękką, zaokrągloną linię i należą do najbardziej uniwersalnych fasonów — pasują do większości kształtów twarzy. Goya wykańcza je lekkim materiałem oraz polaryzacją w wersji przeciwsłonecznej.",
    parent: OKULARY,
  },
  {
    slug: "okulary-nerdy",
    kind: "shape",
    filter: shape("Nerdy"),
    h1: "Okulary nerdy",
    title: "Okulary nerdy — styl geek-chic",
    description: "Okulary nerdy Goya — wyraziste, geometryczne oprawy w stylu geek-chic, z polaryzacją i UV400. Mocny akcent na co dzień.",
    lead: "Nerdy to wyraziste oprawy o grubszej, geometrycznej linii w duchu geek-chic — fason, który sam w sobie staje się akcentem stylizacji. Goya oferuje je zarówno korekcyjnie, jak i przeciwsłonecznie z polaryzacją.",
    parent: OKULARY,
  },
  {
    slug: "okulary-kwadratowe",
    kind: "shape",
    filter: shape("Kwadratowe"),
    h1: "Okulary kwadratowe",
    title: "Okulary kwadratowe — damskie i męskie",
    description: "Okulary kwadratowe Goya — zdecydowana, kanciasta oprawa z polaryzacją i UV400. Idealnie kontrują okrągłą twarz.",
    lead: "Kwadratowe oprawy mają zdecydowaną, kanciastą linię, która świetnie kontruje okrągłą twarz i dodaje rysom charakteru. W Goya dostępne z polaryzacją i ochroną UV400.",
    parent: OKULARY,
  },
  {
    slug: "okulary-sportowe",
    kind: "shape",
    filter: shape("Sportowe"),
    h1: "Okulary sportowe",
    title: "Okulary sportowe z polaryzacją",
    description: "Okulary sportowe Goya — lekkie, dobrze trzymające się oprawy z polaryzacją i UV400. Na rower, bieganie i aktywność na słońcu.",
    lead: "Sportowe oprawy są lekkie i pewnie trzymają się na twarzy podczas ruchu — na rower, bieganie czy dzień na wodzie. Polaryzacja Goya redukuje odblaski, a filtr UV400 chroni oczy przy intensywnym słońcu.",
    parent: SUN,
  },
  // ── Category × gender ─────────────────────────────────────────────────────
  {
    slug: "okulary-przeciwsloneczne-damskie",
    kind: "category",
    filter: and(isSun, gender("Damskie")),
    h1: "Okulary przeciwsłoneczne damskie",
    title: "Okulary przeciwsłoneczne damskie z polaryzacją",
    description: "Damskie okulary przeciwsłoneczne Goya — polaryzacja i UV400 w każdej parze. Kocie oko, muchy, aviatory i więcej. Od 349 zł.",
    lead: "Damskie okulary przeciwsłoneczne Goya to połączenie modnych fasonów — od kociego oka po oversize'owe muchy — z realną ochroną: filtrem polaryzacyjnym, który tnie odblaski, i pełną barierą UV400.",
    parent: SUN,
  },
  {
    slug: "okulary-przeciwsloneczne-meskie",
    kind: "category",
    filter: and(isSun, gender("Męskie")),
    h1: "Okulary przeciwsłoneczne męskie",
    title: "Okulary przeciwsłoneczne męskie z polaryzacją",
    description: "Męskie okulary przeciwsłoneczne Goya — polaryzacja i UV400. Aviatory, prostokątne i klasyczne oprawy. Świetne za kierownicą. Od 349 zł.",
    lead: "Męskie okulary przeciwsłoneczne Goya stawiają na klasyczne, dobrze wyważone fasony — aviatory i prostokątne oprawy — z filtrem polaryzacyjnym, który szczególnie sprawdza się podczas prowadzenia auta.",
    parent: SUN,
  },
  {
    slug: "okulary-korekcyjne-damskie",
    kind: "category",
    filter: and(isOptical, gender("Damskie")),
    h1: "Okulary korekcyjne damskie",
    title: "Oprawki korekcyjne damskie",
    description: "Damskie oprawki korekcyjne Goya — lekkie, gotowe na Twoje soczewki korekcyjne. Kocie oko, owalne i prostokątne. Projektowane w Polsce.",
    lead: "Damskie oprawki korekcyjne Goya to lekkie konstrukcje przygotowane pod Twoje soczewki korekcyjne. Wybierzesz wśród kobiecych fasonów — od kociego oka po delikatne owalne oprawy — w kolorach na co dzień.",
    parent: OPT,
  },
  {
    slug: "okulary-korekcyjne-meskie",
    kind: "category",
    filter: and(isOptical, gender("Męskie")),
    h1: "Okulary korekcyjne męskie",
    title: "Oprawki korekcyjne męskie",
    description: "Męskie oprawki korekcyjne Goya — lekkie i wytrzymałe, gotowe na soczewki korekcyjne. Prostokątne, kwadratowe i klasyczne fasony.",
    lead: "Męskie oprawki korekcyjne Goya łączą lekkość z wytrzymałą konstrukcją i są gotowe na montaż soczewek korekcyjnych. Postawiliśmy na uniwersalne, geometryczne fasony, które pasują do codziennych stylizacji.",
    parent: OPT,
  },
  // ── Polarized ─────────────────────────────────────────────────────────────
  {
    slug: "okulary-polaryzacyjne",
    kind: "polarized",
    filter: and(isSun, (p) => p.polarized),
    h1: "Okulary polaryzacyjne",
    title: "Okulary polaryzacyjne — z filtrem polaryzacyjnym",
    description: "Okulary polaryzacyjne Goya — realna redukcja odblasków od wody, śniegu i jezdni, plus pełna ochrona UV400. Damskie i męskie.",
    lead: "Filtr polaryzacyjny eliminuje odblaski odbite od wody, śniegu i asfaltu, zwiększając kontrast i komfort widzenia — to realna technologia, nie tylko ciemniejsze szkło. Wszystkie przeciwsłoneczne Goya mają polaryzację oraz pełną ochronę UV400.",
    parent: SUN,
  },
  {
    slug: "okulary-polaryzacyjne-damskie",
    kind: "polarized",
    filter: and(isSun, gender("Damskie"), (p) => p.polarized),
    h1: "Okulary polaryzacyjne damskie",
    title: "Okulary polaryzacyjne damskie",
    description: "Damskie okulary polaryzacyjne Goya — modne fasony z filtrem polaryzacyjnym i UV400. Mniej odblasków, większy komfort w słońcu.",
    lead: "Damskie okulary polaryzacyjne Goya łączą kobiece fasony z filtrem, który realnie redukuje odblaski. To wybór dla każdego, kto dużo bywa w pełnym słońcu — nad wodą, w mieście i za kierownicą.",
    parent: SUN,
  },
  {
    slug: "okulary-polaryzacyjne-meskie",
    kind: "polarized",
    filter: and(isSun, gender("Męskie"), (p) => p.polarized),
    h1: "Okulary polaryzacyjne męskie",
    title: "Okulary polaryzacyjne męskie",
    description: "Męskie okulary polaryzacyjne Goya — klasyczne oprawy z filtrem polaryzacyjnym i UV400. Szczególnie polecane kierowcom.",
    lead: "Męskie okulary polaryzacyjne Goya to klasyczne, dobrze wyważone fasony z filtrem, który tnie odblaski od jezdni. Sprawdzą się zarówno w codziennym mieście, jak i podczas dłuższej jazdy autem.",
    parent: SUN,
  },
  // ── Gender hubs ──────────────────────────────────────────────────────────
  {
    slug: "okulary-damskie",
    kind: "gender",
    filter: gender("Damskie"),
    h1: "Okulary damskie",
    title: "Okulary damskie — przeciwsłoneczne i korekcyjne",
    description: "Damskie okulary Goya — przeciwsłoneczne z polaryzacją i oprawki korekcyjne. Kocie oko, owalne, muchy i więcej. Projektowane w Polsce.",
    lead: "Damskie okulary Goya obejmują zarówno przeciwsłoneczne z polaryzacją, jak i lekkie oprawki korekcyjne. Znajdziesz tu kobiece fasony — od kociego oka po oversize'owe muchy — w starannie dobranych kolorach.",
    parent: OKULARY,
  },
  {
    slug: "okulary-meskie",
    kind: "gender",
    filter: gender("Męskie"),
    h1: "Okulary męskie",
    title: "Okulary męskie — przeciwsłoneczne i korekcyjne",
    description: "Męskie okulary Goya — przeciwsłoneczne z polaryzacją i oprawki korekcyjne. Aviatory, prostokątne i klasyczne fasony.",
    lead: "Męskie okulary Goya to klasyczne, uniwersalne fasony — aviatory i prostokątne oprawy — dostępne przeciwsłonecznie z polaryzacją oraz korekcyjnie. Lekka konstrukcja na cały dzień.",
    parent: OKULARY,
  },
  // ── Use-case ─────────────────────────────────────────────────────────────
  {
    slug: "okulary-dla-kierowcow",
    kind: "usecase",
    filter: and(isSun, (p) => p.polarized),
    h1: "Okulary dla kierowców",
    title: "Okulary dla kierowców — polaryzacyjne do jazdy autem",
    description: "Okulary dla kierowców Goya — polaryzacja tnie odblaski od jezdni i maski, UV400 chroni oczy. Lepszy kontrast i mniej zmęczenia za kierownicą.",
    lead: "Za kierownicą najgroźniejsze są odblaski — od mokrej jezdni, maski i innych aut. Filtr polaryzacyjny Goya realnie je redukuje, poprawiając kontrast i zmniejszając zmęczenie oczu. Uwaga: soczewki fotochromowe ciemnieją od UV, więc za przednią szybą (która odcina UV) często nie zadziałają — do auta lepsze są klasyczne soczewki polaryzacyjne.",
    faqs: [
      { q: "Czy okulary polaryzacyjne są dobre do jazdy samochodem?", a: "Tak. Polaryzacja redukuje odblaski od jezdni, maski i innych pojazdów, poprawia kontrast i zmniejsza zmęczenie oczu podczas prowadzenia." },
      { q: "Czy soczewki fotochromowe sprawdzą się za kierownicą?", a: "Zwykle nie. Fotochromy ciemnieją pod wpływem promieniowania UV, a przednia szyba samochodu odcina większość UV — dlatego do auta lepsze są stałe soczewki polaryzacyjne." },
    ],
    parent: SUN,
  },
  // ── Color ────────────────────────────────────────────────────────────────
  {
    slug: "okulary-czarne",
    kind: "color",
    filter: (p) => p.frameColors.includes("Czarny"),
    h1: "Okulary w czarnej oprawie",
    title: "Okulary czarne — czarna oprawa",
    description: "Okulary w czarnej oprawie Goya — najbardziej uniwersalny kolor, z polaryzacją i UV400. Pasują do każdej stylizacji, damskie i męskie.",
    lead: "Czarna oprawa to najbardziej uniwersalny wybór — pasuje do każdego typu urody i stylizacji. W Goya znajdziesz czarne okulary zarówno przeciwsłoneczne z polaryzacją, jak i korekcyjne.",
    parent: OKULARY,
  },
];

/** Maps a raw shape value (data/products.json) to its collection slug, for internal links. */
export const SHAPE_COLLECTION: Record<string, string> = {
  Aviator: "okulary-aviator",
  Kocie: "okulary-kocie-oko",
  Prostokątne: "okulary-prostokatne",
  Okrągłe: "okulary-okragle",
  Muchy: "okulary-muchy",
  Nerdy: "okulary-nerdy",
  Kwadratowe: "okulary-kwadratowe",
  Owalne: "okulary-owalne",
  Sportowe: "okulary-sportowe",
};

/** Only surface collections with enough inventory to avoid thin pages. */
const MIN_PRODUCTS = 4;

export async function collectionProducts(def: CollectionDef): Promise<Product[]> {
  return (await getAllProducts())
    .filter(def.filter)
    .sort((a, b) => b.totalSales - a.totalSales);
}

export async function listCollections(): Promise<CollectionDef[]> {
  // One catalogue read, then filter in memory — not one read per collection.
  const all = await getAllProducts();
  return COLLECTIONS.filter((def) => all.filter(def.filter).length >= MIN_PRODUCTS);
}

export async function getCollection(slug: string): Promise<CollectionDef | undefined> {
  const def = COLLECTIONS.find((c) => c.slug === slug);
  if (!def) return undefined;
  return (await collectionProducts(def)).length >= MIN_PRODUCTS ? def : undefined;
}

/** Data-driven second paragraph — unique per collection because the product mix differs. */
export function collectionFacts(def: CollectionDef, products: Product[]): string {
  if (!products.length) return "";
  const from = Math.min(...products.map((p) => priceOf(p)));
  const shapes = [...new Set(products.map((p) => p.shape).filter(Boolean))] as string[];
  const topShapes = shapes.slice(0, 4).map((s) => (SHAPE_LABELS[s] ?? s).toLowerCase());
  const polarized = products.filter((p) => p.polarized).length;
  const parts: string[] = [`W tej kolekcji znajdziesz ${products.length} ${plural(products.length, "model", "modele", "modeli")} od ${formatPLN(from)}.`];
  if (topShapes.length > 1) parts.push(`Dostępne fasony to m.in. ${topShapes.join(", ")}.`);
  if (polarized > 0) parts.push(`${polarized === products.length ? "Każdy model ma" : `${polarized} z nich ma`} filtr polaryzacyjny i pełną ochronę UV400.`);
  parts.push("Do każdej pary dołączamy twarde etui, ściereczkę z mikrofibry i 24 miesiące gwarancji.");
  return parts.join(" ");
}

export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14)) return few;
  return many;
}

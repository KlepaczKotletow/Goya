// Single source of truth for the production origin (no trailing slash).
// Drives metadataBase, canonicals, sitemap, robots and JSON-LD.
//
// The default is the real domain, not the vercel.app one: a missing
// NEXT_PUBLIC_SITE_URL used to make production publish canonicals pointing at
// goya-eight.vercel.app, which hands Google the preview host as the canonical
// site. Defaulting here means the worst case is a preview deployment naming
// production, which costs nothing, instead of production naming a preview.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://okularygoya.pl").replace(/\/+$/, "");

/** Build an absolute URL from a site-relative path. */
export const absUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

// Seller of record. Same legal entity as the sister store okulary.pl, which has
// represented the GOYA brand since 2001. Polish law requires these details to be
// identifiable from the shop (ustawa o świadczeniu usług drogą elektroniczną
// art. 5, ustawa o prawach konsumenta art. 12), so they are rendered verbatim in
// the regulamin, the privacy policy and the Organization JSON-LD.
export const SELLER = {
  person: "Adrian Głębowski",
  company: "Adrian Głębowski OKULARY.PL",
  registeredAddress: "ul. Grunwaldzka 62, 60-311 Poznań",
  mailingAddress: "ul. Obornicka 229B/9, 60-650 Poznań",
  nip: "7791485427",
  regon: "631116790",
  phones: ["+48 510 130 140", "+48 618 687 352"],
  hours: "8:00–16:00",
} as const;

export const SITE = {
  name: "Goya",
  domain: "okularygoya.pl",
  tagline: "Spójrz inaczej.",
  shortIntro:
    "Polska marka okularów z filtrem polaryzacyjnym. Czysty design, soczewki, które naprawdę chronią, i cena bez metki za logo.",
  email: "kontakt@okularygoya.pl",
  founded: "2019",
};

// Social profiles. Instagram is the brand's real account; Goya has no Facebook page,
// so none is linked. The TikTok entry that used to sit here pointed at @goya, which is
// not ours — a placeholder in `sameAs` tells Google the wrong account is the brand, so
// it is gone until a real handle exists. Add one back as a single line when it does.
// Rendered by <SocialLinks /> (footer + mobile menu) and fed into Organization JSON-LD `sameAs`.
export const SOCIALS: { platform: "instagram" | "tiktok"; label: string; href: string }[] = [
  { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/goya_okulary/" },
];

export const NAV = [
  { label: "Przeciwsłoneczne", href: "/przeciwsloneczne" },
  { label: "Korekcyjne", href: "/korekcyjne" },
  { label: "Damskie", href: "/kolekcje/okulary-damskie" },
  { label: "Męskie", href: "/kolekcje/okulary-meskie" },
  { label: "Poradnik", href: "/poradnik" },
  { label: "O marce", href: "/o-marce" },
];

export const SHAPE_LABELS: Record<string, string> = {
  Kocie: "Kocie oczy",
  Sportowe: "Sportowe",
  Okrągłe: "Okrągłe",
  Nerdy: "Nerdy",
  Muchy: "Muchy",
  Prostokątne: "Prostokątne",
  Aviator: "Aviator",
  Kwadratowe: "Kwadratowe",
  Pozostałe: "Inne",
  Owalne: "Owalne",
};

export const CATEGORY_LABELS: Record<string, string> = {
  sun: "Okulary przeciwsłoneczne",
  optical: "Okulary korekcyjne",
};

export const COLOR_HEX: Record<string, string> = {
  Czarny: "#1f1d1b",
  Wielokolorowy: "#b9a48c",
  Złoty: "#c2a14d",
  "Różowe złoto": "#c4907f",
  Brązowy: "#6b4a2e",
  Grafitowy: "#3c3c41",
  Szylkret: "#5a3b22",
  Srebrny: "#c5c5c7",
  Szary: "#8d8a86",
  Transparentny: "#e9e4da",
  Żółty: "#e2b53d",
  Niebieski: "#2f5fae",
  Fioletowy: "#6b4e9b",
  Zielony: "#3f7d54",
  Granatowy: "#243456",
  Czerwony: "#b23b34",
  Różowy: "#e1a3bd",
  Biały: "#f3f0ea",
  Pomarańczowy: "#d96e2b",
  Beżowy: "#d8c4a3",
};

export const REASSURANCE = [
  { title: "Filtr polaryzacyjny", text: "Realna redukcja odblasków – nie tylko ciemniejsze szkło." },
  { title: "100% ochrona UV400", text: "Pełna bariera dla promieni UVA i UVB w każdej parze." },
  { title: "Polska marka", text: "Projektujemy i kompletujemy Goyę w Polsce." },
  { title: "30 dni na zwrot", text: "Przymierz w domu. Nie pasują – odsyłasz bez pytań." },
];

// What's in the box
export const INCLUDED = [
  { label: "Twarde etui ochronne", note: "Sztywne etui Goya" },
  { label: "Ściereczka z mikrofibry", note: "Do czyszczenia szkieł" },
  { label: "Karta gwarancyjna", note: "24 miesiące gwarancji" },
];

export const TRUST_STATS = [
  { value: "12 000+", label: "zadowolonych klientów" },
  { value: "4.8/5", label: "średnia ocen" },
  { value: "od 2019", label: "na rynku w Polsce" },
  { value: "5 000+", label: "opinii" },
];

export const REVIEWS = [
  { name: "Magda K.", city: "Warszawa", rating: 5, title: "Świetna jakość, polecam", text: "Świetna jakość za tę cenę. Polaryzacja robi ogromną różnicę w słońcu — zero odblasków za kierownicą." },
  { name: "Tomek W.", city: "Kraków", rating: 5, title: "Wysyłka błyskawiczna", text: "Lekkie, dobrze leżą, etui naprawdę solidne. Wysyłka błyskawiczna, następnego dnia." },
  { name: "Ola S.", city: "Gdańsk", rating: 5, title: "Modne i wygodne", text: "Dokładnie jak na zdjęciach. Modne i wygodne — już druga para z Goya." },
  { name: "Piotr M.", city: "Wrocław", rating: 4, title: "Uczciwe ceny", text: "Jakość trzyma poziom, ceny uczciwe. Polecam każdemu, kto szuka dobrych okularów bez przepłacania." },
];

export const FAQS = [
  { q: "Czy okulary mają filtr UV?", a: "Tak – każda para Goya zapewnia 100% ochrony UV400 przed promieniowaniem UVA i UVB." },
  { q: "Czym jest filtr polaryzacyjny?", a: "Filtr polaryzacyjny eliminuje odblaski od wody, śniegu i jezdni, zwiększając kontrast i komfort widzenia. To realna technologia, nie tylko ciemniejsze szkło." },
  { q: "Jaki jest czas dostawy?", a: "Zamówienia wysyłamy w 1–2 dni robocze kurierem lub do paczkomatu. Wysyłka jest darmowa dla każdego zamówienia." },
  { q: "Czy mogę zwrócić okulary?", a: "Masz 30 dni na zwrot bez podawania przyczyny. Wystarczy odesłać produkt w stanie nienaruszonym wraz z etui." },
  { q: "Co znajdę w zestawie?", a: "Do każdej pary dołączamy twarde etui ochronne, ściereczkę z mikrofibry oraz kartę gwarancyjną." },
];

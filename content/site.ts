// Single source of truth for the production origin (no trailing slash).
// Drives metadataBase, canonicals, sitemap, robots and JSON-LD. Flip to the
// real domain at launch by setting NEXT_PUBLIC_SITE_URL=https://goya.pl in Vercel.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://goya-eight.vercel.app").replace(/\/+$/, "");

/** Build an absolute URL from a site-relative path. */
export const absUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const SITE = {
  name: "Goya",
  domain: "goya.pl",
  tagline: "Spójrz inaczej.",
  shortIntro:
    "Polska marka okularów z filtrem polaryzacyjnym. Czysty design, soczewki, które naprawdę chronią, i cena bez metki za logo.",
  email: "kontakt@goya.pl",
  instagram: "https://instagram.com",
  founded: "2019",
};

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
  { title: "Filtr polaryzacyjny", text: "Realna redukcja odblasków - nie tylko ciemniejsze szkło." },
  { title: "100% ochrona UV400", text: "Pełna bariera dla promieni UVA i UVB w każdej parze." },
  { title: "Polska marka", text: "Projektujemy i kompletujemy Goyę w Polsce." },
  { title: "30 dni na zwrot", text: "Przymierz w domu. Nie pasują - odsyłasz bez pytań." },
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
  { q: "Czy okulary mają filtr UV?", a: "Tak - każda para Goya zapewnia 100% ochrony UV400 przed promieniowaniem UVA i UVB." },
  { q: "Czym jest filtr polaryzacyjny?", a: "Filtr polaryzacyjny eliminuje odblaski od wody, śniegu i jezdni, zwiększając kontrast i komfort widzenia. To realna technologia, nie tylko ciemniejsze szkło." },
  { q: "Jaki jest czas dostawy?", a: "Zamówienia wysyłamy w 1–2 dni robocze kurierem lub do paczkomatu. Wysyłka jest darmowa dla każdego zamówienia." },
  { q: "Czy mogę zwrócić okulary?", a: "Masz 30 dni na zwrot bez podawania przyczyny. Wystarczy odesłać produkt w stanie nienaruszonym wraz z etui." },
  { q: "Co znajdę w zestawie?", a: "Do każdej pary dołączamy twarde etui ochronne, ściereczkę z mikrofibry oraz kartę gwarancyjną." },
];

export const SITE = {
  name: "Goya",
  domain: "goya.pl",
  tagline: "Światło i luz.",
  shortIntro:
    "Polska marka okularów z filtrem polaryzacyjnym. Kolekcje inspirowane hiszpańskim światłem — na miasto, podróż i długie popołudnia na słońcu.",
  email: "kontakt@goya.pl",
  instagram: "https://instagram.com",
};

export const NAV = [
  { label: "Przeciwsłoneczne", href: "/przeciwsloneczne" },
  { label: "Korekcyjne", href: "/korekcyjne" },
  { label: "Kolekcje", href: "/#kolekcje" },
  { label: "Damskie", href: "/okulary?gender=Damskie" },
  { label: "Męskie", href: "/okulary?gender=M%C4%99skie" },
  { label: "O marce", href: "/o-marce" },
];

// Collections — short Spanish vacation words, each mapped to a real catalog facet.
export type Collection = {
  name: string;
  meaning: string;
  tagline: string;
  href: string;
  shape?: string;
  category?: "sun" | "optical";
};

export const COLLECTIONS: Collection[] = [
  {
    name: "Sol",
    meaning: "słońce",
    tagline: "Aviatory — klasyka pod pełnym słońcem.",
    href: "/przeciwsloneczne?shape=Aviator",
    shape: "Aviator",
    category: "sun",
  },
  {
    name: "Luna",
    meaning: "księżyc",
    tagline: "Okrągłe jak księżyc nad zatoką.",
    href: "/okulary?shape=Okr%C4%85g%C5%82e",
    shape: "Okrągłe",
  },
  {
    name: "Brisa",
    meaning: "bryza",
    tagline: "Kocia linia, lekka jak wieczorna bryza.",
    href: "/okulary?shape=Kocie",
    shape: "Kocie",
  },
  {
    name: "Vela",
    meaning: "żagiel",
    tagline: "Muchy postawione jak żagiel — kurs na lato.",
    href: "/przeciwsloneczne?shape=Muchy",
    shape: "Muchy",
    category: "sun",
  },
  {
    name: "Faro",
    meaning: "latarnia",
    tagline: "Prostokątne oprawy — prosta linia, pewny kierunek.",
    href: "/okulary?shape=Prostok%C4%85tne",
    shape: "Prostokątne",
  },
  {
    name: "Alba",
    meaning: "świt",
    tagline: "Korekcyjne — czyste światło na co dzień.",
    href: "/korekcyjne",
    category: "optical",
  },
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

// Trust bar — one hairline row, factual.
export const REASSURANCE = [
  { title: "30 dni na zwrot", text: "Przymierz w domu. Nie pasują — odsyłasz bez pytań." },
  { title: "Darmowa wysyłka od 199 zł", text: "Kurier lub paczkomat, wysyłka w 1–2 dni robocze." },
  { title: "24 miesiące gwarancji", text: "Karta gwarancyjna dołączona do każdej pary." },
  { title: "Etui i ściereczka w zestawie", text: "Twarde etui i mikrofibra — bez dopłat." },
];

// Technika bez wykładu — three factual lines instead of marketing prose.
export const TECH_SPECS = [
  { label: "Filtr polaryzacyjny", value: "wycina odblaski od wody, śniegu i jezdni" },
  { label: "UV400", value: "pełna bariera UVA i UVB w każdej parze" },
  { label: "Certyfikat CE", value: "norma PN-EN ISO 12312-1" },
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
  { name: "Magda K.", city: "Warszawa", rating: 5, text: "Świetna jakość za tę cenę. Polaryzacja robi ogromną różnicę w słońcu — zero odblasków za kierownicą." },
  { name: "Tomek W.", city: "Kraków", rating: 5, text: "Lekkie, dobrze leżą, etui naprawdę solidne. Wysyłka błyskawiczna, następnego dnia." },
  { name: "Ola S.", city: "Gdańsk", rating: 5, text: "Dokładnie jak na zdjęciach. Modne i wygodne — już druga para z Goya." },
  { name: "Piotr M.", city: "Wrocław", rating: 4, text: "Jakość trzyma poziom, ceny uczciwe. Polecam każdemu, kto szuka dobrych okularów bez przepłacania." },
];

export const FAQS = [
  { q: "Czy okulary mają filtr UV?", a: "Tak — każda para Goya zapewnia 100% ochrony UV400 przed promieniowaniem UVA i UVB." },
  { q: "Czym jest filtr polaryzacyjny?", a: "Filtr polaryzacyjny eliminuje odblaski od wody, śniegu i jezdni, zwiększając kontrast i komfort widzenia. To realna technologia, nie tylko ciemniejsze szkło." },
  { q: "Jaki jest czas dostawy?", a: "Zamówienia wysyłamy w 1–2 dni robocze kurierem lub do paczkomatu. Darmowa wysyłka od 199 zł." },
  { q: "Czy mogę zwrócić okulary?", a: "Masz 30 dni na zwrot bez podawania przyczyny. Wystarczy odesłać produkt w stanie nienaruszonym wraz z etui." },
  { q: "Co znajdę w zestawie?", a: "Do każdej pary dołączamy twarde etui ochronne, ściereczkę z mikrofibry oraz kartę gwarancyjną." },
];

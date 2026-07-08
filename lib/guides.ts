import type { Product } from "./types";
import { getAllProducts } from "./products";

// Editorial /poradnik hub. The face-shape guides are SHOPPABLE — they explain the rule
// AND merchandise matching Goya frames + link to /kolekcje pages. This is the differentiator
// pure-content opticians can't replicate, and the strongest info→transaction bridge in PL eyewear.
// Content is written in atomic, passage-extractable paragraphs (good for AI answer engines).

export type GuideSection = { h2: string; body: string[] };

export type GuideDef = {
  slug: string;
  kind: "pillar" | "face-shape" | "article";
  h1: string;
  title: string;
  description: string;
  /** ISO month for visible "Ostatnia aktualizacja" + dateModified freshness signal. */
  updated: string;
  lead: string;
  sections: GuideSection[];
  faqs?: { q: string; a: string }[];
  /** Shoppable guides: pull frames in these shapes. */
  recommendedShapes?: string[];
  /** Collection slugs to cross-link. */
  relatedCollections?: string[];
};

export const GUIDES: GuideDef[] = [
  {
    slug: "jak-dobrac-okulary-do-ksztaltu-twarzy",
    kind: "pillar",
    h1: "Jak dobrać okulary do kształtu twarzy",
    title: "Jak dobrać okulary do kształtu twarzy — poradnik",
    description:
      "Jak dobrać okulary i oprawki do kształtu twarzy: okrągłej, kwadratowej, owalnej, pociągłej i w kształcie serca. Prosta zasada kontrastu + dopasowane modele Goya.",
    updated: "2026-06",
    lead: "Najprostsza zasada doboru okularów brzmi: oprawa powinna kontrastować z kształtem twarzy. Do miękkich, okrągłych rysów pasują fasony kanciaste; do twarzy kanciastej — oprawy zaokrąglone. Poniżej znajdziesz konkretne rekomendacje dla każdego kształtu twarzy oraz dopasowane modele Goya.",
    sections: [
      {
        h2: "Jak rozpoznać kształt swojej twarzy?",
        body: [
          "Zwiąż włosy, spójrz w lustro i oceń proporcje: szerokość czoła, kości policzkowych i żuchwy oraz długość twarzy.",
          "Twarz okrągła ma zbliżoną szerokość i długość oraz miękkie linie. Kwadratowa ma szeroką, wyraźną żuchwę. Owalna jest nieco dłuższa niż szersza, z łagodnymi proporcjami. Pociągła (podłużna) jest wyraźnie dłuższa niż szersza. Serce ma szerokie czoło i wąską brodę.",
        ],
      },
      {
        h2: "Zasada kontrastu w jednym zdaniu",
        body: [
          "Dobieraj oprawę o cechach przeciwnych do twarzy: kanciaste fasony dodają struktury miękkim rysom, a zaokrąglone łagodzą kanty.",
          "Szerokość oprawy powinna odpowiadać najszerszemu punktowi twarzy — to ważniejsze niż sam fason.",
        ],
      },
      {
        h2: "Dopasowanie do kształtu twarzy w skrócie",
        body: [
          "Twarz okrągła: prostokątne, kwadratowe i aviatory dodają struktury.",
          "Twarz kwadratowa: okrągłe, owalne i kocie oko łagodzą żuchwę.",
          "Twarz owalna: pasuje większość fasonów — od aviatorów po prostokątne.",
          "Twarz pociągła: duże, głębokie oprawy (muchy, kwadratowe) optycznie skracają twarz.",
          "Twarz w kształcie serca: aviatory i owalne równoważą szersze czoło.",
        ],
      },
    ],
    faqs: [
      { q: "Czy do każdej twarzy pasują inne okulary?", a: "Tak. Najlepiej działa zasada kontrastu: do miękkich rysów dobieraj kanciaste oprawy, a do kanciastych — zaokrąglone. Owalna twarz jest najbardziej uniwersalna." },
      { q: "Co jest ważniejsze: fason czy rozmiar oprawy?", a: "Rozmiar. Nawet idealny fason nie będzie dobrze wyglądał, jeśli oprawa jest za szeroka lub za wąska względem twarzy. Szerokość oprawy powinna odpowiadać najszerszemu punktowi twarzy." },
    ],
  },
  {
    slug: "okulary-do-okraglej-twarzy",
    kind: "face-shape",
    h1: "Okulary do okrągłej twarzy",
    title: "Okulary do okrągłej twarzy — jakie fasony wybrać",
    description:
      "Jakie okulary do okrągłej twarzy? Prostokątne, kwadratowe i aviatory dodają struktury i optycznie wyszczuplają. Zobacz dopasowane modele Goya.",
    updated: "2026-06",
    lead: "Okrągła twarz ma miękkie linie i zbliżoną szerokość oraz długość. Aby dodać jej struktury i optycznie ją wyszczuplić, wybieraj oprawy kanciaste i kątowe — prostokątne, kwadratowe oraz aviatory. Unikaj małych, okrągłych oprawek, które podkreślają krągłość.",
    sections: [
      {
        h2: "Najlepsze fasony do okrągłej twarzy",
        body: [
          "Prostokątne i kwadratowe oprawy wprowadzają wyraźne kąty, które kontrastują z miękkimi rysami i wydłużają twarz.",
          "Aviatory z kątową, kroplowatą linią również dobrze równoważą okrągłe proporcje.",
        ],
      },
      {
        h2: "Czego unikać",
        body: ["Małych, okrągłych i owalnych oprawek bez wyraźnych kątów — powielają kształt twarzy i podkreślają jej krągłość."],
      },
    ],
    recommendedShapes: ["Prostokątne", "Kwadratowe", "Aviator", "Nerdy"],
    relatedCollections: ["okulary-prostokatne", "okulary-kwadratowe", "okulary-aviator"],
  },
  {
    slug: "okulary-do-kwadratowej-twarzy",
    kind: "face-shape",
    h1: "Okulary do kwadratowej twarzy",
    title: "Okulary do kwadratowej twarzy — jakie oprawki wybrać",
    description:
      "Jakie okulary do kwadratowej twarzy? Okrągłe, owalne i kocie oko łagodzą wyraźną żuchwę. Zobacz dopasowane modele Goya.",
    updated: "2026-06",
    lead: "Kwadratowa twarz ma szeroką, wyraźną żuchwę i kanciaste rysy. Aby je złagodzić, wybieraj oprawy zaokrąglone — okrągłe, owalne i kocie oko. Delikatne, krzywe linie zmiękczają kąty i dodają twarzy harmonii.",
    sections: [
      {
        h2: "Najlepsze fasony do kwadratowej twarzy",
        body: [
          "Okrągłe i owalne oprawy wprowadzają miękkie krzywizny, które równoważą mocną linię żuchwy.",
          "Kocie oko z uniesionymi narożnikami optycznie unosi twarz i dodaje jej lekkości.",
        ],
      },
      {
        h2: "Czego unikać",
        body: ["Mocno kanciastych, szerokich i geometrycznych opraw — pogłębiają kanty kwadratowej twarzy."],
      },
    ],
    recommendedShapes: ["Okrągłe", "Owalne", "Kocie", "Aviator"],
    relatedCollections: ["okulary-okragle", "okulary-owalne", "okulary-kocie-oko"],
  },
  {
    slug: "okulary-do-owalnej-twarzy",
    kind: "face-shape",
    h1: "Okulary do owalnej twarzy",
    title: "Okulary do owalnej twarzy — uniwersalne fasony",
    description:
      "Owalna twarz to najbardziej uniwersalny kształt — pasuje do niej większość opraw. Zobacz polecane fasony Goya: aviatory, prostokątne, kocie oko.",
    updated: "2026-06",
    lead: "Owalna twarz ma zrównoważone proporcje i łagodne linie, dlatego pasuje do niej najwięcej fasonów. Kluczem jest zachowanie naturalnej równowagi: wybieraj oprawy o szerokości zbliżonej do najszerszego punktu twarzy i unikaj ekstremalnie dużych modeli.",
    sections: [
      {
        h2: "Najlepsze fasony do owalnej twarzy",
        body: [
          "Sprawdzą się aviatory, prostokątne oprawy i kocie oko — od klasyki po modowe akcenty.",
          "Najważniejsze, by oprawa nie była szersza niż najszerszy punkt twarzy i nie zaburzała jej naturalnych proporcji.",
        ],
      },
    ],
    recommendedShapes: ["Aviator", "Prostokątne", "Kocie", "Muchy"],
    relatedCollections: ["okulary-aviator", "okulary-prostokatne", "okulary-kocie-oko"],
  },
  {
    slug: "okulary-do-pociaglej-twarzy",
    kind: "face-shape",
    h1: "Okulary do pociągłej (podłużnej) twarzy",
    title: "Okulary do pociągłej twarzy — jak optycznie skrócić twarz",
    description:
      "Jakie okulary do pociągłej, podłużnej twarzy? Duże, głębokie oprawy — muchy i kwadratowe — optycznie skracają twarz. Zobacz modele Goya.",
    updated: "2026-06",
    lead: "Pociągła (podłużna) twarz jest wyraźnie dłuższa niż szersza. Aby optycznie ją skrócić, wybieraj oprawy duże i głębokie w pionie — muchy oraz szerokie, kwadratowe fasony. Dodatkowy akcent na górze oprawy lub szersze zauszniki „przecinają” długość twarzy.",
    sections: [
      {
        h2: "Najlepsze fasony do pociągłej twarzy",
        body: [
          "Duże, głębokie oprawy (muchy, oversize) i szerokie kwadratowe fasony skracają twarz i dodają jej szerokości.",
          "Oprawy z wyraźną górną linią lub kontrastowym mostkiem optycznie dzielą twarz w poziomie.",
        ],
      },
      {
        h2: "Czego unikać",
        body: ["Małych i wąskich opraw — jeszcze bardziej wydłużają twarz."],
      },
    ],
    recommendedShapes: ["Muchy", "Kwadratowe", "Okrągłe", "Prostokątne"],
    relatedCollections: ["okulary-muchy", "okulary-kwadratowe", "okulary-prostokatne"],
  },
  {
    slug: "okulary-do-twarzy-w-ksztalcie-serca",
    kind: "face-shape",
    h1: "Okulary do twarzy w kształcie serca",
    title: "Okulary do twarzy w kształcie serca — jakie fasony",
    description:
      "Twarz w kształcie serca ma szerokie czoło i wąską brodę. Aviatory i owalne oprawy równoważą proporcje. Zobacz dopasowane modele Goya.",
    updated: "2026-06",
    lead: "Twarz w kształcie serca ma szersze czoło i zwężającą się ku dole brodę. Aby zrównoważyć proporcje, wybieraj oprawy lekkie u góry i delikatnie zaokrąglone — aviatory, owalne i subtelne kocie oko. Dobrze działają fasony o szerokości zbliżonej do żuchwy.",
    sections: [
      {
        h2: "Najlepsze fasony do twarzy w kształcie serca",
        body: [
          "Aviatory i owalne oprawy odciążają górę twarzy i kierują uwagę w dół, równoważąc szersze czoło.",
          "Delikatne kocie oko dodaje charakteru bez pogłębiania szerokości czoła.",
        ],
      },
      {
        h2: "Czego unikać",
        body: ["Ciężkich, ozdobnych opraw u góry — dodatkowo poszerzają czoło."],
      },
    ],
    recommendedShapes: ["Aviator", "Owalne", "Kocie", "Okrągłe"],
    relatedCollections: ["okulary-aviator", "okulary-owalne", "okulary-kocie-oko"],
  },
  {
    slug: "polaryzacja-czy-uv400",
    kind: "article",
    h1: "Polaryzacja a UV400 — czym się różnią?",
    title: "Polaryzacja a UV400 — czym się różnią i co wybrać",
    description:
      "Polaryzacja a UV400 to dwie różne rzeczy: UV400 chroni zdrowie oczu, polaryzacja zwiększa komfort i tnie odblaski. Wyjaśniamy różnicę i kategorie filtrów.",
    updated: "2026-06",
    lead: "To dwie zupełnie różne funkcje, często mylone. UV400 to ochrona zdrowotna — bariera dla promieniowania UVA i UVB. Polaryzacja to komfort widzenia — filtr, który eliminuje odblaski. Dobre okulary przeciwsłoneczne mają jedno i drugie. Wszystkie przeciwsłoneczne Goya łączą polaryzację z pełną ochroną UV400.",
    sections: [
      {
        h2: "Co oznacza UV400?",
        body: [
          "UV400 oznacza, że soczewka blokuje 100% promieniowania ultrafioletowego o długości fali do 400 nanometrów — czyli pełne pasmo UVA i UVB.",
          "To parametr ochrony zdrowia oczu. Ciemna soczewka bez UV400 jest wręcz groźna: rozszerza źrenicę i wpuszcza więcej UV do oka.",
        ],
      },
      {
        h2: "Czym jest filtr polaryzacyjny?",
        body: [
          "Filtr polaryzacyjny wycina poziome odblaski odbite od jezdni, wody i śniegu. Efekt to wyższy kontrast, żywsze kolory i mniejsze zmęczenie oczu.",
          "Polaryzacja nie zastępuje ochrony UV — to osobna funkcja zwiększająca komfort, szczególnie za kierownicą i nad wodą.",
        ],
      },
      {
        h2: "Kategorie filtra (0–4)",
        body: [
          "Kategoria filtra opisuje, ile światła przepuszcza soczewka. Kat. 0–1 to lekkie przyciemnienie, Kat. 2 to umiarkowane słońce, Kat. 3 to pełne, jasne słońce (najpopularniejsza), a Kat. 4 to bardzo intensywne światło (góry, woda) — niedozwolona do prowadzenia auta.",
        ],
      },
    ],
    faqs: [
      { q: "Czy polaryzacja chroni przed UV?", a: "Nie bezpośrednio. Polaryzacja eliminuje odblaski, a za ochronę przed promieniowaniem odpowiada filtr UV400. Dlatego warto mieć okulary, które łączą obie funkcje — jak każda para Goya." },
      { q: "Po co mi polaryzacja, skoro mam UV400?", a: "UV400 chroni zdrowie oczu, ale nie usuwa oślepiających odblasków od jezdni czy wody. Polaryzacja realnie poprawia kontrast i komfort widzenia w pełnym słońcu." },
      { q: "Która kategoria filtra jest najlepsza na co dzień?", a: "Kategoria 3 — przeznaczona do pełnego, jasnego słońca. To najpopularniejszy wybór na lato i wakacje. Kategoria 4 jest zbyt ciemna do prowadzenia samochodu." },
    ],
  },
];

export function listGuides(): GuideDef[] {
  return GUIDES;
}

export function getGuide(slug: string): GuideDef | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function guideProducts(guide: GuideDef, n = 8): Product[] {
  if (!guide.recommendedShapes?.length) return [];
  const shapes = new Set(guide.recommendedShapes);
  return getAllProducts()
    .filter((p) => p.shape && shapes.has(p.shape))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, n);
}

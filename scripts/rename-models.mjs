// Regenerates Goya's Mediterranean model names from data/products.json.
//
// Why: the imported WooCommerce names ("G 9496", "A 0736", …) read like SKUs.
// The brand direction is a "quiet premium", Spanish/Mediterranean summer feel, so
// every frame gets one short evocative Spanish word (Luz, Brisa, Costa, Faro …).
//
// Deterministic: products are processed in ascending id order and each name is
// drawn once from a themed pool chosen by gender + shape, so re-running yields the
// exact same mapping. The original SKU is preserved as `code` for traceability.
//
// Outputs (all regenerated, never hand-edited):
//   content/model-names.ts   → id → new name map consumed by lib/products.ts
//   docs/model-names.md      → human-readable old→new directory (the "keep-track" doc)
//   data/model-names.csv     → same directory as CSV for spreadsheets
//
// Run:  node scripts/rename-models.mjs
import fs from "node:fs";

const root = new URL("..", import.meta.url);
const products = JSON.parse(fs.readFileSync(new URL("data/products.json", root)));

// ---- Curated Spanish / Mediterranean word pools -------------------------------
// Grouped by mood. The assignment picks a preference order per product; a global
// "used" set guarantees every product gets a distinct name.
const LIGHT   = ["Luz","Sol","Rayo","Alba","Aurora","Ocaso","Solano","Claro","Destello","Fulgor","Lumbre","Candela","Lucero","Solaz","Cénit","Fénix","Nova","Ígneo","Ámbar","Dorado","Reflejo","Albor"];
const SEA     = ["Mar","Marea","Costa","Cala","Bahía","Faro","Vela","Coral","Perla","Nácar","Caleta","Ensenada","Espuma","Litoral","Muelle","Ría","Sirena","Oleaje","Cabo","Salina","Rada","Marina","Nereo","Delfín"];
// Only calm/elegant Mediterranean winds — harsh "storm" words (Vendaval, Galerna,
// Ráfaga, Austro, Soplo) were removed as too heavy for a "quiet premium" name.
const WIND    = ["Brisa","Aire","Céfiro","Levante","Poniente","Mistral","Tramontana"];
// "Ola" and "Estela" dropped: both read as Polish/Spanish women's given names.
const MOVE    = ["Veloz","Rumbo","Vuelo","Deriva","Nómada","Errante","Trayecto","Ímpetu","Brío","Raudo","Regata","Timón","Proa","Ancla","Bruma"];
const FREEDOM = ["Libre","Fiesta","Verano","Siesta","Feria","Sarao","Verbena","Romería","Recreo","Asueto","Paseo","Ruta","Senda","Viaje"];
const FLORAL  = ["Azahar","Jazmín","Dalia","Amapola","Camelia","Magnolia","Violeta","Malva","Lila","Flor","Adelfa","Buganvilla","Mirto","Lavanda","Espliego","Oliva","Palma","Retama","Jara","Tomillo","Romero","Salvia","Menta","Laurel","Nardo","Azucena"];
const GEM     = ["Jade","Ópalo","Turquesa","Esmeralda","Cuarzo","Marfil","Azabache","Ébano","Bronce","Cobre","Canela","Almendra","Avellana","Trigo","Grana","Carmín","Añil","Malaquita","Miel","Ocre"];
const CELESTE = ["Luna","Estrella","Nube","Cielo","Astro","Cometa","Aura","Alma","Lira","Diva","Musa","Ninfa","Gala","Serena","Gracia","Dulce","Bella","Celeste","Neblina","Calma","Sosiego","Remanso","Sereno"];
const PLACES  = ["Ronda","Nerja","Tarifa","Denia","Jávea","Begur","Formentera","Altea","Calpe","Mojácar","Comillas","Llanes","Sóller","Cadaqués","Marbella","Cádiz","Ibiza","Menorca","Mallorca","Almería","Sitges","Tossa","Peñíscola","Getaria","Zahara","Conil","Frigiliana","Mundaka","Tulum","Portofino"];
const STRONG  = ["Roble","Cedro","Pino","Olmo","Fresno","Risco","Monte","Sierra","Halcón","Lince","Bravo","Noble","Hidalgo","Corsario","Timonel","Norte","Duero","Ebro","Tajo","Duna","Arena"];
const KIDS    = ["Chispa","Duende","Grillo","Pinta","Trébol"];

// Hand-picked overrides (keyed by original SKU) applied before automatic assignment.
// These fix cross-language name clashes and tone mismatches the theme buckets missed.
const OVERRIDES = {
  "G 55001 CZ": "Oleaje",  // was "Ola" — a common Polish girl's name on a men's frame
  "GM 7080":    "Cabo",    // was "Estela" — reads as a female given name on a men's frame
  "G 154 CZ":   "Perla",   // was "Soplo" — weak / "heart murmur" connotation, women's
  "G 148":      "Lucero",  // was "Vendaval" — storm too harsh for a women's frame
  "G 170":      "Marina",  // was "Galerna" — obscure storm word, women's
  "G 150 GR C": "Ámbar",   // was "Austro" — obscure wind, women's
  "G 151":      "Sirena",  // was "Ráfaga" — harsh gust, women's
};

// ---- Preference order by gender ------------------------------------------------
const PREFS = {
  Damskie:    [FLORAL, CELESTE, GEM, WIND, LIGHT, SEA, PLACES, FREEDOM],
  "Męskie":   [MOVE, STRONG, SEA, WIND, LIGHT, PLACES, GEM, FREEDOM],
  Unisex:     [PLACES, FREEDOM, LIGHT, SEA, WIND, CELESTE, MOVE, GEM],
  "Dziecięce":[KIDS, LIGHT, FREEDOM],
};
// Global fallback so uniqueness is guaranteed even if a gender's themes run dry.
const FALLBACK = [PLACES, LIGHT, SEA, WIND, CELESTE, GEM, FLORAL, MOVE, STRONG, FREEDOM, KIDS];

// Shape → collection (secondary grouping from the brand brief: City/Coast/Drive/Weekend).
const COLLECTION = {
  Nerdy: "City", Prostokątne: "City", Kwadratowe: "City", Owalne: "City",
  Aviator: "Coast", Muchy: "Coast", Kocie: "Coast",
  Sportowe: "Drive",
  "Okrągłe": "Weekend", "Pozostałe": "Weekend",
};
const collectionFor = (p) => (p.gender === "Dziecięce" ? "Weekend" : COLLECTION[p.shape] ?? "Weekend");

// ---- Assign ---------------------------------------------------------------------
const ids = products.map((p) => p.id);
if (new Set(ids).size !== ids.length) throw new Error("Duplicate product ids — cannot key names by id.");

const used = new Set();
// Reserve override names first so automatic assignment never reuses them.
Object.values(OVERRIDES).forEach((n) => used.add(n));
const pick = (pools) => {
  for (const pool of pools) {
    for (const name of pool) {
      if (!used.has(name)) { used.add(name); return name; }
    }
  }
  return null;
};

const ordered = [...products].sort((a, b) => a.id - b.id);
const rows = [];
for (const p of ordered) {
  const gender = p.gender ?? "Unisex";
  const name = OVERRIDES[p.name] ?? pick([...(PREFS[gender] ?? PREFS.Unisex), ...FALLBACK]);
  if (!name) throw new Error(`Ran out of names at id ${p.id} — enlarge the pools.`);
  rows.push({
    id: p.id,
    old: p.name,
    neu: name,
    collection: collectionFor(p),
    shape: p.shape ?? "—",
    gender,
    category: p.category === "sun" ? "Przeciwsłoneczne" : "Korekcyjne",
    slug: p.slug,
  });
}

// Sanity: every product named, all names distinct.
if (rows.length !== products.length) throw new Error("Row count mismatch.");
if (new Set(rows.map((r) => r.neu)).size !== rows.length) throw new Error("Duplicate names generated.");

// ---- Write content/model-names.ts ----------------------------------------------
const byId = [...rows].sort((a, b) => a.id - b.id);
const tsBody = byId.map((r) => `  ${r.id}: ${JSON.stringify(r.neu)}, // ${r.old} · ${r.collection}`).join("\n");
const ts = `// AUTO-GENERATED by scripts/rename-models.mjs — do not edit by hand.
// Maps WooCommerce product id → Goya Mediterranean model name.
// Regenerate with:  node scripts/rename-models.mjs
export const MODEL_NAMES: Record<number, string> = {
${tsBody}
};
`;
fs.writeFileSync(new URL("content/model-names.ts", root), ts);

// ---- Write docs/model-names.md -------------------------------------------------
const collOrder = ["City", "Coast", "Drive", "Weekend"];
const byColl = [...rows].sort(
  (a, b) => collOrder.indexOf(a.collection) - collOrder.indexOf(b.collection) || a.neu.localeCompare(b.neu, "es"),
);
const counts = collOrder.map((c) => `${c}: ${rows.filter((r) => r.collection === c).length}`).join(" · ");
let md = `# Goya — katalog nazw modeli (stara → nowa)

Śródziemnomorski, „ciche premium” kierunek marki. Każdy model dostał krótką, hiszpańską
nazwę nawiązującą do światła, morza i wakacji. Stary kod (SKU z WooCommerce) zostaje
zachowany jako *Kod modelu* na stronie produktu i w kolumnie poniżej.

- Modeli łącznie: **${rows.length}** (${counts})
- Źródło prawdy: \`content/model-names.ts\` (generowane) — nie edytuj ręcznie.
- Regeneracja: \`node scripts/rename-models.mjs\`

| Kolekcja | Nazwa (nowa) | Kod (stary) | Kształt | Płeć | Kategoria |
|---|---|---|---|---|---|
`;
md += byColl.map((r) => `| ${r.collection} | **${r.neu}** | ${r.old} | ${r.shape} | ${r.gender} | ${r.category} |`).join("\n");
md += "\n";
fs.writeFileSync(new URL("docs/model-names.md", root), md);

// ---- Write data/model-names.csv ------------------------------------------------
const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const csvHeader = "id,old_name,new_name,collection,shape,gender,category,slug";
const csv = [csvHeader, ...byId.map((r) => [r.id, r.old, r.neu, r.collection, r.shape, r.gender, r.category, r.slug].map(esc).join(","))].join("\n") + "\n";
fs.writeFileSync(new URL("data/model-names.csv", root), csv);

// ---- Report --------------------------------------------------------------------
console.log(`Named ${rows.length} products, ${new Set(rows.map((r) => r.neu)).size} unique names.`);
console.log("By collection:", counts);
console.log("Pool size available:", new Set([...LIGHT,...SEA,...WIND,...MOVE,...FREEDOM,...FLORAL,...GEM,...CELESTE,...PLACES,...STRONG,...KIDS]).size);
console.log("Sample:", byId.slice(0, 6).map((r) => `${r.old}→${r.neu}`).join(", "));
console.log("Wrote content/model-names.ts, docs/model-names.md, data/model-names.csv");

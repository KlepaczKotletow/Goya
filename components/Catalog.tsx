"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { ProductGrid } from "./ProductGrid";
import { ColorSwatch } from "./ColorSwatch";
import { CloseIcon } from "./icons";
import { SHAPE_LABELS } from "@/content/site";
import { premiumPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type Sort = "popular" | "price-asc" | "price-desc";
const unique = (arr: (string | null)[]) => [...new Set(arr.filter(Boolean) as string[])];

export function Catalog({
  products,
  lockCategory,
  title,
  subtitle,
  intro,
}: {
  products: Product[];
  lockCategory?: "sun" | "optical";
  title: string;
  subtitle?: string;
  intro?: string;
}) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [genders, setGenders] = useState<string[]>(() => sp.getAll("gender"));
  const [shapes, setShapes] = useState<string[]>(() => sp.getAll("shape"));
  const [colors, setColors] = useState<string[]>(() => sp.getAll("color"));
  const [category, setCategory] = useState<string>(() => (lockCategory ? "" : sp.get("category") ?? ""));
  const [sort, setSort] = useState<Sort>(() => ((sp.get("sort") as Sort) || "popular"));
  const [q, setQ] = useState<string>(() => sp.get("q") ?? "");
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    genders.forEach((g) => params.append("gender", g));
    shapes.forEach((s) => params.append("shape", s));
    colors.forEach((c) => params.append("color", c));
    if (!lockCategory && category) params.set("category", category);
    if (sort !== "popular") params.set("sort", sort);
    if (q) params.set("q", q);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [genders, shapes, colors, category, sort, q, lockCategory, pathname, router]);

  const facetGenders = useMemo(() => unique(products.map((p) => p.gender)), [products]);
  const facetShapes = useMemo(() => unique(products.map((p) => p.shape)), [products]);
  const facetColors = useMemo(() => unique(products.flatMap((p) => p.frameColors)), [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (!lockCategory && category && p.category !== category) return false;
      if (genders.length && !(p.gender && genders.includes(p.gender))) return false;
      if (shapes.length && !(p.shape && shapes.includes(p.shape))) return false;
      if (colors.length && !p.frameColors.some((c) => colors.includes(c))) return false;
      if (q) {
        const hay = `${p.name} ${p.code ?? ""} ${p.fullName} ${p.shape ?? ""} ${p.frameColors.join(" ")} ${p.gender ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
    const byPop = (a: Product, b: Product) => b.totalSales - a.totalSales;
    if (sort === "price-asc") list = [...list].sort((a, b) => premiumPrice(a.priceWoo) - premiumPrice(b.priceWoo) || byPop(a, b));
    else if (sort === "price-desc") list = [...list].sort((a, b) => premiumPrice(b.priceWoo) - premiumPrice(a.priceWoo) || byPop(a, b));
    else list = [...list].sort(byPop);
    return list;
  }, [products, lockCategory, category, genders, shapes, colors, q, sort]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  type Chip = { type: "category" | "gender" | "shape" | "color" | "q"; val: string; label: string };
  const activeChips: Chip[] = [
    ...(!lockCategory && category ? [{ type: "category" as const, val: category, label: category === "sun" ? "Przeciwsłoneczne" : "Korekcyjne" }] : []),
    ...genders.map((g) => ({ type: "gender" as const, val: g, label: g })),
    ...shapes.map((s) => ({ type: "shape" as const, val: s, label: SHAPE_LABELS[s] ?? s })),
    ...colors.map((c) => ({ type: "color" as const, val: c, label: c })),
    ...(q ? [{ type: "q" as const, val: q, label: `„${q}”` }] : []),
  ];
  const removeChip = (chip: Chip) => {
    if (chip.type === "gender") setGenders(genders.filter((x) => x !== chip.val));
    else if (chip.type === "shape") setShapes(shapes.filter((x) => x !== chip.val));
    else if (chip.type === "color") setColors(colors.filter((x) => x !== chip.val));
    else if (chip.type === "category") setCategory("");
    else if (chip.type === "q") setQ("");
  };
  const activeCount = activeChips.length;
  const clearAll = () => {
    setGenders([]);
    setShapes([]);
    setColors([]);
    if (!lockCategory) setCategory("");
    setQ("");
  };

  const Group = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="border-b border-line py-5">
      <p className="eyebrow mb-3">{label}</p>
      {children}
    </div>
  );
  const Pill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick} className={cn("rounded-full border px-3.5 py-1.5 text-sm transition-colors", active ? "border-ink bg-ink text-paper" : "border-ink/20 text-ink hover:border-ink")}>
      {children}
    </button>
  );

  const Filters = (
    <div>
      {!lockCategory && (
        <Group label="Rodzaj">
          <div className="flex flex-wrap gap-2">
            {(["sun", "optical"] as const).map((c) => (
              <Pill key={c} active={category === c} onClick={() => setCategory(category === c ? "" : c)}>
                {c === "sun" ? "Przeciwsłoneczne" : "Korekcyjne"}
              </Pill>
            ))}
          </div>
        </Group>
      )}
      {facetGenders.length > 1 && (
        <Group label="Płeć">
          <div className="flex flex-wrap gap-2">
            {facetGenders.map((g) => (
              <Pill key={g} active={genders.includes(g)} onClick={() => toggle(genders, setGenders, g)}>{g}</Pill>
            ))}
          </div>
        </Group>
      )}
      <Group label="Fason">
        <div className="flex flex-wrap gap-2">
          {facetShapes.map((s) => (
            <Pill key={s} active={shapes.includes(s)} onClick={() => toggle(shapes, setShapes, s)}>{SHAPE_LABELS[s] ?? s}</Pill>
          ))}
        </div>
      </Group>
      <Group label="Kolor oprawy">
        <div className="flex flex-wrap gap-2.5">
          {facetColors.map((c) => (
            <button
              key={c}
              onClick={() => toggle(colors, setColors, c)}
              title={c}
              className={cn("flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm transition-colors", colors.includes(c) ? "border-ink" : "border-ink/15 hover:border-ink/40")}
            >
              <ColorSwatch name={c} size={20} />
              <span className="text-xs">{c}</span>
            </button>
          ))}
        </div>
      </Group>
    </div>
  );

  return (
    <div className="wrap py-10 md:py-14">
      <header className="mb-8">
        <p className="eyebrow">{subtitle}</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{intro}</p>}
      </header>

      <div className="grid gap-10 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-28">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone">{filtered.length} z {products.length}</span>
              {activeCount > 0 && (
                <button onClick={clearAll} className="text-xs text-terracotta hover:underline">Wyczyść ({activeCount})</button>
              )}
            </div>
            {Filters}
          </div>
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between gap-3">
            <button onClick={() => setDrawer(true)} className="flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm md:hidden">
              Filtry {activeCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-terracotta text-[0.65rem] text-paper">{activeCount}</span>}
            </button>
            <span className="hidden text-sm text-stone md:inline">{filtered.length} modeli</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-full border border-ink/20 bg-transparent px-4 py-2 text-sm outline-none">
              <option value="popular">Popularne</option>
              <option value="price-asc">Cena: rosnąco</option>
              <option value="price-desc">Cena: malejąco</option>
            </select>
          </div>

          {activeChips.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <AnimatePresence initial={false}>
                {activeChips.map((chip) => (
                  <motion.button
                    layout
                    key={chip.type + chip.val}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => removeChip(chip)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-linen px-3 py-1.5 text-xs text-ink hover:bg-clay/60"
                  >
                    {chip.label} <span className="text-stone">✕</span>
                  </motion.button>
                ))}
              </AnimatePresence>
              <button onClick={clearAll} className="text-xs text-terracotta hover:underline">Wyczyść wszystko</button>
            </div>
          )}

          {filtered.length > 0 ? (
            <motion.div
              key={`${category}|${genders.join()}|${shapes.join()}|${colors.join()}|${q}|${sort}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductGrid products={filtered} priorityCount={4} />
            </motion.div>
          ) : (
            <div className="py-24 text-center">
              <p className="font-display text-2xl">Brak wyników</p>
              <p className="mt-2 text-stone">Spróbuj zmienić filtry.</p>
              <button onClick={clearAll} className="mt-5 rounded-full bg-ink px-6 py-3 text-sm text-paper">Wyczyść filtry</button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-ink/40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div
              className="fixed bottom-0 left-0 z-50 max-h-[85vh] w-full overflow-y-auto rounded-t-[20px] bg-bg p-6 md:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-display text-2xl">Filtry</h2>
                <button onClick={() => setDrawer(false)} className="p-1.5 text-stone"><CloseIcon /></button>
              </div>
              {Filters}
              <div className="sticky bottom-0 mt-4 flex gap-3 bg-bg pt-3">
                {activeCount > 0 && (
                  <button onClick={clearAll} className="flex-1 rounded-full border border-ink/25 py-3 text-sm">Wyczyść</button>
                )}
                <button onClick={() => setDrawer(false)} className="flex-1 rounded-full bg-ink py-3 text-sm text-paper">Pokaż {filtered.length}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

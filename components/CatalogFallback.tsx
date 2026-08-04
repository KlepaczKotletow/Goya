import type { Product } from "@/lib/types";
import { ProductGrid } from "./ProductGrid";
import { cn } from "@/lib/utils";

/**
 * Server-rendered stand-in for <Catalog>.
 *
 * <Catalog> is a client component that reads useSearchParams, so Next cannot
 * prerender it — it renders THIS fallback into the static HTML instead and swaps
 * it out on hydration (see next/dist/docs .../use-search-params.md). Before this
 * existed the fallback was empty, which meant /okulary, /przeciwsloneczne and
 * /korekcyjne shipped zero links to any product page: the three highest-intent
 * pages on the site were empty shells to a crawler, and to anyone without JS.
 *
 * It deliberately mirrors Catalog's header + two-column layout so hydration
 * doesn't shift anything visually.
 */
export function CatalogFallback({
  products,
  title,
  subtitle,
  intro,
  hideHeader,
  limit = 36,
}: {
  products: Product[];
  title: string;
  subtitle?: string;
  intro?: string;
  hideHeader?: boolean;
  /** Matches the first paint of the hydrated grid; the client renders the rest. */
  limit?: number;
}) {
  // Catalog's default sort is popularity — mirror it so the swap is invisible.
  const shown = [...products].sort((a, b) => b.totalSales - a.totalSales).slice(0, limit);

  return (
    <div className={cn("wrap", hideHeader ? "pb-10 md:pb-14" : "py-10 md:py-14")}>
      {!hideHeader && (
        <header className="mb-8">
          {subtitle && <p className="eyebrow">{subtitle}</p>}
          <h1 className="mt-2 font-display text-4xl md:text-5xl">{title}</h1>
          {intro && <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{intro}</p>}
        </header>
      )}
      <div className="grid gap-10 md:grid-cols-[240px_1fr]">
        {/* Placeholder for the filter rail so the grid column keeps its width. */}
        <div className="hidden md:block" aria-hidden />
        <div>
          <ProductGrid products={shown} priorityCount={4} />
        </div>
      </div>
    </div>
  );
}

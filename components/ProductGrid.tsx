import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Stagger, StaggerItem } from "./Reveal";

export function ProductGrid({
  products,
  priorityCount = 0,
  stagger = false,
}: {
  products: Product[];
  priorityCount?: number;
  stagger?: boolean;
}) {
  // md stays at 2 columns: with the 240px filter sidebar a 3-col grid drops cards to ~123px,
  // too small to actually see a frame. 3-up from lg, 4-up from xl.
  const gridClass = "grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4";
  if (stagger) {
    return (
      <Stagger className={gridClass}>
        {products.map((p, i) => (
          <StaggerItem key={p.slug}>
            <ProductCard product={p} priority={i < priorityCount} />
          </StaggerItem>
        ))}
      </Stagger>
    );
  }
  return (
    <div className={gridClass}>
      {products.map((p, i) => (
        <ProductCard key={p.slug} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}

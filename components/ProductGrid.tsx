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
  const gridClass = "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4";
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

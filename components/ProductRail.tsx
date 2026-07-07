"use client";
import { useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

/* Horizontal snap-scroll rail with a thin amber progress line — no dots, no arrows. */
export function ProductRail({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  return (
    <div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-5 px-5 pb-2 sm:-mx-9 sm:scroll-pl-9 sm:px-9 md:gap-6"
      >
        {products.map((p, i) => (
          <div key={p.slug} className="w-[72%] shrink-0 snap-start sm:w-[42%] md:w-[31%] lg:w-[23.2%]">
            <ProductCard product={p} priority={i < priorityCount} />
          </div>
        ))}
      </div>
      <div className="mt-6 h-px w-full bg-line">
        <div
          className="relative h-px bg-sol transition-[width] duration-150 ease-out"
          style={{ width: `${Math.max(8, progress * 100)}%` }}
        >
          <span className="absolute -right-1 -top-[3px] h-[7px] w-[7px] rounded-full bg-sol" />
        </div>
      </div>
    </div>
  );
}

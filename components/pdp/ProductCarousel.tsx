import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductCard } from "../ProductCard";

export function ProductCarousel({ title, products, href }: { title: string; products: Product[]; href?: string }) {
  if (!products.length) return null;
  return (
    <section className="py-10 md:py-14">
      <div className="wrap mb-5 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
        {href && (
          <Link href={href} className="link-underline shrink-0 text-sm text-stone transition-colors hover:text-ink">
            Zobacz wszystkie →
          </Link>
        )}
      </div>
      <div className="wrap">
        <div className="hide-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-1 sm:-mx-9 sm:px-9">
          {products.map((p) => (
            <div key={p.slug} className="w-[72%] shrink-0 snap-start sm:w-[46%] md:w-[31%] lg:w-[23.5%]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

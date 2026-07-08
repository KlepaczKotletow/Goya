import { StarIcon, CheckIcon } from "../icons";
import { TRUST_STATS, REVIEWS } from "@/content/site";

function GreenStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} z 5 gwiazdek`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`grid h-4 w-4 place-items-center rounded-[3px] ${i <= Math.round(rating) ? "bg-[#00B67A]" : "bg-clay"}`}>
          <StarIcon className="h-2.5 w-2.5 text-paper" />
        </span>
      ))}
    </div>
  );
}

export function TrustBand() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="wrap py-14 md:py-20">
        <h2 className="mx-auto max-w-3xl text-center font-display text-[1.6rem] leading-[1.15] md:text-[2.2rem]">
          Zaufało nam ponad <span className="text-terracotta">12 000 klientek i klientów</span> w całej Polsce
        </h2>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-y-8 md:mt-14 md:grid-cols-4">
          {TRUST_STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5 border-line px-4 text-center odd:border-r md:border-r md:last:border-r-0">
              <p className="font-display text-3xl md:text-4xl">{s.value}</p>
              <p className="text-xs text-stone">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-10 md:mt-14">
          <div className="hide-scrollbar -mx-5 flex snap-x gap-3.5 overflow-x-auto px-5 sm:-mx-9 sm:px-9 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
            {REVIEWS.map((r) => (
              <article key={r.name} className="w-[80%] shrink-0 snap-start rounded-[14px] border border-line bg-bg p-5 sm:w-[46%] md:w-auto">
                <div className="flex items-center justify-between gap-3">
                  <GreenStars rating={r.rating} />
                  <span className="flex items-center gap-1 text-[0.65rem] font-semibold tracking-wide text-[#00865A]">
                    <CheckIcon className="h-3 w-3" /> Zweryfikowane
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-ink">{r.title}</h3>
                <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ink-soft">{r.text}</p>
                <p className="mt-3 text-xs text-stone">{r.name} · {r.city}</p>
              </article>
            ))}
          </div>
          <p className="mt-9 text-center text-sm text-stone">
            Średnia <strong className="font-semibold text-ink">4.8 ★</strong> z 5 · <strong className="font-semibold text-ink">ponad 5 000 opinii</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

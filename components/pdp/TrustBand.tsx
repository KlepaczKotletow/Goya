import { Stars } from "../Stars";
import { TRUST_STATS, REVIEWS } from "@/content/site";

export function TrustBand() {
  return (
    <section className="border-y border-line bg-ink text-paper">
      <div className="wrap py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-end">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-paper/55">Zaufanie</p>
            <h2 className="mt-3 font-display text-3xl leading-[1.05] text-paper md:text-[2.6rem]">
              Zaufało nam ponad 12 000 klientów w całej Polsce.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {TRUST_STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl text-paper">{s.value}</p>
                <p className="mt-1 text-xs text-paper/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-[16px] bg-paper/5 p-5 ring-1 ring-paper/10">
              <Stars rating={r.rating} />
              <p className="mt-3 text-sm leading-relaxed text-paper/85">„{r.text}”</p>
              <p className="mt-3 text-xs text-paper/55">{r.name} · {r.city}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NAV, SITE } from "@/content/site";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { SearchIcon, BagIcon, HeartIcon, BurgerIcon, CloseIcon } from "./icons";
import { SocialLinks } from "./SocialLinks";

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-terracotta px-1 text-[0.6rem] font-semibold text-paper">
      {n}
    </span>
  );
}

export function Header() {
  const { count, setOpen, wishlist, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const reduce = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      setHidden(y > 180 && y > last && !menu && !search);
      last = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menu, search]);

  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [pathname]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/okulary?q=${encodeURIComponent(term)}` : "/okulary");
    setSearch(false);
  };

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-[0.72rem] tracking-wider text-paper">
        Darmowa wysyłka &nbsp;·&nbsp; 30 dni na zwrot
        <span className="hidden sm:inline"> &nbsp;·&nbsp; Polaryzacja w każdej parze</span>
      </div>
      <header
        className={cn(
          "sticky top-0 z-40 transition-[transform,background-color,border-color] duration-300",
          hidden ? "-translate-y-full" : "translate-y-0",
          // No backdrop-blur. This header is sticky, so on iOS Safari the blurred
          // region was re-rasterised on every scroll frame — and while the cart
          // drawer's scrim was open it became a blur nested inside another blur.
          // At 96% the cream reads as the same soft bar without the filter.
          scrolled ? "border-b border-line bg-bg/96" : "border-b border-transparent bg-bg",
        )}
      >
        <div className={cn("wrap relative flex items-center justify-between gap-4 transition-[height] duration-300", scrolled ? "h-14 md:h-16" : "h-16 md:h-20")}>
          <div className="flex items-center gap-2 md:w-1/3">
            <button className="-ml-2.5 p-2.5 md:hidden" onClick={() => setMenu(true)} aria-label="Menu">
              <BurgerIcon />
            </button>
            <nav className="hidden items-center gap-5 text-sm md:flex lg:gap-6">
              {NAV.map((n, i) => {
                const active = !n.href.includes("?") && pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "link-underline whitespace-nowrap",
                      // Only the two category links fit beside the centred logo at md;
                      // any more and "Męskie" collides with it. Full nav from lg.
                      i >= 2 && "hidden lg:inline-block",
                      active && "text-terracotta [background-size:100%_1px]",
                    )}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Viewport-centring only from sm: at 320px the burger + three 40px icons
              leave no room, and the absolutely-centred wordmark lands under the
              search icon. Below sm it sits in normal flow between them instead. */}
          <Link
            href="/"
            aria-label={SITE.name}
            className={cn(
              "font-display tracking-tight transition-[font-size] duration-300",
              "sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
              scrolled ? "text-xl md:text-2xl" : "text-2xl md:text-[1.9rem]",
            )}
          >
            {SITE.name}
          </Link>

          <div className="flex items-center justify-end gap-0.5 md:w-1/3">
            <button className="p-2.5 transition hover:text-terracotta md:p-2" onClick={() => setSearch((s) => !s)} aria-label="Szukaj">
              <SearchIcon />
            </button>
            <Link href="/ulubione" className="relative p-2.5 transition hover:text-terracotta md:p-2" aria-label="Ulubione">
              <HeartIcon />
              {hydrated && wishlist.length > 0 && <Badge n={wishlist.length} />}
            </Link>
            <button className="relative p-2.5 transition hover:text-terracotta md:p-2" onClick={() => setOpen(true)} aria-label="Koszyk">
              <BagIcon />
              {hydrated && count > 0 && <Badge n={count} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {search && (
            <motion.form
              onSubmit={submit}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-line"
            >
              <div className="wrap flex items-center gap-3 py-4">
                <SearchIcon className="text-stone" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Szukaj modelu, kształtu, koloru…"
                  className="w-full bg-transparent text-lg outline-none placeholder:text-stone"
                />
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {menu && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)} />
            <motion.div
              className="fixed left-0 top-0 z-50 flex h-full w-[82%] max-w-sm flex-col bg-bg p-6 md:hidden"
              initial={reduce ? { opacity: 0 } : { x: "-100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "-100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display text-2xl">{SITE.name}</span>
                <button onClick={() => setMenu(false)} aria-label="Zamknij" className="p-2 text-stone">
                  <CloseIcon />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV.map((n) => {
                  const active = !n.href.includes("?") && pathname === n.href;
                  return (
                    <Link
                      key={n.href}
                      href={n.href}
                      aria-current={active ? "page" : undefined}
                      className={cn("border-b border-line py-3.5 font-display text-2xl", active && "text-terracotta")}
                    >
                      {n.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto">
                <SocialLinks />
                <p className="mt-4 text-sm text-stone">{SITE.tagline}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

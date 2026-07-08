"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { NAV, SITE } from "@/content/site";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { SearchIcon, BagIcon, HeartIcon, BurgerIcon, CloseIcon } from "./icons";

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
        Darmowa wysyłka &nbsp;·&nbsp; 30 dni na zwrot &nbsp;·&nbsp; Polaryzacja w każdej parze
      </div>
      <header
        className={cn(
          "sticky top-0 z-40 transition-[transform,background-color,border-color] duration-300",
          hidden ? "-translate-y-full" : "translate-y-0",
          scrolled ? "border-b border-line bg-bg/90 backdrop-blur-md" : "border-b border-transparent bg-bg",
        )}
      >
        <div className={cn("wrap flex items-center justify-between gap-4 transition-[height] duration-300", scrolled ? "h-14 md:h-16" : "h-16 md:h-20")}>
          <div className="flex items-center gap-2 md:w-1/3">
            <button className="-ml-2 p-2 md:hidden" onClick={() => setMenu(true)} aria-label="Menu">
              <BurgerIcon />
            </button>
            <nav className="hidden items-center gap-7 text-sm md:flex">
              {NAV.slice(0, 3).map((n) => (
                <Link key={n.href} href={n.href} className="link-underline">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/" className={cn("font-display tracking-tight transition-all duration-300 md:w-1/3 md:text-center", scrolled ? "text-xl md:text-2xl" : "text-2xl md:text-[1.9rem]")}>
            {SITE.name}
          </Link>

          <div className="flex items-center justify-end gap-0.5 md:w-1/3">
            <button className="p-2 transition hover:text-terracotta" onClick={() => setSearch((s) => !s)} aria-label="Szukaj">
              <SearchIcon />
            </button>
            <Link href="/ulubione" className="relative p-2 transition hover:text-terracotta" aria-label="Ulubione">
              <HeartIcon />
              {hydrated && wishlist.length > 0 && <Badge n={wishlist.length} />}
            </Link>
            <button className="relative p-2 transition hover:text-terracotta" onClick={() => setOpen(true)} aria-label="Koszyk">
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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display text-2xl">{SITE.name}</span>
                <button onClick={() => setMenu(false)} aria-label="Zamknij" className="p-2 text-stone">
                  <CloseIcon />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV.map((n) => (
                  <Link key={n.href} href={n.href} className="border-b border-line py-3.5 font-display text-2xl">
                    {n.label}
                  </Link>
                ))}
              </nav>
              <p className="mt-auto text-sm text-stone">{SITE.tagline}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

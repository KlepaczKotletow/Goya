"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  key: string;
  slug: string;
  name: string;
  price: number;
  /** Real list price when one exists — never a computed fake discount. */
  regularPrice?: number | null;
  image: string | null;
  variant?: string | null;
  /** Which variation was chosen, so the server can re-price and stock-check it. */
  variationId?: number | null;
  qty: number;
};

type CartApi = {
  lines: CartLine[];
  wishlist: string[];
  open: boolean;
  hydrated: boolean;
  add: (line: Omit<CartLine, "qty" | "key"> & { key?: string; qty?: number }) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  toggleWish: (slug: string) => void;
  isWished: (slug: string) => boolean;
  setOpen: (v: boolean) => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartApi | null>(null);
const LS_KEY = "goya-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setLines(Array.isArray(p.lines) ? p.lines : []);
        setWishlist(Array.isArray(p.wishlist) ? p.wishlist : []);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ lines, wishlist }));
    } catch {
      /* ignore */
    }
  }, [lines, wishlist, hydrated]);

  const add = useCallback<CartApi["add"]>((line) => {
    const key = line.key ?? line.slug;
    setLines((prev) => {
      const i = prev.findIndex((l) => l.key === key);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + (line.qty ?? 1) };
        return next;
      }
      return [...prev, { ...line, key, qty: line.qty ?? 1 }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((key: string) => setLines((p) => p.filter((l) => l.key !== key)), []);
  const setQty = useCallback(
    (key: string, qty: number) =>
      setLines((p) => (qty <= 0 ? p.filter((l) => l.key !== key) : p.map((l) => (l.key === key ? { ...l, qty } : l)))),
    [],
  );
  const clear = useCallback(() => setLines([]), []);
  const toggleWish = useCallback(
    (slug: string) => setWishlist((p) => (p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug])),
    [],
  );
  const isWished = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);

  const value = useMemo<CartApi>(
    () => ({ lines, wishlist, open, hydrated, add, remove, setQty, clear, toggleWish, isWished, setOpen, count, subtotal }),
    [lines, wishlist, open, hydrated, add, remove, setQty, clear, toggleWish, isWished, count, subtotal],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartApi {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

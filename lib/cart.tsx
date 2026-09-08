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

/**
 * Three contexts, not one.
 *
 * Everything used to live in a single value, so any change to it re-rendered
 * every `useCart()` consumer. On the catalogue that is one ProductCard per
 * product — measured on the live site: 136 of them. Adding a pair to the bag, or
 * merely opening and closing the drawer, re-rendered all 136, on a phone, in the
 * same frame as the drawer's opening animation. That is the "adding to cart is
 * not smooth" the shop actually feels.
 *
 * Split by how often each part changes:
 *   Actions   — stable for the life of the app; a component that only acts on
 *               the cart never re-renders because of it.
 *   Wishlist  — changes only when a heart is tapped.
 *   State     — lines / open / totals: changes on every cart mutation.
 *
 * A card needs actions plus one boolean about itself, so it now subscribes to
 * the two quiet contexts and is untouched by add/remove/open entirely.
 */
type CartActions = Pick<CartApi, "add" | "remove" | "setQty" | "clear" | "toggleWish" | "setOpen">;
type CartState = Omit<CartApi, keyof CartActions | "wishlist" | "isWished">;

const ActionsCtx = createContext<CartActions | null>(null);
const WishlistCtx = createContext<string[] | null>(null);
const StateCtx = createContext<CartState | null>(null);
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
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);

  // Every member is stable, so this object is created once and never again —
  // that is what keeps action-only consumers out of the re-render.
  const actions = useMemo<CartActions>(
    () => ({ add, remove, setQty, clear, toggleWish, setOpen }),
    [add, remove, setQty, clear, toggleWish],
  );

  const state = useMemo<CartState>(
    () => ({ lines, open, hydrated, count, subtotal }),
    [lines, open, hydrated, count, subtotal],
  );

  return (
    <ActionsCtx.Provider value={actions}>
      <WishlistCtx.Provider value={wishlist}>
        <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
      </WishlistCtx.Provider>
    </ActionsCtx.Provider>
  );
}

/** Cart mutators only. Subscribing to this never causes a re-render. */
export function useCartActions(): CartActions {
  const c = useContext(ActionsCtx);
  if (!c) throw new Error("useCartActions must be used within CartProvider");
  return c;
}

/** Is this one product wished? Re-renders only when the wishlist changes. */
export function useIsWished(slug: string): boolean {
  const w = useContext(WishlistCtx);
  if (!w) throw new Error("useIsWished must be used within CartProvider");
  return w.includes(slug);
}

/**
 * The whole cart. Re-renders on any change, so reach for the narrow hooks above
 * in anything that renders once per product.
 */
export function useCart(): CartApi {
  const actions = useContext(ActionsCtx);
  const wishlist = useContext(WishlistCtx);
  const state = useContext(StateCtx);
  if (!actions || !wishlist || !state) throw new Error("useCart must be used within CartProvider");
  return useMemo(
    () => ({ ...state, ...actions, wishlist, isWished: (slug: string) => wishlist.includes(slug) }),
    [state, actions, wishlist],
  );
}

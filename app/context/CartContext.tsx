"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Product } from "@/app/lib/api";

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
}

type CartAction =
  | { type: "add"; product: Product; quantity?: number }
  | { type: "remove"; productId: string }
  | { type: "setQty"; productId: string; quantity: number }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

const STORAGE_KEY = "lumera-cart";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const qty = action.quantity ?? 1;
      const existing = state.lines.find(
        (l) => l.product._id === action.product._id,
      );
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.product._id === action.product._id
              ? { ...l, quantity: l.quantity + qty }
              : l,
          ),
        };
      }
      return { lines: [...state.lines, { product: action.product, quantity: qty }] };
    }
    case "remove":
      return {
        lines: state.lines.filter((l) => l.product._id !== action.productId),
      };
    case "setQty":
      return {
        lines: state.lines
          .map((l) =>
            l.product._id === action.productId
              ? { ...l, quantity: Math.max(1, action.quantity) }
              : l,
          )
          .filter((l) => l.quantity > 0),
      };
    case "clear":
      return { lines: [] };
    case "hydrate":
      return { lines: action.lines };
    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", lines: JSON.parse(raw) });
    } catch {
      // ignore corrupt storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
  }, [state.lines]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = state.lines.reduce(
      (sum, l) => sum + l.product.price * l.quantity,
      0,
    );
    return {
      lines: state.lines,
      count,
      subtotal,
      add: (product, quantity) => dispatch({ type: "add", product, quantity }),
      remove: (productId) => dispatch({ type: "remove", productId }),
      setQty: (productId, quantity) =>
        dispatch({ type: "setQty", productId, quantity }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state.lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

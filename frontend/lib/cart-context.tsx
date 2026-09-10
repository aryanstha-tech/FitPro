"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartLine {
  productId: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  addItem: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "fitpro_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  // Start empty on the server and on first client render, then hydrate
  // from localStorage — this avoids a server/client mismatch, since
  // localStorage doesn't exist during server rendering.
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setLines(JSON.parse(raw));
      } catch {
        // Corrupt or outdated cart data — safest to just start fresh.
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  function addItem(item: Omit<CartLine, "quantity">, quantity = 1) {
    setLines((prev) => {
      const existing = prev.find((line) => line.productId === item.productId);
      if (existing) {
        return prev.map((line) =>
          line.productId === item.productId ? { ...line, quantity: line.quantity + quantity } : line
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }

  function updateQuantity(productId: number, quantity: number) {
    setLines((prev) => prev.map((line) => (line.productId === productId ? { ...line, quantity } : line)));
  }

  function removeItem(productId: number) {
    setLines((prev) => prev.filter((line) => line.productId !== productId));
  }

  function clear() {
    setLines([]);
  }

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  return (
    <CartContext.Provider value={{ lines, addItem, updateQuantity, removeItem, clear, itemCount, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
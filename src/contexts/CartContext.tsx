import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product } from '../lib/api';

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  open: boolean;
  setOpen: (o: boolean) => void;
}

const Ctx = createContext<CartCtx>(null as any);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ramiya_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ramiya_cart', JSON.stringify(items));
  }, [items]);

  const add = (p: Product) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === p.id);
      if (found) return prev.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { product: p, qty: 1 }];
    });
    setOpen(true);
  };

  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.product.id !== id));
  const setQty = (id: number, qty: number) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.product.id !== id) : prev.map((i) => (i.product.id === id ? { ...i, qty } : i))
    );
  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, total, count, open, setOpen }}>
      {children}
    </Ctx.Provider>
  );
}

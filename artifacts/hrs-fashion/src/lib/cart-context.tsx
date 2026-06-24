import { createContext, useContext, useState, useCallback } from "react";
import type { Product } from "@/lib/data";

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, size: string) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product, size: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.selectedSize === size);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.selectedSize === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.selectedSize === size)));
  }, []);

  const updateQuantity = useCallback((id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => !(i.id === id && i.selectedSize === size)));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.id === id && i.selectedSize === size ? { ...i, quantity } : i
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

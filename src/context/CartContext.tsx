'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  createCart,
  getCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
} from '@/lib/shopify';
import type { ShopifyCart, CartContextType, AddToCartInput } from '@/lib/shopify/types';

const CartContext = createContext<CartContextType | null>(null);

const CART_ID_KEY = 'aag_shopify_cart_id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Rehydrate cart from localStorage on mount
  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;

    getCart(cartId)
      .then((c) => {
        if (c) {
          setCart(c);
        } else {
          localStorage.removeItem(CART_ID_KEY);
        }
      })
      .catch(() => localStorage.removeItem(CART_ID_KEY));
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const addToCart = useCallback(async ({ variantId, quantity, attributes }: AddToCartInput) => {
    setLoading(true);
    try {
      const line = { merchandiseId: variantId, quantity, attributes };
      const cartId = localStorage.getItem(CART_ID_KEY);
      let updated: ShopifyCart;

      if (cartId) {
        updated = await addCartLines(cartId, [line]);
      } else {
        updated = await createCart([line]);
        localStorage.setItem(CART_ID_KEY, updated.id);
      }

      setCart(updated);
      setCartOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCartLine = useCallback(async (lineId: string, quantity: number) => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;
    setLoading(true);
    try {
      const updated = await updateCartLines(cartId, [{ id: lineId, quantity }]);
      setCart(updated);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeCartLine = useCallback(async (lineId: string) => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;
    setLoading(true);
    try {
      const updated = await removeCartLines(cartId, [lineId]);
      setCart(updated);
    } finally {
      setLoading(false);
    }
  }, []);

  const cartCount = cart?.totalQuantity ?? 0;

  return (
    <CartContext.Provider
      value={{ cart, cartOpen, loading, openCart, closeCart, addToCart, updateCartLine, removeCartLine, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

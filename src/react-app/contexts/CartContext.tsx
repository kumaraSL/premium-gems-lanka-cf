import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, CartItem } from '../lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
  addToCart: (product: { id: string; name: string; price: number; image_url: string }, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) { setCartItems([]); return; }
    setIsLoading(true);
    try {
      const { items } = await api.cart.get();
      setCartItems(items);
    } catch {
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchCart();
  }, [user, authLoading]);

  const addToCart = async (product: { id: string; name: string; price: number; image_url: string }, quantity = 1) => {
    if (!user) { alert('Please log in to add items to your cart.'); return; }
    const { items } = await api.cart.add({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
      quantity,
    });
    setCartItems(items);
  };

  const removeFromCart = async (id: string) => {
    await api.cart.remove(id);
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = async (id: string, quantity: number) => {
    const { items } = await api.cart.update(id, quantity);
    setCartItems(items);
  };

  const clearCart = async () => {
    await api.cart.clear();
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartTotal, cartCount, isLoading, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

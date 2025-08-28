'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem, Order, QualityIssue } from '../types';

interface CartContextType {
  cart: Cart;
  orders: Order[];
  qualityIssues: QualityIssue[];
  isCartOpen: boolean;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  placeOrder: (order: Order) => void;
  reportIssue: (issue: QualityIssue) => void;
  reorder: (orderId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [orders, setOrders] = useState<Order[]>([]);
  const [qualityIssues, setQualityIssues] = useState<QualityIssue[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('coffeecart-cart');
    const savedOrders = localStorage.getItem('coffeecart-orders');
    const savedIssues = localStorage.getItem('coffeecart-issues');

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    if (savedIssues) {
      setQualityIssues(JSON.parse(savedIssues));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('coffeecart-cart', JSON.stringify(cart));
  }, [cart]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('coffeecart-orders', JSON.stringify(orders));
  }, [orders]);

  // Save issues to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('coffeecart-issues', JSON.stringify(qualityIssues));
  }, [qualityIssues]);

  const addToCart = (productId: string, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.productId === productId);
      
      if (existingItem) {
        return {
          ...prevCart,
          items: prevCart.items.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      } else {
        return {
          ...prevCart,
          items: [...prevCart.items, { productId, quantity }]
        };
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.filter(item => item.productId !== productId)
    }));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    }));
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const placeOrder = (order: Order) => {
    setOrders(prevOrders => [order, ...prevOrders]);
    clearCart();
    closeCart();
  };

  const reportIssue = (issue: QualityIssue) => {
    setQualityIssues(prevIssues => [issue, ...prevIssues]);
  };

  const reorder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setCart({ items: [...order.items] });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        qualityIssues,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        placeOrder,
        reportIssue,
        reorder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

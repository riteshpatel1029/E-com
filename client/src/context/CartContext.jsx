import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext(null);

const DEFAULT_SAMPLE_ITEMS = [
  {
    product: '65b8ee901b4a92c3a4f89125',
    name: 'Smartphone Pro Max 5G',
    price: 899.99,
    quantity: 1,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=500&q=80',
  },
  {
    product: '65b8ef201b4a92c3a4f89140',
    name: 'Wireless Noise-Cancelling Headphones',
    price: 199.99,
    quantity: 1,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  },
];

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      if (stored) {
        return JSON.parse(stored);
      }
      return DEFAULT_SAMPLE_ITEMS;
    } catch {
      return DEFAULT_SAMPLE_ITEMS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to sync cart to localStorage:', err);
    }
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product === (product._id || product.product));
      if (existingIndex > -1) {
        const item = prev[existingIndex];
        const newQty = Math.min((item.quantity || 1) + quantity, item.stock || 99);
        const updated = [...prev];
        updated[existingIndex] = { ...item, quantity: newQty };
        return updated;
      }
      return [
        ...prev,
        {
          product: product._id || product.product,
          name: product.name,
          price: product.price,
          quantity: Math.min(quantity, product.stock || 99),
          stock: product.stock || 99,
          image: product.image,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product === productId) {
            const validQty = Math.max(1, Math.min(quantity, item.stock || 99));
            return { ...item, quantity: validQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  }, []);

  const loadSampleCart = useCallback(() => {
    setCartItems(DEFAULT_SAMPLE_ITEMS);
    localStorage.setItem('cartItems', JSON.stringify(DEFAULT_SAMPLE_ITEMS));
  }, []);

  const totalCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  }, [cartItems]);

  const value = {
    cartItems,
    totalCount,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadSampleCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

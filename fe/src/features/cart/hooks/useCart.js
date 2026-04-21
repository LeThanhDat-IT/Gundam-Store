import { useState } from 'react';

export const useCart = (initialItems = []) => {
  const [cartItems, setCartItems] = useState(initialItems);

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { cartItems, updateQuantity, removeItem, totalPrice };
};
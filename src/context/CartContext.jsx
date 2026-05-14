import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem('user_id'));

  // Function to load the cart for the current user
  const loadCart = useCallback(() => {
    const currentUserId = localStorage.getItem('user_id');
    setUserId(currentUserId);
    
    if (currentUserId) {
      const savedCart = localStorage.getItem(`cart_${currentUserId}`);
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart', e);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    } else {
      // Clear cart from memory if no user is logged in
      setCartItems([]); 
    }
  }, []);

  // Run on mount and listen to custom auth events
  useEffect(() => {
    loadCart();
    
    const handleAuthChange = () => {
      loadCart();
    };
    
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, [loadCart]);

  // Save cart to user-specific localStorage whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
    }
  }, [cartItems, userId]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Fix for React Strict Mode Double-Increment Bug:
        // Deep copy the item to ensure we aren't mutating the previous state's reference directly
        const updatedItems = [...prevItems];
        const currentItem = { ...updatedItems[existingItemIndex] };
        
        if (currentItem.quantity + quantity <= product.stock) {
          currentItem.quantity += quantity;
        } else {
          currentItem.quantity = product.stock;
        }
        
        updatedItems[existingItemIndex] = currentItem;
        return updatedItems; 
      }
      
      return [...prevItems, { ...product, quantity: quantity }];
    });
  };

  const increaseQuantity = (productId) => {
    setCartItems((prevItems) => 
      prevItems.map(item => {
        if (item.id === productId && item.quantity < item.stock) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) => 
      prevItems.map(item => {
        if (item.id === productId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      cartCount, 
      cartTotal,
      increaseQuantity,
      decreaseQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};

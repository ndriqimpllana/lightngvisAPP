import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your Publishable Key
// Replace 'pk_test_...' with your actual key from the Stripe Dashboard
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load cart from local storage if available
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Persist to local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Add item to cart (merges duplicates based on ID + Options)
  const addToCart = (product, options = {}) => {
    setCart((prevCart) => {
      // Create a unique identifier for this specific configuration (e.g. Size + Frame)
      // We assume product has an 'id' and options contains selected attributes
      const cartItemId = `${product.id}-${JSON.stringify(options)}`;
      
      const existingItemIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { ...product, ...options, cartItemId, quantity: 1 }];
      }
    });
    openCart();
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const checkout = async () => {
    if (isCheckingOut) return;
    setIsCheckingOut(true);

    const stripe = await stripePromise;
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: 'Could not initiate checkout.' }));
        console.error("Failed to create checkout session:", errorBody.error);
        alert(`Error: ${errorBody.error}`);
        return;
      }

      const session = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        console.error(result.error.message);
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Checkout process error:", error);
      alert("An unexpected error occurred during checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartTotal,
      cartCount,
      checkout,
      isCheckingOut
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
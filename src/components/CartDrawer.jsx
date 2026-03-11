import React from 'react';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    cartCount,
    checkout 
  } = useCart();

  // We render the component but control visibility with CSS classes
  // to allow for transitions/animations if needed, or simple conditional rendering
  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-backdrop" onClick={closeCart}></div>
      <div className={`cart-drawer ${isCartOpen ? 'cart-drawer--open' : ''}`}>
        <div className="cart-drawer__header">
          <div className="cart-drawer__title">
            Your Cart <span className="cart-drawer__count">{cartCount}</span>
          </div>
          <button className="cart-drawer__close" onClick={closeCart} aria-label="Close cart">
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-drawer__empty">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {cart.map((item) => (
                <div className="cart-item" key={item.cartItemId}>
                  <div className="cart-item__img-wrap">
                    {/* Ensure your product object has an 'img' or 'image' property */}
                    <img src={item.img || item.image} alt={item.title} className="cart-item__img" />
                  </div>
                  <div className="cart-item__info">
                    <h4 className="cart-item__title">{item.title}</h4>
                    {/* Render optional attributes if they exist */}
                    <p className="cart-item__meta">
                      {item.size && <span>{item.size}</span>}
                      {item.frame && <span> / {item.frame}</span>}
                    </p>
                    <div className="cart-item__bottom">
                      <div className="cart-item__qty">
                        <button onClick={() => updateQuantity(item.cartItemId, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, 1)}>+</button>
                      </div>
                      <div className="cart-item__price">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.cartItemId)}>✕</button>
                </div>
              ))}
            </div>
            <div className="cart-drawer__footer">
              <div className="cart-drawer__total">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button className="btn cart-drawer__checkout" onClick={checkout}>Checkout</button>
              <p className="cart-drawer__secure">Secured by Stripe</p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
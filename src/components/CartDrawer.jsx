import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './CartDrawer.css'

export default function CartDrawer() {
  const { items, removeItem, updateQty, totalPrice, clearCart, isOpen, setIsOpen } = useCart()
  const navigate = useNavigate()

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setIsOpen])

  const handleCheckout = () => {
    setIsOpen(false)
    navigate('/checkout')
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="cart-backdrop" onClick={() => setIsOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`} role="dialog" aria-label="Shopping cart">

        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Cart {items.length > 0 && <span className="cart-drawer__count">{items.reduce((s, i) => s + i.qty, 0)}</span>}
          </h2>
          <button className="cart-drawer__close" onClick={() => setIsOpen(false)} aria-label="Close cart">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <>
            <ul className="cart-drawer__items">
              {items.map((item, idx) => (
                <li key={idx} className="cart-item">
                  <div className="cart-item__img-wrap">
                    <img src={item.src} alt={item.title} className="cart-item__img" />
                  </div>

                  <div className="cart-item__info">
                    <p className="cart-item__title">{item.title}</p>
                    <p className="cart-item__meta">{item.size} · {item.material}</p>
                    {item.frame !== 'No Frame' && (
                      <p className="cart-item__meta">{item.frame}{item.mat !== 'No Mat' ? ` · ${item.mat} mat` : ''}</p>
                    )}

                    <div className="cart-item__bottom">
                      <div className="cart-item__qty">
                        <button onClick={() => updateQty(idx, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(idx, item.qty + 1)}>+</button>
                      </div>
                      <span className="cart-item__price">${item.price * item.qty}</span>
                    </div>
                  </div>

                  <button className="cart-item__remove" onClick={() => removeItem(idx)} aria-label="Remove">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__total">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
              <button className="btn cart-drawer__checkout" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              <button
                className="cart-drawer__clear"
                onClick={() => { if (window.confirm('Remove all items from your cart?')) clearCart() }}
              >
                Empty cart
              </button>
              <p className="cart-drawer__secure">Secure payment via Stripe</p>
            </div>
          </>
        )}
      </div>
    </>
  )
}

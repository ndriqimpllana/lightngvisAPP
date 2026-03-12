import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'
import './Checkout.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

/* ── Stripe appearance matching site theme ───────────────────── */
const STRIPE_APPEARANCE = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#000000',
    colorBackground: '#ffffff',
    colorText: '#000000',
    colorDanger: '#c0392b',
    fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif',
    borderRadius: '0px',
    fontSizeBase: '14px',
  },
  rules: {
    '.Input': {
      border: '1px solid #e5e5e5',
      boxShadow: 'none',
      padding: '0.7rem 0.85rem',
    },
    '.Input:focus': {
      border: '1px solid #000000',
      boxShadow: 'none',
      outline: 'none',
    },
    '.Label': {
      fontSize: '0.62rem',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#525252',
      fontFamily: '"Roboto", sans-serif',
    },
    '.Tab': { border: '1px solid #e5e5e5', boxShadow: 'none' },
    '.Tab--selected': { border: '1px solid #000', boxShadow: 'none' },
  },
}

/* ── Payment form (must be inside <Elements>) ────────────────── */
function PaymentForm({ totalPrice }) {
  const stripe   = useStripe()
  const elements = useElements()
  const { clearCart } = useCart()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error,   setError  ] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const { error: submitErr } = await elements.submit()
    if (submitErr) { setError(submitErr.message); setLoading(false); return }

    const { error: confirmErr } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/shop?order=success`,
      },
      redirect: 'if_required',
    })

    if (confirmErr) {
      setError(confirmErr.message)
      setLoading(false)
    } else {
      clearCart()
      navigate('/shop?order=success')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form__group">
      <span className="checkout-section-label">Payment</span>
      <PaymentElement />
      {error && <p className="checkout-error">{error}</p>}
      <button type="submit" className="btn checkout-submit" disabled={!stripe || loading}>
        {loading ? 'Processing…' : `Pay $${totalPrice}`}
      </button>
      <p className="checkout-secure">Secured by Stripe · SSL encrypted</p>
    </form>
  )
}

/* ── Main checkout page ──────────────────────────────────────── */
export default function Checkout() {
  const { items, totalPrice, totalCount } = useCart()
  const navigate = useNavigate()
  const [clientSecret, setClientSecret] = useState(null)
  const [fetchError,   setFetchError  ] = useState(null)

  useEffect(() => {
    if (items.length === 0) return
    fetch('/api/create-payment-intent', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ items }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.clientSecret) setClientSecret(d.clientSecret)
        else setFetchError('Could not initialise payment. Please try again.')
      })
      .catch(() => setFetchError('Could not connect to payment service.'))
  }, [])  // run once on mount

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <p>Your cart is empty.</p>
        <Link to="/shop" className="btn">Back to Shop</Link>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-page__inner">

        {/* ── Left: order summary ── */}
        <div className="checkout-summary">
          <h1 className="checkout-summary__title">Your Order</h1>
          <span className="checkout-section-label">{totalCount} {totalCount === 1 ? 'item' : 'items'}</span>

          <div className="checkout-summary__items">
            {items.map((item, idx) => (
              <div className="co-item" key={idx}>
                <img src={item.src} alt={item.title} className="co-item__img" />
                <div className="co-item__info">
                  <span className="co-item__title">{item.title}</span>
                  <span className="co-item__meta">{item.size} · {item.material}</span>
                  {item.frame !== 'No Frame' && (
                    <span className="co-item__meta">
                      {item.frame}{item.mat !== 'No Mat' ? ` · ${item.mat} mat` : ''}
                    </span>
                  )}
                  <span className="co-item__meta">Qty {item.qty}</span>
                  <span className="co-item__price">${item.price * item.qty}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-summary__totals">
            <div className="co-total-row">
              <span>Subtotal</span>
              <span>${totalPrice}</span>
            </div>
            <div className="co-total-row">
              <span>Shipping</span>
              <span>Calculated at next step</span>
            </div>
            <div className="co-total-row co-total-row--grand">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>

        {/* ── Right: payment ── */}
        <div className="checkout-form-col">
          {fetchError && <p className="checkout-error">{fetchError}</p>}

          {clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: STRIPE_APPEARANCE }}
            >
              <PaymentForm totalPrice={totalPrice} />
            </Elements>
          ) : !fetchError ? (
            <p className="checkout-secure" style={{ marginTop: '4rem' }}>Loading payment…</p>
          ) : null}
        </div>

      </div>
    </div>
  )
}

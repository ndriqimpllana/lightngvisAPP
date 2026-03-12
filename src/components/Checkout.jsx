import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'
import './Checkout.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const STRIPE_APPEARANCE = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#000000',
    colorBackground: '#ffffff',
    colorText: '#000000',
    colorDanger: '#c0392b',
    fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif',
    borderRadius: '0px',
    fontSizeBase: '15px',
    spacingUnit: '5px',
  },
  rules: {
    '.Input': { border: '1px solid #e5e5e5', boxShadow: 'none', padding: '12px 14px' },
    '.Input:focus': { border: '1px solid #000', boxShadow: 'none' },
    '.Label': { fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#525252' },
    '.Tab': { border: '1px solid #e5e5e5', boxShadow: 'none' },
    '.Tab--selected': { border: '1px solid #000', boxShadow: 'none' },
    '.Tab--selected:focus': { boxShadow: 'none' },
    '.Block': { border: '1px solid #e5e5e5', boxShadow: 'none' },
  },
}

/* ── Payment form inside Elements ────────────────────────────── */
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

    const { error: confirmErr } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/shop?order=success` },
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
    <form onSubmit={handleSubmit}>
      <div className="co-payment-wrap">
        <p className="co-label">Payment details</p>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {error && <p className="co-error">{error}</p>}

      <button
        type="submit"
        className="btn co-pay-btn"
        disabled={!stripe || loading}
      >
        {loading ? 'Processing…' : `Pay $${totalPrice}`}
      </button>

      <p className="co-secure">
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none" style={{marginRight:'6px',verticalAlign:'middle'}}>
          <rect x="1" y="5" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M3 5V3.5a2.5 2.5 0 015 0V5" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
        Secured by Stripe · SSL encrypted
      </p>
    </form>
  )
}

/* ── Main page ───────────────────────────────────────────────── */
export default function Checkout() {
  const { items, totalPrice, totalCount } = useCart()
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
        else setFetchError(d.error || 'Could not initialise payment — please try again.')
      })
      .catch(() => setFetchError('Could not connect to payment service.'))
  }, [])

  if (items.length === 0) {
    return (
      <div className="co-empty">
        <p>Your cart is empty.</p>
        <Link to="/shop" className="btn">Back to Shop</Link>
      </div>
    )
  }

  return (
    <div className="co-page">
      {/* Back link */}
      <Link to="/shop" className="co-back">← Back to Shop</Link>

      <div className="co-grid">

        {/* ── LEFT: payment form ── */}
        <div className="co-left">
          <h1 className="co-heading">Checkout</h1>

          {fetchError && (
            <div className="co-fetch-error">
              <strong>Payment unavailable</strong>
              <p>{fetchError}</p>
            </div>
          )}

          {!clientSecret && !fetchError && (
            <div className="co-loading">
              <span />
              <span />
              <span />
            </div>
          )}

          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: STRIPE_APPEARANCE }}
            >
              <PaymentForm totalPrice={totalPrice} />
            </Elements>
          )}
        </div>

        {/* ── RIGHT: order summary ── */}
        <aside className="co-summary">
          <p className="co-label">Order summary · {totalCount} {totalCount === 1 ? 'item' : 'items'}</p>

          <ul className="co-items">
            {items.map((item, idx) => (
              <li key={idx} className="co-item">
                <div className="co-item__img-wrap">
                  <img src={item.src} alt={item.title} className="co-item__img" />
                  {item.qty > 1 && <span className="co-item__qty-badge">{item.qty}</span>}
                </div>
                <div className="co-item__details">
                  <span className="co-item__title">{item.title}</span>
                  <span className="co-item__spec">{item.size} · {item.material}</span>
                  {item.frame !== 'No Frame' && (
                    <span className="co-item__spec">
                      {item.frame}{item.mat !== 'No Mat' ? ` · ${item.mat} mat` : ''}
                    </span>
                  )}
                </div>
                <span className="co-item__price">${item.price * item.qty}</span>
              </li>
            ))}
          </ul>

          <div className="co-totals">
            <div className="co-totals__row">
              <span>Subtotal</span>
              <span>${totalPrice}</span>
            </div>
            <div className="co-totals__row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="co-totals__row co-totals__row--total">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}

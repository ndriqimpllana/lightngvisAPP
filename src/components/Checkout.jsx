import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'
import './Checkout.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const CARD_STYLE = {
  style: {
    base: {
      fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif',
      fontSize: '15px',
      color: '#000000',
      letterSpacing: '0.02em',
      '::placeholder': { color: '#a3a3a3' },
    },
    invalid: { color: '#c0392b' },
  },
}

/* ── Payment form ────────────────────────────────────────────── */
function PaymentForm({ totalPrice, clientSecret }) {
  const stripe   = useStripe()
  const elements = useElements()
  const { clearCart } = useCart()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error,   setError  ] = useState(null)

  // Contact fields
  const [email,   setEmail  ] = useState('')
  const [phone,   setPhone  ] = useState('')
  // Shipping fields
  const [name,    setName   ] = useState('')
  const [address, setAddress] = useState('')
  const [city,    setCity   ] = useState('')
  const [state,   setState  ] = useState('')
  const [zip,     setZip    ] = useState('')
  const [country, setCountry] = useState('US')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)

    const card = elements.getElement(CardNumberElement)
    const { error: pmErr, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
      billing_details: {
        name,
        email,
        phone,
        address: { line1: address, city, state, postal_code: zip, country },
      },
    })

    if (pmErr) { setError(pmErr.message); setLoading(false); return }

    const { error: confirmErr } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
      receipt_email: email,
      shipping: {
        name,
        phone,
        address: { line1: address, city, state, postal_code: zip, country },
      },
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
    <form onSubmit={handleSubmit} className="co-form">

      {/* Contact */}
      <section className="co-section">
        <p className="co-label">Contact</p>
        <div className="co-field-grid">
          <div className="co-field co-field--full">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" required
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="co-field co-field--full">
            <label>Phone</label>
            <input type="tel" placeholder="+1 (555) 000-0000"
              value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section className="co-section">
        <p className="co-label">Shipping address</p>
        <div className="co-field-grid">
          <div className="co-field co-field--full">
            <label>Full name</label>
            <input type="text" placeholder="Jane Smith" required
              value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="co-field co-field--full">
            <label>Address</label>
            <input type="text" placeholder="123 Main St" required
              value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <div className="co-field">
            <label>City</label>
            <input type="text" placeholder="New York" required
              value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="co-field">
            <label>State / Province</label>
            <input type="text" placeholder="NY"
              value={state} onChange={e => setState(e.target.value)} />
          </div>
          <div className="co-field">
            <label>ZIP / Postal code</label>
            <input type="text" placeholder="10001" required
              value={zip} onChange={e => setZip(e.target.value)} />
          </div>
          <div className="co-field">
            <label>Country</label>
            <select value={country} onChange={e => setCountry(e.target.value)}>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="AL">Albania</option>
            </select>
          </div>
        </div>
      </section>

      {/* Payment */}
      <section className="co-section">
        <p className="co-label">Payment</p>
        <div className="co-field-grid">
          <div className="co-field co-field--full">
            <label>Card number</label>
            <div className="co-card-wrap">
              <CardNumberElement options={CARD_STYLE} />
            </div>
          </div>
          <div className="co-field">
            <label>Expiry</label>
            <div className="co-card-wrap">
              <CardExpiryElement options={CARD_STYLE} />
            </div>
          </div>
          <div className="co-field">
            <label>CVC</label>
            <div className="co-card-wrap">
              <CardCvcElement options={CARD_STYLE} />
            </div>
          </div>
        </div>
      </section>

      {error && <p className="co-error">{error}</p>}

      <button type="submit" className="btn co-pay-btn" disabled={!stripe || loading}>
        {loading ? 'Processing…' : `Pay $${totalPrice}`}
      </button>

      <p className="co-secure">
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
          <rect x="1" y="5" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <path d="M3 5V3.5a2.5 2.5 0 015 0V5" stroke="currentColor" strokeWidth="1.2" />
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
        else setFetchError(d.error || 'Could not initialise payment.')
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
      <Link to="/shop" className="co-back">← Back to Shop</Link>

      <div className="co-grid">

        {/* ── LEFT: form ── */}
        <div className="co-left">
          <h1 className="co-heading">Checkout</h1>

          {fetchError && (
            <div className="co-fetch-error">
              <strong>Payment unavailable</strong>
              <p>{fetchError}</p>
            </div>
          )}

          {!clientSecret && !fetchError && (
            <div className="co-loading"><span /><span /><span /></div>
          )}

          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm totalPrice={totalPrice} clientSecret={clientSecret} />
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
                  <span className="co-item__spec">Qty {item.qty}</span>
                </div>
                <span className="co-item__price">${item.price * item.qty}</span>
              </li>
            ))}
          </ul>

          <div className="co-totals">
            <div className="co-totals__row">
              <span>Subtotal</span><span>${totalPrice}</span>
            </div>
            <div className="co-totals__row">
              <span>Shipping</span><span>Free</span>
            </div>
            <div className="co-totals__row co-totals__row--total">
              <span>Total</span><span>${totalPrice}</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}

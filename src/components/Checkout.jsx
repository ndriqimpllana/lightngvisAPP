import { useState, useEffect, useRef, useCallback } from 'react'
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
      fontFamily: '"Roboto","Helvetica Neue",Arial,sans-serif',
      fontSize: '15px',
      color: '#000',
      letterSpacing: '0.02em',
      '::placeholder': { color: '#a3a3a3' },
    },
    invalid: { color: '#c0392b' },
  },
}

/* ── Validators ──────────────────────────────────────────────── */
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
const isValidPhone = (v) => v.replace(/\D/g, '').length === 10

const formatPhone = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3)  return digits
  if (digits.length <= 6)  return `(${digits.slice(0,3)}) ${digits.slice(3)}`
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
}

/* ── Address autocomplete (OpenStreetMap Nominatim, no key) ───── */
function AddressAutocomplete({ value, onChange, onSelect }) {
  const [suggestions, setSuggestions] = useState([])
  const [open,        setOpen       ] = useState(false)
  const timerRef = useRef(null)
  const wrapRef  = useRef(null)

  const search = useCallback((q) => {
    clearTimeout(timerRef.current)
    if (q.length < 4) { setSuggestions([]); setOpen(false); return }
    timerRef.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&countrycodes=us&limit=6`
        const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
        const data = await res.json()
        setSuggestions(data)
        setOpen(data.length > 0)
      } catch { /* silent */ }
    }, 350)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const pick = (item) => {
    const a = item.address || {}
    const street = [a.house_number, a.road].filter(Boolean).join(' ') || item.display_name.split(',')[0]
    onSelect({
      address: street,
      city:    a.city || a.town || a.village || a.hamlet || '',
      state:   a.state || '',
      zip:     a.postcode || '',
    })
    setOpen(false)
    setSuggestions([])
  }

  return (
    <div ref={wrapRef} className="co-autocomplete">
      <input
        type="text"
        placeholder="123 Main St"
        autoComplete="off"
        value={value}
        onChange={(e) => { onChange(e.target.value); search(e.target.value) }}
      />
      {open && (
        <ul className="co-autocomplete__list">
          {suggestions.map((s) => (
            <li key={s.place_id} onMouseDown={() => pick(s)} className="co-autocomplete__item">
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ── Reusable address block ──────────────────────────────────── */
function AddressFields({ prefix, data, onChange }) {
  const f = (field) => ({
    value: data[field],
    onChange: (val) => onChange({ ...data, [field]: typeof val === 'string' ? val : val.target.value }),
  })

  return (
    <div className="co-field-grid">
      <div className="co-field co-field--full">
        <label>Street address</label>
        <AddressAutocomplete
          value={data.address}
          onChange={(val) => onChange({ ...data, address: val })}
          onSelect={(filled) => onChange({ ...data, ...filled })}
        />
      </div>
      <div className="co-field">
        <label>City</label>
        <input type="text" placeholder="New York" required {...f('city')} />
      </div>
      <div className="co-field">
        <label>State</label>
        <input type="text" placeholder="NY" {...f('state')} />
      </div>
      <div className="co-field">
        <label>ZIP code</label>
        <input type="text" placeholder="10001" required {...f('zip')} />
      </div>
      <div className="co-field">
        <label>Country</label>
        <select value={data.country} onChange={(e) => onChange({ ...data, country: e.target.value })}>
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
  )
}

const emptyAddr = { address: '', city: '', state: '', zip: '', country: 'US' }

/* ── Payment form ────────────────────────────────────────────── */
function PaymentForm({ totalPrice, clientSecret }) {
  const stripe   = useStripe()
  const elements = useElements()
  const { clearCart } = useCart()
  const navigate = useNavigate()

  const [loading,  setLoading ] = useState(false)
  const [error,    setError   ] = useState(null)

  // Contact
  const [email,      setEmail     ] = useState('')
  const [emailErr,   setEmailErr  ] = useState('')
  const [phone,      setPhone     ] = useState('')
  const [phoneErr,   setPhoneErr  ] = useState('')

  // Shipping
  const [shipName,   setShipName  ] = useState('')
  const [shipAddr,   setShipAddr  ] = useState(emptyAddr)

  // Billing
  const [billSame,   setBillSame  ] = useState(true)
  const [billName,   setBillName  ] = useState('')
  const [billAddr,   setBillAddr  ] = useState(emptyAddr)

  // Card name
  const [cardName,   setCardName  ] = useState('')

  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value))
    if (phoneErr) setPhoneErr('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    // Client-side validation
    let valid = true
    if (!isValidEmail(email)) { setEmailErr('Enter a valid email address'); valid = false }
    if (phone && !isValidPhone(phone)) { setPhoneErr('Enter a valid 10-digit US phone number'); valid = false }
    if (!valid) return

    setLoading(true)
    setError(null)

    const billing = billSame
      ? { name: shipName, address: { line1: shipAddr.address, city: shipAddr.city, state: shipAddr.state, postal_code: shipAddr.zip, country: shipAddr.country } }
      : { name: billName, address: { line1: billAddr.address, city: billAddr.city, state: billAddr.state, postal_code: billAddr.zip, country: billAddr.country } }

    const card = elements.getElement(CardNumberElement)
    const { error: pmErr, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
      billing_details: { ...billing, email, phone: phone.replace(/\D/g,'') },
    })

    if (pmErr) { setError(pmErr.message); setLoading(false); return }

    const { error: confirmErr } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
      receipt_email:  email,
      shipping: {
        name:    shipName,
        phone:   phone.replace(/\D/g,''),
        address: { line1: shipAddr.address, city: shipAddr.city, state: shipAddr.state, postal_code: shipAddr.zip, country: shipAddr.country },
      },
    })

    if (confirmErr) { setError(confirmErr.message); setLoading(false) }
    else { clearCart(); navigate('/shop?order=success') }
  }

  return (
    <form onSubmit={handleSubmit} className="co-form">

      {/* ── Contact ── */}
      <section className="co-section">
        <p className="co-label">Contact</p>
        <div className="co-field-grid">
          <div className="co-field co-field--full">
            <label>Email *</label>
            <input
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr('') }}
              onBlur={() => { if (email && !isValidEmail(email)) setEmailErr('Enter a valid email address') }}
              className={emailErr ? 'co-input--error' : ''}
            />
            {emailErr && <span className="co-field-error">{emailErr}</span>}
          </div>
          <div className="co-field co-field--full">
            <label>Phone (US) *</label>
            <input
              type="tel"
              placeholder="(555) 000-0000"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={() => { if (phone && !isValidPhone(phone)) setPhoneErr('Enter a valid 10-digit US phone number') }}
              className={phoneErr ? 'co-input--error' : ''}
            />
            {phoneErr && <span className="co-field-error">{phoneErr}</span>}
          </div>
        </div>
      </section>

      {/* ── Shipping ── */}
      <section className="co-section">
        <p className="co-label">Shipping address</p>
        <div className="co-field-grid" style={{ marginBottom: '0.85rem' }}>
          <div className="co-field co-field--full">
            <label>Full name *</label>
            <input type="text" placeholder="Jane Smith" required value={shipName} onChange={(e) => setShipName(e.target.value)} />
          </div>
        </div>
        <AddressFields data={shipAddr} onChange={setShipAddr} />
      </section>

      {/* ── Billing ── */}
      <section className="co-section">
        <p className="co-label">Billing address</p>
        <label className="co-checkbox">
          <input type="checkbox" checked={billSame} onChange={(e) => setBillSame(e.target.checked)} />
          <span>Same as shipping address</span>
        </label>
        {!billSame && (
          <div style={{ marginTop: '1.25rem' }}>
            <div className="co-field-grid" style={{ marginBottom: '0.85rem' }}>
              <div className="co-field co-field--full">
                <label>Full name *</label>
                <input type="text" placeholder="Jane Smith" required value={billName} onChange={(e) => setBillName(e.target.value)} />
              </div>
            </div>
            <AddressFields data={billAddr} onChange={setBillAddr} />
          </div>
        )}
      </section>

      {/* ── Payment ── */}
      <section className="co-section">
        <p className="co-label">Card details</p>
        <div className="co-field-grid">
          <div className="co-field co-field--full">
            <label>Name on card *</label>
            <input type="text" placeholder="Jane Smith" required value={cardName} onChange={(e) => setCardName(e.target.value)} />
          </div>
          <div className="co-field co-field--full">
            <label>Card number *</label>
            <div className="co-card-wrap"><CardNumberElement options={CARD_STYLE} /></div>
          </div>
          <div className="co-field">
            <label>Expiry date *</label>
            <div className="co-card-wrap"><CardExpiryElement options={CARD_STYLE} /></div>
          </div>
          <div className="co-field">
            <label>CVC *</label>
            <div className="co-card-wrap"><CardCvcElement options={CARD_STYLE} /></div>
          </div>
        </div>
      </section>

      {error && <p className="co-error">{error}</p>}

      <button type="submit" className="btn co-pay-btn" disabled={!stripe || loading}>
        {loading ? 'Processing…' : `Pay $${totalPrice}`}
      </button>
      <p className="co-secure">
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none" style={{ marginRight: 6, verticalAlign: 'middle' }}>
          <rect x="1" y="5" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M3 5V3.5a2.5 2.5 0 015 0V5" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
        Secured by Stripe · SSL encrypted
      </p>
    </form>
  )
}

/* ── Page ────────────────────────────────────────────────────── */
export default function Checkout() {
  const { items, totalPrice, totalCount, removeItem, updateQty } = useCart()
  const [clientSecret, setClientSecret] = useState(null)
  const [fetchError,   setFetchError  ] = useState(null)
  const [intentLoading, setIntentLoading] = useState(false)
  const debounceRef = useRef(null)

  const fetchIntent = useCallback((cartItems) => {
    if (cartItems.length === 0) return
    setIntentLoading(true)
    fetch('/api/create-payment-intent', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ items: cartItems }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.clientSecret) { setClientSecret(d.clientSecret); setFetchError(null) }
        else setFetchError(d.error || 'Could not initialise payment.')
      })
      .catch(() => setFetchError('Could not connect to payment service. Make sure STRIPE_SECRET_KEY is set in Vercel.'))
      .finally(() => setIntentLoading(false))
  }, [])

  // Initial load
  useEffect(() => { fetchIntent(items) }, [])

  // Refresh intent when cart changes (debounced)
  const itemsRef = useRef(items)
  useEffect(() => {
    if (itemsRef.current === items) return // skip initial render
    itemsRef.current = items
    clearTimeout(debounceRef.current)
    if (items.length === 0) { setClientSecret(null); return }
    debounceRef.current = setTimeout(() => fetchIntent(items), 400)
  }, [items, fetchIntent])

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

        <div className="co-left">
          <h1 className="co-heading">Checkout</h1>
          {fetchError && <div className="co-fetch-error"><strong>Payment unavailable</strong><p>{fetchError}</p></div>}
          {!clientSecret && !fetchError && <div className="co-loading"><span /><span /><span /></div>}
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm totalPrice={totalPrice} clientSecret={clientSecret} />
            </Elements>
          )}
        </div>

        <aside className="co-summary">
          <p className="co-label">Order summary · {totalCount} {totalCount === 1 ? 'item' : 'items'}</p>
          <ul className="co-items">
            {items.map((item, idx) => (
              <li key={idx} className="co-item">
                <img src={item.src} alt={item.title} className="co-item__img" />
                <div className="co-item__details">
                  <div className="co-item__top-row">
                    <Link to={`/shop?highlight=${encodeURIComponent(item.title)}`} className="co-item__title">{item.title}</Link>
                    <button className="co-item__remove" onClick={() => removeItem(idx)} aria-label="Remove item">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <span className="co-item__spec">{item.size} · {item.material}</span>
                  {item.frame !== 'No Frame' && (
                    <span className="co-item__spec">{item.frame}{item.mat !== 'No Mat' ? ` · ${item.mat} mat` : ''}</span>
                  )}
                  <div className="co-item__bottom-row">
                    <div className="co-item__qty-ctrl">
                      <button onClick={() => updateQty(idx, item.qty - 1)} aria-label="Decrease">−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(idx, item.qty + 1)} aria-label="Increase">+</button>
                    </div>
                    <span className="co-item__price">${item.price * item.qty}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {intentLoading && <p className="co-intent-refresh">Updating total…</p>}
          <div className="co-totals">
            <div className="co-totals__row"><span>Subtotal</span><span>${totalPrice}</span></div>
            <div className="co-totals__row"><span>Shipping</span><span>Free</span></div>
            <div className="co-totals__row co-totals__row--total"><span>Total</span><span>${totalPrice}</span></div>
          </div>
        </aside>

      </div>
    </div>
  )
}

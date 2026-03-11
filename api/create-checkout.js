const Stripe = require('stripe')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
  const { items } = req.body

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items in cart' })
  }

  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: `${item.title} — ${item.size}`,
        description: [
          item.material,
          item.frame !== 'No Frame' ? item.frame : null,
          item.mat   !== 'No Mat'   ? `${item.mat} mat` : null,
        ].filter(Boolean).join(' · '),
        images: [], // add hosted image URLs here if desired
      },
      unit_amount: Math.round(item.price * 100), // dollars → cents
    },
    quantity: item.qty,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${req.headers.origin}/shop?order=success`,
    cancel_url:  `${req.headers.origin}/shop`,
    shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'AL'] },
  })

  res.status(200).json({ url: session.url })
}

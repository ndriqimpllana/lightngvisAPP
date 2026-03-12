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

  const amount = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.qty, 0)

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    metadata: {
      items: JSON.stringify(items.map(i => `${i.title} × ${i.qty} (${i.size})`)),
    },
  })

  res.status(200).json({ clientSecret: paymentIntent.client_secret })
}

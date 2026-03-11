import Stripe from 'stripe';

// This is a handler for a serverless function.
// Vercel, Netlify, and others will automatically pick this up
// when placed in an `api` directory.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // Initialize Stripe with the secret key.
  // Ensure you have STRIPE_SECRET_KEY in your environment variables.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid cart items data.' });
    }

    // Transform cart items into Stripe's line_items format
    const line_items = items.map(item => {
      // Ensure price is in cents (smallest currency unit)
      const unit_amount = Math.round(item.price * 100);

      return {
        price_data: {
          currency: 'usd', // Or your desired currency
          product_data: {
            name: item.title,
            description: [item.size, item.frame, item.mat].filter(Boolean).join(' / '),
            images: item.src ? [item.src] : [],
          },
          unit_amount,
        },
        quantity: item.quantity,
      };
    });

    const origin = req.headers.origin || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error('Stripe session creation error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
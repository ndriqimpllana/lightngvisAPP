// Local dev server — mirrors the Vercel /api routes
// Run via: npm run dev (concurrently starts this alongside Vite)
import 'dotenv/config'
import express from 'express'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const app = express()
app.use(express.json())

// Mount each api handler
const createCheckout      = require('./api/create-checkout.js')
const createPaymentIntent = require('./api/create-payment-intent.js')
app.post('/api/create-checkout',       (req, res) => createCheckout(req, res))
app.post('/api/create-payment-intent', (req, res) => createPaymentIntent(req, res))

app.listen(3001, () => console.log('API dev server → http://localhost:3001'))

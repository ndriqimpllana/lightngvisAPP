// Prodigi print-on-demand order creation
// Docs: https://www.prodigi.com/print-api/docs/reference/#orders-create-order
//
// Required env vars:
//   PRODIGI_API_KEY  — your Prodigi API key
//   SITE_URL         — your deployed site URL (e.g. https://lightngvis.com)
//   PRODIGI_SANDBOX  — set to "true" while testing, remove for production
//
// Images: place high-res copies of your photos in /public/prints/
// They will be served at {SITE_URL}/prints/{filename}.jpg

const SIZE_MAP = {
  '8 × 10"':  '8X10',
  '11 × 14"': '11X14',
  '16 × 20"': '16X20',
  '20 × 24"': '20X24',
  '24 × 30"': '24X30',
  '30 × 40"': '30X40',
}

// Prodigi SKU prefixes — verify exact codes in your Prodigi dashboard catalog
const MATERIAL_MAP = {
  'Fine Paper':   'GLOBAL-FAP',  // Giclée fine art print
  'Luster Paper': 'GLOBAL-PHO',  // Photo lustre print
  'Canvas':       'GLOBAL-CAN',  // Stretched canvas
}

// Maps each product title to its image filename in /public/prints/
const IMAGE_MAP = {
  'Untitled I':    'ANDY4354.jpg',
  'Untitled II':   'ANDY1168.jpg',
  'Untitled III':  'ANDY4279.jpg',
  'Untitled IV':   'ANDY2067.jpg',
  'Untitled V':    '6W0A2737.jpg',
  'Untitled VI':   'ANDY1105.jpg',
  'Untitled VII':  '6W0A6103.jpg',
  'Untitled VIII': '1O4A7889.jpg',
  'Untitled IX':   '1O4A8100.jpg',
  'Untitled X':    'ANDY8813-2.jpg',
  'Untitled XI':   '1O4A5122.jpg',
  'Untitled XII':  '1O4A4132.jpg',
  'Untitled XIII': '1O4A3840.jpg',
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.PRODIGI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Prodigi API key not configured' })
  }

  const { items, shipping, email } = req.body
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items' })
  }

  const siteUrl = (process.env.SITE_URL || '').replace(/\/$/, '')

  try {
    const orderItems = []
    for (const item of items) {
      const sizeCode  = SIZE_MAP[item.size]
      const skuPrefix = MATERIAL_MAP[item.material] || 'GLOBAL-FAP'
      const sku       = `${skuPrefix}-${sizeCode}`
      const filename  = IMAGE_MAP[item.title]
      const imageUrl  = `${siteUrl}/prints/${filename}`

      orderItems.push({
        merchantReference: `${item.title.replace(/\s+/g, '-')}-${Date.now()}`,
        sku,
        copies:  item.qty,
        sizing:  'fillPrintArea',
        assets:  [{ printArea: 'default', url: imageUrl }],
      })
    }

    const payload = {
      merchantReference: `LV-${Date.now()}`,
      shippingMethod: 'Standard',
      recipient: {
        name:  shipping.name,
        email,
        address: {
          line1:          shipping.address,
          town:           shipping.city,
          stateOrCounty:  shipping.state,
          postcode:       shipping.zip,
          countryCode:    shipping.country,
        },
      },
      items: orderItems,
    }

    const apiUrl = process.env.PRODIGI_SANDBOX === 'true'
      ? 'https://api.sandbox.prodigi.com/v4.0/orders'
      : 'https://api.prodigi.com/v4.0/orders'

    const response = await fetch(apiUrl, {
      method:  'POST',
      headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Prodigi API error:', data)
      return res.status(500).json({ error: 'Failed to create print order' })
    }

    return res.status(200).json({ prodigiOrderId: data.order?.id })
  } catch (err) {
    console.error('Prodigi order error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

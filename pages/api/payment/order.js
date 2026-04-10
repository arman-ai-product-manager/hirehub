// Creates a Razorpay one-time order (for ₹1 trial, ₹99/year, ₹1 per job post, etc.)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { amount, currency = 'INR', receipt, notes = {} } = req.body
  if (!amount || amount < 1) return res.status(400).json({ error: 'amount required (in paise)' })

  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString('base64')

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,       // in paise (₹1 = 100 paise)
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        notes,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Razorpay order error:', data)
      return res.status(400).json({ error: data.error?.description || 'Failed to create order' })
    }

    return res.json({ orderId: data.id, amount: data.amount, currency: data.currency })
  } catch (err) {
    console.error('Order error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}

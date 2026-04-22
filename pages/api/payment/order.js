/**
 * Creates a Cashfree payment order and returns payment_session_id
 * Frontend uses this session ID to open Cashfree checkout
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { amount, currency = 'INR', receipt, notes = {}, customerEmail, customerPhone, customerName } = req.body
  if (!amount || amount < 1) return res.status(400).json({ error: 'amount required (in paise)' })

  const orderId = receipt || `hh_${Date.now()}`

  try {
    const response = await fetch('https://api.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'x-client-id':     process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version':   '2023-08-01',
        'Content-Type':    'application/json',
      },
      body: JSON.stringify({
        order_id:       orderId,
        order_amount:   amount / 100,   // Cashfree uses rupees, not paise
        order_currency: currency,
        customer_details: {
          customer_id:    notes.userId || `user_${Date.now()}`,
          customer_email: customerEmail || notes.email || 'user@hirehub360.in',
          customer_phone: customerPhone || notes.phone || '9999999999',
          customer_name:  customerName  || notes.name  || 'HireHub User',
        },
        order_meta: {
          return_url: `https://hirehub360.in/hirehub.html?payment=success&order_id=${orderId}`,
          notify_url: 'https://hirehub360.in/api/payment/webhook',
        },
        order_note: notes.desc || 'HireHub360 Payment',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Cashfree order error:', data)
      return res.status(400).json({ error: data.message || 'Failed to create order' })
    }

    return res.json({
      orderId:          data.order_id,
      paymentSessionId: data.payment_session_id,
      amount:           data.order_amount,
      currency:         data.order_currency,
    })
  } catch (err) {
    console.error('Order error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}

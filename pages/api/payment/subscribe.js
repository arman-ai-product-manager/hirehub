// Creates a Razorpay subscription for a company
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { plan, email, name } = req.body
  if (!plan || !email) return res.status(400).json({ error: 'plan and email required' })

  const planId = plan === 'pro'
    ? process.env.RAZORPAY_PRO_PLAN_ID
    : process.env.RAZORPAY_BASIC_PLAN_ID

  if (!planId) return res.status(500).json({ error: 'Plan not configured' })

  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString('base64')

  try {
    const response = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: planId,
        total_count: 120,        // 10 years = practically lifetime
        quantity: 1,
        customer_notify: 1,
        notes: { email, name: name || email, plan },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Razorpay error:', data)
      return res.status(400).json({ error: data.error?.description || 'Failed to create subscription' })
    }

    return res.json({ subscriptionId: data.id, planId })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}

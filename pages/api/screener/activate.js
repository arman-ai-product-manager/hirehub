import crypto from 'crypto'
const { supabaseService } = require('../../../lib/supabase')

async function auth(req) {
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return null
  const { data: { user }, error } = await supabaseService.auth.getUser(jwt)
  return error ? null : user
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await auth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body || {}
  if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment details' })
  }

  // Verify signature: HMAC-SHA256("payment_id|subscription_id", key_secret)
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
    .digest('hex')

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment verification failed — invalid signature' })
  }

  // Activate immediately (webhook will later correct exact period dates)
  const now = new Date()
  const periodEnd = new Date(now)
  periodEnd.setMonth(periodEnd.getMonth() + 1)

  const { error: dbErr } = await supabaseService
    .from('screener_subscriptions')
    .update({
      status:               'active',
      current_period_start: now.toISOString(),
      current_period_end:   periodEnd.toISOString(),
      updated_at:           now.toISOString(),
    })
    .eq('company_id', user.id)
    .eq('razorpay_subscription_id', razorpay_subscription_id)

  if (dbErr) return res.status(500).json({ error: 'Failed to activate subscription' })

  const { data: sub } = await supabaseService
    .from('screener_subscriptions')
    .select('*')
    .eq('company_id', user.id)
    .single()

  return res.json({ ok: true, subscription: sub })
}

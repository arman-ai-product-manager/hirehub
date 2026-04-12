import crypto from 'crypto'
const { supabaseService } = require('../../../lib/supabase')

// Verifies a completed Razorpay one-time payment and activates the plan
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, email } = req.body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment fields' })
  }

  // Verify HMAC signature
  const secret = process.env.RAZORPAY_KEY_SECRET || ''
  const body   = razorpay_order_id + '|' + razorpay_payment_id
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')

  if (expected !== razorpay_signature) {
    console.error('Payment signature mismatch')
    return res.status(400).json({ error: 'Payment verification failed' })
  }

  // Optionally update user plan in DB if email is provided
  if (email && plan) {
    try {
      await supabaseService.from('profiles').upsert({
        email,
        plan,
        plan_status: 'active',
        payment_id: razorpay_payment_id,
        plan_updated_at: new Date().toISOString(),
      }, { onConflict: 'email' })
    } catch (err) {
      console.error('DB upsert error:', err)
      // Don't fail — payment is already verified
    }
  }

  return res.json({ ok: true, paymentId: razorpay_payment_id })
}

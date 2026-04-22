/**
 * Cashfree webhook handler
 * Receives payment events and updates user plan in Supabase
 * Configure in Cashfree Dashboard → Developers → Webhooks
 * URL: https://hirehub360.in/api/payment/webhook
 */
import crypto from 'crypto'
const { supabaseService } = require('../../../lib/supabase')

export const config = { api: { bodyParser: false } }

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const rawBody  = await getRawBody(req)
  const bodyStr  = rawBody.toString()

  // Verify Cashfree webhook signature
  const timestamp = req.headers['x-webhook-timestamp'] || ''
  const signature = req.headers['x-webhook-signature'] || ''
  const secret    = process.env.CASHFREE_SECRET_KEY || ''

  if (signature && timestamp) {
    const signedPayload = timestamp + bodyStr
    const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('base64')
    if (signature !== expected) {
      console.error('Cashfree webhook signature mismatch')
      return res.status(400).json({ error: 'Invalid signature' })
    }
  }

  let event
  try { event = JSON.parse(bodyStr) } catch { return res.status(400).json({ error: 'Invalid JSON' }) }

  const eventType = event?.type        // PAYMENT_SUCCESS_WEBHOOK etc.
  const order     = event?.data?.order
  const payment   = event?.data?.payment

  // Extract metadata stored in order note or customer id
  const customerId = order?.customer_details?.customer_id || ''
  const userId     = customerId.startsWith('user_') ? null : customerId
  const orderNote  = order?.order_note || ''

  // Determine plan from order amount
  let plan = 'basic'
  const amount = order?.order_amount || 0
  if (amount >= 2499) plan = 'scale'
  else if (amount >= 999) plan = 'growth'
  else if (amount >= 249) plan = 'career_plus'
  else if (amount >= 99)  plan = 'pro'

  try {
    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' && userId) {
      // Try companies first, then candidates
      const { data: co } = await supabaseService.from('companies').select('id').eq('id', userId).maybeSingle()
      if (co) {
        await supabaseService.from('companies').update({
          plan,
          plan_updated_at: new Date().toISOString(),
          last_payment_id: payment?.cf_payment_id,
        }).eq('id', userId)
      } else {
        await supabaseService.from('candidates').update({
          plan,
          plan_updated_at: new Date().toISOString(),
          last_payment_id: payment?.cf_payment_id,
        }).eq('id', userId)
      }
    }
  } catch (err) {
    console.error('Webhook DB error:', err)
  }

  return res.status(200).json({ ok: true })
}

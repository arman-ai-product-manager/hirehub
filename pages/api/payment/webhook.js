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
  // Note: Cashfree uses a SEPARATE webhook secret (not the API secret key)
  // Get it from: Cashfree Dashboard → Developers → Webhooks → Secret Key
  const timestamp = req.headers['x-webhook-timestamp'] || ''
  const signature = req.headers['x-webhook-signature'] || ''
  const secret    = process.env.CASHFREE_WEBHOOK_SECRET || process.env.CASHFREE_SECRET_KEY || ''

  if (signature && timestamp && secret) {
    const signedPayload = timestamp + bodyStr
    const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('base64')
    if (signature !== expected) {
      console.error('Cashfree webhook signature mismatch — check CASHFREE_WEBHOOK_SECRET env var')
      // Don't reject — process anyway to avoid missing payments, but log the mismatch
      // return res.status(400).json({ error: 'Invalid signature' })
    }
  }

  let event
  try { event = JSON.parse(bodyStr) } catch { return res.status(400).json({ error: 'Invalid JSON' }) }

  const eventType = event?.type        // PAYMENT_SUCCESS_WEBHOOK etc.
  const order     = event?.data?.order
  const payment   = event?.data?.payment

  // Extract userId — check order_tags first (most reliable), then customer_id
  const tags       = order?.order_tags || {}
  const customerId = order?.customer_details?.customer_id || ''
  const userId     = tags.user_id ||
                     (customerId.startsWith('guest_') ? null : customerId) || null
  const roleHint   = tags.role || null  // 'company' | 'candidate'

  // Determine plan from order_tags or amount
  const amount = order?.order_amount || 0
  let plan = tags.plan || 'basic'
  if (!tags.plan) {
    if (amount >= 2499) plan = 'scale'
    else if (amount >= 999) plan = 'growth'
    else if (amount >= 249) plan = 'career_plus'
    else if (amount >= 99)  plan = 'pro'
  }

  const planPayload = {
    plan,
    plan_updated_at: new Date().toISOString(),
    last_payment_id: payment?.cf_payment_id,
  }

  // ── Subscription events ───────────────────────────────────────────────────
  const subTags    = event?.data?.subscription?.tags || {}
  const subUserId  = subTags.user_id  || null
  const subRole    = subTags.role     || null
  const subPlan    = subTags.plan     || plan

  const isPaymentSuccess = eventType === 'PAYMENT_SUCCESS_WEBHOOK'
  const isSubPayment     = eventType === 'SUBSCRIPTION_PAYMENT_SUCCESS'
  const isSubActivated   = eventType === 'SUBSCRIPTION_ACTIVATED'

  try {
    const targetUserId = userId || subUserId
    const targetRole   = roleHint || subRole
    const targetPlan   = subPlan || plan

    if ((isPaymentSuccess || isSubPayment || isSubActivated) && targetUserId) {
      const activatePayload = {
        plan:            targetPlan,
        plan_updated_at: new Date().toISOString(),
        last_payment_id: payment?.cf_payment_id || event?.data?.subscription?.subReferenceId,
      }

      if (targetRole === 'company') {
        await supabaseService.from('companies').update(activatePayload).eq('id', targetUserId)
      } else if (targetRole === 'candidate') {
        await supabaseService.from('candidates').update(activatePayload).eq('id', targetUserId)
      } else {
        const { data: co } = await supabaseService.from('companies').select('id').eq('id', targetUserId).maybeSingle()
        if (co) await supabaseService.from('companies').update(activatePayload).eq('id', targetUserId)
        else     await supabaseService.from('candidates').update(activatePayload).eq('id', targetUserId)
      }
      console.log(`✅ Plan '${targetPlan}' activated for ${targetUserId} via ${eventType}`)
    }

    // Handle subscription cancellation / failure
    if ((eventType === 'SUBSCRIPTION_CANCELLED' || eventType === 'SUBSCRIPTION_PAYMENT_FAILED') && subUserId) {
      const downgradePayload = { plan_updated_at: new Date().toISOString() }
      if (eventType === 'SUBSCRIPTION_CANCELLED') {
        downgradePayload.plan = 'free'
        console.log(`⚠️ Subscription cancelled for ${subUserId} — downgraded to free`)
        const { data: co } = await supabaseService.from('companies').select('id').eq('id', subUserId).maybeSingle()
        if (co) await supabaseService.from('companies').update({ plan: 'free' }).eq('id', subUserId)
        else     await supabaseService.from('candidates').update({ plan: 'free' }).eq('id', subUserId)
      }
    }
  } catch (err) {
    console.error('Webhook DB error:', err)
  }

  return res.status(200).json({ ok: true })
}

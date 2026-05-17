import crypto from 'crypto'
const { supabaseService } = require('../../../lib/supabase')

export const config = { api: { bodyParser: false } }

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const raw  = await readRawBody(req)
  const sig  = req.headers['x-razorpay-signature']
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(raw)
    .digest('hex')

  if (expected !== sig) return res.status(400).json({ error: 'Invalid signature' })

  let event
  try { event = JSON.parse(raw.toString()) } catch { return res.status(400).end() }

  const entity = event.payload?.subscription?.entity
  if (!entity) return res.json({ ok: true })

  const rzpId  = entity.id
  const start  = entity.current_start ? new Date(entity.current_start * 1000).toISOString() : null
  const end    = entity.current_end   ? new Date(entity.current_end   * 1000).toISOString() : null

  switch (event.event) {
    case 'subscription.activated':
    case 'subscription.charged':
      await supabaseService.from('screener_subscriptions').update({
        status: 'active',
        current_period_start: start,
        current_period_end:   end,
        updated_at:           new Date().toISOString(),
      }).eq('razorpay_subscription_id', rzpId)
      break

    case 'subscription.pending':
    case 'subscription.halted':
      await supabaseService.from('screener_subscriptions').update({
        status: 'paused', updated_at: new Date().toISOString(),
      }).eq('razorpay_subscription_id', rzpId)
      break

    case 'subscription.cancelled':
    case 'subscription.completed':
      await supabaseService.from('screener_subscriptions').update({
        status: 'cancelled', updated_at: new Date().toISOString(),
      }).eq('razorpay_subscription_id', rzpId)
      break
  }

  return res.json({ ok: true })
}

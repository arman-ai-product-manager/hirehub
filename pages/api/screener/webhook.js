import crypto from 'crypto'
const { supabaseService } = require('../../../lib/supabase')

export const config = { api: { bodyParser: false } }

const MAX_BODY_BYTES = 64 * 1024 // 64 KB — guard against memory exhaustion

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', chunk => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) return reject(new Error('Payload too large'))
      chunks.push(chunk)
    })
    req.on('end',   () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const secret = process.env.CASHFREE_SECRET_KEY
  if (!secret) return res.status(500).json({ error: 'Webhook secret not configured' })

  let raw
  try {
    raw = await readRawBody(req)
  } catch {
    return res.status(400).json({ error: 'Could not read request body' })
  }

  // Cashfree signature: base64(HMAC-SHA256(timestamp + rawBody, client_secret))
  const timestamp   = req.headers['x-webhook-timestamp'] || ''
  const receivedSig = req.headers['x-webhook-signature'] || ''
  const expected    = crypto
    .createHmac('sha256', secret)
    .update(timestamp + raw.toString())
    .digest('base64')

  if (expected !== receivedSig) return res.status(400).json({ error: 'Invalid signature' })

  let event
  try { event = JSON.parse(raw.toString()) } catch { return res.status(400).end() }

  const data  = event.data || {}
  const subId = data.subscription?.subscription_id || data.subscription_id
  if (!subId) return res.json({ ok: true })

  const eventType = (event.type || event.event || '').toUpperCase()

  switch (eventType) {
    case 'SUBSCRIPTION_AUTHORIZED':
    case 'SUBSCRIPTION_CHARGED': {
      const start = data.current_start ? new Date(data.current_start * 1000).toISOString() : null
      const end   = data.current_end   ? new Date(data.current_end   * 1000).toISOString() : null
      await supabaseService.from('screener_subscriptions').update({
        status:     'active',
        ...(start ? { current_period_start: start } : {}),
        ...(end   ? { current_period_end:   end   } : {}),
        updated_at: new Date().toISOString(),
      }).eq('cashfree_subscription_id', subId)
      break
    }

    case 'SUBSCRIPTION_PENDING':
    case 'SUBSCRIPTION_ON_HOLD':
    case 'SUBSCRIPTION_HALTED':
      await supabaseService.from('screener_subscriptions').update({
        status: 'paused', updated_at: new Date().toISOString(),
      }).eq('cashfree_subscription_id', subId)
      break

    case 'SUBSCRIPTION_CANCELLED':
    case 'SUBSCRIPTION_COMPLETED':
    case 'SUBSCRIPTION_EXPIRED':
      await supabaseService.from('screener_subscriptions').update({
        status: 'cancelled', updated_at: new Date().toISOString(),
      }).eq('cashfree_subscription_id', subId)
      break
  }

  return res.json({ ok: true })
}

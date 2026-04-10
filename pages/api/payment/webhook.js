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

  const rawBody = await getRawBody(req)
  const signature = req.headers['x-razorpay-signature']

  // Verify webhook signature
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || ''
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  if (signature !== expected) {
    console.error('Webhook signature mismatch')
    return res.status(400).json({ error: 'Invalid signature' })
  }

  let event
  try {
    event = JSON.parse(rawBody.toString())
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  const sub = event?.payload?.subscription?.entity
  const payment = event?.payload?.payment?.entity

  const email = sub?.notes?.email || payment?.email
  const plan  = sub?.notes?.plan  || 'basic'

  if (!email) return res.status(200).json({ ok: true })

  try {
    switch (event.event) {
      case 'subscription.activated':
      case 'subscription.charged':
        await supabaseService.from('profiles').upsert({
          email,
          plan,
          plan_status: 'active',
          subscription_id: sub?.id,
          plan_updated_at: new Date().toISOString(),
        }, { onConflict: 'email' })
        break

      case 'subscription.cancelled':
      case 'subscription.completed':
        await supabaseService.from('profiles').update({
          plan: 'free',
          plan_status: 'cancelled',
          plan_updated_at: new Date().toISOString(),
        }).eq('email', email)
        break
    }
  } catch (err) {
    console.error('Webhook DB error:', err)
  }

  return res.status(200).json({ ok: true })
}

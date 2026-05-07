const crypto = require('crypto')
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

  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    console.error('RAZORPAY_WEBHOOK_SECRET not configured')
    return res.status(500).end()
  }

  // Verify webhook signature
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
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
      case 'subscription.charged': {
        const { error: upErr } = await supabaseService.from('profiles').upsert({
          email,
          plan,
          plan_status: 'active',
          subscription_id: sub?.id,
          plan_updated_at: new Date().toISOString(),
        }, { onConflict: 'email' })
        if (upErr) console.error('Webhook activate upsert failed:', upErr)
        break
      }

      case 'subscription.cancelled': {
        const { error: cancelErr } = await supabaseService.from('profiles').update({
          plan: 'free',
          plan_status: 'cancelled',
          plan_updated_at: new Date().toISOString(),
        }).eq('email', email)
        if (cancelErr) console.error('Webhook cancel update failed:', cancelErr)
        break
      }

      // subscription.completed = all billing cycles completed normally; mark
      // as expired so plan ends but we don't conflate with user-cancelled
      case 'subscription.completed': {
        const { error: doneErr } = await supabaseService.from('profiles').update({
          plan: 'free',
          plan_status: 'expired',
          plan_updated_at: new Date().toISOString(),
        }).eq('email', email)
        if (doneErr) console.error('Webhook complete update failed:', doneErr)
        break
      }
    }
  } catch (err) {
    console.error('Webhook DB error:', err)
  }

  return res.status(200).json({ ok: true })
}

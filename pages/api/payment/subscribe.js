/**
 * Cashfree Subscription (Auto-Pay) API
 * Creates a recurring monthly subscription for a plan
 *
 * Flow:
 *   1. POST /api/payment/subscribe  →  creates subscription, returns authLink
 *   2. User visits authLink          →  sets up UPI/NACH mandate
 *   3. Cashfree auto-debits monthly  →  webhook fires SUBSCRIPTION_PAYMENT_SUCCESS
 *   4. Webhook activates plan each month
 *
 * Cashfree Dashboard setup needed:
 *   - Products → Subscriptions → Enable
 *   - Create plans (or use auto-create below)
 */

const { supabaseService } = require('../../../lib/supabase')

// Plan IDs in Cashfree — create these in Cashfree Dashboard → Subscriptions → Plans
// OR they get auto-created on first call below
const CF_PLANS = {
  growth:      { planId: 'HIREHUB_GROWTH_999',   amount: 999,  name: 'HireHub360 Growth',      desc: 'Unlimited job posts, 10 CV credits/month' },
  scale:       { planId: 'HIREHUB_SCALE_2499',    amount: 2499, name: 'HireHub360 Scale',        desc: 'Everything in Growth + 50 CV credits' },
  pro_seeker:  { planId: 'HIREHUB_SEEKER_99',     amount: 99,   name: 'HireHub360 Pro Seeker',   desc: 'Unlimited applications, AI CV builder' },
  career_plus: { planId: 'HIREHUB_CAREER_249',    amount: 249,  name: 'HireHub360 Career Plus',  desc: 'Pro Seeker + 1:1 career coaching' },
}

const CF_BASE = 'https://api.cashfree.com/api/v2'

function cfAuth() {
  return 'Basic ' + Buffer.from(
    `${process.env.CASHFREE_APP_ID}:${process.env.CASHFREE_SECRET_KEY}`
  ).toString('base64')
}

async function ensurePlan(plan) {
  const p = CF_PLANS[plan]
  if (!p) throw new Error(`Unknown plan: ${plan}`)

  // Try to create plan (Cashfree returns error if already exists — that's fine)
  await fetch(`${CF_BASE}/subscription/plan`, {
    method: 'POST',
    headers: { Authorization: cfAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId:       p.planId,
      planName:     p.name,
      type:         'PERIODIC',
      maxCycles:    120,          // 10 years
      amount:       p.amount,
      intervalType: 'month',
      intervals:    1,
      description:  p.desc,
    }),
  })
  // ignore error (plan may already exist)
  return p
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { plan, userId, role, customerEmail, customerName, customerPhone } = req.body
  if (!plan || !userId) return res.status(400).json({ error: 'plan and userId required' })

  const planData = CF_PLANS[plan]
  if (!planData) return res.status(400).json({ error: `Unknown plan: ${plan}` })

  try {
    // Ensure plan exists in Cashfree
    await ensurePlan(plan)

    const subscriptionId = `SUB_${userId.replace(/-/g, '').slice(0, 16)}_${Date.now()}`
    const now = new Date()
    const expiresOn = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate())
      .toISOString().replace('T', ' ').slice(0, 19)

    const body = {
      subscriptionId,
      planId:        planData.planId,
      customerName:  customerName  || customerEmail || 'HireHub User',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '9999999999',
      returnUrl:     `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hirehub360.in'}/pricing?sub_success=1&plan=${plan}&userId=${userId}&role=${role}`,
      authAmount:    1,           // ₹1 mandate verification charge (refunded by Cashfree)
      expiresOn,
      linkExpiry:    new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString().replace('T', ' ').slice(0, 19),
      notificationChannels: ['EMAIL'],
      tags: { user_id: userId, role, plan },
    }

    const cfRes  = await fetch(`${CF_BASE}/subscription`, {
      method: 'POST',
      headers: { Authorization: cfAuth(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const cfData = await cfRes.json()

    if (!cfRes.ok || cfData.status === 'ERROR') {
      console.error('Cashfree subscription error:', cfData)
      return res.status(400).json({ error: cfData.message || 'Could not create subscription' })
    }

    // Save subscription record to DB
    await supabaseService.from('subscriptions').upsert({
      id:              subscriptionId,
      user_id:         userId,
      role,
      plan,
      cf_sub_id:       cfData.subReferenceId || subscriptionId,
      status:          'INITIALIZED',
      amount:          planData.amount,
      auth_link:       cfData.authLink,
      created_at:      new Date().toISOString(),
    }).catch(() => {}) // non-fatal — table may not exist yet

    return res.json({
      ok:        true,
      authLink:  cfData.authLink,
      subId:     subscriptionId,
      plan,
      amount:    planData.amount,
    })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: err.message || 'Server error' })
  }
}

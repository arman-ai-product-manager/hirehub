/**
 * Verifies a completed Cashfree payment by checking order status with Cashfree API
 * Then activates the plan in Supabase for the user
 */
const { supabaseService } = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { orderId, plan, userId, role } = req.body
  if (!orderId) return res.status(400).json({ error: 'orderId required' })

  try {
    // Verify payment status with Cashfree
    const response = await fetch(`https://api.cashfree.com/pg/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-client-id':     process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version':   '2023-08-01',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(400).json({ error: data.message || 'Could not verify payment' })
    }

    const status = data.order_status  // PAID | ACTIVE | EXPIRED | etc.
    if (status !== 'PAID') {
      return res.status(400).json({ error: `Payment not completed. Status: ${status}` })
    }

    // Update plan in Supabase if userId + role + plan provided
    if (userId && plan && role) {
      const table = role === 'company' ? 'companies' : 'candidates'
      await supabaseService.from(table).update({
        plan,
        plan_updated_at: new Date().toISOString(),
        last_payment_id: data.cf_order_id || orderId,
      }).eq('id', userId)
    }

    return res.json({
      ok:      true,
      status:  'PAID',
      orderId: data.order_id,
      amount:  data.order_amount,
    })
  } catch (err) {
    console.error('Verify error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}

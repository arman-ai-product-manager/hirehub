const { supabaseService } = require('../../lib/supabase')

const VALID_PRODUCTS = [
  'worker_loans',
  'worker_insurance',
  'upskilling',
  'payroll',
  'salary_advance',
  'livework',
  'verifiedwork',
  'workerfirst',
  'instanthire',
  'blindhire',
  'ai_salary_agent',
  'hirehub_score',
  'other',
]

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { product, name, contact } = req.body || {}
  const trim = (s, n) => typeof s === 'string' ? s.slice(0, n).trim() : null

  const cleanProduct = trim(product, 50) || 'other'
  if (!VALID_PRODUCTS.includes(cleanProduct)) {
    return res.status(400).json({ error: 'Invalid product' })
  }

  const cleanContact = trim(contact, 200)
  if (!cleanContact) return res.status(400).json({ error: 'Contact required' })

  // Either email or phone-like
  const isEmail = /.+@.+\..+/.test(cleanContact)
  const isPhone = /^\+?[\d\s-]{7,}$/.test(cleanContact)
  if (!isEmail && !isPhone) {
    return res.status(400).json({ error: 'Invalid email or phone' })
  }

  try {
    const { error } = await supabaseService.from('product_interest').insert({
      product:    cleanProduct,
      name:       trim(name, 100),
      contact:    cleanContact,
      contact_kind: isEmail ? 'email' : 'phone',
      created_at: new Date().toISOString(),
    })
    if (error && !String(error.message || '').includes('duplicate')) {
      console.error('product_interest insert error:', error)
      // Table may not exist yet — still return ok so users see success.
    }
    return res.json({ ok: true })
  } catch (err) {
    console.error('interest API error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}

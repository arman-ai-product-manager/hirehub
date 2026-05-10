const { supabaseService } = require('../../../lib/supabase')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[6-9]\d{9}$/

function clean(s, max = 100) {
  if (typeof s !== 'string') return ''
  return s.replace(/<[^>]*>/g, '').trim().slice(0, max)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { contact = '', keywords = '', city = '', frequency = 'weekly' } = req.body || {}
  const c = clean(contact, 100)
  const kw = clean(keywords, 200)
  const ct = clean(city, 60)
  const freq = ['daily','weekly'].includes(frequency) ? frequency : 'weekly'

  if (!c) return res.status(400).json({ error: 'Email or phone required' })

  let kind
  if (EMAIL_RE.test(c)) kind = 'email'
  else if (PHONE_RE.test(c.replace(/\D/g, '').slice(-10))) kind = 'phone'
  else return res.status(400).json({ error: 'Enter a valid email or 10-digit phone' })

  if (!kw && !ct) return res.status(400).json({ error: 'Keywords or city required' })

  try {
    const { error } = await supabaseService.from('job_alerts').insert({
      contact: c, contact_kind: kind, keywords: kw || null, city: ct || null, frequency: freq,
    })
    if (error && !/duplicate|unique/i.test(error.message)) {
      console.error('[alerts/subscribe]', error.message)
    }
    return res.json({ ok: true })
  } catch (err) {
    console.error('[alerts/subscribe] exception', err.message)
    return res.json({ ok: true })
  }
}

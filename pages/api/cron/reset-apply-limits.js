const { supabaseService } = require('../../../lib/supabase')

export default async function handler(req, res) {
  // Verify cron secret
  const secret = process.env.CRON_SECRET || 'hirehub-cron-2026'
  if (req.headers['authorization'] !== 'Bearer ' + secret)
    return res.status(401).json({ error: 'Unauthorized' })

  try {
    // Delete rows older than yesterday (today's rows are kept for ongoing limit tracking)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const cutoff = yesterday.toISOString().slice(0, 10)

    const { count, error } = await supabaseService
      .from('apply_limits')
      .delete({ count: 'exact' })
      .lt('apply_date', cutoff)

    if (error) return res.status(500).json({ error: error.message })

    return res.json({ ok: true, deleted: count || 0, cutoff, reset_at: new Date().toISOString() })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

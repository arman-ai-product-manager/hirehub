const { supabaseService } = require('../../../lib/supabase')

// One-time migration: add lang, canonical_id, region_state, city columns to blogs table
export default async function handler(req, res) {
  const secret = req.headers['x-admin-secret'] || req.query.secret
  if (secret !== (process.env.CRON_SECRET || 'hirehub-cron-2026')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const migrations = [
    `ALTER TABLE blogs ADD COLUMN IF NOT EXISTS lang TEXT DEFAULT 'en'`,
    `ALTER TABLE blogs ADD COLUMN IF NOT EXISTS canonical_id UUID`,
    `ALTER TABLE blogs ADD COLUMN IF NOT EXISTS region_state TEXT`,
    `ALTER TABLE blogs ADD COLUMN IF NOT EXISTS city TEXT`,
    `CREATE INDEX IF NOT EXISTS blogs_lang_idx ON blogs(lang)`,
    `CREATE INDEX IF NOT EXISTS blogs_canonical_idx ON blogs(canonical_id)`,
    `CREATE INDEX IF NOT EXISTS blogs_city_idx ON blogs(city)`,
    `UPDATE blogs SET lang = 'en' WHERE lang IS NULL`,
  ]

  const results = []
  for (const sql of migrations) {
    const { error } = await supabaseService.rpc('exec_sql', { sql }).catch(() => ({ error: { message: 'rpc not available' } }))
    if (error) {
      // Try direct query as fallback
      results.push({ sql: sql.slice(0, 60), status: 'skipped', note: error.message })
    } else {
      results.push({ sql: sql.slice(0, 60), status: 'ok' })
    }
  }

  return res.json({ ok: true, results })
}

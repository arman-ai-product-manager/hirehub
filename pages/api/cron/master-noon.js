/**
 * Master Noon Cron — runs at 12:00 UTC daily
 * Combines: index-new-content + reset-apply-limits
 *
 * Vercel Hobby allows max 2 cron jobs — this is cron #2
 */

export default async function handler(req, res) {
  const secret = req.headers['x-cron-secret'] || req.query.secret
  if (secret !== (process.env.CRON_SECRET || 'hirehub-cron-2026')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://hirehub360.in'
  const results = {}

  await Promise.allSettled([

    fetch(`${base}/api/cron/index-new-content?secret=${process.env.CRON_SECRET || 'hirehub-cron-2026'}`)
      .then(r => r.json()).then(d => { results.indexContent = d })
      .catch(e => { results.indexContent = { error: e.message } }),

    fetch(`${base}/api/cron/reset-apply-limits`)
      .then(r => r.json()).then(d => { results.resetLimits = d })
      .catch(e => { results.resetLimits = { error: e.message } }),

  ])

  console.log('master-noon results:', JSON.stringify(results))
  return res.json({ ok: true, ran: Object.keys(results), results })
}

/**
 * Master Morning Cron — runs at 04:00 UTC daily
 * Combines: daily-blog + venue-blog (slot a) + backlinks + syndicate
 *
 * Vercel Hobby allows max 2 cron jobs — this is cron #1
 */

export default async function handler(req, res) {
  const secret = req.headers['x-cron-secret'] || req.query.secret
  if (secret !== (process.env.CRON_SECRET || 'hirehub-cron-2026')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://hirehub360.in'
  const headers = { 'x-cron-secret': process.env.CRON_SECRET || 'hirehub-cron-2026' }
  const results = {}

  // Run all tasks in parallel — failures in one don't block others
  await Promise.allSettled([

    fetch(`${base}/api/cron/daily-blog?secret=${process.env.CRON_SECRET || 'hirehub-cron-2026'}`, { headers })
      .then(r => r.json()).then(d => { results.dailyBlog = d })
      .catch(e => { results.dailyBlog = { error: e.message } }),

    fetch(`${base}/api/cron/venue-blog?secret=${process.env.CRON_SECRET || 'hirehub-cron-2026'}&slot=a`, { headers })
      .then(r => r.json()).then(d => { results.venueBlogA = d })
      .catch(e => { results.venueBlogA = { error: e.message } }),

    fetch(`${base}/api/cron/venue-blog?secret=${process.env.CRON_SECRET || 'hirehub-cron-2026'}&slot=b`, { headers })
      .then(r => r.json()).then(d => { results.venueBlogB = d })
      .catch(e => { results.venueBlogB = { error: e.message } }),

    fetch(`${base}/api/cron/backlinks?secret=${process.env.CRON_SECRET || 'hirehub-cron-2026'}`, { headers })
      .then(r => r.json()).then(d => { results.backlinks = d })
      .catch(e => { results.backlinks = { error: e.message } }),

    fetch(`${base}/api/cron/syndicate?secret=${process.env.CRON_SECRET || 'hirehub-cron-2026'}`, { headers })
      .then(r => r.json()).then(d => { results.syndicate = d })
      .catch(e => { results.syndicate = { error: e.message } }),

  ])

  console.log('master-morning results:', JSON.stringify(results))
  return res.json({ ok: true, ran: Object.keys(results), results })
}

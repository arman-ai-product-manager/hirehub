/**
 * Hourly cron — auto-submits newly created jobs and blogs to IndexNow + Google/Bing sitemap pings.
 * Runs every hour. Picks up content created in the last 90 minutes (overlap to avoid gaps).
 * Schedule: every hour  →  "0 * * * *"
 */
const { supabaseService } = require('../../../lib/supabase')
const { autoIndex, SITE } = require('../../../lib/autoIndex')
const { googleIndex }     = require('../../../lib/googleIndex')

function mkSlug(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = req.headers['x-cron-secret'] || req.query.secret
  if (secret !== (process.env.CRON_SECRET || 'hirehub-cron-2026')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Look back 90 minutes to catch anything since last run
    const since = new Date(Date.now() - 90 * 60 * 1000).toISOString()

    const [{ data: newJobs }, { data: newBlogs }] = await Promise.all([
      supabaseService
        .from('jobs')
        .select('id,title,company_name,location,slug')
        .eq('status', 'active')
        .gte('created_at', since),
      supabaseService
        .from('blogs')
        .select('slug')
        .eq('published', true)
        .gte('created_at', since),
    ])

    const urls = []

    // Job URLs — prefer stored slug, fall back to computed slug
    for (const j of (newJobs || [])) {
      const slug = j.slug || (mkSlug(j.title) + '-' + mkSlug(j.company_name) + '-' + mkSlug(j.location))
      urls.push(`${SITE}/jobs/${slug}`)
    }

    // Blog URLs
    for (const b of (newBlogs || [])) {
      urls.push(`${SITE}/blog/${b.slug}`)
    }

    if (urls.length === 0) {
      return res.json({ ok: true, indexed: 0, message: 'No new content since last run' })
    }

    // IndexNow + sitemap pings (Bing, Yandex, Google sitemap ping)
    await autoIndex(urls)

    // Google Indexing API — direct crawl request per URL (quota: 200/day)
    // Limit to 50 per hourly run to preserve daily quota for multiple runs
    const googleUrls = urls.slice(0, 50)
    const googleResults = await googleIndex(googleUrls)
    const googleOk = googleResults.filter(r => r.ok).length

    return res.json({
      ok: true,
      indexed: urls.length,
      google_submitted: googleOk,
      google_failed: googleResults.filter(r => !r.ok).length,
      urls,
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

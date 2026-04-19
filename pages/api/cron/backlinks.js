/**
 * Daily backlink/ping cron — submits HireHub360 to 20+ free indexing, blog ping,
 * and content aggregator services to build domain authority and crawl signals.
 *
 * Services used (all free, no API keys required):
 *   - Blog XML-RPC ping services (Pingomatic, etc.)
 *   - Search engine sitemap pings (Google, Bing, Yandex)
 *   - IndexNow for all enrolled search engines
 *   - Free job aggregator pings (Jooble, etc.)
 *   - RSS aggregator notifications
 *
 * Schedule: daily at 07:00 UTC  →  "0 7 * * *"
 */
const { supabaseService } = require('../../../lib/supabase')
const { SITE } = require('../../../lib/autoIndex')

const INDEXNOW_KEY = 'hirehub2026'
const SITEMAP_URL  = `${SITE}/sitemap.xml`

// ── BLOG PING SERVICES (XML-RPC) ───────────────────────────────────────────
// These signal search engines and aggregators that new content is available.
const BLOG_PING_ENDPOINTS = [
  'https://rpc.pingomatic.com/',
  'https://ping.blogs.yandex.ru/RPC2',
  'http://blogsearch.google.com/ping/RPC2',
  'https://ping.feedburner.com/',
  'http://rpc.weblogs.com/RPC2',
  'http://ping.feedburner.com/RPC2',
  'http://api.moreover.com/RPC2',
  'http://www.blogreader.co.uk/rpc.php',
  'http://ping.blo.gs/',
  'http://ping.bloggers.jp/rpc/',
  'http://blogping.com/RPC2',
  'http://www.ping.in/',
]

// Build the XML-RPC ping payload
function buildRpcPayload(blogName, blogUrl, rssUrl) {
  return `<?xml version="1.0"?><methodCall><methodName>weblogUpdates.ping</methodName><params><param><value><string>${blogName}</string></value></param><param><value><string>${blogUrl}</string></value></param><param><value><string>${rssUrl}</string></value></param></params></methodCall>`
}

// ── SEARCH ENGINE SITEMAP PINGS ────────────────────────────────────────────
const SITEMAP_PINGS = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  `https://www.google.com/ping?sitemap=${encodeURIComponent(SITE + '/sitemap.xml')}`,
]

// ── INDEXNOW SEARCH ENGINES ────────────────────────────────────────────────
// IndexNow protocol — submit to each engine individually for broader coverage
const INDEXNOW_ENGINES = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://search.seznam.cz/indexnow',
  'https://yandex.com/indexnow',
]

async function pingBlogServices(todayUrls) {
  const rssUrl = `${SITE}/blog`
  const payload = buildRpcPayload('HireHub360 Blog', `${SITE}/blog`, rssUrl)
  const results = []

  for (const endpoint of BLOG_PING_ENDPOINTS) {
    try {
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml' },
        body: payload,
        signal: AbortSignal.timeout(5000),
      })
      results.push({ endpoint, status: r.status, ok: r.status < 400 })
    } catch (e) {
      results.push({ endpoint, error: e.message, ok: false })
    }
  }
  return results
}

async function pingSitemaps() {
  const results = []
  for (const url of SITEMAP_PINGS) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(5000) })
      results.push({ url, status: r.status, ok: r.status < 400 })
    } catch (e) {
      results.push({ url, error: e.message, ok: false })
    }
  }
  return results
}

async function submitIndexNow(urlList) {
  const results = []
  for (const engine of INDEXNOW_ENGINES) {
    try {
      const r = await fetch(engine, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: 'hirehub360.in',
          key: INDEXNOW_KEY,
          keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
          urlList,
        }),
        signal: AbortSignal.timeout(8000),
      })
      results.push({ engine, status: r.status, ok: r.status < 400 })
    } catch (e) {
      results.push({ engine, error: e.message, ok: false })
    }
  }
  return results
}

async function pingRssAggregators() {
  // Free RSS/feed aggregators that accept notification pings
  const RSS_URL = encodeURIComponent(`${SITE}/blog`)
  const SITE_URL = encodeURIComponent(SITE)
  const aggregators = [
    `https://blogsearch.google.com/ping?name=HireHub360&url=${SITE_URL}&changesURL=${RSS_URL}`,
    `https://www.feedspot.com/oms/ping?s=HireHub360 India Hiring Blog&url=${SITE_URL}`,
    `http://ping.in/update?name=HireHub360&url=${SITE_URL}`,
  ]
  const results = []
  for (const url of aggregators) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(5000) })
      results.push({ url: url.slice(0, 60), status: r.status, ok: r.status < 400 })
    } catch (e) {
      results.push({ url: url.slice(0, 60), error: e.message, ok: false })
    }
  }
  return results
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
    // Get today's fresh content URLs to push through IndexNow
    const since = new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString() // last 26h

    const [{ data: recentBlogs }, { data: recentJobs }] = await Promise.all([
      supabaseService.from('blogs').select('slug').eq('published', true).gte('created_at', since).limit(20),
      supabaseService.from('jobs').select('slug,title,company_name,location').eq('status', 'active').gte('created_at', since).limit(20),
    ])

    const freshUrls = [SITE, `${SITE}/blog`]

    for (const b of (recentBlogs || [])) {
      freshUrls.push(`${SITE}/blog/${b.slug}`)
    }

    function mkSlug(s) {
      return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }

    for (const j of (recentJobs || [])) {
      const slug = j.slug || (mkSlug(j.title) + '-' + mkSlug(j.company_name) + '-' + mkSlug(j.location))
      freshUrls.push(`${SITE}/jobs/${slug}`)
    }

    // Run all pings in parallel
    const [blogPings, sitemapPings, indexNowResults, rssResults] = await Promise.all([
      pingBlogServices(freshUrls),
      pingSitemaps(),
      submitIndexNow(freshUrls.slice(0, 100)), // IndexNow max 100 per batch
      pingRssAggregators(),
    ])

    const total = blogPings.length + sitemapPings.length + indexNowResults.length + rssResults.length
    const ok    = [...blogPings, ...sitemapPings, ...indexNowResults, ...rssResults].filter(r => r.ok).length

    // Log the run to Supabase audit_log for tracking (best-effort)
    try {
      await supabaseService.from('audit_log').insert({
        actor_role: 'cron',
        action: 'backlink_ping',
        metadata: { total, ok, fresh_urls: freshUrls.length, date: new Date().toISOString().slice(0,10) },
      })
    } catch (_) {}

    return res.json({
      ok: true,
      total_submissions: total,
      successful: ok,
      fresh_content_urls: freshUrls.length,
      breakdown: { blogPings, sitemapPings, indexNowResults, rssResults },
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

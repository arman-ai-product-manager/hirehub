/**
 * syndicate.js — Daily cron that cross-posts new HireHub360 blogs to:
 *   1. Dev.to    (DA 90+) — dofollow backlink via canonical URL
 *   2. Hashnode  (DA 70+) — dofollow backlink via originalArticleURL
 *
 * Canonical URL is always set to hirehub360.in/blog/[slug] so Google
 * treats hirehub360.in as the original source — no duplicate content penalty.
 *
 * Tracks syndicated posts in Supabase `blogs` table via `syndicated_at` JSONB column.
 * Falls back gracefully if column doesn't exist yet.
 *
 * Schedule: daily at 08:30 UTC  →  "30 8 * * *"
 */
const { supabaseService } = require('../../../lib/supabase')
const { SITE } = require('../../../lib/autoIndex')

const DEVTO_KEY    = process.env.DEVTO_API_KEY
const HASHNODE_KEY = process.env.HASHNODE_API_KEY

// ── DEV.TO ─────────────────────────────────────────────────────────────────

async function postToDevTo(blog) {
  const canonicalUrl = `${SITE}/blog/${blog.slug}`

  // Map blog tags to Dev.to format (max 4, lowercase, no spaces, alphanumeric only)
  const tags = (blog.tags || ['hiring', 'india', 'jobs', 'hr'])
    .slice(0, 4)
    .map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter(t => t.length >= 2 && t.length <= 30)

  // Prepend attribution header to content
  const body = `> *This article was originally published on [HireHub360](${canonicalUrl}) — India's AI-powered job posting platform.*\n\n${blog.content}`

  const r = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'api-key': DEVTO_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      article: {
        title: blog.title,
        body_markdown: body,
        published: true,
        canonical_url: canonicalUrl,
        tags,
        description: blog.excerpt || blog.title,
      },
    }),
    signal: AbortSignal.timeout(15000),
  })

  const data = await r.json()
  if (!r.ok) throw new Error(data?.error || data?.errors?.join(', ') || r.statusText)
  return { url: data.url, id: data.id }
}

// ── HASHNODE ────────────────────────────────────────────────────────────────

async function getHashnodePublicationId() {
  const r = await fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: {
      Authorization: HASHNODE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{ me { publications(first: 1) { edges { node { id title url } } } } }`,
    }),
    signal: AbortSignal.timeout(10000),
  })
  const data = await r.json()
  const pub = data?.data?.me?.publications?.edges?.[0]?.node
  if (!pub) throw new Error('No Hashnode publication found — create a blog at hashnode.com first')
  return pub.id
}

async function postToHashnode(blog, publicationId) {
  const canonicalUrl = `${SITE}/blog/${blog.slug}`

  const body = `> *Originally published on [HireHub360](${canonicalUrl}) — India's AI-powered job posting platform.*\n\n${blog.content}`

  const r = await fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: {
      Authorization: HASHNODE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation PublishPost($input: PublishPostInput!) {
          publishPost(input: $input) {
            post { id url title }
          }
        }
      `,
      variables: {
        input: {
          title: blog.title,
          contentMarkdown: body,
          publicationId,
          originalArticleURL: canonicalUrl,
          tags: [],
          metaTags: {
            title: blog.title,
            description: blog.excerpt || blog.title,
          },
        },
      },
    }),
    signal: AbortSignal.timeout(15000),
  })

  const data = await r.json()
  if (data.errors) throw new Error(data.errors.map(e => e.message).join(', '))
  const post = data?.data?.publishPost?.post
  if (!post) throw new Error('Hashnode returned no post data')
  return { url: post.url, id: post.id }
}

// ── HANDLER ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = req.headers['x-cron-secret'] || req.query.secret
  if (secret !== (process.env.CRON_SECRET || 'hirehub-cron-2026')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!DEVTO_KEY && !HASHNODE_KEY) {
    return res.status(500).json({ error: 'No syndication API keys configured' })
  }

  try {
    // Fetch blogs published in last 26h that haven't been syndicated yet
    const since = new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString()

    const { data: blogs, error: fetchErr } = await supabaseService
      .from('blogs')
      .select('id,slug,title,excerpt,content,tags')
      .eq('published', true)
      .gte('created_at', since)
      .is('syndicated_at', null)  // not yet syndicated
      .order('created_at', { ascending: true })
      .limit(3)  // max 3 per day to avoid spam flags

    if (fetchErr) {
      // Column may not exist yet — fall back to fetching without filter
      const { data: fallback } = await supabaseService
        .from('blogs')
        .select('id,slug,title,excerpt,content,tags')
        .eq('published', true)
        .gte('created_at', since)
        .order('created_at', { ascending: true })
        .limit(3)

      if (!fallback || fallback.length === 0) {
        return res.json({ ok: true, message: 'No new blogs to syndicate today' })
      }
      // Use fallback but note we can't mark as syndicated without column
      return await syndicateBlogs(fallback, false, res)
    }

    if (!blogs || blogs.length === 0) {
      return res.json({ ok: true, message: 'No new blogs to syndicate today' })
    }

    return await syndicateBlogs(blogs, true, res)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

async function syndicateBlogs(blogs, canMark, res) {
  const results = []

  // Get Hashnode publication ID once
  let hashnodePublicationId = null
  if (HASHNODE_KEY) {
    try {
      hashnodePublicationId = await getHashnodePublicationId()
    } catch (e) {
      results.push({ platform: 'hashnode_setup', error: e.message })
    }
  }

  for (const blog of blogs) {
    const blogResult = { slug: blog.slug, devto: null, hashnode: null }

    // Post to Dev.to
    if (DEVTO_KEY) {
      try {
        blogResult.devto = await postToDevTo(blog)
      } catch (e) {
        blogResult.devto = { error: e.message }
      }
    }

    // Post to Hashnode
    if (HASHNODE_KEY && hashnodePublicationId) {
      try {
        blogResult.hashnode = await postToHashnode(blog, hashnodePublicationId)
      } catch (e) {
        blogResult.hashnode = { error: e.message }
      }
    }

    // Mark as syndicated in Supabase (best-effort)
    if (canMark && (blogResult.devto?.url || blogResult.hashnode?.url)) {
      try {
        await supabaseService.from('blogs').update({
          syndicated_at: new Date().toISOString(),
        }).eq('id', blog.id)
      } catch (_) {}
    }

    results.push(blogResult)
  }

  const successful = results.filter(r => r.devto?.url || r.hashnode?.url).length
  return res.json({ ok: true, syndicated: successful, total: blogs.length, results })
}

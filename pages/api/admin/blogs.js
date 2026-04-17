const { supabaseService } = require('../../../lib/supabase')
const { autoIndex, SITE } = require('../../../lib/autoIndex')

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseService
      .from('blogs')
      .select('id,title,slug,excerpt,cover_image,author,tags,published,created_at')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ posts: data || [] })
  }

  if (req.method === 'POST') {
    const { id, title, slug, excerpt, content, cover_image, author, tags, published } = req.body
    const payload = {
      title: title || '',
      slug: slug || '',
      excerpt: excerpt || null,
      content: content || '',
      cover_image: cover_image || null,
      author: author || 'HireHub360 Team',
      tags: Array.isArray(tags) ? tags : [],
      published: !!published,
      updated_at: new Date().toISOString()
    }

    if (id) {
      const { error } = await supabaseService.from('blogs').update(payload).eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
    } else {
      const { error } = await supabaseService.from('blogs').insert(payload)
      if (error) return res.status(500).json({ error: error.message })
    }

    // Auto-index immediately if published
    if (published && slug) {
      autoIndex([
        `${SITE}/blog/${slug}`,
        `${SITE}/blog`,
        `${SITE}/sitemap.xml`
      ]).catch(() => {})
    }

    return res.json({ ok: true })
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const { error } = await supabaseService.from('blogs').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}

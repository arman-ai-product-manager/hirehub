const { supabaseService } = require('../../../lib/supabase')

async function auth(req) {
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return null
  const { data: { user }, error } = await supabaseService.auth.getUser(jwt)
  return error ? null : user
}

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' })

  const user = await auth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'id required' })

  // Verify ownership before deleting
  const { data: resume } = await supabaseService
    .from('screener_resumes')
    .select('id,file_url,company_id')
    .eq('id', id)
    .eq('company_id', user.id)
    .maybeSingle()

  if (!resume) return res.status(403).json({ error: 'Resume not found' })

  // Delete storage file if present
  if (resume.file_url) {
    try {
      // Extract storage path from URL: .../resumes/<path>
      const match = resume.file_url.match(/\/resumes\/(.+)$/)
      if (match) {
        await supabaseService.storage.from('resumes').remove([decodeURIComponent(match[1])])
      }
    } catch {}
  }

  const { error } = await supabaseService
    .from('screener_resumes')
    .delete()
    .eq('id', id)
    .eq('company_id', user.id)

  if (error) return res.status(500).json({ error: error.message })

  return res.json({ ok: true })
}

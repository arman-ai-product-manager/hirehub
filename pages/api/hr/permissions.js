const { supabaseService } = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers.authorization || ''
  const jwt = authHeader.replace('Bearer ', '').trim()
  if (!jwt) return res.status(401).json({ error: 'Not authenticated' })

  const { data: { user }, error: authErr } = await supabaseService.auth.getUser(jwt)
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' })
  if (user.user_metadata?.role !== 'company')
    return res.status(403).json({ error: 'Only company admins can update HR permissions' })

  const { hr_user_id, permissions } = req.body || {}
  if (!hr_user_id || !permissions) return res.status(400).json({ error: 'hr_user_id and permissions required' })

  // Verify this HR user belongs to the calling company
  const { data: hrUser } = await supabaseService
    .from('hr_users').select('id,company_id').eq('id', hr_user_id).maybeSingle()
  if (!hrUser || hrUser.company_id !== user.id)
    return res.status(403).json({ error: 'This HR member is not in your company' })

  const { error } = await supabaseService
    .from('hr_users')
    .update({ permissions, updated_at: new Date().toISOString() })
    .eq('id', hr_user_id)

  if (error) return res.status(500).json({ error: error.message })

  await supabaseService.from('audit_log').insert({
    actor_id:    user.id,
    actor_role:  'company',
    action:      'update_hr_permissions',
    target_type: 'user',
    target_id:   hr_user_id,
    metadata:    { permissions },
  }).catch(() => {})

  return res.json({ ok: true })
}

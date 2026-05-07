const { validateSession } = require('../../../lib/adminSession')
const { supabaseService } = require('../../../lib/supabase')

async function auditLog(action, targetType, targetId, metadata) {
  try {
    await supabaseService.from('audit_log').insert({
      actor_id:    null,
      actor_role:  'super_admin',
      action,
      target_type: targetType,
      target_id:   String(targetId || ''),
      metadata:    metadata || {},
    })
  } catch (_) {}
}

export default async function handler(req, res) {
  if (!validateSession(req)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { action, userId, jobId, plan, table } = req.body || {}

  try {
    // ── Ban user ──────────────────────────────────────────────────
    if (action === 'ban_user') {
      const tbl = table === 'companies' ? 'companies' : 'candidates'
      await supabaseService.from(tbl)
        .update({ is_banned: true, banned_at: new Date().toISOString() })
        .eq('id', userId)
      // Force sign-out via Supabase Admin API
      await supabaseService.auth.admin.signOut(userId).catch(() => {})
      await auditLog('ban_user', tbl, userId, { table: tbl })
      return res.json({ ok: true })
    }

    // ── Unban user ────────────────────────────────────────────────
    if (action === 'unban_user') {
      const tbl = table === 'companies' ? 'companies' : 'candidates'
      await supabaseService.from(tbl)
        .update({ is_banned: false, banned_at: null })
        .eq('id', userId)
      await auditLog('unban_user', tbl, userId, { table: tbl })
      return res.json({ ok: true })
    }

    // ── Delete job ────────────────────────────────────────────────
    if (action === 'delete_job') {
      if (!jobId) return res.status(400).json({ error: 'jobId required' })
      await supabaseService.from('jobs').delete().eq('id', jobId)
      await auditLog('delete_job', 'job', jobId, {})
      return res.json({ ok: true })
    }

    // ── Override plan ─────────────────────────────────────────────
    if (action === 'override_plan') {
      if (!userId || !plan) return res.status(400).json({ error: 'userId and plan required' })
      const validPlans = ['free', 'pro', 'enterprise']
      if (!validPlans.includes(plan)) return res.status(400).json({ error: 'Invalid plan' })
      await supabaseService.from('companies')
        .update({ plan, plan_override: plan })
        .eq('id', userId)
      await auditLog('override_plan', 'company', userId, { plan })
      return res.json({ ok: true })
    }

    return res.status(400).json({ error: 'Unknown action' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

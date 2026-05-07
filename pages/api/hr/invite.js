const { supabaseService } = require('../../../lib/supabase')
const { Resend }          = require('resend')

export default async function handler(req, res) {

  // ── CREATE INVITE — called by Company Admin ────────────────────
  if (req.method === 'POST') {
    const authHeader = req.headers.authorization || ''
    const jwt = authHeader.replace('Bearer ', '').trim()
    if (!jwt) return res.status(401).json({ error: 'Not authenticated' })

    const { data: { user }, error: authErr } = await supabaseService.auth.getUser(jwt)
    if (authErr || !user) return res.status(401).json({ error: 'Invalid token' })
    if (user.user_metadata?.role !== 'company')
      return res.status(403).json({ error: 'Only company admins can invite HR members' })

    const { email, permissions } = req.body || {}
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' })

    const { data: company } = await supabaseService
      .from('companies').select('id,company_name').eq('id', user.id).maybeSingle()
    if (!company) return res.status(400).json({ error: 'Company profile not found. Please complete your company profile first.' })

    // Revoke any existing pending invite for this email+company
    await supabaseService.from('hr_invites')
      .update({ status: 'revoked' })
      .eq('company_id', company.id)
      .eq('email', email.toLowerCase())
      .eq('status', 'pending')

    const perms = permissions || {
      can_view_all_jobs:      true,
      can_contact_candidates: false,
      assigned_job_ids:       [],
    }

    const { data: invite, error: invErr } = await supabaseService
      .from('hr_invites')
      .insert({
        company_id: company.id,
        invited_by: user.id,
        email:      email.toLowerCase(),
        permissions: perms,
      })
      .select()
      .single()

    if (invErr) return res.status(500).json({ error: invErr.message })

    // Send invite email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const inviteUrl = `https://hirehub360.in/hirehub.html?hr_token=${invite.token}`
        await resend.emails.send({
          from:    'noreply@hirehub360.in',
          to:      [email],
          subject: `You're invited to join ${company.company_name} on HireHub360`,
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
              <div style="text-align:center;margin-bottom:28px">
                <span style="font-size:32px">🎯</span>
                <div style="font-weight:900;font-size:22px;color:#ff6b00;margin-top:8px">HireHub360</div>
              </div>
              <h2 style="font-size:20px;font-weight:800;color:#1d1d1f;margin-bottom:12px">You're invited!</h2>
              <p style="color:#444;font-size:15px;line-height:1.6;margin-bottom:20px">
                <strong>${company.company_name}</strong> has invited you to join their HR team on HireHub360.
                As an HR member, you'll be able to manage job applications, shortlist candidates, and schedule interviews.
              </p>
              <div style="text-align:center;margin-bottom:24px">
                <a href="${inviteUrl}"
                  style="background:#ff6b00;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:800;font-size:15px;display:inline-block">
                  Accept Invitation →
                </a>
              </div>
              <p style="color:#888;font-size:12px;text-align:center;line-height:1.5">
                This link expires in 7 days. If you didn't expect this, you can safely ignore this email.<br/>
                — Team HireHub360
              </p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Resend error:', emailErr)
      }
    }

    // Audit log
    await supabaseService.from('audit_log').insert({
      actor_id:    user.id,
      actor_role:  'company',
      action:      'invite_hr',
      target_type: 'user',
      target_id:   email,
      metadata:    { company_id: company.id, company_name: company.company_name, email },
    }).catch(() => {})

    return res.json({ ok: true, invite_id: invite.id })
  }

  // ── ACCEPT INVITE — called after HR user signs in ─────────────
  if (req.method === 'PATCH') {
    const { token, user_id } = req.body || {}
    if (!token || !user_id) return res.status(400).json({ error: 'token and user_id required' })

    const { data: invite } = await supabaseService
      .from('hr_invites')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .maybeSingle()

    if (!invite) return res.status(404).json({ error: 'Invalid or already-used invite link' })
    if (new Date(invite.expires_at) < new Date())
      return res.status(410).json({ error: 'Invite link has expired. Ask your company admin to resend.' })

    // Upsert hr_users row
    const { error: hrErr } = await supabaseService.from('hr_users').upsert({
      id:          user_id,
      company_id:  invite.company_id,
      email:       invite.email,
      permissions: invite.permissions,
      invited_by:  invite.invited_by,
    }, { onConflict: 'id' })

    if (hrErr) return res.status(500).json({ error: hrErr.message })

    // Update Supabase Auth metadata — set role to 'hr'
    await supabaseService.auth.admin.updateUserById(user_id, {
      user_metadata: {
        role:       'hr',
        company_id: invite.company_id,
      },
    }).catch(console.error)

    // Mark invite accepted
    await supabaseService.from('hr_invites')
      .update({ status: 'accepted' })
      .eq('id', invite.id)

    // Audit
    await supabaseService.from('audit_log').insert({
      actor_id:    user_id,
      actor_role:  'hr',
      action:      'accept_hr_invite',
      target_type: 'company',
      target_id:   invite.company_id,
      metadata:    { invite_id: invite.id },
    }).catch(() => {})

    return res.json({ ok: true, company_id: invite.company_id, permissions: invite.permissions })
  }

  res.status(405).json({ error: 'Method not allowed' })
}

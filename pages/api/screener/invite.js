import { Resend } from 'resend'
const { supabaseService } = require('../../../lib/supabase')

async function auth(req) {
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return null
  const { data: { user }, error } = await supabaseService.auth.getUser(jwt)
  return error ? null : user
}

function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await auth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const { email, company_name } = req.body || {}
  if (!email || !isValidEmail(email)) return res.status(400).json({ error: 'Valid email required' })

  const name  = (company_name || 'Your company').trim().slice(0, 100)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hirehub360.in'

  // Record invite in DB (best-effort — don't fail if table doesn't exist yet)
  await supabaseService.from('screener_invites').upsert({
    company_id:    user.id,
    invited_email: email.toLowerCase(),
    status:        'pending',
  }, { onConflict: 'company_id,invited_email' }).catch(() => {})

  if (!process.env.RESEND_API_KEY) {
    return res.json({ ok: true, skipped: 'RESEND_API_KEY not set — invite recorded in DB only' })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from:    'HireHub360 <noreply@hirehub360.in>',
      to:      email,
      subject: `You've been invited to join ${name} on HireHub360`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif">
  <div style="max-width:540px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)">
    <div style="background:linear-gradient(135deg,#1d1d1f,#2d2d30);padding:32px;text-align:center">
      <div style="font-size:42px;margin-bottom:12px">👋</div>
      <h1 style="color:#fff;font-size:22px;font-weight:900;margin:0;letter-spacing:-.03em">You're Invited</h1>
    </div>
    <div style="padding:32px">
      <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 20px">
        <strong>${name}</strong> has invited you to collaborate on HireHub360 — India's AI-powered resume screener that ranks 500 candidates in minutes.
      </p>
      <a href="${appUrl}/hirehub.html" style="display:block;text-align:center;background:#ff6b00;color:#fff;padding:14px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none;margin-bottom:20px">
        Accept Invitation →
      </a>
      <p style="font-size:12px;color:#9ca3af;margin:0;text-align:center">
        If you weren't expecting this, you can safely ignore this email.
      </p>
    </div>
    <div style="border-top:1px solid #f3f4f6;padding:16px 32px;text-align:center">
      <p style="font-size:12px;color:#9ca3af;margin:0">HireHub360 · <a href="${appUrl}" style="color:#ff6b00;text-decoration:none">hirehub360.in</a></p>
    </div>
  </div>
</body>
</html>`,
    })
    return res.json({ ok: true })
  } catch (e) {
    console.error('Invite email error:', e.message)
    return res.status(500).json({ error: e.message })
  }
}

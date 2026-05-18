import { Resend } from 'resend'
const { supabaseService } = require('../../../lib/supabase')

async function auth(req) {
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return null
  const { data: { user }, error } = await supabaseService.auth.getUser(jwt)
  return error ? null : user
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await auth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  if (!process.env.RESEND_API_KEY) return res.json({ ok: true, skipped: 'RESEND_API_KEY not set' })
  if (!user.email)                 return res.json({ ok: true, skipped: 'No email on account' })

  const { job_id, job_title, screened_count, shortlist_count, job_url } = req.body || {}
  if (!job_id) return res.status(400).json({ error: 'job_id required' })

  // Verify job ownership
  const { data: job } = await supabaseService
    .from('screener_jobs')
    .select('id, title')
    .eq('id', job_id)
    .eq('company_id', user.id)
    .maybeSingle()
  if (!job) return res.status(403).json({ error: 'Job not found' })

  const title      = job_title || job.title
  const screened   = screened_count || 0
  const shortlists = shortlist_count || 0
  const link       = job_url || `${process.env.NEXT_PUBLIC_APP_URL || 'https://hirehub360.in'}/screener/${job_id}`

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from:    'HireHub360 <noreply@hirehub360.in>',
      to:      user.email,
      subject: `✅ Screening complete: ${title}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)">
    <div style="background:linear-gradient(135deg,#1d1d1f,#2d2d30);padding:32px 32px 28px;text-align:center">
      <div style="font-size:42px;margin-bottom:12px">🎉</div>
      <h1 style="color:#fff;font-size:22px;font-weight:900;margin:0 0 8px;letter-spacing:-.03em">Screening Complete</h1>
      <p style="color:rgba(255,255,255,.65);font-size:14px;margin:0">${title}</p>
    </div>
    <div style="padding:32px">
      <div style="display:flex;gap:16px;margin-bottom:28px">
        <div style="flex:1;background:#f9fafb;border-radius:12px;padding:18px;text-align:center;border:1px solid #f3f4f6">
          <div style="font-size:28px;font-weight:900;color:#111827">${screened}</div>
          <div style="font-size:12px;color:#9ca3af;margin-top:4px;font-weight:600">Resumes Screened</div>
        </div>
        <div style="flex:1;background:#f0fdf4;border-radius:12px;padding:18px;text-align:center;border:1px solid #dcfce7">
          <div style="font-size:28px;font-weight:900;color:#16a34a">${shortlists}</div>
          <div style="font-size:12px;color:#16a34a;margin-top:4px;font-weight:600">Shortlisted</div>
        </div>
      </div>
      <a href="${link}" style="display:block;text-align:center;background:#ff6b00;color:#fff;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none;letter-spacing:-.01em">
        View Results →
      </a>
    </div>
    <div style="border-top:1px solid #f3f4f6;padding:16px 32px;text-align:center">
      <p style="font-size:12px;color:#9ca3af;margin:0">HireHub360 AI Screener · <a href="https://hirehub360.in" style="color:#ff6b00;text-decoration:none">hirehub360.in</a></p>
    </div>
  </div>
</body>
</html>`,
    })
    return res.json({ ok: true })
  } catch (e) {
    console.error('Email send error:', e.message)
    return res.status(500).json({ error: e.message })
  }
}

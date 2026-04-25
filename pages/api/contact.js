/**
 * POST /api/contact
 * Handles contact form submissions — saves to Supabase + sends email
 */
const { supabaseService } = require('../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, phone, subject, message } = req.body
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' })

  // Save to Supabase (best effort)
  try {
    await supabaseService.from('contact_submissions').insert({
      name, email, phone: phone || null, subject: subject || null, message,
      created_at: new Date().toISOString()
    })
  } catch (e) { console.error('Contact DB error:', e.message) }

  // Send email notification
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = require('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'contact@hirehub360.in',
        to: [process.env.BOOKING_EMAIL || 'armanshk612@gmail.com'],
        subject: `[Contact] ${subject || 'New Message'} — ${name}`,
        html: `<h2>New Contact Form Submission</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> <a href="mailto:${email}">${email}</a></p>
          <p><b>Phone:</b> ${phone || 'Not provided'}</p>
          <p><b>Subject:</b> ${subject || 'Not specified'}</p>
          <hr/>
          <p>${message.replace(/\n/g,'<br/>')}</p>`
      })
      // Auto-reply to user
      await resend.emails.send({
        from: 'support@hirehub360.in',
        to: [email],
        subject: 'We received your message — HireHub360',
        html: `<p>Hi ${name},</p>
          <p>Thanks for reaching out! We've received your message and will get back to you within 2 hours during business hours (Mon–Sat, 9AM–7PM IST).</p>
          <p>— Team HireHub360<br/><a href="https://hirehub360.in">hirehub360.in</a></p>`
      })
    } catch (e) { console.error('Contact email error:', e.message) }
  }

  return res.json({ ok: true })
}

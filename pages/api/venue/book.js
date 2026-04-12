const { supabaseService } = require('../../../lib/supabase')

const GSHEET_URL = 'https://script.google.com/macros/s/AKfycbydrY-w7Uqh_fgcEKjc1e5a_ZxWszVGqJps4iIq_dfW0N_vfCbSybSJphohmIkGXywv/exec'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { category, name, phone, email, company, date, guests, occasion, notes } = req.body

  if (!name || !phone || !email || !date || !guests) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // 1. Save to Supabase
  try {
    await supabaseService.from('venue_bookings').insert({
      category,
      booker_name: name,
      phone,
      email,
      booking_date: date,
      guests: parseInt(guests),
      occasion,
      notes,
      status: 'pending'
    })
  } catch (e) {
    console.error('Supabase insert error:', e.message)
  }

  // 2. Send emails via Resend — only if key is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = require('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'bookings@hirehub360.in',
        to: [process.env.BOOKING_EMAIL || 'armanshk612@gmail.com'],
        subject: `[Venue Booking] ${category} — ${name} — ${date}`,
        html: `<h2>New Venue Booking</h2>
          <p><b>Category:</b> ${category}</p>
          <p><b>Name:</b> ${name} | <b>Phone:</b> ${phone} | <b>Email:</b> ${email}</p>
          <p><b>Company:</b> ${company || 'N/A'} | <b>Date:</b> ${date} | <b>Guests:</b> ${guests}</p>
          <p><b>Occasion:</b> ${occasion || 'Not specified'}</p>
          <p><b>Notes:</b> ${notes || 'None'}</p>`
      })

      await resend.emails.send({
        from: 'bookings@hirehub360.in',
        to: [email],
        subject: `Booking Request Received — ${category}`,
        html: `<h2>Hi ${name}!</h2>
          <p>Your booking request for <b>${category}</b> on <b>${date}</b> is received.</p>
          <p>Our team will call you at <b>${phone}</b> within 2 hours to confirm.</p>
          <p>— Team Hire Hub</p>`
      })
    } catch (e) {
      console.error('Resend error:', e.message)
    }
  }

  // 3. Push to Google Sheet server-side (no CORS issues)
  try {
    await fetch(GSHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        type: 'venue_booking', category, name, phone, email,
        company: company || '', date, guests, occasion: occasion || '',
        notes: notes || '', timestamp: new Date().toISOString()
      })
    })
  } catch (e) {
    console.error('GSheet error:', e.message)
  }

  res.json({ ok: true })
}

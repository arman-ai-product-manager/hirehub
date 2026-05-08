const { supabaseService } = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { jobId, jobTitle, companyName, location, candidateName } = req.body || {}

  if (!jobTitle || !companyName) {
    return res.status(400).json({ error: 'jobTitle and companyName are required' })
  }

  const waNumber = process.env.WHATSAPP_SUPPORT_NUMBER || '919820000000'

  const message = `Hi HireHub360! 🙏

I want to apply for this job:
*Job:* ${jobTitle}
*Company:* ${companyName}
*Location:* ${location || 'Not specified'}

My details:
Name: ${candidateName || 'Please ask me'}
I am interested and available to join.

Please connect me with the recruiter. Thank you!`

  const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`

  // Log application attempt to Supabase (best-effort, don't fail the request)
  try {
    await supabaseService.from('applications').insert({
      id:             crypto.randomUUID(),
      job_id:         jobId || null,
      source:         'whatsapp',
      status:         'applied',
      applied_at:     new Date().toISOString(),
      candidate_name: candidateName || null,
    })
  } catch (err) {
    console.warn('[whatsapp-apply] Failed to log application:', err.message)
  }

  return res.json({ url })
}

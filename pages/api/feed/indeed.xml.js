const { supabaseService } = require('../../../lib/supabase')

export const config = { api: { responseLimit: '8mb' } }

function esc(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function indeedDate(isoStr) {
  return new Date(isoStr || Date.now()).toUTCString()
}

export default async function handler(req, res) {
  const { data: jobs, error } = await supabaseService
    .from('jobs')
    .select('id,title,company_name,location,description,salary_label,salary_min,salary_max,salary_hidden,job_type,experience,skills,slug,created_at,remote_policy')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) return res.status(500).send('DB error')

  const base = (process.env.NEXT_PUBLIC_APP_URL || 'https://hirehub360.in').trim().replace(/\/$/, '')

  const items = (jobs || []).map(j => {
    const slug = j.slug || `${j.title}-${j.company_name}-${j.location}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const jobUrl = `${base}/jobs/${slug}`
    const salary = j.salary_hidden ? '' : (j.salary_label || (j.salary_min ? `₹${j.salary_min}–${j.salary_max || ''}` : ''))
    const isRemote = j.remote_policy === 'Remote' || j.remote_policy === 'Full-Remote'
    const jobType = {
      'Full-time': 'fulltime',
      'Part-time': 'parttime',
      'Contract': 'contract',
      'Internship': 'internship',
      'Freelance': 'other',
    }[j.job_type] || 'fulltime'

    return `    <job>
      <title><![CDATA[${j.title}]]></title>
      <date><![CDATA[${indeedDate(j.created_at)}]]></date>
      <referencenumber><![CDATA[${j.id}]]></referencenumber>
      <url><![CDATA[${jobUrl}]]></url>
      <company><![CDATA[${j.company_name}]]></company>
      <city><![CDATA[${j.location || ''}]]></city>
      <country><![CDATA[India]]></country>
      <remotetype><![CDATA[${isRemote ? 'temporary' : ''}]]></remotetype>
      <description><![CDATA[${j.description || `${j.title} position at ${j.company_name} in ${j.location}. Skills: ${(j.skills || []).join(', ')}. Apply on HireHub360.`}]]></description>
      <salary><![CDATA[${salary}]]></salary>
      <jobtype><![CDATA[${jobType}]]></jobtype>
      ${(j.skills || []).slice(0, 5).map(s => `<category><![CDATA[${s}]]></category>`).join('\n      ')}
    </job>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<source>
  <publisher>HireHub360</publisher>
  <publisherurl>${base}</publisherurl>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <jobs>
${items}
  </jobs>
</source>`

  res.setHeader('Content-Type', 'text/xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600')
  res.send(xml)
}

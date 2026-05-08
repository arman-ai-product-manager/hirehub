const { supabaseService } = require('../../../lib/supabase')

// Generic job XML feed — compatible with Foundit, Shine, JobsTera, Hirect, and most job aggregators
export const config = { api: { responseLimit: '8mb' } }

export default async function handler(req, res) {
  const { data: jobs, error } = await supabaseService
    .from('jobs')
    .select('id,title,company_name,location,description,salary_label,salary_min,salary_max,salary_hidden,job_type,experience,skills,slug,created_at,remote_policy,sector,currency')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) return res.status(500).send('DB error')

  const base = (process.env.NEXT_PUBLIC_APP_URL || 'https://hirehub360.in').trim().replace(/\/$/, '')
  const now = new Date().toISOString()

  const items = (jobs || []).map(j => {
    const slug = j.slug || `${j.title}-${j.company_name}-${j.location}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const jobUrl = `${base}/jobs/${slug}`
    const salary = j.salary_hidden ? '' : (j.salary_label || (j.salary_min ? `${j.currency || 'INR'} ${j.salary_min}` : ''))
    const isRemote = j.remote_policy === 'Remote' || j.remote_policy === 'Full-Remote'
    const description = j.description || `${j.title} at ${j.company_name} in ${j.location}. Skills required: ${(j.skills || []).join(', ')}. Apply now on HireHub360.`

    return `  <job>
    <id><![CDATA[${j.id}]]></id>
    <title><![CDATA[${j.title}]]></title>
    <company><![CDATA[${j.company_name}]]></company>
    <url><![CDATA[${jobUrl}]]></url>
    <location><![CDATA[${j.location || 'India'}]]></location>
    <country>IN</country>
    <remote>${isRemote ? 'true' : 'false'}</remote>
    <type><![CDATA[${j.job_type || 'Full-time'}]]></type>
    <experience><![CDATA[${j.experience || ''}]]></experience>
    <category><![CDATA[${j.sector || ''}]]></category>
    <salary><![CDATA[${salary}]]></salary>
    <currency>${j.currency || 'INR'}</currency>
    <description><![CDATA[${description}]]></description>
    <skills><![CDATA[${(j.skills || []).join(', ')}]]></skills>
    <posted>${new Date(j.created_at || now).toISOString()}</posted>
    <source>HireHub360</source>
    <source_url>${base}</source_url>
  </job>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jobs generated="${now}" count="${(jobs || []).length}" source="HireHub360" source_url="${base}">
${items}
</jobs>`

  res.setHeader('Content-Type', 'text/xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600')
  res.send(xml)
}

const { supabaseService } = require('../lib/supabase')

function mkSlug(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const CITIES = [
  'mumbai','dubai','bangalore','pune','delhi','hyderabad','chennai','kolkata',
  'ahmedabad','noida','gurgaon','jaipur','surat','lucknow','nagpur','indore',
  'kochi','coimbatore','visakhapatnam','abu-dhabi','sharjah','bhopal','patna',
]

const DEMO_JOB_SLUGS = [
  'senior-software-engineer-techcorp-india-bangalore',
  'product-manager-swiggy-mumbai',
  'data-analyst-razorpay-bangalore',
  'marketing-manager-zomato-delhi',
  'hr-business-partner-infosys-hyderabad',
  'devops-engineer-flipkart-bangalore',
  'sales-executive-jio-mumbai',
  'ui-ux-designer-cred-bangalore',
  'business-analyst-accenture-pune',
  'content-writer-magicpin-delhi',
  'finance-analyst-hdfc-bank-mumbai',
  'operations-manager-amazon-chennai',
]

export default function Sitemap() { return null }

export async function getServerSideProps({ res }) {
  const base = (process.env.NEXT_PUBLIC_APP_URL || 'https://hirehub360.in').trim().replace(/\/$/, '')

  const [{ data: jobs }, { data: blogs }] = await Promise.all([
    supabaseService.from('jobs').select('id,title,company_name,location,created_at').eq('status','active').limit(10000),
    supabaseService.from('blogs').select('slug,created_at,updated_at').eq('published',true).limit(1000)
  ])

  const today = new Date().toISOString().split('T')[0]

  // DB job pages
  const dbJobUrls = (jobs || []).map(j => {
    const slug = mkSlug(j.title) + '-' + mkSlug(j.company_name) + '-' + mkSlug(j.location)
    const date = (j.created_at || today).split('T')[0]
    return `<url><loc>${base}/jobs/${slug}</loc><lastmod>${date}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
  }).join('\n')

  // Demo job pages
  const demoJobUrls = DEMO_JOB_SLUGS.map(slug =>
    `<url><loc>${base}/jobs/${slug}</loc><lastmod>2026-04-01</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
  ).join('\n')

  // City landing pages — highest priority for local SEO
  const cityUrls = CITIES.map(c =>
    `<url><loc>${base}/jobs/in/${c}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.95</priority></url>`
  ).join('\n')

  // Blog pages
  const blogUrls = (blogs || []).map(b => {
    const date = (b.updated_at || b.created_at || today).split('T')[0]
    return `<url><loc>${base}/blog/${b.slug}</loc><lastmod>${date}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${base}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
<url><loc>${base}/blog</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
<url><loc>${base}/hirehub.html</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
${cityUrls}
${blogUrls}
${dbJobUrls}
${demoJobUrls}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.write(xml)
  res.end()

  return { props: {} }
}

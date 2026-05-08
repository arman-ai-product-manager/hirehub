const { supabaseService } = require('../lib/supabase')

function mkSlug(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const CITIES_HIGH = [
  'mumbai','dubai','bangalore','delhi','hyderabad','pune',
  'chennai','noida','gurgaon','kolkata','ahmedabad','abu-dhabi',
]
const CITIES_MID = [
  'jaipur','surat','lucknow','nagpur','indore',
  'kochi','coimbatore','visakhapatnam','sharjah',
]
const ALL_CITIES = [...CITIES_HIGH, ...CITIES_MID, 'bhopal','patna']

// /hire/[slug] City×Skill pages — 21 skills × 10 cities = 210 pages
const HIRE_SKILLS = [
  'labour-contractor','construction-workers','warehouse-workers','security-guards',
  'housekeeping-staff','delivery-boys','freelancer','graphic-designer','web-developer',
  'ui-designer','video-editor','content-writer','digital-marketer','seo-expert',
  'google-ads-specialist','social-media-manager','meta-ads-expert','data-analyst',
  'power-bi-expert','data-scientist','business-analyst',
]
const HIRE_CITIES = [
  'mumbai','pune','bangalore','delhi','hyderabad','chennai','ahmedabad','dubai','singapore','india',
]

// /compare/[slug] comparison pages
const COMPARE_SLUGS = [
  'hirehub360-vs-upwork',
  'hirehub360-vs-fiverr',
  'hirehub360-vs-naukri',
  'hirehub360-vs-linkedin',
]

// /salary/[slug] rate pages
const SALARY_SLUGS = [
  'freelance-graphic-designer-rate-mumbai',
  'data-analyst-salary-india',
  'freelance-web-developer-rate-bangalore',
  'seo-expert-rate-india',
  'content-writer-rate-india',
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

// Keyword sets per city — matches the provided sitemap exactly
const CITY_KEYWORDS = {
  Mumbai:        ['Software Engineer','Product Manager','Finance Analyst','Sales Executive','Marketing Manager','Business Analyst','Fresher','Remote','Part-time','Internship','Work from Home'],
  Dubai:         ['Software Engineer','Business Analyst','HR Manager','Project Manager','Sales Executive','Finance Manager','Fresher','Remote','Part-time','Internship','Work from Home'],
  Bangalore:     ['Software Engineer','Data Scientist','DevOps Engineer','UI/UX Designer','Product Manager','SDE-2','Fresher','Remote','Part-time','Internship','Work from Home'],
  Delhi:         ['Marketing Manager','Content Writer','HR Business Partner','Sales Manager','Operations Head','Digital Marketer','Fresher','Remote','Part-time','Internship','Work from Home'],
  Hyderabad:     ['Software Engineer','Data Analyst','Cloud Architect','DevOps Engineer','Business Analyst','Full Stack Developer','Fresher','Remote','Part-time','Internship','Work from Home'],
  Pune:          ['Software Engineer','Business Analyst','Operations Manager','HR Executive','QA Engineer','Java Developer','Fresher','Remote','Part-time','Internship','Work from Home'],
  Chennai:       ['Operations Manager','Software Engineer','Finance Analyst','HR Executive','Sales Executive','Embedded Engineer','Fresher','Remote','Part-time','Internship','Work from Home'],
  Noida:         ['Software Engineer','Content Writer','Digital Marketer','BPO Executive','HR Executive','React Developer','Fresher','Remote','Part-time','Internship','Work from Home'],
  Gurgaon:       ['Product Manager','Sales Manager','Business Analyst','HR Business Partner','Finance Manager','Account Manager','Fresher','Remote','Part-time','Internship','Work from Home'],
  Kolkata:       ['Accountant','HR Executive','Sales Executive','Content Writer','Operations Manager','Finance Manager','Fresher','Remote','Part-time','Internship','Work from Home'],
  Ahmedabad:     ['Sales Executive','Operations Manager','Finance Analyst','Marketing Executive','HR Executive','Civil Engineer','Fresher','Remote','Part-time','Internship','Work from Home'],
  'Abu Dhabi':   ['Project Manager','Finance Manager','HR Manager','Operations Manager','Sales Executive','Government Liaison','Fresher','Remote','Part-time','Internship','Work from Home'],
  Jaipur:        ['Software Engineer','Sales Executive','HR Executive','Content Writer','Operations Manager','Accountant','Fresher','Remote','Part-time','Internship','Work from Home'],
  Surat:         ['Sales Executive','Finance Analyst','Operations Manager','HR Executive','Textile Designer','Diamond Grader','Fresher','Remote','Part-time','Internship','Work from Home'],
  Lucknow:       ['Software Engineer','Sales Executive','HR Executive','Content Writer','Operations Manager','Banking Executive','Fresher','Remote','Part-time','Internship','Work from Home'],
  Nagpur:        ['Sales Executive','Operations Manager','HR Executive','Finance Analyst','Marketing Executive','Civil Engineer','Fresher','Remote','Part-time','Internship','Work from Home'],
  Indore:        ['Software Engineer','Sales Executive','HR Executive','Finance Analyst','Operations Manager','CA / Finance','Fresher','Remote','Part-time','Internship','Work from Home'],
  Kochi:         ['Software Engineer','Operations Manager','Finance Analyst','HR Executive','Sales Executive','Marine Engineer','Fresher','Remote','Part-time','Internship','Work from Home'],
  Coimbatore:    ['Software Engineer','Operations Manager','HR Executive','Sales Executive','Finance Analyst','Mechanical Engineer','Fresher','Remote','Part-time','Internship','Work from Home'],
  Visakhapatnam: ['Software Engineer','Operations Manager','HR Executive','Finance Analyst','Sales Executive','Port Manager','Fresher','Remote','Part-time','Internship','Work from Home'],
  Sharjah:       ['Sales Executive','HR Executive','Operations Manager','Content Writer','Marketing Executive','Logistics Manager','Fresher','Remote','Part-time','Internship','Work from Home'],
}

function url(loc, lastmod, changefreq, priority) {
  return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
}

export default function Sitemap() { return null }

export async function getServerSideProps({ res }) {
  const base = (process.env.NEXT_PUBLIC_APP_URL || 'https://hirehub360.in').trim().replace(/\/$/, '')
  const today = new Date().toISOString().split('T')[0]

  const [{ data: jobs }, { data: blogs }] = await Promise.all([
    supabaseService.from('jobs').select('id,title,company_name,location,created_at').eq('status','active').limit(10000),
    supabaseService.from('blogs').select('slug,lang,created_at,updated_at').eq('published',true).limit(2000)
  ])

  // Static pages
  const staticUrls = [
    url(`${base}`,                today,   'daily',   '1.00'),
    url(`${base}/pricing`,        today,   'weekly',  '0.85'),
    url(`${base}/features`,       today,   'weekly',  '0.85'),
    url(`${base}/blog`,           today,   'daily',   '0.90'),
    url(`${base}/hirehub.html`,   today,   'daily',   '0.80'),
  ].join('\n')

  // City landing pages
  const cityHighUrls = CITIES_HIGH.map(c =>
    url(`${base}/jobs/in/${c}`, today, 'daily', '0.95')
  ).join('\n')

  const cityMidUrls = CITIES_MID.map(c =>
    url(`${base}/jobs/in/${c}`, today, 'daily', '0.80')
  ).join('\n')

  // Keyword + city search URLs
  const kwCityHigh = Object.entries(CITY_KEYWORDS)
    .filter(([city]) => CITIES_HIGH.includes(city.toLowerCase().replace(/ /g,'-')) || city === 'Abu Dhabi')
    .flatMap(([city, keywords]) =>
      keywords.map(kw =>
        url(`${base}/?q=${encodeURIComponent(kw)}&city=${encodeURIComponent(city)}`, today, 'weekly', '0.64')
      )
    ).join('\n')

  const kwCityMid = Object.entries(CITY_KEYWORDS)
    .filter(([city]) => CITIES_MID.includes(city.toLowerCase().replace(/ /g,'-')))
    .flatMap(([city, keywords]) =>
      keywords.map(kw =>
        url(`${base}/?q=${encodeURIComponent(kw)}&city=${encodeURIComponent(city)}`, today, 'weekly', '0.51')
      )
    ).join('\n')

  // Blog pages — English and multilingual
  const enBlogs = (blogs || []).filter(b => !b.lang || b.lang === 'en')
  const langBlogs = (blogs || []).filter(b => b.lang && b.lang !== 'en')

  const blogUrls = enBlogs.map(b => {
    const date = (b.updated_at || b.created_at || today).split('T')[0]
    return url(`${base}/blog/${b.slug}`, date, 'weekly', '0.85')
  }).join('\n')

  const langBlogUrls = langBlogs.map(b => {
    const date = (b.updated_at || b.created_at || today).split('T')[0]
    const baseSlug = b.slug.replace(/^[a-z]{2}-/, '')
    return url(`${base}/blog/${b.lang}/${baseSlug}`, date, 'weekly', '0.80')
  }).join('\n')

  // DB job pages
  const dbJobUrls = (jobs || []).map(j => {
    const slug = mkSlug(j.title) + '-' + mkSlug(j.company_name) + '-' + mkSlug(j.location)
    const date = (j.created_at || today).split('T')[0]
    return url(`${base}/jobs/${slug}`, date, 'weekly', '0.80')
  }).join('\n')

  // Demo job pages
  const demoJobUrls = DEMO_JOB_SLUGS.map(slug =>
    url(`${base}/jobs/${slug}`, '2026-04-01', 'monthly', '0.70')
  ).join('\n')

  // /hire/[skill]-[city] landing pages (priority 0.88)
  const hireUrls = HIRE_SKILLS.flatMap(skill =>
    HIRE_CITIES.map(city =>
      url(`${base}/hire/${skill}-${city}`, today, 'weekly', '0.88')
    )
  ).join('\n')

  // /compare/[slug] comparison pages (priority 0.82)
  const compareUrls = COMPARE_SLUGS.map(slug =>
    url(`${base}/compare/${slug}`, today, 'monthly', '0.82')
  ).join('\n')

  // /salary/[slug] rate pages (priority 0.85)
  const salaryUrls = SALARY_SLUGS.map(slug =>
    url(`${base}/salary/${slug}`, today, 'monthly', '0.85')
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticUrls}
${cityHighUrls}
${cityMidUrls}
${hireUrls}
${compareUrls}
${salaryUrls}
${blogUrls}
${langBlogUrls}
${dbJobUrls}
${demoJobUrls}
${kwCityHigh}
${kwCityMid}
</urlset>`

  res.setHeader('Content-Type', 'text/xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.write(xml)
  res.end()

  return { props: {} }
}

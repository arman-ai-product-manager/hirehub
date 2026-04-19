const { supabaseService } = require('../../../lib/supabase')
const { autoIndex, SITE } = require('../../../lib/autoIndex')
const { googleIndex }     = require('../../../lib/googleIndex')

// 60-day rotating topic list — cities, job categories, HR tips
const TOPICS = [
  { city: 'Bangalore', angle: 'IT & Startup Hiring', pincodes: ['560001','560034','560066','560100','560103'], sector: 'IT' },
  { city: 'Delhi NCR', angle: 'Fast Hiring for Sales & BPO', pincodes: ['110001','110020','110044','110085','122001','201301'], sector: 'Sales' },
  { city: 'Pune', angle: 'Manufacturing & IT Job Posting', pincodes: ['411001','411014','411028','411045','411057'], sector: 'IT' },
  { city: 'Hyderabad', angle: 'Tech & Pharma Hiring', pincodes: ['500001','500034','500081','500084','500032'], sector: 'Pharma' },
  { city: 'Chennai', angle: 'Auto & IT Sector Hiring', pincodes: ['600001','600032','600042','600083','600097'], sector: 'Auto' },
  { city: 'Ahmedabad', angle: 'Textile & Finance Hiring', pincodes: ['380001','380006','380015','380054','380058'], sector: 'Finance' },
  { city: 'Kolkata', angle: 'Logistics & Retail Hiring', pincodes: ['700001','700013','700032','700091','700156'], sector: 'Logistics' },
  { city: 'Surat', angle: 'Diamond & Textile Industry Hiring', pincodes: ['395001','395002','395004','395006','395010'], sector: 'Textile' },
  { city: 'Jaipur', angle: 'Tourism & Retail Hiring', pincodes: ['302001','302004','302006','302012','302021'], sector: 'Retail' },
  { city: 'Noida & Greater Noida', angle: 'IT Park & BPO Hiring', pincodes: ['201301','201306','201308','201310','201318'], sector: 'BPO' },
  { city: 'Gurgaon', angle: 'MNC & Finance Hiring', pincodes: ['122001','122002','122003','122010','122022'], sector: 'Finance' },
  { city: 'Chandigarh', angle: 'Government & IT Hiring', pincodes: ['160001','160011','160017','160022','160036'], sector: 'IT' },
  { city: 'Lucknow', angle: 'FMCG & Retail Hiring', pincodes: ['226001','226010','226012','226016','226020'], sector: 'FMCG' },
  { city: 'Nagpur', angle: 'Logistics & Healthcare Hiring', pincodes: ['440001','440010','440013','440022','440025'], sector: 'Healthcare' },
  { city: 'Kochi', angle: 'Hospitality & IT Hiring', pincodes: ['682001','682011','682016','682030','682041'], sector: 'Hospitality' },
  { city: 'Indore', angle: 'Pharma & IT Hiring', pincodes: ['452001','452002','452006','452010','452018'], sector: 'Pharma' },
  { city: 'Coimbatore', angle: 'Manufacturing & Textile Hiring', pincodes: ['641001','641005','641006','641014','641018'], sector: 'Manufacturing' },
  { city: 'Visakhapatnam', angle: 'Steel & Port Sector Hiring', pincodes: ['530001','530003','530012','530017','530022'], sector: 'Manufacturing' },
  { city: 'Bhopal', angle: 'Government & Retail Hiring', pincodes: ['462001','462003','462010','462016','462023'], sector: 'Retail' },
  { city: 'Vadodara', angle: 'Chemical & IT Hiring', pincodes: ['390001','390006','390009','390015','390021'], sector: 'Chemical' },
  { city: 'Mumbai', angle: 'Finance & Banking Hiring', pincodes: ['400001','400013','400021','400051','400070'], sector: 'Finance' },
  { city: 'Mumbai', angle: 'Logistics & Operations Hiring', pincodes: ['400070','400093','400601','400604','400703'], sector: 'Logistics' },
  { city: 'Bangalore', angle: 'Product & Design Hiring', pincodes: ['560001','560008','560025','560047','560068'], sector: 'IT' },
  { city: 'Delhi', angle: 'Healthcare & Hospital Hiring', pincodes: ['110001','110005','110006','110029','110060'], sector: 'Healthcare' },
  { city: 'Pune', angle: 'BPO & Customer Support Hiring', pincodes: ['411001','411014','411041','411057','412101'], sector: 'BPO' },
  { city: 'Hyderabad', angle: 'Real Estate & Construction Hiring', pincodes: ['500001','500016','500029','500033','500072'], sector: 'Real Estate' },
  { city: 'Chennai', angle: 'BPO & Finance Hiring', pincodes: ['600001','600018','600035','600056','600100'], sector: 'Finance' },
  { city: 'Bangalore', angle: 'E-Commerce & Delivery Hiring', pincodes: ['560029','560034','560037','560068','560076'], sector: 'E-Commerce' },
  { city: 'Gurgaon', angle: 'Startup & HR Tech Hiring', pincodes: ['122001','122009','122011','122016','122051'], sector: 'HR Tech' },
  { city: 'Noida', angle: 'Media & Digital Marketing Hiring', pincodes: ['201301','201303','201304','201307','201309'], sector: 'Digital Marketing' },
]

function mkSlug(s) {
  return (s || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

async function generateBlog(topic) {
  const prompt = `Write a detailed, SEO-optimized blog post for HireHub360 (hirehub360.in), a job posting platform in India.

Topic: "Post Jobs in ${topic.city} Fast — ${topic.angle}"
Target audience: HR managers, recruiters, and business owners in ${topic.city} who hire regularly.
Key pincodes to mention: ${topic.pincodes.join(', ')}
Industry focus: ${topic.sector}

Requirements:
- 900-1200 words
- Use markdown formatting (## headings, **bold**, tables, bullet points)
- Include a section listing 8-10 specific areas/zones in ${topic.city} with their pincodes and top roles hired there
- Include a table showing top job roles and avg applications in 24 hours
- Include a "How to Post a Job" step-by-step section
- Include FAQ section (4 questions)
- Mention the pincodes: ${topic.pincodes.join(', ')} naturally in content
- Do NOT use generic filler. Be specific to ${topic.city} and ${topic.sector}.
- Tone: professional but direct. Built for Indian HR professionals.

── LINKING RULES (Google E-E-A-T 2026 — MANDATORY) ──
You MUST include EXACTLY these links naturally within the body content:

INTERNAL LINKS (3–4 links, descriptive anchor text, contextual placement):
- [Post a job for free on HireHub360](https://hirehub360.in) — use in intro or "how to post" section
- [Browse ${topic.city} job listings](https://hirehub360.in/jobs/in/${topic.city.toLowerCase().split(' ')[0]}) — use in pincode/area section
- [View hiring plans and pricing](https://hirehub360.in/pricing) — use in CTA or cost section
- [Read more HR hiring guides](https://hirehub360.in/blog) — use in FAQ or closing section

EXTERNAL LINKS (2–3 links, only high-authority sources, opens context of facts you mention):
- [Ministry of Labour & Employment, India](https://labour.gov.in) — cite when mentioning employment trends or regulations
- [NASSCOM India workforce data](https://nasscom.in) — cite when mentioning IT/tech hiring data (only if sector is IT/tech)
- [SHRM HR best practices](https://www.shrm.org) — cite when mentioning HR practices or hiring benchmarks
- [People Matters HR India](https://www.peoplematters.in) — cite when mentioning India HR industry statistics
- [India Brand Equity Foundation](https://www.ibef.org) — cite when mentioning India industry/sector growth data

Rules for links:
1. ALL links must appear naturally mid-sentence — never in a "References" section
2. Anchor text must be descriptive (never "click here", "read more", "this link")
3. Internal links = dofollow. External links = include naturally, no rel attribute needed in markdown
4. Each link must be contextually relevant to the sentence it appears in
5. Do NOT stuff links. Each link earns its place.

End with a strong CTA: "**Ready to hire in ${topic.city}?** [Post your first job free on HireHub360](https://hirehub360.in) and get verified candidates within 24 hours."

Write only the blog content in markdown. No intro, no "here is the blog", just the markdown content starting with ## heading.`

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7
    })
  })

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

export default async function handler(req, res) {
  // Allow GET for manual trigger, or Vercel cron (which sends GET)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verify cron secret to prevent abuse
  const secret = req.headers['x-cron-secret'] || req.query.secret
  if (secret !== (process.env.CRON_SECRET || 'hirehub-cron-2026')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Pick today's topic based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    const topic = TOPICS[dayOfYear % TOPICS.length]

    // Generate slug
    const dateStr = new Date().toISOString().slice(0, 10)
    const slug = `post-jobs-${mkSlug(topic.city)}-${mkSlug(topic.sector)}-${dateStr}`

    // Check if slug already exists
    const { data: existing } = await supabaseService.from('blogs').select('id').eq('slug', slug).maybeSingle()
    if (existing) {
      return res.json({ ok: true, message: 'Blog already written for today', slug })
    }

    // Generate content with AI
    const content = await generateBlog(topic)
    if (!content || content.length < 200) {
      return res.status(500).json({ error: 'AI generated empty content' })
    }

    const title = `Post Jobs in ${topic.city} Fast — ${topic.angle} | HireHub360`
    const excerpt = `${topic.city} HRs — post a job on HireHub360 and get verified candidates in 24 hours. Covering ${topic.pincodes.slice(0,3).join(', ')} and all top ${topic.city} pincodes. Free job posting. Start now.`

    // Save to Supabase
    const { error } = await supabaseService.from('blogs').insert({
      title,
      slug,
      excerpt,
      content,
      author: 'HireHub360 Team',
      tags: ['job posting', topic.city.toLowerCase(), topic.sector.toLowerCase(), 'fast hiring', 'HR India'],
      published: true,
      updated_at: new Date().toISOString()
    })

    if (error) return res.status(500).json({ error: error.message })

    const blogUrl = `${SITE}/blog/${slug}`

    // IndexNow + sitemap pings (Bing, Yandex, Google sitemap ping)
    await autoIndex([blogUrl, `${SITE}/blog`])

    // Google Indexing API — direct crawl request
    const [gBlog, gIndex] = await Promise.all([
      googleIndex([blogUrl]),
      googleIndex([`${SITE}/blog`]),
    ])

    return res.json({
      ok: true, slug, title, city: topic.city,
      google_indexed: gBlog[0]?.ok,
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const { supabaseService } = require('../../../lib/supabase')
const { autoIndex, SITE } = require('../../../lib/autoIndex')

// ── CLUSTER 1: LABOUR ──────────────────────────────────────────────────────
const LABOUR_TOPICS = [
  { kw: 'labour contractor Mumbai', city: 'Mumbai', area: 'Dharavi', skill: 'Construction Workers', segment: 'labour' },
  { kw: 'manpower supply Thane', city: 'Thane', area: 'Bhiwandi', skill: 'Warehouse Workers', segment: 'labour' },
  { kw: 'construction workers Dharavi', city: 'Mumbai', area: 'Dharavi', skill: 'Construction Workers', segment: 'labour' },
  { kw: 'warehouse workers Bhiwandi', city: 'Bhiwandi', area: 'MIDC', skill: 'Warehouse Workers', segment: 'labour' },
  { kw: 'daily wage workers Navi Mumbai', city: 'Navi Mumbai', area: 'Vashi', skill: 'Daily Wage Workers', segment: 'labour' },
  { kw: 'labour contractor Pune', city: 'Pune', area: 'Pimpri Chinchwad', skill: 'Factory Workers', segment: 'labour' },
  { kw: 'manpower supply Bangalore', city: 'Bangalore', area: 'Peenya', skill: 'Industrial Workers', segment: 'labour' },
  { kw: 'contract labour Delhi', city: 'Delhi', area: 'Okhla', skill: 'Packing Workers', segment: 'labour' },
  { kw: 'skilled workers hire Hyderabad', city: 'Hyderabad', area: 'Patancheru', skill: 'Factory Workers', segment: 'labour' },
  { kw: 'construction labour Chennai', city: 'Chennai', area: 'Ambattur', skill: 'Construction Workers', segment: 'labour' },
  { kw: 'security guards hire Mumbai', city: 'Mumbai', area: 'Andheri', skill: 'Security Guards', segment: 'labour' },
  { kw: 'housekeeping staff hire Mumbai', city: 'Mumbai', area: 'BKC', skill: 'Housekeeping Staff', segment: 'labour' },
  { kw: 'delivery boys hire Mumbai', city: 'Mumbai', area: 'Kurla', skill: 'Delivery Boys', segment: 'labour' },
  { kw: 'loading unloading workers Bhiwandi', city: 'Bhiwandi', area: 'Warehouse Zone', skill: 'Loading Workers', segment: 'labour' },
  { kw: 'plumber electrician hire Mumbai', city: 'Mumbai', area: 'Malad', skill: 'Plumber & Electrician', segment: 'labour' },
]

// ── CLUSTER 2: FREELANCE ──────────────────────────────────────────────────
const FREELANCE_TOPICS = [
  { kw: 'hire freelancer Mumbai', city: 'Mumbai', skill: 'Freelancer', segment: 'freelance' },
  { kw: 'freelance graphic designer India', city: 'India', skill: 'Graphic Designer', segment: 'freelance' },
  { kw: 'freelance web developer Mumbai', city: 'Mumbai', skill: 'Web Developer', segment: 'freelance' },
  { kw: 'best freelance platform India 2025', city: 'India', skill: 'Freelancer', segment: 'freelance' },
  { kw: 'hire UI designer online India', city: 'India', skill: 'UI Designer', segment: 'freelance' },
  { kw: 'hire freelance video editor Mumbai', city: 'Mumbai', skill: 'Video Editor', segment: 'freelance' },
  { kw: 'freelance content writer India', city: 'India', skill: 'Content Writer', segment: 'freelance' },
  { kw: 'hire freelance app developer Mumbai', city: 'Mumbai', skill: 'App Developer', segment: 'freelance' },
  { kw: 'freelance logo designer India', city: 'India', skill: 'Logo Designer', segment: 'freelance' },
  { kw: 'hire freelance photographer Mumbai', city: 'Mumbai', skill: 'Photographer', segment: 'freelance' },
  { kw: 'freelance copywriter hire India', city: 'India', skill: 'Copywriter', segment: 'freelance' },
  { kw: 'hire freelance motion graphic designer India', city: 'India', skill: 'Motion Graphic Designer', segment: 'freelance' },
  { kw: 'React developer freelance Mumbai', city: 'Mumbai', skill: 'React Developer', segment: 'freelance' },
  { kw: 'freelance Node.js developer India', city: 'India', skill: 'Node.js Developer', segment: 'freelance' },
  { kw: 'hire freelance WordPress developer Mumbai', city: 'Mumbai', skill: 'WordPress Developer', segment: 'freelance' },
]

// ── CLUSTER 3: DIGITAL MARKETING ─────────────────────────────────────────
const DIGMKT_TOPICS = [
  { kw: 'hire digital marketer Mumbai', city: 'Mumbai', skill: 'Digital Marketer', segment: 'digital-marketing' },
  { kw: 'SEO expert Mumbai', city: 'Mumbai', skill: 'SEO Expert', segment: 'digital-marketing' },
  { kw: 'Google Ads specialist India', city: 'India', skill: 'Google Ads Specialist', segment: 'digital-marketing' },
  { kw: 'social media manager hire Mumbai', city: 'Mumbai', skill: 'Social Media Manager', segment: 'digital-marketing' },
  { kw: 'best digital marketing agency Mumbai 2025', city: 'Mumbai', skill: 'Digital Marketing Agency', segment: 'digital-marketing' },
  { kw: 'Meta ads expert India', city: 'India', skill: 'Meta Ads Expert', segment: 'digital-marketing' },
  { kw: 'hire SEO expert Bangalore', city: 'Bangalore', skill: 'SEO Expert', segment: 'digital-marketing' },
  { kw: 'performance marketing expert Mumbai', city: 'Mumbai', skill: 'Performance Marketer', segment: 'digital-marketing' },
  { kw: 'hire email marketing expert India', city: 'India', skill: 'Email Marketing Expert', segment: 'digital-marketing' },
  { kw: 'YouTube ads expert hire India', city: 'India', skill: 'YouTube Ads Expert', segment: 'digital-marketing' },
  { kw: 'PPC expert hire Mumbai', city: 'Mumbai', skill: 'PPC Expert', segment: 'digital-marketing' },
  { kw: 'influencer marketing manager hire India', city: 'India', skill: 'Influencer Marketing Manager', segment: 'digital-marketing' },
  { kw: 'hire content marketer Mumbai', city: 'Mumbai', skill: 'Content Marketer', segment: 'digital-marketing' },
  { kw: 'ecommerce marketing expert India', city: 'India', skill: 'Ecommerce Marketer', segment: 'digital-marketing' },
  { kw: 'WhatsApp marketing expert hire India', city: 'India', skill: 'WhatsApp Marketing Expert', segment: 'digital-marketing' },
]

// ── CLUSTER 4: DATA ANALYTICS ─────────────────────────────────────────────
const DATA_TOPICS = [
  { kw: 'hire data analyst Mumbai', city: 'Mumbai', skill: 'Data Analyst', segment: 'data-analytics' },
  { kw: 'Power BI expert India', city: 'India', skill: 'Power BI Expert', segment: 'data-analytics' },
  { kw: 'freelance data scientist Mumbai', city: 'Mumbai', skill: 'Data Scientist', segment: 'data-analytics' },
  { kw: 'Excel analyst for hire India', city: 'India', skill: 'Excel Analyst', segment: 'data-analytics' },
  { kw: 'business analyst Mumbai', city: 'Mumbai', skill: 'Business Analyst', segment: 'data-analytics' },
  { kw: 'SQL developer hire India', city: 'India', skill: 'SQL Developer', segment: 'data-analytics' },
  { kw: 'Tableau developer hire Mumbai', city: 'Mumbai', skill: 'Tableau Developer', segment: 'data-analytics' },
  { kw: 'Python data analyst hire India', city: 'India', skill: 'Python Data Analyst', segment: 'data-analytics' },
  { kw: 'hire data engineer Mumbai', city: 'Mumbai', skill: 'Data Engineer', segment: 'data-analytics' },
  { kw: 'Google Analytics expert hire India', city: 'India', skill: 'Google Analytics Expert', segment: 'data-analytics' },
  { kw: 'hire machine learning engineer India', city: 'India', skill: 'Machine Learning Engineer', segment: 'data-analytics' },
  { kw: 'data visualisation expert hire India', city: 'India', skill: 'Data Visualisation Expert', segment: 'data-analytics' },
  { kw: 'freelance R programmer India', city: 'India', skill: 'R Programmer', segment: 'data-analytics' },
  { kw: 'hire financial analyst Mumbai', city: 'Mumbai', skill: 'Financial Analyst', segment: 'data-analytics' },
  { kw: 'CRM analyst hire India', city: 'India', skill: 'CRM Analyst', segment: 'data-analytics' },
]

const CLUSTERS = { a: LABOUR_TOPICS, b: FREELANCE_TOPICS, c: DIGMKT_TOPICS, d: DATA_TOPICS }

const CLUSTER_META = {
  labour: {
    competitor: 'local placement agencies',
    extLink: '[Ministry of Labour & Employment](https://labour.gov.in)',
    extContext: 'according to Ministry of Labour & Employment data',
    cta: 'WhatsApp HireHub360 now',
    cityAreas: {
      Mumbai: ['Dharavi','Kurla','Bhiwandi','Andheri','Navi Mumbai','Thane','Kalyan','Dombivli','Malad','Borivali'],
      Pune: ['Pimpri','Chinchwad','Hadapsar','Bhosari','Chakan','Talegaon','Ranjangaon','Wai','MIDC','Kothrud'],
      Bangalore: ['Peenya','Whitefield','Bommasandra','Hosur Road','Electronic City','Doddaballapur','Nelamangala','Tumkur','Bidadi','Anekal'],
      Delhi: ['Okhla','Narela','Bawana','Wazirpur','Bahadurgarh','Faridabad','Ghaziabad','Noida','Manesar','Kundli'],
    },
  },
  freelance: {
    competitor: 'Upwork and Fiverr',
    extLink: '[NASSCOM India Digital Talent Report](https://nasscom.in)',
    extContext: 'as per NASSCOM India workforce data',
    cta: 'post your requirement on HireHub360',
    cityAreas: null,
  },
  'digital-marketing': {
    competitor: 'Upwork, Fiverr and local agencies',
    extLink: '[IAMAI India Internet Report](https://www.iamai.in)',
    extContext: 'per IAMAI\'s India Internet & Mobile Association data',
    cta: 'hire your digital marketing expert on HireHub360',
    cityAreas: null,
  },
  'data-analytics': {
    competitor: 'Naukri and LinkedIn',
    extLink: '[NASSCOM Analytics India Sector Report](https://nasscom.in)',
    extContext: 'per NASSCOM\'s India Analytics sector report',
    cta: 'post your data project on HireHub360',
    cityAreas: null,
  },
}

function mkSlug(s) {
  return (s || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function buildPrompt(topic) {
  const meta = CLUSTER_META[topic.segment]
  const isLocal = topic.city !== 'India'
  const cityLine = isLocal
    ? `Primary city: ${topic.city}. Cover 10 specific areas/zones in ${topic.city} with 2 lines each.`
    : `National scope. List 8 Indian cities: Mumbai, Bangalore, Delhi, Hyderabad, Pune, Chennai, Ahmedabad, Kolkata.`

  const pricingContext = {
    labour: '₹400–₹900/day for daily wage, ₹12,000–₹35,000/month for skilled labour, ₹50,000–₹2,00,000 for contractor agreements',
    freelance: '₹5,000–₹15,000 for logo/graphic work, ₹15,000–₹80,000 for web development, ₹500–₹3,000/hour for specialist work',
    'digital-marketing': '₹15,000–₹40,000/month for SEO, ₹20,000–₹80,000/month for full digital marketing, ₹10,000–₹50,000 for ad management',
    'data-analytics': '₹20,000–₹60,000/month for data analyst, ₹8,000–₹25,000 per project for dashboards, ₹500–₹2,000/hour for expert consultants',
  }[topic.segment]

  return `You are India's top B2B SEO writer. Write a 1,800–2,200 word blog post for HireHub360 (hirehub360.in), India's #1 all-in-one talent platform.

TARGET KEYWORD: "${topic.kw}"
SKILL: ${topic.skill}
PRIMARY LOCATION: ${topic.city}
SEGMENT: ${topic.segment}

STRICT BLOG STRUCTURE (follow EXACTLY — this is non-negotiable):

---
# [H1 — Primary keyword "${topic.kw}" + year 2025 — once only, under 70 chars]

[INTRO — 150 words exactly. Open with the client's biggest pain point. Use "${topic.kw}" within the first 80 words. Mention HireHub360 naturally as the solution. High urgency, direct tone.]

## What is ${topic.skill} and Why ${topic.city} Businesses Need It in 2025
[200 words. Market stats, India industry growth data, urgency drivers. Cite: ${meta.extLink} ${meta.extContext}.]

## Top ${topic.skill} Services Available on HireHub360
[List 6–8 sub-skills/specialisations with 2-line descriptions each. Use bullet points.]

## ${isLocal ? `${topic.skill} Coverage — ${topic.city} Areas We Serve` : `Cities We Cover Across India`}
[${cityLine}]

## How HireHub360 Works — 3 Simple Steps
Step 1 — Post your requirement free (takes 2 minutes)
Step 2 — Get matched ${topic.skill} profiles in 2–24 hours
Step 3 — Hire, pay securely, get results — 100% satisfaction guarantee
[Add 2–3 lines of detail per step. Mention WhatsApp support.]

## Why HireHub360 Beats ${meta.competitor}
[Comparison table with 5 rows: Speed, Price, Quality Verification, India Focus, Support. HireHub360 ✅ vs Others ❌. 3-line intro + 3-line conclusion after table.]

## ${topic.skill} Cost in ${topic.city === 'India' ? 'India' : topic.city} — Full Pricing Guide 2025
[Realistic price ranges for 3–4 service tiers. Use this data: ${pricingContext}. Explain what drives cost. This section ranks for high buying-intent searches.]

## Frequently Asked Questions — ${topic.skill} Hiring in ${topic.city}
[Exactly 6 FAQs. Use real questions people type on Google. Answer each in 60–80 words. Questions must include: (1) How to hire, (2) Cost/pricing, (3) Time to hire, (4) Quality assurance, (5) Payment/contract, (6) HireHub360-specific benefit.]

## Client Success Stories — Real Results on HireHub360
[3 realistic testimonials. Each must have: Name, Company, City, Star rating (4.8–5.0), specific result achieved (numbers preferred). Make them feel authentic and India-specific.]

---

CONCLUSION (100 words): Summarise the pain solved. Repeat "${topic.kw}" naturally. End with:
**Ready to hire the best ${topic.skill} in ${topic.city}?** [Post your requirement free on HireHub360](https://hirehub360.in) and get matched profiles in under 24 hours. WhatsApp us at +91-XXXXXXXXXX for instant support. 🚀

---

MANDATORY INTERNAL LINKS (weave naturally into content — never in a list):
- [Post your requirement free on HireHub360](https://hirehub360.in) — use in intro and conclusion
- [Browse ${topic.city === 'India' ? 'all' : topic.city} job listings](https://hirehub360.in${topic.city === 'India' ? '' : '/jobs/in/'+topic.city.toLowerCase()}) — use in coverage/cities section
- [View HireHub360 pricing plans](https://hirehub360.in/pricing) — use in pricing section
- [Read more hiring guides on our blog](https://hirehub360.in/blog) — use in FAQ or conclusion

MANDATORY EXTERNAL LINK (one only, mid-sentence, relevant context):
- ${meta.extLink}

SEO RULES:
- "${topic.kw}" appears naturally 8–10 times across the full post (≈1.5% density)
- H1: once only
- H2: exactly 7 (as structured above)
- H3: use inside each H2 for sub-points where needed
- No filler. No generic AI-speak. Every sentence earns its place.
- Tone: premium, expert, direct. Written for Indian business owners and startup founders.
- Use ₹ for currency. Use Indian English spelling. Hindi words allowed where natural (e.g. "kaam", "dhanda", "jugaad" sparingly).

Write ONLY the markdown blog content. Start directly with the # H1. No preamble, no meta notes.`
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = req.headers['x-cron-secret'] || req.query.secret
  if (secret !== (process.env.CRON_SECRET || 'hirehub-cron-2026')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // slot: a=labour, b=freelance, c=digital-marketing, d=data-analytics
  const slot = (req.query.slot || 'a').toLowerCase()
  const topics = CLUSTERS[slot]
  if (!topics) return res.status(400).json({ error: 'Invalid slot. Use a/b/c/d.' })

  try {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    const topic = topics[dayOfYear % topics.length]

    const dateStr = new Date().toISOString().slice(0, 10)
    const slug = `hire-${mkSlug(topic.skill)}-${mkSlug(topic.city)}-${dateStr}`

    const { data: existing } = await supabaseService.from('blogs').select('id').eq('slug', slug).maybeSingle()
    if (existing) return res.json({ ok: true, message: 'Already written today', slug })

    // Generate with AI
    const prompt = buildPrompt(topic)
    const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.68,
      }),
    })

    const aiData = await aiRes.json()
    const content = aiData.choices?.[0]?.message?.content || ''
    if (!content || content.length < 500) {
      return res.status(500).json({ error: 'AI generated empty content', aiData })
    }

    // Extract H1 as title (first line)
    const firstLine = content.split('\n').find(l => l.trim())
    const title = firstLine?.replace(/^#+\s*/, '').trim() || `Hire ${topic.skill} in ${topic.city} — Complete Guide 2025`
    const metaTitle = title.slice(0, 60)
    const excerpt = `Looking to hire ${topic.skill} in ${topic.city}? HireHub360 matches you with verified, top-rated ${topic.skill.toLowerCase()} professionals in 2–24 hours. Post your requirement free. 100% satisfaction guaranteed.`

    const { error } = await supabaseService.from('blogs').insert({
      title,
      slug,
      excerpt,
      content,
      author: 'HireHub360 SEO Team',
      tags: [topic.kw, topic.skill.toLowerCase(), topic.city.toLowerCase(), topic.segment, 'hire india 2025'],
      published: true,
      meta_title: metaTitle,
      meta_description: `Hire verified ${topic.skill} in ${topic.city} within 24 hrs. Best rates, zero commission, 100% satisfaction. Post free on HireHub360.`.slice(0, 155),
      updated_at: new Date().toISOString(),
    })

    if (error) return res.status(500).json({ error: error.message })

    await autoIndex([`${SITE}/blog/${slug}`, `${SITE}/blog`])

    return res.json({ ok: true, slug, title, keyword: topic.kw, segment: topic.segment })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

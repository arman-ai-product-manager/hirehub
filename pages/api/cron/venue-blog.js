const { supabaseService } = require('../../../lib/supabase')
const { autoIndex, SITE } = require('../../../lib/autoIndex')
const { googleIndex }     = require('../../../lib/googleIndex')

// ── VENUE BLOG TOPICS ──────────────────────────────────────────────────────
// Premium-only. Targeting large corporates, MNCs, enterprise HR teams.
// No budget / cheap / under-1000 content. High-value audience only.

const VENUE_TOPICS = [

  // ── ENTERPRISE OUTING ──
  { kw: 'corporate outing Mumbai',
    title: 'Premium Corporate Outing Venues in Mumbai — Enterprise Packages for 50–500 Employees',
    venue: 'The Game Palacio', areas: ['Lower Parel','BKC','Bandra','Kurla'],
    angle: 'How Mumbai\'s top MNCs and large corporates plan exclusive team outings at premium entertainment venues — full buyouts, branded events, and dedicated event managers.' },

  { kw: 'corporate event venues Mumbai',
    title: 'Best Corporate Event Venues in Mumbai — Full Buyouts, AV Setup & Enterprise Catering',
    venue: 'Luna Et Sol', areas: ['Lower Parel','Worli','BKC','Andheri'],
    angle: 'Enterprise-grade corporate event venues in Mumbai with capacity for 100–1,000 guests — AV, branding, F&B and dedicated event coordination.' },

  { kw: 'team outing places Mumbai',
    title: 'Exclusive Team Outing Venues in Mumbai — Private Events for Corporate Teams',
    venue: 'Formula Karting', areas: ['Powai','Andheri','Navi Mumbai','Pune'],
    angle: 'Premium, private team outing destinations in Mumbai used by India\'s top companies — exclusive venue hire, custom packages, white-glove coordination.' },

  { kw: 'office outing ideas Mumbai',
    title: 'Luxury Office Outing Ideas in Mumbai — Experiences That Retain Top Talent',
    venue: 'Amazonia', areas: ['Lower Parel','Worli','BKC','Juhu'],
    angle: 'How Fortune 500 companies in Mumbai design memorable office outings that drive retention — exclusive experiences, premium venues, and measurable engagement ROI.' },

  { kw: 'corporate party venues Mumbai',
    title: 'Premium Corporate Party Venues in Mumbai — Annual Parties, Client Nights & Leadership Events',
    venue: 'Kamikaze', areas: ['BKC','Lower Parel','Worli','Andheri'],
    angle: 'Mumbai\'s most prestigious corporate party venues for annual celebrations, client entertainment, leadership offsite dinners and award nights — full-service, GST-ready.' },

  // ── TEAM BUILDING / ENGAGEMENT ──
  { kw: 'team building activities Mumbai',
    title: 'High-Impact Team Building Activities in Mumbai — Enterprise Programs for 100+ Employees',
    venue: 'The Game Palacio', areas: ['Lower Parel','Bandra','Noida','Hyderabad'],
    angle: 'Structured team building programs in Mumbai used by India\'s largest companies — data-backed activities that improve cross-functional collaboration and reduce attrition.' },

  { kw: 'employee engagement ideas',
    title: 'Enterprise Employee Engagement Strategies That Actually Reduce Attrition in 2026',
    venue: 'The Game Palacio', areas: ['Mumbai','Bangalore','Delhi','Hyderabad'],
    angle: 'How Indian MNCs design year-round engagement calendars — quarterly outings, milestone celebrations, leadership-sponsored events that move the needle on retention.' },

  { kw: 'team bonding activities office',
    title: 'Executive Team Bonding Experiences in Mumbai — For Leadership & Senior Management',
    venue: 'Luna Et Sol', areas: ['Mumbai','Delhi','Bangalore'],
    angle: 'Premium team bonding experiences for C-suite and senior management in Mumbai — curated itineraries, private venues, and facilitated sessions.' },

  { kw: 'HR engagement activities',
    title: 'HR Engagement Calendar for Large Indian Enterprises — Quarterly Outing Strategy',
    venue: 'The Game Palacio', areas: ['Mumbai','Bangalore','Pune','Hyderabad'],
    angle: 'How India\'s top HR leaders structure annual engagement plans — venue strategy, vendor partnerships, budgeting at scale and measuring engagement ROI.' },

  { kw: 'office fun activity ideas',
    title: 'Premium Office Activity Ideas for Enterprise Teams — Beyond the Usual Team Lunch',
    venue: 'Formula Karting', areas: ['Mumbai','Pune','Noida','Delhi'],
    angle: 'Enterprise-grade office activity programs that top companies use to differentiate their culture — exclusive experiences, private bookings, full-day event formats.' },

  // ── VENUE BOOKING / TRANSACTIONAL ──
  { kw: 'corporate event booking',
    title: 'Corporate Event Booking in Mumbai — How India\'s Top Companies Confirm Venues in 2 Hours',
    venue: 'The Game Palacio', areas: ['Lower Parel','BKC','Bandra','Kurla'],
    angle: 'How Mumbai\'s fastest-growing corporations use HireHub360 to book premium venues instantly — no back-and-forth, 2-hour confirmation, dedicated coordination.' },

  { kw: 'team outing booking',
    title: 'Enterprise Team Outing Booking — Single Platform for Pan-India Corporate Venues',
    venue: 'The Game Superpark', areas: ['Mumbai','Pune','Delhi','Hyderabad'],
    angle: 'How large companies with multi-city teams use one platform to book consistent, premium team outings across Mumbai, Delhi, Bangalore and Pune.' },

  { kw: 'corporate outing near me',
    title: 'Instant Corporate Outing Booking in Mumbai — 18 Premium Venues, 2-Hour Confirmation',
    venue: 'The Game Palacio', areas: ['Lower Parel','Andheri','BKC','Thane'],
    angle: 'Premium corporate outing venues across Mumbai that confirm bookings in 2 hours — no advance payment, dedicated event manager, GST invoice guaranteed.' },

  { kw: 'office party venues',
    title: 'Elite Office Party Venues in Mumbai — Private Buyouts for 50 to 500 Guests',
    venue: 'Amazonia', areas: ['Lower Parel','Worli','Juhu','BKC'],
    angle: 'Mumbai\'s top-tier office party venues offering complete buyouts — custom branding, premium F&B, private event staff and next-day GST invoicing.' },

  // ── RESTAURANT / DINING ──
  { kw: 'restaurant corporate booking Mumbai',
    title: 'Premium Restaurant Corporate Bookings in Mumbai — Private Dining for Enterprise Teams',
    venue: 'Verde', areas: ['BKC','Lower Parel','Worli','Juhu'],
    angle: 'Exclusive restaurant private dining experiences in Mumbai for corporate teams — client entertainment, leadership dinners, board-level hospitality.' },

  { kw: 'corporate dinner booking Mumbai',
    title: 'Corporate Dinner Venues in Mumbai — Client Entertainment & Leadership Dining at Scale',
    venue: 'Amazonia', areas: ['Lower Parel','Worli','BKC','Juhu'],
    angle: 'How Mumbai\'s top companies host client dinners and leadership events — premium restaurants with private rooms, sommelier service and custom menus.' },

  { kw: 'group booking restaurants Mumbai',
    title: 'Exclusive Group Restaurant Bookings in Mumbai — For 50 to 300 Corporate Guests',
    venue: 'Koa', areas: ['Juhu','BKC','Andheri','Thane'],
    angle: 'Premium group dining experiences in Mumbai for large corporate teams — private floors, custom menus, branded setups and seamless corporate billing.' },

  { kw: 'team lunch places Mumbai',
    title: 'Premium Team Lunch Venues in Mumbai — Exclusive Dining for Corporate Teams',
    venue: 'American Pie', areas: ['BKC','Lower Parel','Bandra','Powai'],
    angle: 'Mumbai\'s best premium team lunch venues for mid-to-large corporate teams — private areas, set menus, quick turnaround and corporate invoicing.' },

  // ── PACKAGES & EVENTS ──
  { kw: 'corporate outing packages',
    title: 'Premium Corporate Outing Packages Across India — Turnkey Events for 100–1,000 Employees',
    venue: 'The Game Superpark', areas: ['Mumbai','Pune','Delhi','Hyderabad'],
    angle: 'All-inclusive corporate outing packages used by India\'s largest employers — private venue, premium F&B, activities, branding and dedicated event management.' },

  { kw: 'team outing packages Mumbai',
    title: 'Enterprise Team Outing Packages in Mumbai — Custom, Branded & Fully Managed',
    venue: 'Formula Karting', areas: ['Pune','Noida','Delhi','Bhiwandi'],
    angle: 'Custom team outing packages in Mumbai designed for enterprise HR teams — fixed per-head pricing, flexible group sizes, dedicated manager, same-day invoice.' },

  { kw: 'company outing packages Mumbai',
    title: 'Company-Wide Outing Packages in Mumbai — Annual Events for 200–1,000 Employees',
    venue: 'The Game Superpark', areas: ['Pune','Navi Mumbai','Thane','Borivali'],
    angle: 'How large Mumbai-based companies plan annual company outings — venue strategy, logistics, F&B at scale, vendor management and employee experience design.' },

  { kw: 'office event packages',
    title: 'Premium Office Event Packages in Mumbai — Annual Day, Quarterly Awards & Client Evenings',
    venue: 'Luna Et Sol', areas: ['Mumbai','Delhi','BKC'],
    angle: 'Premium office event packages for enterprise teams — annual day celebrations, quarterly awards, client evenings and leadership retreats, fully managed.' },

  { kw: 'corporate party packages per person',
    title: 'Corporate Party Packages in Mumbai — Premium Per-Head Pricing for Enterprise Events',
    venue: 'The Game Palacio', areas: ['Lower Parel','Bandra','Noida','Hyderabad'],
    angle: 'Enterprise corporate party packages in Mumbai with transparent per-head pricing — premium F&B, activities, AV and branding included, GST invoice assured.' },

  // ── SPECIFIC ACTIVITY ──
  { kw: 'bowling corporate booking Mumbai',
    title: 'Premium Corporate Bowling Events in Mumbai — Private Lane Buyouts for Enterprise Teams',
    venue: 'The Game Palacio', areas: ['Lower Parel','Bandra','Ansal Plaza','Pitampura'],
    angle: 'How Mumbai\'s top companies book private bowling events — full lane buyouts, branded setups, premium dining and corporate tournament formats.' },

  { kw: 'arcade corporate event Mumbai',
    title: 'Corporate Arcade & Gaming Events in Mumbai — Exclusive Buyouts for Enterprise Teams',
    venue: 'The Game', areas: ['Mumbai','Navi Mumbai','Lower Parel'],
    angle: 'Private arcade and gaming event bookings in Mumbai for corporate teams — exclusive access, team tournament formats, premium F&B and branded experience.' },

  { kw: 'indoor team outing Mumbai',
    title: 'Premium Indoor Corporate Venues in Mumbai — Year-Round Private Events for Enterprise Teams',
    venue: 'Snow World', areas: ['Mumbai','Navi Mumbai','Thane','Pune'],
    angle: 'Mumbai\'s top indoor corporate venues for private team events — climate-controlled, AV-ready, catering included, accessible for large teams year-round.' },

  { kw: 'play area corporate booking',
    title: 'Corporate Family Day & Employee Appreciation Events at Premium Play Venues in Mumbai',
    venue: 'Pokiddo Junior', areas: ['Lower Parel','Noida','Thane'],
    angle: 'How large Mumbai corporates run premium family day events — exclusive entertainment venue bookings, activity zones, catering and CSR-linked engagement.' },

  { kw: 'unique office outing ideas India',
    title: 'Unique Premium Corporate Outing Experiences Across India — For Companies That Don\'t Do Generic',
    venue: 'Formula Karting', areas: ['Pune','Noida','Delhi','Mumbai'],
    angle: 'How India\'s top-rated employers design exclusive, memorable outings — private snow parks, go-kart championships, luxury dining and branded corporate experiences.' },

  // ── CORPORATE PLANNING ──
  { kw: 'corporate event planning ideas',
    title: 'Enterprise Corporate Event Planning Guide — Mumbai\'s Top HR Teams Share Their Strategy',
    venue: 'Amazonia', areas: ['Mumbai','Delhi','Bangalore'],
    angle: 'How enterprise HR leads at India\'s top companies plan corporate events at scale — vendor strategy, budget allocation, venue selection and measuring success.' },

  { kw: 'office party places near me',
    title: 'Premium Office Party Venues Near Your Mumbai Office — Private, Instant Confirmation',
    venue: 'The Game Garden', areas: ['Navi Mumbai','BKC','Lower Parel','Thane'],
    angle: 'Find premium office party venues within 10 minutes of major Mumbai business districts — instant booking confirmation, private event spaces, no advance payment.' },

  { kw: 'office outing ideas Mumbai',
    title: 'Exclusive Office Outing Experiences in Mumbai — What India\'s Best Employers Actually Do',
    venue: 'Snow World', areas: ['Mumbai','Navi Mumbai','Thane'],
    angle: 'What India\'s Great Place to Work-certified companies do differently for office outings — exclusive experiences, premium venues, and the engagement data behind it.' },

  // ── SEASONAL / TOPICAL ──
  { kw: 'corporate outing Mumbai',
    title: 'Q3 Corporate Outing Planning for Mumbai Teams — Book Now Before Peak Season Fills Up',
    venue: 'The Game Palacio', areas: ['Lower Parel','BKC','Bandra','Andheri'],
    angle: 'Why Q3 is the peak corporate outing season in Mumbai and how enterprise HR teams secure premium venue slots months in advance.' },

  { kw: 'team building activities Mumbai',
    title: 'High-ROI Team Building Programs in Mumbai — Measurable Engagement for Enterprise HR',
    venue: 'Formula Karting', areas: ['Pune','Noida','Thane','Mumbai'],
    angle: 'Team building activities in Mumbai with measurable outcomes — how India\'s top employers quantify engagement ROI from quarterly outing programs.' },

  { kw: 'corporate event venues Mumbai',
    title: 'Mumbai\'s Most Sought-After Corporate Event Venues — Why They Book Out 6 Weeks Early',
    venue: 'Luna Et Sol', areas: ['Lower Parel','BKC','Worli'],
    angle: 'The most in-demand corporate event venues in Mumbai — why they\'re always booked and how to secure your preferred date through HireHub360.' },

]

function mkSlug(s) {
  return (s || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

async function generateVenueBlog(topic) {
  const prompt = `Write a detailed, SEO-optimized blog post for HireHub360 (hirehub360.in).

Target keyword: "${topic.kw}"
Blog title: "${topic.title}"
Featured venue: ${topic.venue} (a premium entertainment/dining venue by PJH India)
Key areas to mention: ${topic.areas.join(', ')}
Blog angle: ${topic.angle}

IMPORTANT TONE: This is for enterprise HR directors, CHROs, and senior office admins at large companies (100–5,000 employees). Do NOT mention budget options, cheap packages, or "under ₹X" pricing. The audience books premium experiences and expects quality. Positioning is always premium, exclusive, high-quality.

About HireHub360 venue booking:
- India's leading platform for instant corporate venue booking
- 18+ premium entertainment and dining venues by PJH India
- Brands: The Game Palacio, Formula Karting, Snow World, Amazonia, Luna Et Sol, Koa, Pokiddo, The Game Ranch, American Pie, Verde, The Beer Garden, Kamikaze, The Game, The Game Garden, The Game Superpark, Pokiddo Junior
- Confirmed in 2 hours. Dedicated event manager. GST invoice guaranteed.
- Zero advance payment. Free to request.
- Book at: https://hirehub360.in

Requirements:
- 900–1,200 words
- Markdown format (## headings, **bold**, tables, bullet points)
- Target keyword "${topic.kw}" naturally 4–6 times
- Comparison table: Venue | Location | Capacity | Package Starting | Best For
- "Why Enterprise HR Teams Choose HireHub360" section
- "How to Book in 3 Steps" section — fast, premium, zero hassle
- FAQ section — 4 questions relevant to large corporates (GST billing, buyouts, group size, cancellation)
- Mention areas: ${topic.areas.join(', ')}
- Tone: authoritative, strategic, written for senior HR professionals and CHROs
- Reference real enterprise context: "companies of 200–1,000 employees", "quarterly engagement calendar", "dedicated event manager", "corporate invoice within 24 hours"
- Do NOT mention pricing below ₹1,500 per head. Do NOT use words like "budget", "affordable", "cheap", "under ₹X".

── LINKING RULES (Google E-E-A-T 2026 — MANDATORY) ──
You MUST weave EXACTLY these links naturally into the body content:

INTERNAL LINKS (3–4 links — contextual, descriptive anchor text):
- [Book a corporate venue on HireHub360](https://hirehub360.in) — in intro or "How to Book" section
- [Explore all corporate venue packages](https://hirehub360.in/pricing) — in pricing/package section
- [Read more corporate outing guides](https://hirehub360.in/blog) — in closing or FAQ section
- [Post jobs & manage your team on HireHub360](https://hirehub360.in) — in "about HireHub360" context

EXTERNAL LINKS (2–3 links — only .gov.in, .org, established Indian publications):
- [Great Place to Work India](https://www.greatplacetowork.in) — cite when mentioning employee engagement benchmarks or certified employers
- [People Matters](https://www.peoplematters.in) — cite when referencing HR industry data or workforce statistics
- [SHRM Global HR Standards](https://www.shrm.org) — cite when mentioning team building research or HR best practices
- [India Brand Equity Foundation](https://www.ibef.org) — cite when referencing India's hospitality/entertainment industry growth
- [Ministry of Corporate Affairs India](https://www.mca.gov.in) — cite when mentioning corporate compliance, GST invoicing requirements

Linking rules (strictly follow):
1. Links must appear naturally mid-sentence — NEVER in a separate "Sources" or "References" section
2. Anchor text must describe the destination (never "click here", "here", "this link", "read more")
3. Each link placed only where it genuinely adds context for the reader
4. Do NOT repeat the same URL more than once
5. Internal links signal site structure to Google. External links signal E-E-A-T trust.

End with strong CTA:
"**Planning your next corporate outing?** [Book your venue instantly on HireHub360](https://hirehub360.in) — 18+ premium venues, confirmed in 2 hours, dedicated event manager, GST invoice guaranteed."

Write ONLY the blog markdown. Start directly with ## heading. No preamble.`

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
      temperature: 0.72
    })
  })

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = req.headers['x-cron-secret'] || req.query.secret
  if (secret !== (process.env.CRON_SECRET || 'hirehub-cron-2026')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // slot: 'a' = first daily venue blog, 'b' = second daily venue blog
  const slot = req.query.slot || 'a'

  try {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    const idx = slot === 'b'
      ? ((dayOfYear * 2 + 1) % VENUE_TOPICS.length)
      : ((dayOfYear * 2) % VENUE_TOPICS.length)
    const topic = VENUE_TOPICS[idx]

    const dateStr = new Date().toISOString().slice(0, 10)
    const slug = `corporate-venue-${mkSlug(topic.kw)}-${dateStr}-${slot}`

    const { data: existing } = await supabaseService.from('blogs').select('id').eq('slug', slug).maybeSingle()
    if (existing) {
      return res.json({ ok: true, message: 'Already written today', slug })
    }

    const content = await generateVenueBlog(topic)
    if (!content || content.length < 200) {
      return res.status(500).json({ error: 'AI generated empty content' })
    }

    const excerpt = `Planning a ${topic.kw}? HireHub360 gives enterprise HR teams instant access to 18+ premium venues across India — ${topic.areas.slice(0,3).join(', ')} and more. Confirmed in 2 hours, dedicated event manager, GST invoice guaranteed.`

    const { error } = await supabaseService.from('blogs').insert({
      title: topic.title,
      slug,
      excerpt,
      content,
      author: 'HireHub360 Venue Team',
      tags: [topic.kw, 'corporate outing Mumbai', 'enterprise team outing', 'premium venue booking', 'corporate event Mumbai', topic.venue.toLowerCase()],
      published: true,
      updated_at: new Date().toISOString()
    })

    if (error) return res.status(500).json({ error: error.message })

    const blogUrl = `${SITE}/blog/${slug}`
    await autoIndex([blogUrl, `${SITE}/blog`])

    // Google Indexing API — direct crawl request
    const gResult = await googleIndex([blogUrl])

    return res.json({
      ok: true, slug, title: topic.title, keyword: topic.kw, venue: topic.venue,
      google_indexed: gResult[0]?.ok,
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

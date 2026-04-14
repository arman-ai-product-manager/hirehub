const { supabaseService } = require('../../../lib/supabase')
const { autoIndex, SITE } = require('../../../lib/autoIndex')

// ── VENUE BLOG TOPICS ──────────────────────────────────────────────────────
// 2 blogs/day — rotating through 60 corporate outing / venue SEO topics
// All target Mumbai venue booking + team outing keywords

const VENUE_TOPICS = [
  // ── INTENT: Venue discovery ──
  { kw: 'corporate outing Mumbai',      title: 'Best Corporate Outing Places in Mumbai (2026) — Venues, Packages & Booking Guide',      venue: 'The Game Palacio', areas: ['Lower Parel','Bandra','Kurla','Thane'], angle: 'Top 10 corporate outing destinations in Mumbai with packages, pricing and booking tips for HR teams.' },
  { kw: 'team outing places Mumbai',    title: 'Top 15 Team Outing Places in Mumbai — From ₹500 to Premium Packages',                  venue: 'Formula Karting', areas: ['Powai','Andheri','Navi Mumbai','Pune'], angle: 'Complete guide for HR managers planning team outings in Mumbai — indoor, outdoor, premium and budget options.' },
  { kw: 'office outing ideas Mumbai',   title: '20 Office Outing Ideas in Mumbai Your Team Will Actually Love',                         venue: 'Snow World', areas: ['Malad','Goregaon','Borivali','Thane'], angle: 'Creative and unique office outing ideas in Mumbai — from snow parks to go-karting, perfect for any team size.' },
  { kw: 'corporate party venues Mumbai',title: 'Best Corporate Party Venues in Mumbai — Private Dining, Bars & Event Halls',             venue: 'Amazonia', areas: ['BKC','Lower Parel','Worli','Juhu'], angle: 'Curated corporate party venues in Mumbai for celebrations, client dinners, and annual parties.' },
  { kw: 'team building activities Mumbai', title: 'Top Team Building Activities in Mumbai — Fun, Engaging & HR-Approved',               venue: 'Pokiddo', areas: ['Thane','Pune','Noida','Navi Mumbai'], angle: 'Proven team building activities in Mumbai that actually improve morale, communication and productivity.' },
  { kw: 'office party places near me',  title: 'Office Party Places Near You in Mumbai — Book in 2 Hours or Less',                     venue: 'The Game Garden', areas: ['Navi Mumbai','Vashi','Belapur','Kharghar'], angle: 'Find the best office party venues near your Mumbai office — quick confirmation, group packages included.' },
  { kw: 'corporate event venues Mumbai',title: 'Corporate Event Venues in Mumbai — Capacity, Pricing & Packages Compared',             venue: 'Luna Et Sol', areas: ['Lower Parel','BKC','Worli','Andheri'], angle: 'Compare the best corporate event venues in Mumbai by capacity, pricing, F&B options and AV facilities.' },
  { kw: 'company outing packages Mumbai',title: 'Company Outing Packages in Mumbai — Everything Included from ₹799/head',             venue: 'The Game Superpark', areas: ['Pune','Navi Mumbai','Thane','Borivali'], angle: 'All-inclusive company outing packages in Mumbai — food, activities, private area and zero planning stress.' },
  { kw: 'bowling corporate booking Mumbai', title: 'Corporate Bowling Booking in Mumbai — Group Packages, Private Lanes & F&B',        venue: 'The Game Palacio', areas: ['Lower Parel','Bandra','Ansal Plaza','Pitampura'], angle: 'Book bowling lanes for your corporate team in Mumbai — group rates, private booking, F&B bundles.' },
  { kw: 'arcade corporate event Mumbai',title: 'Corporate Arcade Events in Mumbai — Gaming + Team Bonding + Dining',                   venue: 'The Game', areas: ['Mumbai','Navi Mumbai'], angle: 'Plan the perfect corporate arcade event in Mumbai — gaming stations, team tournaments and dining packages.' },

  // ── INTENT: Restaurant / dining ──
  { kw: 'restaurant corporate booking Mumbai', title: 'Best Restaurants for Corporate Bookings in Mumbai — Private Rooms & Group Menus', venue: 'Verde', areas: ['Noida','Hyderabad','BKC','Juhu'], angle: 'Top restaurants in Mumbai that specialise in corporate bookings — private dining, set menus, billing and GST.' },
  { kw: 'team lunch places Mumbai',     title: 'Best Team Lunch Places in Mumbai — Group-Friendly Restaurants Under ₹1,000',           venue: 'American Pie', areas: ['Malad','Bandra','BKC','Kurla'], angle: 'Find the best team lunch spots in Mumbai for groups of 10–100 — quick service, group billing and private space.' },
  { kw: 'corporate dinner booking Mumbai', title: 'Corporate Dinner Venues in Mumbai — Impress Clients and Celebrate Teams',           venue: 'Amazonia', areas: ['Lower Parel','Worli','BKC','Juhu'], angle: 'Best corporate dinner venues in Mumbai for client entertainment, quarterly parties and leadership dinners.' },
  { kw: 'group booking restaurants Mumbai', title: 'Group Restaurant Bookings in Mumbai — Top 12 Venues That Handle 20–200 Pax',      venue: 'Koa', areas: ['Juhu','Thane','Andheri'], angle: 'Planning a large group booking in Mumbai? These restaurants handle 20–200 guests with private dining options.' },

  // ── INTENT: Packages & pricing ──
  { kw: 'corporate outing packages',    title: 'Corporate Outing Packages in India 2026 — Pricing, Inclusions & How to Book',          venue: 'The Game Superpark', areas: ['Mumbai','Pune','Delhi','Hyderabad'], angle: 'Everything you need to know about corporate outing packages in India — what\'s included, avg price per head and booking process.' },
  { kw: 'team outing packages Mumbai',  title: 'Team Outing Packages in Mumbai — Compare 10 Venues by Price & Activities',             venue: 'Formula Karting', areas: ['Pune','Noida','Delhi','Bhiwandi'], angle: 'Side-by-side comparison of team outing packages in Mumbai with pricing, activities, food options and group size.' },
  { kw: 'corporate party packages per person', title: 'Corporate Party Packages Per Person in Mumbai — Budget to Premium Options',     venue: 'The Beer Garden', areas: ['Navi Mumbai','Goregaon'], angle: 'Corporate party packages priced per person in Mumbai — from ₹599 budget options to ₹3,000 premium experiences.' },
  { kw: 'office event packages',        title: 'Office Event Packages in Mumbai — Birthday, Farewell, Annual Day & More',              venue: 'Kamikaze', areas: ['Noida','Hyderabad'], angle: 'Ready-to-book office event packages in Mumbai covering all occasions — no planning stress, fixed pricing.' },
  { kw: 'play area corporate booking',  title: 'Corporate Bookings at Play Areas & Entertainment Zones in Mumbai',                     venue: 'Pokiddo Junior', areas: ['Lower Parel','Noida','Thane'], angle: 'Book entertainment zones and indoor play areas in Mumbai for corporate family events and team celebrations.' },

  // ── INTENT: Employee engagement ──
  { kw: 'employee engagement ideas',    title: 'Employee Engagement Ideas That Actually Work — 25 Proven Activities for 2026',         venue: 'The Game Palacio', areas: ['Mumbai','Bangalore','Delhi','Hyderabad'], angle: 'Practical employee engagement ideas used by top Indian companies — beyond pizza parties and awards.' },
  { kw: 'team bonding activities office', title: 'Best Team Bonding Activities for Office Teams — 20 Ideas Beyond the Boring',        venue: 'Pokiddo', areas: ['Pune','Noida','Thane'], angle: 'Team bonding activities that employees actually enjoy — from escape rooms to go-karting and brewery tours.' },
  { kw: 'office fun activity ideas',    title: 'Office Fun Activity Ideas for Indian Workplaces — Engaging, Budget-Friendly, HR-Approved', venue: 'The Game', areas: ['Mumbai'], angle: '30 office fun activity ideas scaled for Indian teams — from 10-person startups to 500+ enterprise teams.' },
  { kw: 'corporate event planning ideas', title: 'Corporate Event Planning Ideas for Mumbai HR Teams — Timeline, Budget & Vendors',    venue: 'Luna Et Sol', areas: ['Mumbai','Delhi'], angle: 'Step-by-step corporate event planning for Mumbai HRs — vendor shortlist, budget templates, checklists.' },
  { kw: 'HR engagement activities',     title: 'HR Engagement Activities That Reduce Attrition — A Data-Driven Guide for India',      venue: 'The Game Palacio', areas: ['Mumbai','Bangalore','Pune'], angle: 'How Indian HR teams use monthly engagement activities to reduce attrition by 22% — real strategies that work.' },

  // ── INTENT: Budget / small team ──
  { kw: 'best places for team outing in Mumbai under 1000', title: 'Team Outing in Mumbai Under ₹1,000 Per Head — 10 Best Options', venue: 'The Game Garden', areas: ['Navi Mumbai','Thane','Malad'], angle: 'Best team outing places in Mumbai that fit under ₹1,000 per person — activities, food and private area included.' },
  { kw: 'affordable corporate outing Mumbai', title: 'Affordable Corporate Outings in Mumbai — Fun Without Breaking the Budget',       venue: 'American Pie', areas: ['Malad','Bandra','Powai','Thane'], angle: 'Budget-friendly corporate outing options in Mumbai that don\'t feel cheap — great experiences at honest prices.' },
  { kw: 'small team outing places Mumbai', title: 'Small Team Outing Places in Mumbai — Perfect for 5–15 People',                    venue: 'Koa', areas: ['Juhu','Thane'], angle: 'Finding the right venue for a small team of 5–15 in Mumbai — intimate, fun and easy to organise.' },
  { kw: 'indoor team outing Mumbai',    title: 'Best Indoor Team Outing Venues in Mumbai — Monsoon-Proof & Year-Round Fun',           venue: 'Snow World', areas: ['Mumbai','Navi Mumbai','Thane'], angle: 'Mumbai\'s best indoor team outing venues for any season — air-conditioned, activity-packed and group-friendly.' },
  { kw: 'unique office outing ideas India', title: 'Unique Office Outing Ideas in India — 15 Experiences Your Team Has Never Tried', venue: 'Formula Karting', areas: ['Pune','Noida','Delhi'], angle: 'Stand out with unique office outing ideas in India — snow parks, go-karting, trampoline parks and more.' },

  // ── INTENT: Transactional / booking ──
  { kw: 'corporate outing near me',     title: '"Corporate Outing Near Me" — How to Find & Book the Best Venue in 2 Hours',           venue: 'The Game Palacio', areas: ['Lower Parel','Andheri','BKC','Thane'], angle: 'Searching for corporate outings near you? Here\'s how Mumbai companies book confirmed venues in under 2 hours.' },
  { kw: 'team outing booking',          title: 'Team Outing Booking Made Easy — Step-by-Step Guide for Mumbai HR Teams',              venue: 'The Game Superpark', areas: ['Pune','Navi Mumbai'], angle: 'Everything you need to know about team outing booking in Mumbai — from shortlisting to payment to day-of logistics.' },
  { kw: 'office party venues',          title: 'Office Party Venues in Mumbai — Top 12 Spaces for Every Budget & Team Size',          venue: 'Kamikaze', areas: ['Noida','Hyderabad','BKC'], angle: 'The definitive list of office party venues in Mumbai — private rooms, rooftops, bars and family-friendly spaces.' },
  { kw: 'corporate event booking',      title: 'Corporate Event Booking in Mumbai — How to Get Confirmed in 2 Hours or Less',         venue: 'The Game Palacio', areas: ['Lower Parel','Bandra','Kurla'], angle: 'How Mumbai\'s fastest-growing companies book corporate events without the back-and-forth — HireHub360 venue guide.' },
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

About HireHub360 venue booking:
- Instant corporate venue booking at 18+ premium venues across India
- Brands: The Game Palacio, Formula Karting, Snow World, Amazonia, Luna Et Sol, Koa, Pokiddo, The Game Ranch, American Pie, Verde, The Beer Garden, Kamikaze, The Game, The Game Garden, The Game Superpark, Pokiddo Junior, Pink Wasabi, Leo's
- All venues are by PJH India — India's largest entertainment brand group
- Confirmed in 2 hours. Zero advance payment. Free to request.
- Book at: https://hirehub360.in (click "Venue" tab in company dashboard)

Requirements:
- 900–1,200 words
- Markdown format (## headings, **bold**, tables, bullet points)
- Use target keyword "${topic.kw}" naturally 4–6 times
- Include a comparison table (Venue | Location | Capacity | Package From | Best For)
- Include a "Why Companies Book on HireHub360" section
- Include "How to Book in 3 Steps" section
- Include FAQ (4 questions specific to corporate outing booking)
- Strong CTA at end: "Book Your Team Outing on HireHub360 → hirehub360.in"
- Mention specific areas: ${topic.areas.join(', ')}
- Tone: helpful, direct, written for Indian HR managers and office admins
- Do NOT be generic. Be specific to Mumbai corporate culture where relevant.
- Include real data: "teams of 15–200", "₹799–₹3,500 per head", "2-hour confirmation"

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
      temperature: 0.75
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
    // slot a = even index, slot b = odd index — so 2 unique topics per day
    const idx = slot === 'b'
      ? ((dayOfYear * 2 + 1) % VENUE_TOPICS.length)
      : ((dayOfYear * 2) % VENUE_TOPICS.length)
    const topic = VENUE_TOPICS[idx]

    const dateStr = new Date().toISOString().slice(0, 10)
    const slug = `corporate-outing-${mkSlug(topic.kw)}-${dateStr}-${slot}`

    // Skip if already written
    const { data: existing } = await supabaseService.from('blogs').select('id').eq('slug', slug).maybeSingle()
    if (existing) {
      return res.json({ ok: true, message: 'Already written today', slug })
    }

    // Generate
    const content = await generateVenueBlog(topic)
    if (!content || content.length < 200) {
      return res.status(500).json({ error: 'AI generated empty content' })
    }

    const excerpt = `Planning a ${topic.kw}? HireHub360 lets you instantly book 18+ premium venues across India — ${topic.areas.slice(0,3).join(', ')} and more. Confirmed in 2 hours. Zero advance payment.`

    const { error } = await supabaseService.from('blogs').insert({
      title: topic.title,
      slug,
      excerpt,
      content,
      author: 'HireHub360 Venue Team',
      tags: [topic.kw, 'corporate outing Mumbai', 'team outing', 'venue booking', 'employee engagement', topic.venue.toLowerCase()],
      published: true,
      updated_at: new Date().toISOString()
    })

    if (error) return res.status(500).json({ error: error.message })

    // Auto-index
    await autoIndex([`${SITE}/blog/${slug}`, `${SITE}/blog`])

    return res.json({ ok: true, slug, title: topic.title, keyword: topic.kw, venue: topic.venue })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

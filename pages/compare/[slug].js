import Head from 'next/head'
import { useState } from 'react'

const COMPARISONS = {
  'hirehub360-vs-upwork': {
    competitor: 'Upwork',
    category: 'Freelance Platform',
    intent: 'freelancer hiring',
    meta_title: 'HireHub360 vs Upwork — Which is Better for Indian Businesses 2025',
    meta_desc: 'Honest comparison of HireHub360 vs Upwork for hiring freelancers in India. Fees, quality, speed, and payment modes compared. See which saves you more money.',
    h1: 'HireHub360 vs Upwork — Honest Comparison for Indian Businesses (2025)',
    intro: 'Upwork is the world\'s largest freelance marketplace, but it wasn\'t built for India. HireHub360 was. Here\'s an honest, data-backed comparison so you can decide where to spend your hiring budget.',
    hirehub_tagline: 'India-first freelance hiring. No dollar fees. UPI payments. Verified profiles.',
    competitor_tagline: 'Global freelance platform. 18M+ freelancers. Dollar billing only.',
    verdict: 'For Indian SMEs hiring local freelancers under ₹50,000/project, HireHub360 saves 20-35% in fees and avoids dollar conversion costs entirely.',
    rows: [
      { feature: 'Platform Fee', hirehub: '8% (capped ₹2,000)', competitor: '20% (no cap)', winner: 'hirehub' },
      { feature: 'Payment Mode', hirehub: 'UPI, NEFT, Paytm, Razorpay', competitor: 'USD wire transfer only', winner: 'hirehub' },
      { feature: 'Indian Freelancers', hirehub: '1.2L+ verified profiles', competitor: '~4L (unverified)', winner: 'hirehub' },
      { feature: 'GST Invoice', hirehub: 'Auto-generated, GSTIN linked', competitor: 'Not applicable', winner: 'hirehub' },
      { feature: 'Avg. Hire Time', hirehub: '< 4 hours', competitor: '2-5 days (proposal wait)', winner: 'hirehub' },
      { feature: 'Dispute Resolution', hirehub: 'Indian arbitration, 48hr SLA', competitor: 'US-timezone, slow', winner: 'hirehub' },
      { feature: 'Language Support', hirehub: 'Hindi, Tamil, Telugu, English', competitor: 'English only', winner: 'hirehub' },
      { feature: 'Global Freelancers', hirehub: 'India, UAE, Singapore', competitor: '180+ countries', winner: 'competitor' },
      { feature: 'Enterprise SLA', hirehub: 'Coming Q3 2025', competitor: 'Upwork Enterprise ✅', winner: 'competitor' },
    ],
    faqs: [
      { q: 'Is HireHub360 cheaper than Upwork for Indian businesses?', a: 'Yes. HireHub360 charges 8% (capped at ₹2,000) vs Upwork\'s 20% (uncapped). On a ₹20,000 project, you save ₹2,400 in platform fees alone — plus you avoid dollar conversion charges.' },
      { q: 'Can I pay freelancers in INR on HireHub360?', a: 'Yes. HireHub360 supports UPI, NEFT, Paytm, and Razorpay. Upwork forces USD payments, which adds 2-4% forex conversion on every transaction.' },
      { q: 'Does HireHub360 have as many freelancers as Upwork?', a: 'Upwork has more global freelancers, but for Indian SMEs, HireHub360\'s verified India-focused pool delivers faster matches. 90% of Indian businesses need local freelancers anyway.' },
      { q: 'Which platform is better for long-term contracts?', a: 'Upwork\'s Enterprise plan suits large companies needing 100+ contractors. For Indian SMEs and startups, HireHub360\'s monthly retainer feature (coming Q3 2025) will be the better choice.' },
      { q: 'Does HireHub360 provide GST invoices?', a: 'Yes. Every transaction on HireHub360 generates a GSTIN-linked GST invoice automatically. Upwork does not support Indian GST compliance.' },
      { q: 'Which platform has better dispute resolution for Indians?', a: 'HireHub360 resolves disputes via Indian arbitration within 48 hours, in business hours (IST). Upwork\'s dispute team operates in US timezones, causing delays for Indian users.' },
    ],
  },
  'hirehub360-vs-fiverr': {
    competitor: 'Fiverr',
    category: 'Gig Marketplace',
    intent: 'gig hiring',
    meta_title: 'HireHub360 vs Fiverr — Honest Comparison for Indian SMEs 2025',
    meta_desc: 'HireHub360 vs Fiverr comparison for Indian businesses. Compare fees, payment options, freelancer quality, and delivery times. Find out which works better in India.',
    h1: 'HireHub360 vs Fiverr — Which Gig Platform Wins for Indian SMEs? (2025)',
    intro: 'Fiverr pioneered the $5 gig economy, but its fee structure has ballooned to 20% for buyers and 20% for sellers — that\'s 40% off every transaction in "taxes." HireHub360 takes 8% total. Here\'s the full picture.',
    hirehub_tagline: 'Fixed-price gigs + custom projects. 8% total fee. UPI payments. India-focused.',
    competitor_tagline: 'Global gig marketplace. 20% buyer fee + 20% seller fee = 40% total cut.',
    verdict: 'For Indian SMEs ordering gigs under ₹25,000, HireHub360\'s 8% fee vs Fiverr\'s effective 40% makes it 5x cheaper to operate. Add UPI payments and local language support, and HireHub360 wins clearly.',
    rows: [
      { feature: 'Total Platform Cut', hirehub: '8% (seller only)', competitor: '~33% (buyer 5.5% + seller 20%)', winner: 'hirehub' },
      { feature: 'Minimum Gig Price', hirehub: '₹299', competitor: '$5 (~₹415) + 20% fee', winner: 'hirehub' },
      { feature: 'Payment Mode', hirehub: 'UPI, NEFT, wallets', competitor: 'Card/PayPal (USD) only', winner: 'hirehub' },
      { feature: 'Seller Withdrawal', hirehub: 'Instant UPI transfer', competitor: '14-day clearing period', winner: 'hirehub' },
      { feature: 'Hindi-speaking Sellers', hirehub: '60,000+', competitor: 'Present but hard to filter', winner: 'hirehub' },
      { feature: 'Gig Volume', hirehub: 'Growing (500K+ gigs)', competitor: '3M+ gigs', winner: 'competitor' },
      { feature: 'International Buyers', hirehub: 'India, UAE, SG only', competitor: '160+ countries', winner: 'competitor' },
      { feature: 'Revision Policy', hirehub: 'Seller-defined', competitor: 'Seller-defined', winner: 'tie' },
      { feature: 'GST Compliance', hirehub: 'Auto GST invoice', competitor: 'No INR/GST support', winner: 'hirehub' },
    ],
    faqs: [
      { q: 'Why is HireHub360 cheaper than Fiverr for Indian buyers?', a: 'Fiverr charges buyers an additional 5.5% service fee on top of the gig price, while sellers pay 20%. HireHub360 charges only 8% from the seller — buyers pay the listed price, no hidden fees.' },
      { q: 'Can I find the same quality freelancers on HireHub360 as Fiverr?', a: 'For Indian work — Hindi content, Indian social media management, India-specific SEO, local graphic design — HireHub360\'s verified Indian pool delivers equal or better quality at lower rates.' },
      { q: 'How fast do freelancers respond on HireHub360 vs Fiverr?', a: 'Because HireHub360 freelancers are in the same timezone (IST), average first response is under 45 minutes. On Fiverr, you may be dealing with sellers in Eastern Europe or South Asia with 8-12 hour delays.' },
      { q: 'Does Fiverr work with UPI payments in India?', a: 'No. Fiverr only accepts international cards and PayPal. This means Indian buyers pay 2-4% forex fees on every gig. HireHub360 supports UPI, Paytm, PhonePe, and NEFT.' },
      { q: 'Which platform pays freelancers faster?', a: 'HireHub360 releases payment within 3 days of delivery approval with instant UPI transfer. Fiverr holds funds for 14 days before sellers can withdraw — a major cash flow problem for Indian freelancers.' },
      { q: 'Is HireHub360 better than Fiverr for social media marketing in India?', a: 'Yes. HireHub360 has 15,000+ verified social media managers who understand Indian audiences, trending formats, and regional languages. This depth of India-specific expertise is hard to find on Fiverr.' },
    ],
  },
  'hirehub360-vs-naukri': {
    competitor: 'Naukri',
    category: 'Job Board',
    intent: 'hiring platform',
    meta_title: 'HireHub360 vs Naukri for Freelancers — Full Comparison 2025',
    meta_desc: 'HireHub360 vs Naukri compared for Indian businesses and freelancers. Job postings, freelance support, pricing, and features. Which platform wins in 2025?',
    h1: 'HireHub360 vs Naukri — Which Platform is Better for Indian Hiring in 2025?',
    intro: 'Naukri.com dominates Indian job postings for full-time employment. But the Indian workforce is shifting — 56% of new earners prefer gig or freelance work. HireHub360 was built for this shift. Naukri wasn\'t.',
    hirehub_tagline: 'Gig + freelance + full-time hiring. AI matching. ₹0 to post. India-first.',
    competitor_tagline: 'India\'s #1 job board. Full-time jobs only. ₹5,000-50,000/month plans.',
    verdict: 'For hiring freelancers, gig workers, and contract staff, HireHub360 is the clear choice. For recruiting senior full-time employees with structured HR workflows, Naukri\'s database depth still has an edge.',
    rows: [
      { feature: 'Freelance Hiring', hirehub: 'Core feature ✅', competitor: 'Not supported ❌', winner: 'hirehub' },
      { feature: 'Gig Workers', hirehub: '1.2L+ profiles ✅', competitor: 'Not available ❌', winner: 'hirehub' },
      { feature: 'Job Posting Cost', hirehub: 'Free (basic) / ₹499 featured', competitor: '₹5,000-50,000/month', winner: 'hirehub' },
      { feature: 'AI Matching', hirehub: 'HireHub Score + AI rank', competitor: 'Keyword matching only', winner: 'hirehub' },
      { feature: 'Full-time CV Database', hirehub: 'Growing (2L+ CVs)', competitor: '80M+ CVs', winner: 'competitor' },
      { feature: 'Campus Hiring', hirehub: 'Coming 2025', competitor: 'Naukri Campus ✅', winner: 'competitor' },
      { feature: 'Resume Shortlisting', hirehub: 'AI auto-shortlist', competitor: 'Manual filter tools', winner: 'hirehub' },
      { feature: 'Instant Hire (<4hr)', hirehub: 'InstantHire feature ✅', competitor: 'Not possible ❌', winner: 'hirehub' },
      { feature: 'WhatsApp Apply', hirehub: 'WhatsApp job alerts ✅', competitor: 'SMS only', winner: 'hirehub' },
    ],
    faqs: [
      { q: 'Can I hire freelancers on Naukri?', a: 'No. Naukri is a full-time job board and does not support freelance or gig hiring. If you need a graphic designer for 3 days or a data analyst for a 2-week project, HireHub360 is the right platform.' },
      { q: 'How much does it cost to post a job on HireHub360 vs Naukri?', a: 'HireHub360 offers free basic job posting. Featured listings cost ₹499/post. Naukri\'s plans start at ₹5,000/month and go up to ₹50,000/month for access to their CV database — a 10x cost difference.' },
      { q: 'Does HireHub360 have as many candidates as Naukri?', a: 'Not yet. Naukri has 80M+ registered CVs built over 25 years. For full-time senior hiring, their database depth is unmatched. But for freelancers, gig workers, and candidates who prefer platforms built for them, HireHub360 is growing fast.' },
      { q: 'Which platform fills positions faster?', a: 'HireHub360\'s InstantHire feature connects you with available freelancers within 4 hours. Naukri\'s average time-to-hire for full-time roles is 18-45 days. For urgent or project-based needs, HireHub360 wins.' },
      { q: 'Is HireHub360 good for startup hiring?', a: 'Yes. HireHub360\'s free posting + AI matching + gig/freelance support makes it ideal for startups who need flexible hiring without committing to expensive monthly plans. Many Indian startups use HireHub360 for their first 20 hires.' },
      { q: 'Can blue-collar workers find jobs on both platforms?', a: 'HireHub360 specifically supports blue-collar hiring: construction workers, delivery boys, security guards, housekeeping staff. Naukri is primarily white-collar and does not have strong blue-collar coverage.' },
    ],
  },
  'hirehub360-vs-linkedin': {
    competitor: 'LinkedIn',
    category: 'Professional Network',
    intent: 'professional hiring',
    meta_title: 'HireHub360 vs LinkedIn for Hiring in India — Full Comparison 2025',
    meta_desc: 'HireHub360 vs LinkedIn Jobs compared for Indian businesses. Cost, candidate quality, AI matching, and freelance support. Which platform is right for your team?',
    h1: 'HireHub360 vs LinkedIn for Hiring in India — Honest Comparison (2025)',
    intro: 'LinkedIn is the world\'s largest professional network, but its job products were designed for Fortune 500 companies. Indian SMEs, startups, and businesses needing gig workers pay premium prices for a platform not tuned for their needs. HireHub360 is different.',
    hirehub_tagline: 'India-first hiring. Freelance + full-time + gig. AI matching. No recruiter spam.',
    competitor_tagline: 'Global professional network. 1B+ members. Premium job ads. InMail credits.',
    verdict: 'For Indian SMEs and startups who need flexible, cost-effective hiring — especially freelance or gig roles — HireHub360 is purpose-built. LinkedIn remains superior for senior executive hiring and global reach.',
    rows: [
      { feature: 'Job Posting Cost', hirehub: '₹0-499/post', competitor: '$5-200/day (~₹400-16,000)', winner: 'hirehub' },
      { feature: 'Freelance Hiring', hirehub: 'Core feature ✅', competitor: 'Limited (Marketplace, new)', winner: 'hirehub' },
      { feature: 'InMail / Outreach', hirehub: 'Direct chat (free)', competitor: 'InMail credits (paid)', winner: 'hirehub' },
      { feature: 'Indian Candidate Pool', hirehub: 'India-optimized ✅', competitor: 'Global, less India-focused', winner: 'hirehub' },
      { feature: 'AI Matching', hirehub: 'HireHub Score algorithm', competitor: 'LinkedIn AI (basic)', winner: 'tie' },
      { feature: 'Professional Network', hirehub: 'Hiring only', competitor: '1B+ member network', winner: 'competitor' },
      { feature: 'Global Reach', hirehub: 'India, UAE, Singapore', competitor: '200+ countries', winner: 'competitor' },
      { feature: 'Executive Search', hirehub: 'Growing', competitor: 'Industry standard ✅', winner: 'competitor' },
      { feature: 'Recruiter Spam', hirehub: 'Minimal (intent-based)', competitor: 'High (InMail blasting)', winner: 'hirehub' },
    ],
    faqs: [
      { q: 'Is it cheaper to hire on HireHub360 vs LinkedIn?', a: 'Significantly cheaper. LinkedIn\'s paid job ads start at $5/day and effective packages run $50-200/day. HireHub360 has a free tier and featured posts at ₹499 flat. For a 30-day campaign, HireHub360 can save ₹1-5 lakhs.' },
      { q: 'Can I hire freelancers on LinkedIn?', a: 'LinkedIn launched LinkedIn Marketplace for freelancers, but it\'s early-stage and limited in India. HireHub360 has had freelance hiring as its core feature from day one, with 1.2L+ active profiles.' },
      { q: 'Which platform has better Indian candidates?', a: 'HireHub360\'s entire database is India-focused, with candidates who have updated profiles, verified skills, and local references. LinkedIn\'s 100M+ Indian users are mostly passive — they don\'t actively apply to jobs.' },
      { q: 'Does HireHub360 support recruiter workflows?', a: 'Yes. HireHub360 has recruiter dashboards, bulk job posting, applicant tracking, and AI shortlisting. It lacks LinkedIn\'s full-blown Recruiter product, but for teams under 50 people, HireHub360\'s tools are more than sufficient.' },
      { q: 'Which is better for hiring freshers in India?', a: 'HireHub360. Most fresh graduates can\'t afford LinkedIn Premium and don\'t have enough connections to be visible. HireHub360\'s search is skill-based, giving freshers equal visibility regardless of network size.' },
      { q: 'Can I replace LinkedIn with HireHub360 for all my hiring?', a: 'For freelance, gig, contract, and entry-to-mid level full-time hiring in India — yes, completely. For C-level, global, or highly specialized executive searches, LinkedIn still has an edge due to its network depth.' },
    ],
  },
}

const SKILLS_LINKS = [
  { label: 'Hire SEO Expert Mumbai', href: '/hire/seo-expert-mumbai' },
  { label: 'Hire Data Analyst Bangalore', href: '/hire/data-analyst-bangalore' },
  { label: 'Hire Web Developer Delhi', href: '/hire/web-developer-delhi' },
  { label: 'Hire Graphic Designer Pune', href: '/hire/graphic-designer-pune' },
]

export default function ComparePage({ data, slug }) {
  const [posted, setPosted] = useState(false)

  if (!data) return null

  const bg = '#0a0a0a'
  const card = '#141414'
  const border = '#2a2a2a'
  const orange = '#ff6b00'
  const green = '#22c55e'
  const red = '#ef4444'
  const muted = '#888'

  return (
    <>
      <Head>
        <title>{data.meta_title}</title>
        <meta name="description" content={data.meta_desc} />
        <meta property="og:title" content={data.meta_title} />
        <meta property="og:description" content={data.meta_desc} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://hirehub360.in/compare/${slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.faqs.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a }
          }))
        })}} />
      </Head>

      <div style={{ background: bg, minHeight: '100vh', color: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>

        {/* Nav */}
        <nav style={{ background: '#111', borderBottom: `1px solid ${border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ color: orange, fontWeight: 800, fontSize: 18, textDecoration: 'none' }}>HireHub360</a>
          <span style={{ color: border, fontSize: 20 }}>›</span>
          <span style={{ color: muted, fontSize: 14 }}>Compare</span>
          <span style={{ color: border, fontSize: 20 }}>›</span>
          <span style={{ color: '#ccc', fontSize: 14 }}>vs {data.competitor}</span>
        </nav>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px' }}>

          {/* Hero */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ background: '#1a1a1a', border: `1px solid ${border}`, borderRadius: 20, padding: '4px 12px', fontSize: 12, color: muted }}>{data.category}</span>
              <span style={{ background: '#1a1200', border: `1px solid #3a2800`, borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#ffa500' }}>Updated May 2025</span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>{data.h1}</h1>
            <p style={{ color: '#aaa', fontSize: 16, lineHeight: 1.7, maxWidth: 700 }}>{data.intro}</p>
          </div>

          {/* Platform Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }}>
            <div style={{ background: '#0d1a0d', border: `2px solid #1a3a1a`, borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, background: orange, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 16 }}>H</div>
                <span style={{ fontWeight: 700, fontSize: 16 }}>HireHub360</span>
                <span style={{ marginLeft: 'auto', background: '#1a3a1a', color: green, borderRadius: 12, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>RECOMMENDED</span>
              </div>
              <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.6 }}>{data.hirehub_tagline}</p>
            </div>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, background: '#2a2a2a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 14 }}>vs</div>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{data.competitor}</span>
              </div>
              <p style={{ color: '#666', fontSize: 13, lineHeight: 1.6 }}>{data.competitor_tagline}</p>
            </div>
          </div>

          {/* Comparison Table */}
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Feature-by-Feature Comparison</h2>
          <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${border}`, marginBottom: 48 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1a1a1a' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: muted, fontWeight: 600, fontSize: 13, width: '30%' }}>Feature</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: green, fontWeight: 600, fontSize: 13, width: '35%' }}>HireHub360</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: '#888', fontWeight: 600, fontSize: 13, width: '35%' }}>{data.competitor}</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${border}`, background: i % 2 === 0 ? 'transparent' : '#0d0d0d' }}>
                    <td style={{ padding: '13px 16px', fontSize: 14, color: '#ccc' }}>{row.feature}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13 }}>
                      <span style={{ color: row.winner === 'hirehub' ? green : row.winner === 'tie' ? '#fbbf24' : '#aaa' }}>{row.hirehub}</span>
                      {row.winner === 'hirehub' && <span style={{ marginLeft: 6, color: green, fontSize: 12 }}>✓</span>}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13 }}>
                      <span style={{ color: row.winner === 'competitor' ? '#fbbf24' : '#666' }}>{row.competitor}</span>
                      {row.winner === 'competitor' && <span style={{ marginLeft: 6, color: '#fbbf24', fontSize: 12 }}>✓</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Verdict */}
          <div style={{ background: '#0d1a0d', border: `1px solid #1a4a1a`, borderRadius: 12, padding: 24, marginBottom: 48 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 28 }}>🏆</span>
              <div>
                <div style={{ fontWeight: 700, color: green, marginBottom: 8 }}>Our Verdict</div>
                <p style={{ color: '#bbb', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{data.verdict}</p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
            {data.faqs.map((faq, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 15 }}>Q: {faq.q}</div>
                <div style={{ color: '#aaa', fontSize: 14, lineHeight: 1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>

          {/* Related links */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 48 }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>Find Freelancers on HireHub360</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {SKILLS_LINKS.map((l, i) => (
                <a key={i} href={l.href} style={{ background: '#1a1a1a', border: `1px solid ${border}`, borderRadius: 8, padding: '8px 14px', color: '#ccc', textDecoration: 'none', fontSize: 13 }}>{l.label}</a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: `linear-gradient(135deg, #1a0a00, #0d0d0d)`, border: `1px solid #3a1a00`, borderRadius: 16, padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🚀</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Try HireHub360 Free</h2>
            <p style={{ color: '#aaa', marginBottom: 24, fontSize: 15 }}>Post your first job free. Find freelancers in under 4 hours. No credit card required.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/hirehub.html" style={{ background: orange, color: '#fff', padding: '14px 32px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Post a Job Free →</a>
              <a href="/" style={{ background: '#1a1a1a', color: '#ccc', padding: '14px 32px', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: 15, border: `1px solid ${border}` }}>Browse Freelancers</a>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const data = COMPARISONS[params.slug] || null
  if (!data) return { notFound: true }
  return { props: { data, slug: params.slug } }
}

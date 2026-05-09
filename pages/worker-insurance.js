import Head from 'next/head'
import InterestForm from '../components/InterestForm'

const PLANS = [
  {
    name: 'Basic Shield',
    price: '₹149/month',
    cover: '₹2 Lakh',
    for: 'Individual worker',
    highlight: false,
    badge: null,
    includes: ['Accident cover ₹2L', 'Hospitalization ₹50K', 'Death benefit ₹2L'],
  },
  {
    name: 'Family Guard',
    price: '₹299/month',
    cover: '₹5 Lakh',
    for: 'Worker + spouse + 2 kids',
    highlight: true,
    badge: '⭐ Most Popular',
    includes: ['Accident cover ₹5L', 'Hospitalization ₹2L', 'Critical illness ₹1L', 'Death benefit ₹5L'],
  },
  {
    name: 'Blue Collar Pro',
    price: '₹199/month',
    cover: '₹3 Lakh',
    for: 'Blue collar / gig workers',
    highlight: false,
    badge: '🔵 Gig Worker Special',
    includes: ['On-site accident ₹3L', 'Tool loss cover ₹25K', 'Disability benefit', 'Emergency medical'],
  },
  {
    name: 'Employer Group',
    price: '₹99/employee',
    cover: '₹5 Lakh/employee',
    for: 'Employer buying for team',
    highlight: false,
    badge: '🏢 For Employers',
    includes: ['Bulk discount 40%', 'Centralized billing', 'Instant claim processing', 'Compliance certificate'],
  },
]

const STATS = [
  { val: '450M+', lbl: 'Workers in India' },
  { val: '90%', lbl: 'Without insurance' },
  { val: '48 hrs', lbl: 'Claim processing' },
  { val: '₹149', lbl: 'Starting price/month' },
]

const CLAIM_STEPS = [
  { num: '01', title: 'WhatsApp us', desc: 'Send "CLAIM" to our WhatsApp number with your policy ID and a brief description of the incident.' },
  { num: '02', title: '48-hour processing', desc: 'Our claims team reviews and approves your claim within 48 hours — no physical visits needed.' },
  { num: '03', title: 'Direct bank transfer', desc: 'Approved claim amount transferred directly to your registered bank account. No cheques, no delays.' },
]

export default function WorkerInsurance() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: 'HireHub360 Worker Insurance',
    description: 'Affordable insurance for every Indian worker — ₹149/month, full coverage, no medical test. White collar, blue collar, gig workers all covered.',
    provider: {
      '@type': 'Organization',
      name: 'HireHub360',
      url: 'https://hirehub360.in',
    },
    areaServed: 'IN',
    offers: PLANS.map(p => ({
      '@type': 'Offer',
      name: p.name,
      price: p.price,
      description: `Coverage: ${p.cover} | For: ${p.for} | Includes: ${p.includes.join(', ')}`,
    })),
  }

  return (
    <>
      <Head>
        <title>Affordable Insurance for Every Indian Worker — HireHub360</title>
        <meta name="description" content="₹149/month. Full coverage. No medical test. Group insurance for your entire workforce — white collar, blue collar, gig workers. HireHub360 Worker Insurance." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="canonical" href="https://hirehub360.in/worker-insurance" />
        <meta property="og:title" content="₹149/month Worker Insurance — HireHub360" />
        <meta property="og:description" content="Full coverage for every Indian worker. No medical test. Claim via WhatsApp in 48 hours." />
        <meta property="og:url" content="https://hirehub360.in/worker-insurance" />
        <meta property="og:type" content="website" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif;background:#f5f5f7;color:#1d1d1f}
        a{text-decoration:none;color:inherit}
        .nav{background:rgba(255,255,255,.92);backdrop-filter:blur(20px);border-bottom:1px solid #e5e5ea;padding:0 5vw;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
        .logo{font-weight:900;font-size:22px;letter-spacing:-.04em}.logo span{color:#ff6b00}
        .btn-back{background:#f5f5f7;color:#1d1d1f;padding:8px 18px;border-radius:999px;font-weight:600;font-size:13px;border:none;cursor:pointer;text-decoration:none}
        /* Hero */
        .hero{background:linear-gradient(135deg,#0f0f0f 0%,#001530 50%,#0a0a0f 100%);padding:72px 5vw 64px;text-align:center;color:#fff;position:relative;overflow:hidden}
        .hero::before{content:'';position:absolute;top:-40px;right:-60px;width:320px;height:320px;background:radial-gradient(circle,rgba(255,107,0,.20) 0%,transparent 70%);pointer-events:none}
        .hero::after{content:'';position:absolute;bottom:-30px;left:20px;width:220px;height:220px;background:radial-gradient(circle,rgba(255,107,0,.10) 0%,transparent 70%);pointer-events:none}
        .hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,107,0,.15);border:1px solid rgba(255,107,0,.3);border-radius:999px;padding:5px 16px;font-size:11px;font-weight:700;color:#ff6b00;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px}
        .hero h1{font-size:clamp(28px,5.5vw,56px);font-weight:900;letter-spacing:-.05em;margin-bottom:16px;line-height:1.08}
        .hero h1 span{color:#ff6b00}
        .hero-sub{font-size:15px;color:#bbb;max-width:500px;margin:0 auto 32px;line-height:1.7}
        .stats-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:36px}
        .stat-chip{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:14px 20px;text-align:center;min-width:130px}
        .stat-val{font-size:22px;font-weight:900;color:#ff6b00;letter-spacing:-.03em}
        .stat-lbl{font-size:11px;color:#888;margin-top:2px;font-weight:600;text-transform:uppercase;letter-spacing:.04em}
        .btn-cta{display:inline-block;background:#ff6b00;color:#fff;padding:16px 36px;border-radius:14px;font-weight:800;font-size:16px;letter-spacing:-.02em;transition:opacity .18s,transform .18s;border:none;cursor:pointer}
        .btn-cta:hover{opacity:.88;transform:translateY(-2px)}
        .cta-note{font-size:12px;color:#666;margin-top:10px}
        /* Plans */
        .plans-section{padding:56px 5vw;max-width:1200px;margin:0 auto}
        .sec-title{font-size:clamp(22px,3.5vw,34px);font-weight:900;letter-spacing:-.04em;margin-bottom:8px;text-align:center}
        .sec-sub{font-size:15px;color:#6e6e73;text-align:center;margin-bottom:40px;max-width:520px;margin-left:auto;margin-right:auto}
        .plans-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:18px}
        .plan-card{background:#fff;border-radius:22px;padding:28px 24px;border:2px solid #e5e5ea;position:relative;overflow:hidden;transition:box-shadow .2s}
        .plan-card.highlight{border-color:#ff6b00;box-shadow:0 8px 40px rgba(255,107,0,.15)}
        .plan-card:hover{box-shadow:0 8px 32px rgba(0,0,0,.08)}
        .plan-accent{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#ff6b00,#ff9500)}
        .plan-badge{position:absolute;top:-1px;right:20px;color:#fff;font-size:10px;font-weight:800;padding:5px 14px;border-radius:0 0 10px 10px;white-space:nowrap;background:#ff6b00}
        .plan-name{font-size:13px;font-weight:800;color:#6e6e73;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px}
        .plan-price{font-size:36px;font-weight:900;color:#1d1d1f;letter-spacing:-.05em;margin-bottom:2px}
        .plan-card.highlight .plan-price{color:#ff6b00}
        .plan-cover{font-size:13px;font-weight:700;color:#34c759;margin-bottom:2px}
        .plan-for{font-size:12px;color:#aaa;margin-bottom:18px}
        .plan-includes{list-style:none;margin-bottom:22px;display:flex;flex-direction:column;gap:8px}
        .plan-includes li{font-size:13px;color:#3d3d3f;display:flex;align-items:flex-start;gap:8px}
        .plan-includes li::before{content:'✅';flex-shrink:0;font-size:12px;margin-top:1px}
        .plan-cta{width:100%;padding:14px;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;border:none;transition:all .18s;letter-spacing:-.02em}
        .plan-cta.primary{background:#ff6b00;color:#fff}
        .plan-cta.primary:hover{opacity:.88}
        .plan-cta.secondary{background:#f5f5f7;color:#1d1d1f}
        .plan-cta.secondary:hover{background:#e5e5ea}
        /* Why matters */
        .why-section{background:#1d1d1f;padding:56px 5vw}
        .why-inner{max-width:1200px;margin:0 auto}
        .why-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;margin-top:40px}
        .why-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:24px 22px}
        .why-stat{font-size:36px;font-weight:900;color:#ff6b00;letter-spacing:-.05em;margin-bottom:6px}
        .why-title{font-size:15px;font-weight:700;color:#fff;margin-bottom:8px}
        .why-desc{font-size:13px;color:#888;line-height:1.65}
        /* Claim steps */
        .claim-section{padding:56px 5vw;max-width:1200px;margin:0 auto}
        .claim-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
        .claim-card{background:#fff;border-radius:20px;padding:28px 24px;border:1.5px solid #e5e5ea}
        .claim-num{font-size:13px;font-weight:800;color:#ff6b00;letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px}
        .claim-title{font-size:17px;font-weight:800;letter-spacing:-.03em;margin-bottom:8px;color:#1d1d1f}
        .claim-desc{font-size:14px;color:#6e6e73;line-height:1.6}
        /* CTA */
        .cta-section{background:linear-gradient(135deg,#1d1d1f 0%,#001530 100%);padding:56px 5vw;text-align:center}
        .cta-section h2{font-size:clamp(22px,3.5vw,38px);font-weight:900;color:#fff;letter-spacing:-.04em;margin-bottom:10px}
        .cta-section p{font-size:15px;color:#888;margin-bottom:28px;max-width:440px;margin-left:auto;margin-right:auto}
        .btn-cta-orange{display:inline-block;background:#ff6b00;color:#fff;padding:16px 40px;border-radius:14px;font-weight:800;font-size:16px;letter-spacing:-.02em;transition:opacity .18s,transform .18s}
        .btn-cta-orange:hover{opacity:.88;transform:translateY(-2px)}
        .disclaimer{background:#fff;border-top:1px solid #e5e5ea;padding:16px 5vw;font-size:11px;color:#aaa;text-align:center;line-height:1.7}
        footer{background:#1d1d1f;color:#555;padding:28px 5vw;text-align:center;font-size:12px}
        @media(max-width:640px){.stats-row{gap:8px}.stat-chip{min-width:calc(50% - 5px);flex:1 1 calc(50% - 5px)}.plans-grid,.why-grid,.claim-grid{grid-template-columns:1fr}}
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">Hire<span>Hub</span><sup style={{ fontSize: 12, fontWeight: 900, color: '#ff6b00' }}>360</sup></a>
        <a href="/" className="btn-back">← Back to App</a>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-badge">🛡️ Worker Insurance</div>
        <h1><span>₹149/month.</span><br />Full Coverage.<br />No Medical Test.</h1>
        <p className="hero-sub">Group insurance for your entire workforce — white collar, blue collar, gig workers. One platform for India's 450M+ workers.</p>

        <div className="stats-row">
          {STATS.map(s => (
            <div key={s.lbl} className="stat-chip">
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>

        <a href="/hirehub.html" className="btn-cta">Get Covered Today →</a>
        <div className="cta-note">Coming soon — register your interest now</div>
      </div>

      {/* PLANS */}
      <div className="plans-section">
        <h2 className="sec-title">Choose Your Coverage</h2>
        <p className="sec-sub">Plans for every type of worker — individual, family, blue collar, or employer buying for a team.</p>
        <div className="plans-grid">
          {PLANS.map(p => (
            <div key={p.name} className={`plan-card${p.highlight ? ' highlight' : ''}`}>
              {p.highlight && <div className="plan-accent" />}
              {p.badge && <div className="plan-badge">{p.badge}</div>}
              <div className="plan-name" style={{ marginTop: p.badge ? '18px' : '0' }}>{p.name}</div>
              <div className="plan-price">{p.price}</div>
              <div className="plan-cover">Coverage: {p.cover}</div>
              <div className="plan-for">{p.for}</div>
              <ul className="plan-includes">
                {p.includes.map(item => <li key={item}>{item}</li>)}
              </ul>
              <button
                className={`plan-cta ${p.highlight ? 'primary' : 'secondary'}`}
                onClick={() => { window.location.href = '/hirehub.html' }}
              >
                Get Covered →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* WHY IT MATTERS */}
      <div className="why-section">
        <div className="why-inner">
          <h2 className="sec-title" style={{ color: '#fff' }}>Why This Matters for India</h2>
          <p className="sec-sub" style={{ color: '#888' }}>India's workforce crisis: most workers have no financial protection at all.</p>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-stat">90%</div>
              <div className="why-title">Workers Have Zero Insurance</div>
              <div className="why-desc">India has 450M+ workers. 90% have no accident, health, or life coverage. One injury = family financial ruin.</div>
            </div>
            <div className="why-card">
              <div className="why-stat">ESIC</div>
              <div className="why-title">Covers Only Formal Sector</div>
              <div className="why-desc">ESIC only covers formal salaried employees. Gig workers, blue collar, and contractual staff are completely excluded.</div>
            </div>
            <div className="why-card">
              <div className="why-stat">3×</div>
              <div className="why-title">Better Talent Retention</div>
              <div className="why-desc">Employers who offer group insurance see 3× better talent retention. Insurance is the new salary increment for blue collar workers.</div>
            </div>
            <div className="why-card">
              <div className="why-stat">₹149</div>
              <div className="why-title">Less Than a Cup of Tea/Day</div>
              <div className="why-desc">Full accident and death coverage for less than ₹5/day. No reason for any Indian worker to go unprotected.</div>
            </div>
          </div>
        </div>
      </div>

      {/* CLAIM PROCESS */}
      <div className="claim-section">
        <h2 className="sec-title">Claim Process — 3 Simple Steps</h2>
        <p className="sec-sub">No hospitals, no paperwork, no running around. Claim from anywhere via WhatsApp.</p>
        <div className="claim-grid">
          {CLAIM_STEPS.map(s => (
            <div key={s.num} className="claim-card">
              <div className="claim-num">Step {s.num}</div>
              <div className="claim-title">{s.title}</div>
              <div className="claim-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <h2>Protect Every Worker Today</h2>
        <p>₹149/month*. Coverage starts immediately on activation.</p>
        <p style={{ fontSize: 11, color: '#888', marginTop: -8, marginBottom: 16 }}>*Premium varies by age, occupation, and coverage chosen.</p>
        <a href="/hirehub.html" className="btn-cta-orange">Get Covered Today →</a>
        <p style={{ fontSize: 12, color: '#555', margin: '12px 0 24px' }}>Coming soon — register below to be first in line</p>
        <InterestForm product="worker_insurance" productLabel="Worker Insurance" accent="#ff6b00" />
      </div>

      {/* DISCLAIMER */}
      <div className="disclaimer">
        <strong>Regulatory Disclosure:</strong> HireHub360 Insurance is offered in partnership with IRDAI-licensed insurers. All insurance products are subject to terms, conditions, and exclusions of the respective insurer. Please read the policy document carefully before purchasing. Premium amounts shown are indicative and may vary based on age, occupation, and coverage chosen.
      </div>

      <footer>
        © 2026 HireHub360 · hirehub360.in · Insurance queries: <a href="mailto:insurance@hirehub360.in" style={{ color: '#ff6b00' }}>insurance@hirehub360.in</a>
      </footer>
    </>
  )
}

export function getStaticProps() {
  return { props: {}, revalidate: 3600 }
}

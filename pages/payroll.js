import Head from 'next/head'

const FEATURES = [
  { icon: '💸', title: 'Auto Salary Processing', desc: 'Set it once. Runs every month without you lifting a finger. Supports all salary structures — fixed, variable, CTC.' },
  { icon: '🏛️', title: 'PF & ESI Filing', desc: 'Automated government compliance filings. Challan generation, ECR file upload, zero manual errors.' },
  { icon: '📊', title: 'TDS Calculation', desc: 'Form 16, challan generation, TDS deduction per IT slab — all automated. No CA required for payroll.' },
  { icon: '📄', title: 'Payslip Generation', desc: 'Professional PDF payslips emailed to every employee on payday. Branded with your company logo.' },
  { icon: '📅', title: 'Leave & Attendance', desc: 'Integrated leave tracking with payroll. Absences auto-deducted, overtime auto-added.' },
  { icon: '🔧', title: 'Contractor Payouts', desc: 'Daily, weekly or monthly payouts for gig workers and contractors. Supports UPI, bank transfer, and wallet.' },
]

const PLANS = [
  { name: 'Starter', employees: 'Up to 10', price: '₹999/month', highlight: false, badge: null, includes: 'Salary processing, payslips, basic reports' },
  { name: 'Growth', employees: 'Up to 50', price: '₹2,499/month', highlight: true, badge: '⭐ Most Popular', includes: 'Everything in Starter + PF/ESI filing, TDS calculation' },
  { name: 'Scale', employees: 'Up to 200', price: '₹5,999/month', highlight: false, badge: '🚀 Best Value', includes: 'Everything in Growth + HR integration, compliance suite' },
  { name: 'Enterprise', employees: 'Unlimited', price: 'Custom', highlight: false, badge: '🏆 For Large Teams', includes: 'Full suite + dedicated support + custom integrations' },
]

const WHO_ITS_FOR = [
  { icon: '🚀', label: 'Startups' },
  { icon: '🏢', label: 'SMEs' },
  { icon: '👷', label: 'Labour Contractors' },
  { icon: '🏭', label: 'Factories' },
  { icon: '🛒', label: 'Retail Chains' },
  { icon: '🏗️', label: 'Construction Firms' },
]

export default function Payroll() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: 'HireHub360 Payroll',
    description: 'One-click payroll automation for India — salary processing, PF/ESI filing, TDS calculation, payslips for 1 to 10,000 employees.',
    provider: {
      '@type': 'Organization',
      name: 'HireHub360',
      url: 'https://hirehub360.in',
    },
    areaServed: 'IN',
    offers: PLANS.map(p => ({
      '@type': 'Offer',
      name: `HireHub360 Payroll ${p.name}`,
      description: `${p.employees} employees — ${p.price} — ${p.includes}`,
    })),
  }

  return (
    <>
      <Head>
        <title>Payroll Made Simple for India's Growing Businesses — HireHub360</title>
        <meta name="description" content="One-click payroll for 1 to 10,000 employees. Automate salaries, PF, ESI, TDS — all from your HireHub360 dashboard. From ₹999/month." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="canonical" href="https://hirehub360.in/payroll" />
        <meta property="og:title" content="One-Click Payroll for India — HireHub360" />
        <meta property="og:description" content="Automate salaries, PF, ESI, TDS for 1 to 10,000 employees. Starting ₹999/month." />
        <meta property="og:url" content="https://hirehub360.in/payroll" />
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
        .hero{background:linear-gradient(135deg,#0f0f0f 0%,#001a08 50%,#0a0a0f 100%);padding:72px 5vw 64px;text-align:center;color:#fff;position:relative;overflow:hidden}
        .hero::before{content:'';position:absolute;top:-40px;right:-60px;width:320px;height:320px;background:radial-gradient(circle,rgba(255,107,0,.20) 0%,transparent 70%);pointer-events:none}
        .hero::after{content:'';position:absolute;bottom:-30px;left:20px;width:220px;height:220px;background:radial-gradient(circle,rgba(255,107,0,.10) 0%,transparent 70%);pointer-events:none}
        .hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,107,0,.15);border:1px solid rgba(255,107,0,.3);border-radius:999px;padding:5px 16px;font-size:11px;font-weight:700;color:#ff6b00;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px}
        .hero h1{font-size:clamp(28px,5.5vw,54px);font-weight:900;letter-spacing:-.05em;margin-bottom:16px;line-height:1.1}
        .hero h1 span{color:#ff6b00}
        .hero-sub{font-size:15px;color:#bbb;max-width:520px;margin:0 auto 32px;line-height:1.7}
        .hero-trust{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;font-size:12px;color:#666;margin-bottom:36px}
        .hero-trust span{display:flex;align-items:center;gap:5px}
        .btn-cta{display:inline-block;background:#ff6b00;color:#fff;padding:16px 36px;border-radius:14px;font-weight:800;font-size:16px;letter-spacing:-.02em;transition:opacity .18s,transform .18s;border:none;cursor:pointer}
        .btn-cta:hover{opacity:.88;transform:translateY(-2px)}
        .cta-note{font-size:12px;color:#666;margin-top:10px}
        /* Sections */
        .section{padding:56px 5vw;max-width:1200px;margin:0 auto}
        .sec-title{font-size:clamp(22px,3.5vw,34px);font-weight:900;letter-spacing:-.04em;margin-bottom:8px;text-align:center}
        .sec-sub{font-size:15px;color:#6e6e73;text-align:center;margin-bottom:40px;max-width:520px;margin-left:auto;margin-right:auto}
        /* Features grid */
        .feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px}
        .feat-card{background:#fff;border-radius:20px;padding:28px 24px;border:1.5px solid #e5e5ea;transition:box-shadow .2s}
        .feat-card:hover{box-shadow:0 8px 32px rgba(0,0,0,.08)}
        .feat-icon{font-size:32px;margin-bottom:14px}
        .feat-title{font-size:17px;font-weight:800;letter-spacing:-.03em;margin-bottom:8px;color:#1d1d1f}
        .feat-desc{font-size:13px;color:#6e6e73;line-height:1.65}
        /* Pricing */
        .pricing-section{background:#fff;padding:56px 5vw}
        .plans-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;max-width:1200px;margin:0 auto}
        .plan-card{background:#f5f5f7;border-radius:20px;padding:28px 24px;border:2px solid #e5e5ea;position:relative;overflow:hidden}
        .plan-card.highlight{background:#fff;border-color:#ff6b00;box-shadow:0 8px 40px rgba(255,107,0,.15)}
        .plan-accent{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#ff6b00,#ff9500)}
        .plan-badge{position:absolute;top:-1px;right:20px;background:#ff6b00;color:#fff;font-size:10px;font-weight:800;padding:5px 14px;border-radius:0 0 10px 10px;white-space:nowrap}
        .plan-name{font-size:13px;font-weight:800;color:#6e6e73;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
        .plan-employees{font-size:12px;color:#aaa;margin-bottom:4px}
        .plan-price{font-size:32px;font-weight:900;color:#1d1d1f;letter-spacing:-.05em;margin-bottom:4px}
        .plan-card.highlight .plan-price{color:#ff6b00}
        .plan-includes{font-size:13px;color:#6e6e73;margin-bottom:20px;line-height:1.55}
        .plan-cta{width:100%;padding:13px;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;border:none;transition:all .18s;letter-spacing:-.02em}
        .plan-cta.primary{background:#ff6b00;color:#fff}
        .plan-cta.primary:hover{opacity:.88}
        .plan-cta.secondary{background:#e5e5ea;color:#1d1d1f}
        .plan-cta.secondary:hover{background:#d5d5d8}
        /* Who it's for */
        .who-section{padding:56px 5vw;max-width:1200px;margin:0 auto;text-align:center}
        .who-chips{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:28px}
        .who-chip{background:#fff;border:1.5px solid #e5e5ea;border-radius:14px;padding:14px 22px;font-size:15px;font-weight:700;color:#1d1d1f;display:flex;align-items:center;gap:8px}
        /* CTA Banner */
        .cta-banner{background:linear-gradient(135deg,#1d1d1f 0%,#2c1a00 100%);padding:56px 5vw;text-align:center}
        .cta-banner h2{font-size:clamp(22px,3.5vw,36px);font-weight:900;color:#fff;letter-spacing:-.04em;margin-bottom:12px}
        .cta-banner p{font-size:15px;color:#888;margin-bottom:28px}
        .btn-cta-orange{display:inline-block;background:#ff6b00;color:#fff;padding:16px 40px;border-radius:14px;font-weight:800;font-size:16px;letter-spacing:-.02em;transition:opacity .18s,transform .18s}
        .btn-cta-orange:hover{opacity:.88;transform:translateY(-2px)}
        footer{background:#1d1d1f;color:#555;padding:28px 5vw;text-align:center;font-size:12px}
        @media(max-width:640px){.feat-grid,.plans-grid{grid-template-columns:1fr}.who-chips{gap:8px}}
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">Hire<span>Hub</span><sup style={{ fontSize: 12, fontWeight: 900, color: '#ff6b00' }}>360</sup></a>
        <a href="/" className="btn-back">← Back to App</a>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-badge">💼 Payroll Automation</div>
        <h1>One-Click Payroll for<br /><span>1 to 10,000 Employees</span></h1>
        <p className="hero-sub">Automate salaries, PF, ESI, TDS — all from your HireHub360 dashboard. Set it once, never worry again.</p>
        <div className="hero-trust">
          <span>✅ PF & ESI compliant</span>
          <span>✅ TDS auto-calculated</span>
          <span>✅ First 3 months free</span>
          <span>✅ No setup fees</span>
        </div>
        <a href="/hirehub.html" className="btn-cta">Start Free Trial — 3 Months Free →</a>
        <div className="cta-note">No credit card required · Cancel anytime</div>
      </div>

      {/* FEATURES */}
      <div className="section">
        <h2 className="sec-title">Everything Payroll, Automated</h2>
        <p className="sec-sub">From salary transfers to government filings — one platform handles it all.</p>
        <div className="feat-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feat-card">
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div className="pricing-section">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 className="sec-title">Transparent Pricing</h2>
          <p className="sec-sub">Starts at ₹999/month. No hidden fees. No per-transaction charges. First 3 months free.</p>
          <div className="plans-grid">
            {PLANS.map(p => (
              <div key={p.name} className={`plan-card${p.highlight ? ' highlight' : ''}`}>
                {p.highlight && <div className="plan-accent" />}
                {p.badge && <div className="plan-badge">{p.badge}</div>}
                <div className="plan-name" style={{ marginTop: p.badge ? '18px' : '0' }}>{p.name}</div>
                <div className="plan-employees">{p.employees}</div>
                <div className="plan-price">{p.price}</div>
                <div className="plan-includes">{p.includes}</div>
                <button
                  className={`plan-cta ${p.highlight ? 'primary' : 'secondary'}`}
                  onClick={() => { window.location.href = '/hirehub.html' }}
                >
                  {p.price === 'Custom' ? 'Talk to Sales →' : 'Start Free Trial →'}
                </button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 16 }}>
            All plans include first 3 months free. Cancel anytime. Prices exclusive of GST.
          </p>
        </div>
      </div>

      {/* WHO IT'S FOR */}
      <div className="who-section">
        <h2 className="sec-title">Built for India's Businesses</h2>
        <p className="sec-sub">Whether you have 5 workers or 5,000, HireHub360 Payroll scales with you.</p>
        <div className="who-chips">
          {WHO_ITS_FOR.map(w => (
            <div key={w.label} className="who-chip">
              <span>{w.icon}</span>
              <span>{w.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA BANNER */}
      <div className="cta-banner">
        <h2>Ready to Automate Payroll?</h2>
        <p>Join thousands of Indian businesses running payroll on autopilot.</p>
        <a href="/hirehub.html" className="btn-cta-orange">Start Free Trial — First 3 Months Free →</a>
        <p style={{ fontSize: 12, color: '#555', marginTop: 12 }}>No credit card required · Setup in 15 minutes</p>
      </div>

      <footer>
        © 2026 HireHub360 · hirehub360.in · Payroll queries: <a href="mailto:payroll@hirehub360.in" style={{ color: '#ff6b00' }}>payroll@hirehub360.in</a>
      </footer>
    </>
  )
}

export function getStaticProps() {
  return { props: {}, revalidate: 3600 }
}

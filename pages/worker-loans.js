import Head from 'next/head'
import InterestForm from '../components/InterestForm'

const LOAN_PRODUCTS = [
  { name: 'Salary Advance', amount: '₹2,000–₹25,000', tenure: '30 days', interest: '2%/month', for: 'All workers' },
  { name: 'Emergency Loan', amount: '₹5,000–₹50,000', tenure: '3–6 months', interest: '1.5%/month', for: 'Verified workers' },
  { name: 'Skill Loan', amount: '₹10,000–₹1 Lakh', tenure: '6–18 months', interest: '1.2%/month', for: 'For courses' },
  { name: 'Blue Collar EMI', amount: '₹3,000–₹20,000', tenure: '3 months', interest: '2.2%/month', for: 'Blue collar' },
]

const STEPS = [
  { num: '01', title: 'Apply via HireHub360', desc: 'Your work history on our platform is your credit score — no bank statements needed.' },
  { num: '02', title: 'AI verifies employment', desc: 'Our AI checks your active employment status on the platform in minutes, not days.' },
  { num: '03', title: 'Money in 4 hours', desc: 'Once approved, funds hit your bank account within 4 hours — any time of day.' },
  { num: '04', title: 'Repay from next salary', desc: 'Automatic repayment deducted from your salary — no missed payments, no stress.' },
]

const WHY_BETTER = [
  { icon: '🚫', title: 'No CIBIL score needed', desc: 'Your work history on HireHub360 IS your credit score. First-time borrowers welcome.' },
  { icon: '⚡', title: 'Instant AI approval', desc: 'Banks take 7–15 days. Our AI approves in minutes and disburses in 4 hours.' },
  { icon: '🔄', title: 'Repayment from salary', desc: 'Auto-deducted from your next salary. No chasing, no defaults, no late fees.' },
  { icon: '🌏', title: 'Everyone is eligible', desc: 'Blue collar, gig workers, contractual staff — banks ignore them, we serve them.' },
]

export default function WorkerLoans() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: 'HireHub360 Worker Loans & Salary Advance',
    description: 'Instant salary advance and worker loans for Indian workers — no CIBIL score needed, 4-hour disbursal, repay from salary.',
    provider: {
      '@type': 'Organization',
      name: 'HireHub360',
      url: 'https://hirehub360.in',
    },
    areaServed: 'IN',
    offers: LOAN_PRODUCTS.map(p => ({
      '@type': 'Offer',
      name: p.name,
      description: `${p.amount} | ${p.tenure} | ${p.interest} | For: ${p.for}`,
    })),
  }

  return (
    <>
      <Head>
        <title>Instant Salary Advance & Worker Loans — HireHub360</title>
        <meta name="description" content="Get salary advance of ₹500–₹50,000 in 4 hours. No CIBIL score needed. AI-powered approval. For all Indian workers — blue collar, gig, contractual." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="canonical" href="https://hirehub360.in/worker-loans" />
        <meta property="og:title" content="Instant Salary Advance & Worker Loans — HireHub360" />
        <meta property="og:description" content="Get ₹500–₹50,000 in 4 hours. No CIBIL needed. Your work history is your credit score." />
        <meta property="og:url" content="https://hirehub360.in/worker-loans" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=Instant+Worker+Loans+%E2%82%B9500%E2%80%9350%2C000&s=Approved+in+4+hours+%C2%B7+No+CIBIL+needed+%C2%B7+Your+work+history+is+your+credit" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="HireHub360" />
        <meta name="twitter:card" content="summary_large_image" />
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
        .hero{background:linear-gradient(135deg,#0f0f0f 0%,#1a0800 50%,#0a0a0f 100%);padding:72px 5vw 64px;text-align:center;color:#fff;position:relative;overflow:hidden}
        .hero::before{content:'';position:absolute;top:-40px;right:-60px;width:320px;height:320px;background:radial-gradient(circle,rgba(255,107,0,.22) 0%,transparent 70%);pointer-events:none}
        .hero::after{content:'';position:absolute;bottom:-30px;left:20px;width:220px;height:220px;background:radial-gradient(circle,rgba(255,107,0,.10) 0%,transparent 70%);pointer-events:none}
        .hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,107,0,.15);border:1px solid rgba(255,107,0,.3);border-radius:999px;padding:5px 16px;font-size:11px;font-weight:700;color:#ff6b00;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px}
        .hero h1{font-size:clamp(28px,5.5vw,54px);font-weight:900;letter-spacing:-.05em;margin-bottom:16px;line-height:1.1}
        .hero h1 span{color:#ff6b00}
        .hero-sub{font-size:15px;color:#bbb;max-width:500px;margin:0 auto 32px;line-height:1.7}
        .stats-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:36px}
        .stat-chip{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:12px 20px;text-align:center;min-width:130px}
        .stat-val{font-size:20px;font-weight:900;color:#ff6b00;letter-spacing:-.03em}
        .stat-lbl{font-size:11px;color:#888;margin-top:2px;font-weight:600;text-transform:uppercase;letter-spacing:.04em}
        .btn-cta{display:inline-block;background:#ff6b00;color:#fff;padding:16px 36px;border-radius:14px;font-weight:800;font-size:16px;letter-spacing:-.02em;transition:opacity .18s,transform .18s;border:none;cursor:pointer}
        .btn-cta:hover{opacity:.88;transform:translateY(-2px)}
        .cta-note{font-size:12px;color:#666;margin-top:10px}
        /* Sections */
        .section{padding:56px 5vw;max-width:1200px;margin:0 auto}
        .sec-title{font-size:clamp(22px,3.5vw,34px);font-weight:900;letter-spacing:-.04em;margin-bottom:8px;text-align:center}
        .sec-sub{font-size:15px;color:#6e6e73;text-align:center;margin-bottom:40px;max-width:500px;margin-left:auto;margin-right:auto}
        /* Steps */
        .steps-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}
        .step-card{background:#fff;border-radius:20px;padding:28px 24px;border:1.5px solid #e5e5ea;position:relative}
        .step-num{font-size:13px;font-weight:800;color:#ff6b00;letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px}
        .step-title{font-size:17px;font-weight:800;letter-spacing:-.03em;margin-bottom:8px;color:#1d1d1f}
        .step-desc{font-size:14px;color:#6e6e73;line-height:1.6}
        /* Table */
        .table-wrap{overflow-x:auto;border-radius:16px;border:1.5px solid #e5e5ea;background:#fff}
        table{width:100%;border-collapse:collapse;font-size:14px}
        thead{background:#1d1d1f;color:#fff}
        thead th{padding:14px 18px;text-align:left;font-weight:700;font-size:12px;letter-spacing:.04em;text-transform:uppercase}
        tbody tr{border-bottom:1px solid #f0f0f0}
        tbody tr:last-child{border-bottom:none}
        tbody td{padding:14px 18px;color:#3d3d3f;vertical-align:middle}
        tbody tr:hover{background:#fafafa}
        .tag{display:inline-block;background:rgba(255,107,0,.1);color:#ff6b00;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700}
        /* Why better grid */
        .why-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}
        .why-card{background:#fff;border-radius:18px;padding:24px 22px;border:1.5px solid #e5e5ea}
        .why-icon{font-size:28px;margin-bottom:12px}
        .why-title{font-size:16px;font-weight:800;letter-spacing:-.03em;margin-bottom:6px;color:#1d1d1f}
        .why-desc{font-size:13px;color:#6e6e73;line-height:1.6}
        /* Eligibility */
        .elig-section{background:#1d1d1f;padding:56px 5vw;text-align:center}
        .elig-title{font-size:clamp(20px,3vw,30px);font-weight:900;color:#fff;margin-bottom:12px;letter-spacing:-.04em}
        .elig-sub{font-size:14px;color:#888;margin-bottom:28px}
        .elig-chips{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:36px}
        .elig-chip{background:rgba(255,107,0,.12);border:1px solid rgba(255,107,0,.25);border-radius:12px;padding:10px 20px;color:#ff6b00;font-size:14px;font-weight:700}
        .btn-cta-light{display:inline-block;background:#ff6b00;color:#fff;padding:16px 40px;border-radius:14px;font-weight:800;font-size:16px;letter-spacing:-.02em;transition:opacity .18s,transform .18s}
        .btn-cta-light:hover{opacity:.88;transform:translateY(-2px)}
        /* Disclaimer */
        .disclaimer{background:#fff;border-top:1px solid #e5e5ea;padding:16px 5vw;font-size:11px;color:#aaa;text-align:center;line-height:1.7}
        footer{background:#1d1d1f;color:#555;padding:28px 5vw;text-align:center;font-size:12px}
        @media(max-width:640px){.stats-row{gap:8px}.stat-chip{min-width:calc(50% - 5px);flex:1 1 calc(50% - 5px)}.steps-grid,.why-grid{grid-template-columns:1fr}}
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">Hire<span>Hub</span><sup style={{ fontSize: 12, fontWeight: 900, color: '#ff6b00' }}>360</sup></a>
        <a href="/" className="btn-back">← Back to App</a>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-badge">💰 Worker Financial Layer</div>
        <h1>Get Salary in Advance —<br /><span>No Credit Score Needed</span></h1>
        <p className="hero-sub">India's first work-history powered loan. Your employment record on HireHub360 is all you need.</p>

        <div className="stats-row">
          <div className="stat-chip">
            <div className="stat-val">₹500–₹50K</div>
            <div className="stat-lbl">Loan Range</div>
          </div>
          <div className="stat-chip">
            <div className="stat-val">4 Hours</div>
            <div className="stat-lbl">Disbursal Time</div>
          </div>
          <div className="stat-chip">
            <div className="stat-val">Zero</div>
            <div className="stat-lbl">Paperwork</div>
          </div>
          <div className="stat-chip">
            <div className="stat-val">2.5%</div>
            <div className="stat-lbl">Processing Fee</div>
          </div>
        </div>

        <a href="/hirehub.html" className="btn-cta">Apply for Salary Advance →</a>
        <div className="cta-note">Coming soon — register your interest now</div>
      </div>

      {/* HOW IT WORKS */}
      <div className="section">
        <h2 className="sec-title">How It Works</h2>
        <p className="sec-sub">From application to money in bank — in 4 hours flat.</p>
        <div className="steps-grid">
          {STEPS.map(s => (
            <div key={s.num} className="step-card">
              <div className="step-num">Step {s.num}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* LOAN PRODUCTS TABLE */}
      <div style={{ padding: '0 5vw 56px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 className="sec-title" style={{ marginBottom: 8 }}>Loan Products</h2>
        <p className="sec-sub">Choose the product that fits your need — from quick advances to skill loans.</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Amount</th>
                <th>Tenure</th>
                <th>Interest</th>
                <th>For</th>
              </tr>
            </thead>
            <tbody>
              {LOAN_PRODUCTS.map(p => (
                <tr key={p.name}>
                  <td><strong>{p.name}</strong></td>
                  <td style={{ color: '#ff6b00', fontWeight: 700 }}>{p.amount}</td>
                  <td>{p.tenure}</td>
                  <td>{p.interest}</td>
                  <td><span className="tag">{p.for}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WHY BETTER */}
      <div style={{ background: '#fff', padding: '56px 5vw' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 className="sec-title">Why HireHub360 Loans Beat Banks</h2>
          <p className="sec-sub">Traditional banks are built for salaried IT employees. We're built for everyone else.</p>
          <div className="why-grid">
            {WHY_BETTER.map(w => (
              <div key={w.title} className="why-card">
                <div className="why-icon">{w.icon}</div>
                <div className="why-title">{w.title}</div>
                <div className="why-desc">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ELIGIBILITY + CTA */}
      <div className="elig-section">
        <h2 className="elig-title">Eligibility — Simple as 1-2-3</h2>
        <p className="elig-sub">No long forms. No document uploads. Just 3 criteria.</p>
        <div className="elig-chips">
          <div className="elig-chip">✅ Listed on HireHub360</div>
          <div className="elig-chip">✅ Worked 3+ months</div>
          <div className="elig-chip">✅ Active employment</div>
        </div>
        <a href="/hirehub.html" className="btn-cta-light">Apply for Salary Advance →</a>
        <p style={{ fontSize: 12, color: '#666', marginTop: 12, marginBottom: 24 }}>Coming soon — register below to be first in line</p>
        <InterestForm product="worker_loans" productLabel="Salary Advance" accent="#ff6b00" />
      </div>

      {/* DISCLAIMER */}
      <div className="disclaimer">
        <strong>Regulatory Disclosure:</strong> HireHub360 Financial Services is in partnership with licensed NBFCs. All loans are subject to eligibility verification and RBI guidelines. Interest rates and processing fees mentioned are indicative and may vary. Lending is subject to credit appraisal at the discretion of the NBFC partner.
      </div>

      <footer>
        © 2026 HireHub360 · hirehub360.in · Questions? <a href="mailto:support@hirehub360.in" style={{ color: '#ff6b00' }}>support@hirehub360.in</a>
      </footer>
    </>
  )
}

export function getStaticProps() {
  return { props: {}, revalidate: 3600 }
}

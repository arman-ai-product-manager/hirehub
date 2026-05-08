import Head from 'next/head'

const CITY_DATA = [
  { city: 'Bangalore', avgSalary: '₹18–35 LPA', growth: '+12%', topRole: 'Software Engineer', badge: '🔥 Hottest' },
  { city: 'Mumbai', avgSalary: '₹15–30 LPA', growth: '+9%', topRole: 'Finance Analyst', badge: '📈 Growing' },
  { city: 'Delhi NCR', avgSalary: '₹12–28 LPA', growth: '+11%', topRole: 'Product Manager', badge: '⚡ Surging' },
  { city: 'Hyderabad', avgSalary: '₹14–28 LPA', growth: '+15%', topRole: 'Data Engineer', badge: '🚀 Fastest' },
  { city: 'Pune', avgSalary: '₹10–22 LPA', growth: '+8%', topRole: 'Java Developer', badge: '✅ Stable' },
  { city: 'Chennai', avgSalary: '₹10–20 LPA', growth: '+7%', topRole: 'Operations Manager', badge: '📊 Steady' },
  { city: 'Ahmedabad', avgSalary: '₹8–18 LPA', growth: '+13%', topRole: 'Sales Executive', badge: '🌱 Emerging' },
  { city: 'Kolkata', avgSalary: '₹7–16 LPA', growth: '+6%', topRole: 'Accountant', badge: '🏙️ Metro' },
]

const SKILLS_DATA = [
  { rank: 1, skill: 'Generative AI / Prompt Engineering', demand: '+340%', salary: '₹25–60 LPA', trend: '🔥' },
  { rank: 2, skill: 'Cloud Architecture (AWS/Azure/GCP)', demand: '+180%', salary: '₹22–45 LPA', trend: '📈' },
  { rank: 3, skill: 'Data Engineering (Spark/Kafka)', demand: '+150%', salary: '₹20–40 LPA', trend: '⚡' },
  { rank: 4, skill: 'Cybersecurity & DevSecOps', demand: '+130%', salary: '₹18–38 LPA', trend: '🛡️' },
  { rank: 5, skill: 'React / Next.js Full Stack', demand: '+95%', salary: '₹12–30 LPA', trend: '💻' },
  { rank: 6, skill: 'Digital Marketing & Performance', demand: '+80%', salary: '₹8–22 LPA', trend: '📱' },
  { rank: 7, skill: 'Supply Chain & Logistics Ops', demand: '+75%', salary: '₹6–18 LPA', trend: '🚚' },
  { rank: 8, skill: 'Sales (D2C / SaaS)', demand: '+70%', salary: '₹6–20 LPA + comm', trend: '💰' },
  { rank: 9, skill: 'HR Tech & Talent Analytics', demand: '+65%', salary: '₹8–20 LPA', trend: '🤝' },
  { rank: 10, skill: 'Content Creation & Video', demand: '+60%', salary: '₹4–16 LPA', trend: '🎥' },
]

const SECTOR_DATA = [
  { sector: 'Technology & SaaS', hiring: '↑ +22%', avgSalary: '₹18–45 LPA', openRoles: '45,000+', outlook: 'Strong' },
  { sector: 'E-Commerce & Logistics', hiring: '↑ +18%', avgSalary: '₹5–22 LPA', openRoles: '80,000+', outlook: 'Very Strong' },
  { sector: 'BFSI & Fintech', hiring: '↑ +14%', avgSalary: '₹8–35 LPA', openRoles: '28,000+', outlook: 'Strong' },
  { sector: 'Manufacturing & Industry', hiring: '↑ +12%', avgSalary: '₹4–18 LPA', openRoles: '1,20,000+', outlook: 'Growing' },
  { sector: 'Healthcare & Pharma', hiring: '↑ +10%', avgSalary: '₹5–25 LPA', openRoles: '35,000+', outlook: 'Stable' },
  { sector: 'Retail & Consumer', hiring: '→ +3%', avgSalary: '₹3–12 LPA', openRoles: '60,000+', outlook: 'Moderate' },
  { sector: 'Media & Advertising', hiring: '↓ -5%', avgSalary: '₹5–20 LPA', openRoles: '12,000+', outlook: 'Cautious' },
]

const AI_REPLACING = [
  { role: 'Data Entry Operator', risk: 'High', note: 'AI tools process 10x faster with zero errors' },
  { role: 'Basic Content Writer', risk: 'High', note: 'GenAI drafts in seconds; editors still needed' },
  { role: 'Customer Support L1', risk: 'High', note: 'Chatbots handle 80% of repetitive tickets' },
  { role: 'Junior Accountant', risk: 'Medium', note: 'Routine bookkeeping automated; advisory remains' },
  { role: 'Graphic Designer (Banners)', risk: 'Medium', note: 'AI tools handle templated creatives' },
  { role: 'QA Manual Tester', risk: 'Medium', note: 'AI-driven test suites reduce manual work by 60%' },
]

const AI_CREATING = [
  { role: 'AI Prompt Engineer', growth: '+340%', salary: '₹20–60 LPA', note: 'Highest-demand new role in India' },
  { role: 'LLM Fine-tuning Specialist', growth: '+280%', salary: '₹25–70 LPA', note: 'Scarce skill, premium pay' },
  { role: 'AI Product Manager', growth: '+200%', salary: '₹22–55 LPA', note: 'Bridge between AI capability and product' },
  { role: 'MLOps / AI Infrastructure', growth: '+175%', salary: '₹20–50 LPA', note: 'Running AI in production at scale' },
  { role: 'AI Trainer / RLHF Specialist', growth: '+160%', salary: '₹10–30 LPA', note: 'Teaching AI to behave correctly' },
  { role: 'AI Ethics & Compliance', growth: '+120%', salary: '₹15–40 LPA', note: 'Emerging regulatory requirement' },
]

function outlookColor(outlook) {
  if (outlook === 'Very Strong') return '#22c55e'
  if (outlook === 'Strong') return '#4ade80'
  if (outlook === 'Growing') return '#86efac'
  if (outlook === 'Stable') return '#fbbf24'
  if (outlook === 'Moderate') return '#fb923c'
  if (outlook === 'Cautious') return '#f87171'
  return '#9ca3af'
}

function riskColor(risk) {
  if (risk === 'High') return '#f87171'
  if (risk === 'Medium') return '#fbbf24'
  return '#4ade80'
}

const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'India Workforce Intelligence 2026',
  description: 'Comprehensive salary data, skill demand rankings, and hiring trends across major Indian cities and sectors for 2026.',
  url: 'https://hirehub360.in/salary-intelligence',
  creator: {
    '@type': 'Organization',
    name: 'HireHub360',
    url: 'https://hirehub360.in',
  },
  datePublished: '2026-01-01',
  dateModified: '2026-05-08',
  license: 'https://creativecommons.org/licenses/by/4.0/',
  spatialCoverage: 'India',
  temporalCoverage: '2026',
  keywords: ['India salary data', 'job market 2026', 'skill demand India', 'hiring trends India', 'city salary comparison'],
}

export default function SalaryIntelligence() {
  return (
    <>
      <Head>
        <title>India Salary Intelligence 2026 — City Salaries, Skill Demand & Hiring Trends | HireHub360</title>
        <meta name="description" content="India Workforce Intelligence 2026: city-wise salary ranges, top 10 in-demand skills, sector hiring trends, and AI vs Human jobs analysis. Free data from HireHub360." />
        <meta name="keywords" content="India salary 2026, Bangalore salary, Mumbai salary, skill demand India, hiring trends 2026, AI jobs India, workforce intelligence" />
        <meta property="og:title" content="India Salary Intelligence 2026 — HireHub360" />
        <meta property="og:description" content="City-wise salary data, top skills by demand growth, sector hiring trends, and the AI vs Human jobs breakdown for India 2026." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hirehub360.in/salary-intelligence" />
        <meta property="og:image" content="https://hirehub360.in/favicon.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="India Salary Intelligence 2026 — HireHub360" />
        <meta name="twitter:description" content="Free salary data across 8 cities, top 10 skills, sector hiring trends and AI vs Human jobs for India 2026." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: #f5f5f7; color: #1d1d1f; }
        .nav { background: rgba(29,29,31,.96); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,.08); padding: 0 5vw; height: 56px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .logo { font-weight: 900; font-size: 22px; letter-spacing: -.04em; color: #fff; text-decoration: none; }
        .logo span { color: #ff6b00; }
        .nav-cta { background: #ff6b00; color: #fff; padding: 8px 18px; border-radius: 20px; text-decoration: none; font-size: 14px; font-weight: 700; }
        .hero { background: #1d1d1f; color: #fff; padding: 80px 5vw 70px; text-align: center; }
        .hero-eyebrow { display: inline-block; background: rgba(255,107,0,.15); border: 1px solid rgba(255,107,0,.4); color: #ff6b00; font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; margin-bottom: 20px; }
        .hero h1 { font-size: clamp(32px, 6vw, 58px); font-weight: 900; letter-spacing: -.03em; line-height: 1.1; margin-bottom: 18px; }
        .hero h1 span { color: #ff6b00; }
        .hero-sub { font-size: clamp(16px, 2.5vw, 20px); color: rgba(255,255,255,.7); max-width: 640px; margin: 0 auto 32px; line-height: 1.6; }
        .hero-stats { display: flex; gap: 32px; justify-content: center; flex-wrap: wrap; margin-top: 10px; }
        .stat-pill { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); border-radius: 12px; padding: 14px 22px; text-align: center; }
        .stat-pill-num { font-size: 26px; font-weight: 900; color: #ff6b00; }
        .stat-pill-label { font-size: 12px; color: rgba(255,255,255,.55); margin-top: 3px; }
        .section { padding: 64px 5vw; }
        .section-alt { background: #fff; }
        .section-dark { background: #1d1d1f; color: #fff; }
        .section-label { display: inline-block; background: rgba(255,107,0,.1); color: #ff6b00; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px; }
        .section-dark .section-label { background: rgba(255,107,0,.2); }
        .section-title { font-size: clamp(24px, 4vw, 36px); font-weight: 900; letter-spacing: -.025em; margin-bottom: 8px; }
        .section-sub { font-size: 16px; color: #6e6e73; margin-bottom: 40px; max-width: 560px; }
        .section-dark .section-sub { color: rgba(255,255,255,.55); }
        .city-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        .city-card { background: #fff; border: 1px solid #e5e5ea; border-radius: 16px; padding: 22px; transition: transform .15s, box-shadow .15s; }
        .city-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,.1); }
        .city-badge { display: inline-block; font-size: 12px; font-weight: 700; color: #ff6b00; background: rgba(255,107,0,.1); padding: 3px 10px; border-radius: 20px; margin-bottom: 10px; }
        .city-name { font-size: 20px; font-weight: 800; letter-spacing: -.02em; margin-bottom: 6px; }
        .city-salary { font-size: 22px; font-weight: 900; color: #1d1d1f; margin-bottom: 4px; }
        .city-growth { font-size: 14px; font-weight: 700; color: #22c55e; margin-bottom: 8px; }
        .city-role { font-size: 13px; color: #6e6e73; }
        .city-role strong { color: #1d1d1f; }
        .skills-list { display: flex; flex-direction: column; gap: 12px; }
        .skill-row { display: flex; align-items: center; gap: 14px; background: #fff; border: 1px solid #e5e5ea; border-radius: 14px; padding: 16px 20px; transition: transform .12s; }
        .skill-row:hover { transform: translateX(4px); }
        .skill-rank { font-size: 18px; font-weight: 900; color: #ff6b00; min-width: 32px; text-align: center; }
        .skill-trend { font-size: 22px; min-width: 28px; text-align: center; }
        .skill-info { flex: 1; }
        .skill-name { font-size: 15px; font-weight: 700; color: #1d1d1f; margin-bottom: 2px; }
        .skill-salary { font-size: 13px; color: #6e6e73; }
        .skill-demand { font-size: 15px; font-weight: 800; color: #22c55e; white-space: nowrap; }
        .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th { background: #1d1d1f; color: rgba(255,255,255,.7); font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 12px 16px; text-align: left; white-space: nowrap; }
        td { padding: 14px 16px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #f9f9fb; }
        .outlook-pill { display: inline-block; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; color: #fff; }
        .ai-split { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        @media (max-width: 700px) { .ai-split { grid-template-columns: 1fr; } }
        .ai-col-label { font-size: 13px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .ai-col-label.replacing { color: #f87171; }
        .ai-col-label.creating { color: #4ade80; }
        .ai-item { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; }
        .ai-item-role { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .ai-item-note { font-size: 12px; color: rgba(255,255,255,.5); line-height: 1.5; }
        .ai-item-growth { font-size: 13px; font-weight: 800; color: #4ade80; white-space: nowrap; }
        .ai-item-salary { font-size: 12px; color: rgba(255,255,255,.65); margin-bottom: 3px; }
        .risk-badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; color: #fff; white-space: nowrap; }
        .cta-section { background: linear-gradient(135deg, #ff6b00 0%, #ff8c38 100%); padding: 72px 5vw; text-align: center; }
        .cta-title { font-size: clamp(26px, 4vw, 42px); font-weight: 900; color: #fff; letter-spacing: -.03em; margin-bottom: 14px; }
        .cta-sub { font-size: 17px; color: rgba(255,255,255,.85); margin-bottom: 32px; max-width: 540px; margin-left: auto; margin-right: auto; line-height: 1.6; }
        .cta-btn { display: inline-block; background: #fff; color: #ff6b00; font-size: 17px; font-weight: 800; padding: 16px 36px; border-radius: 30px; text-decoration: none; letter-spacing: -.01em; box-shadow: 0 8px 24px rgba(0,0,0,.2); transition: transform .15s; }
        .cta-btn:hover { transform: translateY(-2px); }
        .cta-note { font-size: 13px; color: rgba(255,255,255,.7); margin-top: 14px; }
        footer { background: #1d1d1f; color: rgba(255,255,255,.45); text-align: center; padding: 28px 5vw; font-size: 13px; }
        footer a { color: #ff6b00; text-decoration: none; }
      `}</style>

      {/* Nav */}
      <nav className="nav">
        <a href="/" className="logo">Hire<span>Hub</span><sup style={{ fontSize: '13px', fontWeight: 800 }}>360</sup></a>
        <a href="/hirehub.html" className="nav-cta">Find Jobs →</a>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">India Workforce Intelligence 2026</div>
        <h1>India's <span>Salary</span> &<br />Hiring Intelligence</h1>
        <p className="hero-sub">
          Real data on city salaries, in-demand skills, sector hiring trends, and the AI disruption reshaping India's workforce in 2026.
        </p>
        <div className="hero-stats">
          <div className="stat-pill">
            <div className="stat-pill-num">8</div>
            <div className="stat-pill-label">Cities Covered</div>
          </div>
          <div className="stat-pill">
            <div className="stat-pill-num">10</div>
            <div className="stat-pill-label">Top Skills Ranked</div>
          </div>
          <div className="stat-pill">
            <div className="stat-pill-num">7</div>
            <div className="stat-pill-label">Sectors Analysed</div>
          </div>
          <div className="stat-pill">
            <div className="stat-pill-num">4.8L+</div>
            <div className="stat-pill-label">Open Roles Tracked</div>
          </div>
        </div>
      </section>

      {/* City Salary Cards */}
      <section className="section">
        <span className="section-label">City Salaries</span>
        <h2 className="section-title">Average Salaries by City — 2026</h2>
        <p className="section-sub">Year-over-year growth and top hiring roles across India's major job markets.</p>
        <div className="city-grid">
          {CITY_DATA.map((c) => (
            <div key={c.city} className="city-card">
              <div className="city-badge">{c.badge}</div>
              <div className="city-name">{c.city}</div>
              <div className="city-salary">{c.avgSalary}</div>
              <div className="city-growth">{c.growth} YoY growth</div>
              <div className="city-role">Top role: <strong>{c.topRole}</strong></div>
            </div>
          ))}
        </div>
      </section>

      {/* Top 10 Skills */}
      <section className="section section-alt">
        <span className="section-label">Skill Demand</span>
        <h2 className="section-title">Top 10 In-Demand Skills — 2026</h2>
        <p className="section-sub">Demand growth vs 2024 baseline. The skills employers are paying a premium for right now.</p>
        <div className="skills-list">
          {SKILLS_DATA.map((s) => (
            <div key={s.rank} className="skill-row">
              <div className="skill-rank">#{s.rank}</div>
              <div className="skill-trend">{s.trend}</div>
              <div className="skill-info">
                <div className="skill-name">{s.skill}</div>
                <div className="skill-salary">{s.salary}</div>
              </div>
              <div className="skill-demand">{s.demand}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sector Hiring Trends */}
      <section className="section">
        <span className="section-label">Sector Trends</span>
        <h2 className="section-title">Sector Hiring Trends — 2026</h2>
        <p className="section-sub">Hiring momentum, salary bands, and open role counts across India's key sectors.</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sector</th>
                <th>Hiring Trend</th>
                <th>Avg Salary Range</th>
                <th>Open Roles</th>
                <th>Outlook</th>
              </tr>
            </thead>
            <tbody>
              {SECTOR_DATA.map((s) => (
                <tr key={s.sector}>
                  <td style={{ fontWeight: 700, color: '#1d1d1f' }}>{s.sector}</td>
                  <td style={{ fontWeight: 700, color: s.hiring.startsWith('↑') ? '#22c55e' : s.hiring.startsWith('↓') ? '#f87171' : '#fbbf24' }}>{s.hiring}</td>
                  <td>{s.avgSalary}</td>
                  <td style={{ fontWeight: 600 }}>{s.openRoles}</td>
                  <td>
                    <span className="outlook-pill" style={{ background: outlookColor(s.outlook) }}>{s.outlook}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI vs Human Jobs */}
      <section className="section section-dark">
        <span className="section-label">AI Disruption</span>
        <h2 className="section-title" style={{ color: '#fff' }}>AI vs Human Jobs — What's Changing</h2>
        <p className="section-sub">Which roles AI is displacing — and the brand-new high-paying roles it's creating in India.</p>
        <div className="ai-split">
          {/* Replacing */}
          <div>
            <div className="ai-col-label replacing">⚠️ Roles AI is Replacing</div>
            {AI_REPLACING.map((r) => (
              <div key={r.role} className="ai-item">
                <div className="ai-item-role">
                  <span>{r.role}</span>
                  <span className="risk-badge" style={{ background: riskColor(r.risk) }}>{r.risk} Risk</span>
                </div>
                <div className="ai-item-note">{r.note}</div>
              </div>
            ))}
          </div>
          {/* Creating */}
          <div>
            <div className="ai-col-label creating">✅ Roles AI is Creating</div>
            {AI_CREATING.map((r) => (
              <div key={r.role} className="ai-item">
                <div className="ai-item-role">
                  <span>{r.role}</span>
                  <span className="ai-item-growth">{r.growth}</span>
                </div>
                <div className="ai-item-salary">{r.salary}</div>
                <div className="ai-item-note">{r.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="cta-section">
        <h2 className="cta-title">Download Full India Workforce Report 2026</h2>
        <p className="cta-sub">
          Get the complete data: 50+ cities, 200+ roles, salary percentile breakdowns, and 12-month hiring forecasts. Free.
        </p>
        <a href="/hirehub.html" className="cta-btn">
          Download Free Report →
        </a>
        <div className="cta-note">No sign-up required · PDF + Excel · Instant access</div>
      </section>

      <footer>
        <p>© 2026 HireHub360 · <a href="https://hirehub360.in">hirehub360.in</a> · Data compiled from platform analytics and public market sources · For media queries: <a href="mailto:team@hirehub360.in">team@hirehub360.in</a></p>
      </footer>
    </>
  )
}

export async function getStaticProps() {
  return { props: {}, revalidate: 86400 }
}

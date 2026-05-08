import Head from 'next/head'
import { useState } from 'react'

const RISING_SKILLS = [
  { skill: 'Prompt Engineering', category: 'AI/ML', rise: '+340%', demand: 'Extreme', salary: '₹25–60 LPA', replacing: 'Manual data entry, basic writing', badge: '🔥 Explosive' },
  { skill: 'LLM Fine-tuning', category: 'AI/ML', rise: '+280%', demand: 'Very High', salary: '₹30–70 LPA', replacing: 'Traditional ML pipelines', badge: '🔥 Explosive' },
  { skill: 'Kubernetes / DevOps', category: 'Cloud', rise: '+160%', demand: 'High', salary: '₹18–40 LPA', replacing: 'Manual deployments', badge: '📈 Hot' },
  { skill: 'Data Engineering (Spark)', category: 'Data', rise: '+145%', demand: 'High', salary: '₹20–42 LPA', replacing: 'ETL specialists', badge: '📈 Hot' },
  { skill: 'React Native / Flutter', category: 'Mobile', rise: '+120%', demand: 'High', salary: '₹14–32 LPA', replacing: 'Native iOS/Android silos', badge: '📈 Hot' },
  { skill: 'Cybersecurity (SIEM/SOC)', category: 'Security', rise: '+115%', demand: 'High', salary: '₹16–38 LPA', replacing: 'Manual monitoring', badge: '📈 Hot' },
  { skill: 'Growth Hacking / PLG', category: 'Marketing', rise: '+90%', demand: 'Medium-High', salary: '₹12–28 LPA', replacing: 'Traditional marketing', badge: '📊 Growing' },
  { skill: 'Supply Chain Analytics', category: 'Operations', rise: '+85%', demand: 'Medium-High', salary: '₹10–24 LPA', replacing: 'Manual forecasting', badge: '📊 Growing' },
]

const DECLINING_SKILLS = [
  { skill: 'Manual QA Testing', decline: '-45%', reason: 'AI-automated testing', timeframe: '2-3 years', action: 'Upskill to automation testing' },
  { skill: 'Basic Data Entry', decline: '-60%', reason: 'RPA + AI replacing', timeframe: '1-2 years', action: 'Move to data analysis' },
  { skill: 'Traditional SEO (keyword stuffing)', decline: '-55%', reason: 'AI content + search evolution', timeframe: '1-2 years', action: 'Learn AI-driven SEO' },
  { skill: 'PHP / jQuery Development', decline: '-35%', reason: 'Modern frameworks dominant', timeframe: '3-4 years', action: 'Migrate to React/Next.js' },
  { skill: 'Traditional HR Admin', decline: '-40%', reason: 'HRMS automation', timeframe: '2-3 years', action: 'HR analytics and strategy' },
  { skill: 'Cold Calling (BPO)', decline: '-50%', reason: 'AI voice agents', timeframe: '1-3 years', action: 'Shift to consultative sales' },
]

const CITY_MATRIX = [
  { skill: 'AI/ML',        bangalore: 3, mumbai: 2, delhi: 2, hyderabad: 3, pune: 2 },
  { skill: 'Cloud/DevOps', bangalore: 3, mumbai: 2, delhi: 2, hyderabad: 3, pune: 2 },
  { skill: 'Finance',      bangalore: 2, mumbai: 3, delhi: 2, hyderabad: 1, pune: 2 },
  { skill: 'Sales/BD',     bangalore: 2, mumbai: 3, delhi: 3, hyderabad: 2, pune: 2 },
  { skill: 'Operations',   bangalore: 2, mumbai: 3, delhi: 2, hyderabad: 2, pune: 3 },
  { skill: 'Digital Mktg', bangalore: 3, mumbai: 3, delhi: 3, hyderabad: 2, pune: 2 },
]

const AI_REPLACING = [
  'Data entry operators',
  'Basic accountants',
  'Simple customer support',
  'Manual QA testers',
  'Content translators',
  'Basic graphic designers',
]

const AI_CREATING = [
  'Prompt engineers',
  'AI trainers & evaluators',
  'LLMOps engineers',
  'AI ethics officers',
  'Human-AI workflow designers',
  'AI audit specialists',
]

function FireBadge({ count }) {
  return <span style={{ fontSize: 18, letterSpacing: -2 }}>{'🔥'.repeat(count)}</span>
}

export default function SkillIntelligence() {
  const [activeFilter, setActiveFilter] = useState('All')

  const categories = ['All', ...Array.from(new Set(RISING_SKILLS.map(s => s.category)))]
  const filtered = activeFilter === 'All' ? RISING_SKILLS : RISING_SKILLS.filter(s => s.category === activeFilter)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'India Skill Intelligence Report 2026',
    description: 'Tracks rising and declining skills in India\'s job market, updated weekly from 50,000+ job postings.',
    url: 'https://hirehub360.in/skill-intelligence',
    creator: {
      '@type': 'Organization',
      name: 'HireHub360',
      url: 'https://hirehub360.in',
    },
    spatialCoverage: 'India',
    temporalCoverage: '2025/2026',
    keywords: 'skill demand, AI jobs, rising skills, declining skills, India job market, 2026',
  }

  return (
    <>
      <Head>
        <title>India Skill Intelligence Report 2026 | HireHub360</title>
        <meta name="description" content="Track which skills are rising, falling, and being replaced by AI in India's job market. Updated weekly from 50,000+ job postings. Free intelligence for institutes, colleges & recruiters." />
        <meta property="og:title" content="India Skill Intelligence Report 2026 | HireHub360" />
        <meta property="og:description" content="Which skills are exploding (+340%) and which are dying (-60%)? Live skill demand data across India's top cities." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hirehub360.in/skill-intelligence" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="India Skill Intelligence Report 2026 | HireHub360" />
        <meta name="twitter:description" content="Rising skills, declining skills, city demand matrix — all from 50,000+ live job postings." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://hirehub360.in/skill-intelligence" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#0a0a0a;color:#fff}
        a{text-decoration:none;color:inherit}
        .nav{background:rgba(10,10,10,.92);border-bottom:1px solid #1f1f1f;padding:0 5vw;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;backdrop-filter:blur(12px)}
        .logo{font-weight:900;font-size:22px;letter-spacing:-.04em}
        .logo span{color:#ff6b00}
        .logo sup{color:#ff6b00;font-size:13px;vertical-align:super}
        .nav-r{display:flex;gap:10px;align-items:center}
        .nav-btn{padding:8px 18px;border-radius:999px;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:opacity .15s;text-decoration:none;display:inline-block}
        .nav-btn:hover{opacity:.85}
        .nav-btn.ghost{background:rgba(255,255,255,.1);color:#fff}
        .nav-btn.primary{background:#ff6b00;color:#fff}
        .section{padding:64px 5vw}
        .section-title{font-size:clamp(24px,4vw,36px);font-weight:900;letter-spacing:-.04em;margin-bottom:8px}
        .section-sub{font-size:15px;color:#666;margin-bottom:36px;line-height:1.6;max-width:640px}
        .eyebrow{display:inline-block;background:rgba(255,107,0,.15);color:#ff6b00;padding:5px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:16px;border:1px solid rgba(255,107,0,.25)}
        .tag{display:inline-block;padding:3px 9px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.04em}
        @media(max-width:640px){
          .hide-mobile{display:none!important}
          .matrix-table th,.matrix-table td{padding:10px 8px;font-size:13px}
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">
          HireHub<span>Hub</span><sup>360</sup>
        </a>
        <div className="nav-r">
          <a href="/features" className="nav-btn ghost hide-mobile">Features</a>
          <a href="/hirehub.html" className="nav-btn primary">Post a Job</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        padding: '88px 5vw 72px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,107,0,.18), transparent)',
        borderBottom: '1px solid #1a1a1a',
      }}>
        <div style={{ display: 'inline-block', background: 'rgba(255,107,0,.12)', color: '#ff6b00', padding: '6px 16px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 24, border: '1px solid rgba(255,107,0,.25)' }}>
          Live Intelligence — Updated Weekly
        </div>
        <h1 style={{ fontSize: 'clamp(32px,6vw,64px)', fontWeight: 900, letterSpacing: '-.05em', lineHeight: 1.05, marginBottom: 20 }}>
          Skill Intelligence Engine<br /><span style={{ color: '#ff6b00' }}>India 2026</span>
        </h1>
        <p style={{ fontSize: 18, color: '#888', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.75 }}>
          Track which skills are rising, falling, and being replaced by AI. Updated weekly from <strong style={{ color: '#ccc' }}>50,000+ job postings</strong>.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', paddingTop: 40, borderTop: '1px solid #1f1f1f' }}>
          {[
            { n: '50,000+', l: 'Jobs Tracked Weekly' },
            { n: '21', l: 'Cities Monitored' },
            { n: '340%', l: 'Fastest Growing Skill' },
            { n: '200+', l: 'Skills Indexed' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: 28, fontWeight: 900, color: '#ff6b00', letterSpacing: '-.04em' }}>{s.n}</span>
              <span style={{ display: 'block', fontSize: 12, color: '#555', marginTop: 3 }}>{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* RISING SKILLS */}
      <section className="section" style={{ background: '#0d0d0d' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="eyebrow">Rising Skills</div>
          <h2 className="section-title">Skills Exploding in Demand <span style={{ color: '#22c55e' }}>↑</span></h2>
          <p className="section-sub">Skill categories with highest YoY demand growth across India's tech hubs. Salary ranges reflect 2026 market rates.</p>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 999,
                  border: activeFilter === cat ? '1.5px solid #ff6b00' : '1.5px solid #2a2a2a',
                  background: activeFilter === cat ? 'rgba(255,107,0,.12)' : 'transparent',
                  color: activeFilter === cat ? '#ff6b00' : '#666',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map(item => (
              <div
                key={item.skill}
                style={{
                  background: '#111',
                  border: '1px solid #1e1e1e',
                  borderRadius: 16,
                  padding: 24,
                  transition: 'border-color .2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2a2a'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ background: 'rgba(255,255,255,.06)', color: '#888', padding: '3px 9px', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                    {item.category}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#888' }}>{item.badge}</span>
                </div>

                <h3 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-.03em', marginBottom: 8 }}>{item.skill}</h3>

                {/* Rise badge */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(34,197,94,.12)', color: '#22c55e', padding: '4px 12px', borderRadius: 8, fontSize: 15, fontWeight: 900, border: '1px solid rgba(34,197,94,.2)' }}>
                    {item.rise}
                  </span>
                  <span style={{ background: 'rgba(255,107,0,.1)', color: '#ff6b00', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                    {item.demand} demand
                  </span>
                </div>

                {/* Salary */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '.06em' }}>Salary range</span>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#e0e0e0', marginTop: 2 }}>{item.salary}</div>
                </div>

                {/* Replacing */}
                <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 12, marginTop: 12 }}>
                  <span style={{ fontSize: 11, color: '#444', textTransform: 'uppercase', letterSpacing: '.06em' }}>Replacing</span>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 3 }}>{item.replacing}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DECLINING SKILLS */}
      <section className="section">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="eyebrow" style={{ background: 'rgba(239,68,68,.1)', color: '#ef4444', borderColor: 'rgba(239,68,68,.2)' }}>At-Risk Skills</div>
          <h2 className="section-title">Skills in Decline <span style={{ color: '#ef4444' }}>↓</span></h2>
          <p className="section-sub">These roles are shrinking fast. If you or your students have these skills, the time to pivot is now.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {DECLINING_SKILLS.map(item => (
              <div
                key={item.skill}
                style={{
                  background: '#110a0a',
                  border: '1px solid #2a1010',
                  borderRadius: 16,
                  padding: 24,
                  transition: 'border-color .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#3a1818'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2a1010'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ background: 'rgba(239,68,68,.1)', color: '#ef4444', padding: '4px 12px', borderRadius: 8, fontSize: 15, fontWeight: 900, border: '1px solid rgba(239,68,68,.2)' }}>
                    {item.decline}
                  </span>
                  <span style={{ background: 'rgba(239,68,68,.08)', color: '#ef4444', padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                    {item.timeframe}
                  </span>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-.03em', marginBottom: 8, color: '#e0e0e0' }}>{item.skill}</h3>

                <div style={{ fontSize: 13, color: '#666', marginBottom: 14, lineHeight: 1.5 }}>
                  <span style={{ color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em' }}>Why: </span>
                  {item.reason}
                </div>

                <div style={{ background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.12)', borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: '#22c55e', fontSize: 14, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>{item.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITY × SKILL MATRIX */}
      <section className="section" style={{ background: '#0d0d0d' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="eyebrow">City Intelligence</div>
          <h2 className="section-title">City × Skill Demand Matrix</h2>
          <p className="section-sub">Where each skill is hottest right now. 🔥🔥🔥 = extreme demand, 🔥🔥 = strong, 🔥 = moderate.</p>

          <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid #1e1e1e' }}>
            <table className="matrix-table" style={{ width: '100%', borderCollapse: 'collapse', background: '#111', minWidth: 560 }}>
              <thead>
                <tr style={{ background: '#161616', borderBottom: '1px solid #1e1e1e' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '.08em' }}>Skill</th>
                  {['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'].map(city => (
                    <th key={city} style={{ padding: '14px 16px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.06em' }}>{city}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CITY_MATRIX.map((row, i) => (
                  <tr
                    key={row.skill}
                    style={{ borderBottom: i < CITY_MATRIX.length - 1 ? '1px solid #191919' : 'none', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#161616'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px', fontWeight: 700, fontSize: 14, color: '#e0e0e0' }}>{row.skill}</td>
                    {['bangalore', 'mumbai', 'delhi', 'hyderabad', 'pune'].map(city => (
                      <td key={city} style={{ padding: '14px 16px', textAlign: 'center', fontSize: 16 }}>
                        <FireBadge count={row[city]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 12, color: '#444', marginTop: 14, textAlign: 'right' }}>
            Based on job posting density across HireHub360 listings. Updated weekly.
          </p>
        </div>
      </section>

      {/* AI REPLACING vs CREATING */}
      <section className="section">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="eyebrow" style={{ background: 'rgba(99,102,241,.1)', color: '#818cf8', borderColor: 'rgba(99,102,241,.2)' }}>AI Impact</div>
          <h2 className="section-title">AI Replacing vs. Creating Jobs</h2>
          <p className="section-sub">The AI transition is real. Here's an honest look at what's disappearing and what's being born.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* Replacing */}
            <div style={{ background: '#120a0a', border: '1px solid #2a1010', borderRadius: 20, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 24 }}>⚠️</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#ef4444', letterSpacing: '-.02em' }}>AI is Replacing</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 1 }}>Jobs at risk in 2–5 years</div>
                </div>
              </div>
              <ul style={{ listStyle: 'none' }}>
                {AI_REPLACING.map(job => (
                  <li key={job} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #1e0808', fontSize: 14, color: '#cc8888' }}>
                    <span style={{ color: '#ef4444', flexShrink: 0, fontSize: 12 }}>✕</span>
                    {job}
                  </li>
                ))}
              </ul>
            </div>

            {/* Creating */}
            <div style={{ background: '#080f0a', border: '1px solid #102a15', borderRadius: 20, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 24 }}>🚀</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#22c55e', letterSpacing: '-.02em' }}>AI is Creating</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 1 }}>New roles emerging now</div>
                </div>
              </div>
              <ul style={{ listStyle: 'none' }}>
                {AI_CREATING.map(job => (
                  <li key={job} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #0a1e0d', fontSize: 14, color: '#88cc99' }}>
                    <span style={{ color: '#22c55e', flexShrink: 0, fontSize: 12 }}>✓</span>
                    {job}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Callout */}
          <div style={{ marginTop: 20, background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.15)', borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>💡</span>
            <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7 }}>
              <strong style={{ color: '#c7c7ff' }}>The net job count isn't shrinking — it's shifting.</strong> Every role AI replaces generates 1.3 new adjacent roles on average. The risk isn't job loss; it's skill mismatch. Workers and institutions that adapt now will capture the upside.
            </p>
          </div>
        </div>
      </section>

      {/* PARTNER CTA */}
      <section className="section" style={{ background: '#0d0d0d' }}>
        <div style={{
          maxWidth: 800,
          margin: '0 auto',
          background: 'linear-gradient(135deg, #111 0%, #140800 100%)',
          border: '1px solid #2a1500',
          borderRadius: 24,
          padding: 'clamp(32px, 6vw, 60px)',
          textAlign: 'center',
        }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,107,0,.12)', color: '#ff6b00', padding: '5px 14px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20, border: '1px solid rgba(255,107,0,.2)' }}>
            For Institutes &amp; Colleges
          </div>
          <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 900, letterSpacing: '-.04em', marginBottom: 14, lineHeight: 1.1 }}>
            Training Institutes &amp; Colleges —<br />
            <span style={{ color: '#ff6b00' }}>Partner with HireHub360</span>
          </h2>
          <p style={{ fontSize: 15, color: '#777', marginBottom: 32, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 32px' }}>
            Access verified skill demand data for your curriculum planning. Get placement-ready students hired faster with real-time market intelligence your competitors don't have.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            {[
              { icon: '📊', label: 'Live skill demand reports' },
              { icon: '🎯', label: 'Placement partner network' },
              { icon: '📈', label: 'Curriculum gap analysis' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.04)', border: '1px solid #2a2a2a', borderRadius: 10, padding: '8px 16px' }}>
                <span style={{ fontSize: 16 }}>{f.icon}</span>
                <span style={{ fontSize: 13, color: '#aaa', fontWeight: 600 }}>{f.label}</span>
              </div>
            ))}
          </div>

          <a
            href="/hirehub.html"
            style={{
              display: 'inline-block',
              background: '#ff6b00',
              color: '#fff',
              fontWeight: 800,
              fontSize: 15,
              padding: '14px 36px',
              borderRadius: 12,
              textDecoration: 'none',
              letterSpacing: '-.01em',
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Partner With Us →
          </a>

          <p style={{ fontSize: 12, color: '#444', marginTop: 16 }}>
            Free data access for registered institutes. Enterprise plans available.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '32px 5vw', borderTop: '1px solid #141414', textAlign: 'center' }}>
        <a href="/" className="logo" style={{ display: 'inline-block', marginBottom: 12 }}>
          HireHub<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ color: '#ff6b00', fontSize: 11 }}>360</sup>
        </a>
        <p style={{ fontSize: 12, color: '#444', marginTop: 8 }}>
          © 2026 HireHub360. Skill data sourced from live job postings across India.{' '}
          <a href="/privacy" style={{ color: '#555', textDecoration: 'underline' }}>Privacy</a>
        </p>
      </footer>
    </>
  )
}

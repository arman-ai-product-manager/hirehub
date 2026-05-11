import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const CITIES = ['Bangalore','Mumbai','Delhi NCR','Hyderabad','Pune','Chennai','Gurgaon','Noida','Kolkata','Ahmedabad','Jaipur','Kochi','Remote']
const POPULAR_ROLES = [
  'Software Engineer','Senior Software Engineer','Product Manager','Data Scientist','DevOps Engineer',
  'Sales Executive','Marketing Manager','HR Business Partner','Finance Analyst','UI/UX Designer',
  'Content Writer','Business Analyst','Operations Manager',
]
const SIZES = [
  { v:'startup', l:'Startup (1-100)' },
  { v:'mid',     l:'Mid-size (100-1000)' },
  { v:'mnc',     l:'MNC / Large (1000+)' },
]

function fmtLpa(n) { return typeof n === 'number' ? n.toFixed(1) + ' LPA' : '—' }
function fmtRange(min, max) { return `₹${Number(min).toFixed(1)}–${Number(max).toFixed(1)} LPA` }
function fmtRupees(n) { return '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN') }

export default function SalaryCalculator() {
  const [role, setRole] = useState('Software Engineer')
  const [years, setYears] = useState(3)
  const [city, setCity] = useState('Bangalore')
  const [skills, setSkills] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [state, setState] = useState({ status:'idle', err:'' })
  const [data, setData] = useState(null)

  async function run(e) {
    e.preventDefault()
    if (!role.trim() || !city) { setState({ status:'error', err:'Role and city required' }); return }
    setState({ status:'loading', err:'' })
    setData(null)
    try {
      const r = await fetch('/api/salary/estimate', {
        method:'POST',
        headers:{ 'content-type':'application/json' },
        body: JSON.stringify({
          role: role.trim(), city, years: Number(years),
          skills: skills.split(',').map(s => s.trim()).filter(Boolean),
          companySize,
        }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Could not estimate')
      setData(j)
      setState({ status:'ready', err:'' })
    } catch (err) {
      setState({ status:'error', err: err.message })
    }
  }

  function shareWhatsApp() {
    if (!data) return
    const cur = data.current_estimate
    const text = `💰 *${role}, ${years} yrs in ${city}*\n\nSalary range: ₹${cur.min_lpa}–${cur.max_lpa} LPA\nMedian: ₹${cur.median_lpa} LPA\nMonthly take-home: ₹${(cur.monthly_in_hand_min/1000).toFixed(0)}K – ₹${(cur.monthly_in_hand_max/1000).toFixed(0)}K\n\n📊 _Estimated by HireHub360 AI — hirehub360.in/salary-calculator_`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <>
      <Head>
        <title>AI Salary Calculator India 2026 — Know Your Worth in 30 Seconds | HireHub360</title>
        <meta name="description" content="Free AI salary calculator for India 2026. Enter your role, years, city — get realistic CTC range, city comparison, high-paying skills, and negotiation tips. Updated for 2026." />
        <link rel="canonical" href="https://hirehub360.in/salary-calculator" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:title" content="AI Salary Calculator India 2026 — Know Your Worth" />
        <meta property="og:description" content="Free. Realistic CTC range, city comparison, high-paying skills, and negotiation tips for any role in India." />
        <meta property="og:url" content="https://hirehub360.in/salary-calculator" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=AI+Salary+Calculator+India+2026&s=Free+%C2%B7+role+%2B+experience+%2B+city+%E2%86%92+realistic+CTC+range" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="HireHub360" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div style={{ minHeight:'100vh', background:'#f5f5f7', fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui" }}>
        <header style={{ background:'#fff', borderBottom:'1px solid #e5e5e7', padding:'14px 20px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <Link href="/" style={{ fontSize:18, fontWeight:700, color:'#1d1d1f', textDecoration:'none' }}>
              HireHub<span style={{ color:'#ff6b00' }}>Hub</span><sup style={{ fontSize:10, color:'#ff6b00' }}>360</sup>
            </Link>
            <Link href="/" style={{ fontSize:14, color:'#0066cc', textDecoration:'none' }}>← Home</Link>
          </div>
        </header>

        <section style={{ background:'linear-gradient(135deg,#10b981 0%,#059669 100%)', color:'#fff', padding:'52px 20px 36px', textAlign:'center' }}>
          <div style={{ maxWidth:780, margin:'0 auto' }}>
            <div style={{ display:'inline-block', background:'rgba(255,255,255,0.18)', padding:'6px 12px', borderRadius:999, fontSize:12, fontWeight:600, marginBottom:14 }}>
              💰 FREE · INDIA 2026 DATA
            </div>
            <h1 style={{ fontSize:'clamp(28px,5vw,42px)', fontWeight:700, margin:'0 0 12px' }}>
              AI Salary Calculator
            </h1>
            <p style={{ fontSize:16, opacity:0.95, lineHeight:1.5, maxWidth:620, margin:'0 auto' }}>
              Know your worth in 30 seconds. Get a realistic CTC range, city comparison, and skill premium for any Indian role.
            </p>
          </div>
        </section>

        <main style={{ maxWidth:900, margin:'0 auto', padding:'32px 16px 80px' }}>
          <form onSubmit={run} style={{ background:'#fff', borderRadius:18, padding:'24px 22px', border:'1px solid #e5e5e7', marginBottom:20 }}>
            <div style={{ display:'grid', gap:14, gridTemplateColumns:'1fr 1fr' }}>
              <Row label="Role *" full>
                <input value={role} onChange={e=>setRole(e.target.value)} placeholder="e.g. Senior React Developer" required style={inp} />
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
                  {POPULAR_ROLES.map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      style={{ background:'#f5f5f7', border:'1px solid #e5e5e7', padding:'5px 10px', borderRadius:999, fontSize:12, color:'#1d1d1f', cursor:'pointer' }}>
                      {r}
                    </button>
                  ))}
                </div>
              </Row>
              <Row label="Years of experience *">
                <input type="number" min="0" max="40" step="1" value={years} onChange={e=>setYears(e.target.value)} required style={inp} />
              </Row>
              <Row label="City *">
                <select value={city} onChange={e=>setCity(e.target.value)} required style={inp}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Row>
              <Row label="Key skills (optional)" full hint="Comma-separated — e.g. React, TypeScript, AWS">
                <input value={skills} onChange={e=>setSkills(e.target.value)} placeholder="React, TypeScript, AWS" style={inp} />
              </Row>
              <Row label="Company type (optional)" full>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <button type="button" onClick={()=>setCompanySize('')}
                    style={chip(companySize === '')}>Any</button>
                  {SIZES.map(s => (
                    <button key={s.v} type="button" onClick={()=>setCompanySize(s.v)}
                      style={chip(companySize === s.v)}>{s.l}</button>
                  ))}
                </div>
              </Row>
            </div>

            {state.err && (
              <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', color:'#991b1b', padding:'12px 14px', borderRadius:10, fontSize:14, marginTop:16 }}>{state.err}</div>
            )}

            <button type="submit" disabled={state.status==='loading'}
              style={{ width:'100%', marginTop:18, background:'#10b981', color:'#fff', padding:'15px', borderRadius:12, border:'none', fontSize:16, fontWeight:700, cursor:'pointer', opacity:state.status==='loading' ? 0.7 : 1 }}>
              {state.status==='loading' ? '⚙️ Calculating…' : '💰 Calculate My Salary'}
            </button>
          </form>

          {data && (
            <div>
              {/* Main estimate card */}
              <div style={{ background:'linear-gradient(135deg,#10b981 0%,#059669 100%)', color:'#fff', borderRadius:18, padding:'26px 24px', marginBottom:20, textAlign:'center' }}>
                <div style={{ fontSize:13, opacity:0.9, marginBottom:8 }}>Estimated salary for {data.input.role} ({data.input.years} yrs, {data.input.city})</div>
                <div style={{ fontSize:'clamp(28px,5vw,38px)', fontWeight:700, marginBottom:6 }}>
                  {fmtRange(data.current_estimate.min_lpa, data.current_estimate.max_lpa)}
                </div>
                <div style={{ fontSize:15, opacity:0.95 }}>
                  Median: <strong>{fmtLpa(data.current_estimate.median_lpa)}</strong> · Take-home: <strong>{fmtRupees(data.current_estimate.monthly_in_hand_min)} – {fmtRupees(data.current_estimate.monthly_in_hand_max)}/mo</strong>
                </div>
                <div style={{ marginTop:14, display:'inline-block', background:'rgba(255,255,255,0.18)', padding:'4px 12px', borderRadius:999, fontSize:12 }}>
                  Confidence: {data.confidence} · {data.based_on}
                </div>
                <div style={{ marginTop:18, display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap' }}>
                  <button onClick={shareWhatsApp} style={{ background:'rgba(255,255,255,0.95)', color:'#059669', border:'none', padding:'10px 18px', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>
                    💬 Share on WhatsApp
                  </button>
                </div>
              </div>

              {data.market_signal && (
                <div style={{ background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:12, padding:'14px 18px', marginBottom:20, color:'#9a3412' }}>
                  <strong>📊 Market signal:</strong> {data.market_signal}
                </div>
              )}

              {/* City comparison */}
              <Section title="🌆 Same Role, Different City">
                <div style={{ display:'grid', gap:8 }}>
                  {(data.city_comparison || []).map((c, i) => {
                    const pct = c.vs_input_pct || 0
                    const isHigher = pct > 0
                    return (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'#f5f5f7', borderRadius:10 }}>
                        <div>
                          <div style={{ fontWeight:600, color:'#1d1d1f' }}>{c.city}</div>
                          <div style={{ fontSize:12, color:'#6e6e73' }}>{c.note}</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontWeight:700, color:'#1d1d1f' }}>{fmtLpa(c.median_lpa)}</div>
                          <div style={{ fontSize:12, color: isHigher ? '#059669' : (pct < 0 ? '#dc2626' : '#6e6e73') }}>
                            {pct > 0 ? '+' : ''}{pct}% vs {data.input.city}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Section>

              {/* High-paying skills */}
              {data.high_paying_skills?.length > 0 && (
                <Section title="🚀 Skills That Pay More">
                  <p style={{ fontSize:13, color:'#6e6e73', margin:'0 0 12px' }}>Add any of these to your toolkit for a premium:</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {data.high_paying_skills.map((s, i) => (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'#fff7ed', borderRadius:10, border:'1px solid #fed7aa' }}>
                        <span style={{ fontWeight:600, color:'#9a3412' }}>{s.skill}</span>
                        <span style={{ fontWeight:700, color:'#059669' }}>+{s.premium_pct}%</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Next level */}
              {data.next_level_target && (
                <Section title="🎯 Your Next Level">
                  <p style={{ margin:'0 0 10px', color:'#1d1d1f' }}>
                    In ~<strong>{data.next_level_target.years} years</strong> at this trajectory, target median: <strong style={{ color:'#059669' }}>{fmtLpa(data.next_level_target.target_median_lpa)}</strong>
                  </p>
                  <p style={{ margin:'0 0 8px', fontSize:14, color:'#6e6e73' }}>To get there, focus on:</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {(data.next_level_target.what_to_learn || []).map((s, i) => (
                      <span key={i} style={{ background:'#dbeafe', color:'#1e40af', padding:'5px 12px', borderRadius:999, fontSize:13, fontWeight:500 }}>{s}</span>
                    ))}
                  </div>
                </Section>
              )}

              {/* Negotiation tips */}
              {data.negotiation_tips?.length > 0 && (
                <Section title="💪 Negotiation Tips">
                  <ul style={{ paddingLeft:20, margin:0, lineHeight:1.7, color:'#1d1d1f' }}>
                    {data.negotiation_tips.map((t, i) => <li key={i} style={{ marginBottom:4 }}>{t}</li>)}
                  </ul>
                </Section>
              )}

              <div style={{ marginTop:24, background:'linear-gradient(135deg,#1d1d1f 0%,#2d2d30 100%)', color:'#fff', borderRadius:16, padding:'24px', textAlign:'center' }}>
                <h3 style={{ fontSize:20, fontWeight:700, margin:'0 0 8px' }}>Worth more? Find a better-paying role.</h3>
                <p style={{ opacity:0.8, fontSize:14, marginBottom:18 }}>Browse 50,000+ jobs with salary listed up-front.</p>
                <Link href="/" style={{ display:'inline-block', background:'#ff6b00', color:'#fff', padding:'12px 26px', borderRadius:10, fontWeight:600, textDecoration:'none' }}>
                  Browse jobs →
                </Link>
              </div>

              <p style={{ fontSize:11, color:'#6e6e73', textAlign:'center', marginTop:20 }}>
                AI estimate based on 2026 Indian market benchmarks. Actual offers vary by company, performance, and negotiation. Not financial advice.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

const inp = { width:'100%', padding:'12px 14px', fontSize:15, borderRadius:10, border:'1px solid #d2d2d7', background:'#fff', color:'#1d1d1f', outline:'none', boxSizing:'border-box', fontFamily:'inherit' }

function chip(active) {
  return {
    background: active ? '#1d1d1f' : '#fff',
    color: active ? '#fff' : '#1d1d1f',
    border: '1px solid ' + (active ? '#1d1d1f' : '#d2d2d7'),
    padding:'8px 14px', borderRadius:999, fontSize:13, fontWeight:500, cursor:'pointer',
  }
}

function Row({ label, hint, children, full }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#1d1d1f', marginBottom:6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize:11, color:'#6e6e73', margin:'4px 0 0' }}>{hint}</p>}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom:18 }}>
      <h3 style={{ fontSize:17, fontWeight:600, color:'#1d1d1f', margin:'0 0 10px' }}>{title}</h3>
      <div style={{ background:'#fff', border:'1px solid #e5e5e7', borderRadius:12, padding:'16px 18px' }}>
        {children}
      </div>
    </section>
  )
}

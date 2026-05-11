import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const EXP_OPTIONS = ['Fresher (0–1 yr)', '1–3 yrs', '3–6 yrs', '6–10 yrs', '10+ yrs (Senior)']
const POPULAR_ROLES = [
  'React Developer', 'Product Manager', 'Data Analyst', 'Sales Executive',
  'HR Business Partner', 'DevOps Engineer', 'Content Writer', 'Marketing Manager',
]

const CAT_COLOR = {
  'Behavioral':              { bg:'#dbeafe', fg:'#1e40af' },
  'Technical/Role-specific': { bg:'#fef3c7', fg:'#92400e' },
  'Situational':             { bg:'#fce7f3', fg:'#9d174d' },
  'HR/Cultural':             { bg:'#d1fae5', fg:'#065f46' },
}

export default function InterviewPrep() {
  const [jd, setJd] = useState('')
  const [role, setRole] = useState('')
  const [experience, setExperience] = useState('1–3 yrs')
  const [state, setState] = useState({ status:'idle', err:'' })
  const [prep, setPrep] = useState(null)
  const [expanded, setExpanded] = useState({})

  async function run(e) {
    e.preventDefault()
    if (!jd.trim() && !role.trim()) {
      setState({ status:'error', err:'Paste a JD or enter a role' }); return
    }
    setState({ status:'loading', err:'' })
    setPrep(null)
    try {
      const r = await fetch('/api/interview/prep', {
        method:'POST',
        headers:{ 'content-type':'application/json' },
        body: JSON.stringify({ jd:jd.trim(), role:role.trim(), experience }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Could not generate prep')
      setPrep(j.prep)
      setState({ status:'ready', err:'' })
      setExpanded({})
    } catch (err) {
      setState({ status:'error', err: err.message })
    }
  }

  function toggle(i) { setExpanded(e => ({ ...e, [i]: !e[i] })) }

  function shareWhatsApp() {
    if (!prep) return
    const top = prep.questions.slice(0, 5)
    const text = `🎯 *Interview Prep — ${role || 'My next role'}*\n\n` +
      top.map((q, i) => `${i+1}. ${q.q}\n   _Tip:_ ${q.tip}`).join('\n\n') +
      `\n\n📚 Full prep on HireHub360 → hirehub360.in/interview-prep`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <>
      <Head>
        <title>AI Interview Prep — Practice Real Interview Questions | HireHub360</title>
        <meta name="description" content="Paste a job description and get realistic interview questions, sample answers, and tips tailored to the role. Free AI interview coach for Indian candidates." />
        <link rel="canonical" href="https://hirehub360.in/interview-prep" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:title" content="AI Interview Prep — Practice Real Interview Questions" />
        <meta property="og:description" content="Paste a JD, get real interview questions with sample answers. Free AI coach for Indian candidates." />
        <meta property="og:url" content="https://hirehub360.in/interview-prep" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=AI+Interview+Prep&s=Paste+a+JD+%E2%86%92+get+real+interview+questions+%2B+sample+answers" />
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

        <section style={{ background:'linear-gradient(135deg,#1d1d1f 0%,#2d2d30 100%)', color:'#fff', padding:'56px 20px 40px', textAlign:'center' }}>
          <div style={{ maxWidth:780, margin:'0 auto' }}>
            <div style={{ display:'inline-block', background:'rgba(255,107,0,0.15)', color:'#ffb380', padding:'6px 12px', borderRadius:999, fontSize:12, fontWeight:600, letterSpacing:0.5, marginBottom:14 }}>
              🎯 FREE · AI-POWERED
            </div>
            <h1 style={{ fontSize:'clamp(28px,5vw,44px)', fontWeight:700, margin:'0 0 14px', lineHeight:1.15 }}>
              AI Interview Prep
            </h1>
            <p style={{ fontSize:'clamp(15px,2vw,18px)', opacity:0.85, lineHeight:1.55, maxWidth:640, margin:'0 auto' }}>
              Paste a job description — get <strong>real interview questions</strong>, sample answers,
              red flags to avoid, and salary negotiation tips. Tailored to the role.
            </p>
          </div>
        </section>

        <main style={{ maxWidth:880, margin:'0 auto', padding:'32px 16px 80px' }}>
          {!prep && (
            <form onSubmit={run} style={{ background:'#fff', borderRadius:18, padding:'24px 22px', border:'1px solid #e5e5e7' }}>
              <h2 style={{ fontSize:18, fontWeight:600, color:'#1d1d1f', margin:'0 0 14px' }}>Step 1 — Paste the job description</h2>
              <textarea value={jd} onChange={e=>setJd(e.target.value)} rows={7}
                placeholder={'Paste the full job description here…\n\nOr if you don\'t have one, just enter a role below.'}
                style={inp}
              />

              <h2 style={{ fontSize:18, fontWeight:600, color:'#1d1d1f', margin:'22px 0 14px' }}>Step 2 — Or just pick a role</h2>
              <input type="text" value={role} onChange={e=>setRole(e.target.value)}
                placeholder="e.g. React Developer at a fintech startup" style={inp} />
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:10 }}>
                {POPULAR_ROLES.map(r => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    style={{ background:'#f5f5f7', border:'1px solid #e5e5e7', color:'#1d1d1f', padding:'6px 12px', borderRadius:999, fontSize:12, cursor:'pointer' }}>
                    {r}
                  </button>
                ))}
              </div>

              <h2 style={{ fontSize:18, fontWeight:600, color:'#1d1d1f', margin:'22px 0 14px' }}>Step 3 — Your experience level</h2>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {EXP_OPTIONS.map(e => (
                  <button key={e} type="button" onClick={() => setExperience(e)}
                    style={{
                      background: experience===e ? '#ff6b00' : '#fff',
                      color: experience===e ? '#fff' : '#1d1d1f',
                      border:'1px solid ' + (experience===e ? '#ff6b00' : '#d2d2d7'),
                      padding:'8px 14px', borderRadius:999, fontSize:13, fontWeight:500, cursor:'pointer',
                    }}>
                    {e}
                  </button>
                ))}
              </div>

              {state.err && (
                <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', color:'#991b1b', padding:'12px 14px', borderRadius:10, fontSize:14, marginTop:16 }}>
                  {state.err}
                </div>
              )}

              <button type="submit" disabled={state.status==='loading'}
                style={{ width:'100%', marginTop:20, background:'#ff6b00', color:'#fff', padding:'15px', borderRadius:12, border:'none', fontSize:16, fontWeight:700, cursor:'pointer', opacity:state.status==='loading' ? 0.7 : 1 }}>
                {state.status==='loading' ? '🤖 Generating prep… (10-15 sec)' : '🚀 Generate Interview Prep'}
              </button>

              <p style={{ textAlign:'center', fontSize:12, color:'#6e6e73', marginTop:12 }}>
                Free, unlimited. Powered by AI. Tailored to the actual role.
              </p>
            </form>
          )}

          {prep && (
            <div>
              {/* Action bar */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10, marginBottom:18 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#1d1d1f', margin:0 }}>Your Interview Prep</h2>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <button onClick={shareWhatsApp}
                    style={{ background:'#25D366', color:'#fff', border:'none', padding:'10px 16px', borderRadius:10, fontSize:14, fontWeight:500, cursor:'pointer' }}>
                    💬 Share top 5 on WhatsApp
                  </button>
                  <button onClick={() => window.print()}
                    style={{ background:'#fff', color:'#1d1d1f', border:'1px solid #d2d2d7', padding:'10px 16px', borderRadius:10, fontSize:14, fontWeight:500, cursor:'pointer' }}>
                    🖨️ Print
                  </button>
                  <button onClick={() => { setPrep(null); setState({ status:'idle', err:'' }) }}
                    style={{ background:'#fff', color:'#6e6e73', border:'1px solid #d2d2d7', padding:'10px 16px', borderRadius:10, fontSize:14, fontWeight:500, cursor:'pointer' }}>
                    🔄 New
                  </button>
                </div>
              </div>

              {prep.role_summary && (
                <div style={{ background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:12, padding:'14px 18px', marginBottom:18, color:'#9a3412' }}>
                  <strong>About this role:</strong> {prep.role_summary}
                </div>
              )}

              {prep.rounds.length > 0 && (
                <Section title="📋 Typical Interview Rounds">
                  <ol style={{ paddingLeft:20, margin:0, lineHeight:1.7, color:'#1d1d1f' }}>
                    {prep.rounds.map((r, i) => <li key={i}>{r}</li>)}
                  </ol>
                </Section>
              )}

              <Section title={`❓ ${prep.questions.length} Likely Questions`}>
                <div style={{ display:'grid', gap:10 }}>
                  {prep.questions.map((q, i) => {
                    const c = CAT_COLOR[q.category] || { bg:'#f5f5f7', fg:'#1d1d1f' }
                    const isOpen = expanded[i]
                    return (
                      <div key={i} style={{ background:'#fff', border:'1px solid #e5e5e7', borderRadius:12, padding:'14px 16px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', gap:10, alignItems:'flex-start', marginBottom:6 }}>
                          <span style={{ background:c.bg, color:c.fg, fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:6 }}>{q.category}</span>
                          <span style={{ fontSize:12, color:'#6e6e73' }}>Q{i+1}</span>
                        </div>
                        <p style={{ fontSize:15, fontWeight:600, color:'#1d1d1f', margin:'4px 0 8px', lineHeight:1.4 }}>{q.q}</p>
                        <p style={{ fontSize:13, color:'#6e6e73', margin:0, lineHeight:1.5 }}>💡 <strong>Tip:</strong> {q.tip}</p>
                        {q.sample_answer && (
                          <>
                            <button onClick={() => toggle(i)} style={{ marginTop:10, background:'none', border:'none', color:'#0066cc', fontSize:13, fontWeight:500, cursor:'pointer', padding:0 }}>
                              {isOpen ? '▲ Hide sample answer' : '▼ Show sample answer'}
                            </button>
                            {isOpen && (
                              <div style={{ marginTop:8, padding:'12px 14px', background:'#f5f5f7', borderRadius:8, fontSize:13, color:'#3d3d3f', lineHeight:1.6 }}>
                                {q.sample_answer}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Section>

              {prep.questions_to_ask_them.length > 0 && (
                <Section title="🎤 Smart Questions to Ask Them">
                  <ul style={{ paddingLeft:20, margin:0, lineHeight:1.7 }}>
                    {prep.questions_to_ask_them.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </Section>
              )}

              {prep.red_flags_to_avoid.length > 0 && (
                <Section title="🚩 Red Flags to Avoid">
                  <ul style={{ paddingLeft:20, margin:0, lineHeight:1.7, color:'#991b1b' }}>
                    {prep.red_flags_to_avoid.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </Section>
              )}

              {prep.salary_negotiation_tip && (
                <Section title="💰 Salary Negotiation Tip">
                  <p style={{ margin:0, lineHeight:1.6, color:'#1d1d1f' }}>{prep.salary_negotiation_tip}</p>
                </Section>
              )}

              <div style={{ marginTop:24, background:'linear-gradient(135deg,#1d1d1f 0%,#2d2d30 100%)', color:'#fff', borderRadius:16, padding:'24px', textAlign:'center' }}>
                <h3 style={{ fontSize:20, fontWeight:700, margin:'0 0 8px' }}>Ace it? Apply now.</h3>
                <p style={{ opacity:0.8, fontSize:14, marginBottom:18 }}>Browse 50,000+ active jobs across India on HireHub360.</p>
                <Link href="/" style={{ display:'inline-block', background:'#ff6b00', color:'#fff', padding:'12px 26px', borderRadius:10, fontWeight:600, textDecoration:'none' }}>
                  Browse jobs →
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

const inp = { width:'100%', padding:'12px 14px', fontSize:15, borderRadius:10, border:'1px solid #d2d2d7', background:'#fff', color:'#1d1d1f', outline:'none', boxSizing:'border-box', fontFamily:'inherit', resize:'vertical' }

function Section({ title, children }) {
  return (
    <section style={{ marginBottom:20 }}>
      <h3 style={{ fontSize:17, fontWeight:600, color:'#1d1d1f', margin:'0 0 10px' }}>{title}</h3>
      <div style={{ background:'#fff', border:'1px solid #e5e5e7', borderRadius:12, padding:'16px 18px' }}>
        {children}
      </div>
    </section>
  )
}

import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null

const CITIES = ['Mumbai','Bangalore','Delhi','Hyderabad','Pune','Chennai','Noida','Gurgaon','Kolkata','Ahmedabad','Remote','Pan India']
const JOB_TYPES = ['Full-time','Part-time','Contract','Internship','Freelance']
const EXP_OPTIONS = ['0–1 yrs (Fresher)','1–3 yrs','2–5 yrs','3–6 yrs','5–8 yrs','7–10 yrs','10+ yrs']

function mkSlug(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function PostJob() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [form, setForm] = useState({ title:'', company_name:'', location:'', salary_label:'', salary_hidden:false, job_type:'Full-time', experience:'2–5 yrs', skills:'', description:'' })
  const [state, setState] = useState({ status:'idle', msg:'' })

  useEffect(() => {
    if (!supabase) { setChecking(false); return }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s || null)
      setChecking(false)
      if (s?.user?.user_metadata?.company_name) {
        setForm(f => ({ ...f, company_name: s.user.user_metadata.company_name || '' }))
      }
    })
  }, [])

  function set(k) { return e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })) }

  async function submit(e) {
    e.preventDefault()
    if (!session) { setState({ status:'error', msg:'Please sign in first' }); return }
    if (!form.title.trim() || !form.company_name.trim() || !form.location) {
      setState({ status:'error', msg:'Job title, company name, and city are required' }); return
    }
    setState({ status:'loading', msg:'' })
    const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean)
    const slug = mkSlug(form.title) + '-' + mkSlug(form.company_name) + '-' + mkSlug(form.location)
    const id = 'job_' + Date.now()
    try {
      const r = await fetch('/api/jobs/save', {
        method:'POST',
        headers: { 'content-type':'application/json', 'authorization':'Bearer ' + session.access_token },
        body: JSON.stringify({ id, slug, ...form, skills, status:'active' }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Could not post job')
      setState({ status:'success', msg:'✅ Job posted! Redirecting…' })
      setTimeout(() => { window.location.href = '/jobs/' + slug }, 1500)
    } catch (err) {
      setState({ status:'error', msg: err.message })
    }
  }

  return (
    <>
      <Head>
        <title>Post a Job Free — HireHub360 | Reach India's Top Talent</title>
        <meta name="description" content="Post a job for free on HireHub360. Reach thousands of active candidates across India. Instant indexing on Google. No credit card needed." />
        <link rel="canonical" href="https://hirehub360.in/post-job" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:title" content="Post a Job Free — HireHub360" />
        <meta property="og:description" content="Free job posting. Reach thousands of active candidates across India instantly." />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=Post+a+Job+Free&s=Reach+thousands+of+active+Indian+candidates+%E2%80%94+no+credit+card+needed" />
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
            <Link href="/pricing" style={{ fontSize:14, color:'#ff6b00', fontWeight:600, textDecoration:'none' }}>See Growth Plan →</Link>
          </div>
        </header>

        <section style={{ background:'linear-gradient(135deg,#ff6b00 0%,#ff8c42 100%)', color:'#fff', padding:'48px 20px 36px', textAlign:'center' }}>
          <div style={{ maxWidth:700, margin:'0 auto' }}>
            <h1 style={{ fontSize:'clamp(26px,5vw,40px)', fontWeight:700, margin:'0 0 10px' }}>Post a Job Free</h1>
            <p style={{ fontSize:16, opacity:0.95, margin:0, lineHeight:1.5 }}>
              Reach thousands of active candidates across India. Instant Google indexing. No credit card needed.
            </p>
          </div>
        </section>

        <main style={{ maxWidth:720, margin:'0 auto', padding:'32px 16px 80px' }}>
          {checking && (
            <div style={{ textAlign:'center', padding:'40px', color:'#6e6e73' }}>Loading…</div>
          )}

          {!checking && !session && (
            <div style={{ background:'#fff', borderRadius:16, padding:'40px 24px', textAlign:'center', border:'1px solid #e5e5e7' }}>
              <div style={{ fontSize:44, marginBottom:12 }}>🔐</div>
              <h2 style={{ fontSize:22, fontWeight:600, color:'#1d1d1f', marginBottom:8 }}>Sign in to post a job</h2>
              <p style={{ color:'#6e6e73', marginBottom:24 }}>
                Create a free employer account to post jobs and manage applications.
              </p>
              <a href="/hirehub.html" style={{ display:'inline-block', background:'#ff6b00', color:'#fff', padding:'14px 32px', borderRadius:12, fontWeight:600, textDecoration:'none', fontSize:15 }}>
                Sign in / Create account →
              </a>
            </div>
          )}

          {!checking && session && (
            <form onSubmit={submit} style={{ background:'#fff', borderRadius:18, padding:'28px 24px', border:'1px solid #e5e5e7' }}>
              <h2 style={{ fontSize:20, fontWeight:600, color:'#1d1d1f', margin:'0 0 20px' }}>Job details</h2>

              <Row label="Job Title *">
                <input value={form.title} onChange={set('title')} placeholder="e.g. Senior React Developer" required style={inp} />
              </Row>
              <Row label="Company Name *">
                <input value={form.company_name} onChange={set('company_name')} placeholder="Your company name" required style={inp} />
              </Row>
              <Row label="City *">
                <select value={form.location} onChange={set('location')} required style={inp}>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Row>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <Row label="Job Type">
                  <select value={form.job_type} onChange={set('job_type')} style={inp}>
                    {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Row>
                <Row label="Experience">
                  <select value={form.experience} onChange={set('experience')} style={inp}>
                    {EXP_OPTIONS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Row>
              </div>
              <Row label="Salary / CTC" hint="e.g. ₹8–14 LPA  or  ₹40,000/month">
                <input value={form.salary_label} onChange={set('salary_label')} placeholder="₹8–14 LPA" style={inp} />
                <label style={{ display:'flex', alignItems:'center', gap:8, marginTop:8, fontSize:13, color:'#6e6e73', cursor:'pointer' }}>
                  <input type="checkbox" checked={form.salary_hidden} onChange={set('salary_hidden')} />
                  Hide salary from candidates
                </label>
              </Row>
              <Row label="Required Skills" hint="Comma-separated — e.g. React, Node.js, AWS">
                <input value={form.skills} onChange={set('skills')} placeholder="React, Node.js, TypeScript" style={inp} />
              </Row>
              <Row label="Job Description">
                <textarea value={form.description} onChange={set('description')} rows={7}
                  placeholder={'Describe the role, responsibilities, and requirements.\n\nExample:\nWe are looking for a React developer to join our product team. You will build and maintain our customer-facing applications...'
                  } style={{ ...inp, resize:'vertical', fontFamily:'inherit' }} />
              </Row>

              {state.msg && (
                <div style={{ padding:'12px 14px', borderRadius:10, fontSize:14, marginBottom:16,
                  background: state.status==='success' ? '#d1fae5' : '#fee2e2',
                  color: state.status==='success' ? '#065f46' : '#991b1b',
                }}>{state.msg}</div>
              )}

              <button type="submit" disabled={state.status==='loading'}
                style={{ width:'100%', background:'#ff6b00', color:'#fff', padding:'15px', borderRadius:12, border:'none', fontSize:16, fontWeight:700, cursor:'pointer', opacity:state.status==='loading' ? 0.7 : 1 }}>
                {state.status==='loading' ? 'Posting…' : '📢 Post Job Free'}
              </button>
              <p style={{ fontSize:12, color:'#6e6e73', textAlign:'center', marginTop:12 }}>
                Free forever on Starter plan. <Link href="/pricing" style={{ color:'#0066cc' }}>Upgrade for unlimited posts →</Link>
              </p>
            </form>
          )}
        </main>
      </div>
    </>
  )
}

const inp = { width:'100%', padding:'12px 14px', fontSize:16, borderRadius:10, border:'1px solid #d2d2d7', background:'#fff', color:'#1d1d1f', outline:'none', boxSizing:'border-box' }

function Row({ label, hint, children }) {
  return (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:'block', fontSize:14, fontWeight:500, color:'#1d1d1f', marginBottom:6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize:12, color:'#6e6e73', margin:'6px 0 0' }}>{hint}</p>}
    </div>
  )
}

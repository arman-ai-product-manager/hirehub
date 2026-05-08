import Head from 'next/head'
import { useState } from 'react'
const { supabaseService } = require('../../lib/supabase')

function mkSlug(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const DEMO_JOBS = [
  {id:'d1',title:'Senior Software Engineer',company_name:'TechCorp India',location:'Bangalore',salary_label:'₹18–28 LPA',salary_hidden:false,job_type:'Full-time',skills:['React','Node.js','AWS'],experience:'3–6 yrs'},
  {id:'d2',title:'Product Manager',company_name:'Swiggy',location:'Mumbai',salary_label:'₹22–35 LPA',salary_hidden:false,job_type:'Full-time',skills:['Product','Analytics','Agile'],experience:'4–8 yrs'},
  {id:'d3',title:'Data Analyst',company_name:'Razorpay',location:'Bangalore',salary_label:'₹8–15 LPA',salary_hidden:false,job_type:'Full-time',skills:['SQL','Python','Tableau'],experience:'1–3 yrs'},
  {id:'d4',title:'Marketing Manager',company_name:'Zomato',location:'Delhi',salary_label:'₹12–20 LPA',salary_hidden:false,job_type:'Full-time',skills:['SEO','Content','Analytics'],experience:'3–6 yrs'},
  {id:'d5',title:'HR Business Partner',company_name:'Infosys',location:'Hyderabad',salary_label:'₹8–14 LPA',salary_hidden:false,job_type:'Full-time',skills:['HR','Recruitment','HRBP'],experience:'2–5 yrs'},
  {id:'d6',title:'DevOps Engineer',company_name:'Flipkart',location:'Bangalore',salary_label:'₹15–25 LPA',salary_hidden:false,job_type:'Full-time',skills:['Kubernetes','Docker','CI/CD'],experience:'2–5 yrs'},
  {id:'d7',title:'Sales Executive',company_name:'Jio',location:'Mumbai',salary_label:'₹4–8 LPA',salary_hidden:false,job_type:'Full-time',skills:['Sales','B2B','CRM'],experience:'0–2 yrs'},
  {id:'d8',title:'UI/UX Designer',company_name:'CRED',location:'Bangalore',salary_label:'₹10–18 LPA',salary_hidden:false,job_type:'Full-time',skills:['Figma','Design','UX Research'],experience:'2–4 yrs'},
  {id:'d9',title:'Business Analyst',company_name:'Accenture',location:'Pune',salary_label:'₹7–13 LPA',salary_hidden:false,job_type:'Full-time',skills:['SQL','Excel','Tableau'],experience:'1–4 yrs'},
  {id:'d10',title:'Content Writer',company_name:'MagicPin',location:'Delhi',salary_label:'₹4–7 LPA',salary_hidden:false,job_type:'Full-time',skills:['Writing','SEO','Research'],experience:'0–2 yrs'},
  {id:'d11',title:'Finance Analyst',company_name:'HDFC Bank',location:'Mumbai',salary_label:'₹8–16 LPA',salary_hidden:false,job_type:'Full-time',skills:['Excel','Finance','Forecasting'],experience:'2–5 yrs'},
  {id:'d12',title:'Operations Manager',company_name:'Amazon',location:'Chennai',salary_label:'₹10–18 LPA',salary_hidden:false,job_type:'Full-time',skills:['Ops','Logistics','Six Sigma'],experience:'3–7 yrs'},
]

export default function WhatsAppApplyPage({ job, slug }) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  if (!job) return (
    <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
      <h2 style={{ marginBottom: 8 }}>Job not found</h2>
      <p style={{ color: '#6e6e73', marginBottom: 24 }}>This job may have been filled or removed.</p>
      <a href="/" style={{ color: '#ff6b00', fontWeight: 700 }}>← Browse all jobs</a>
    </div>
  )

  const salary = job.salary_hidden ? null : job.salary_label

  async function handleWhatsApp() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/apply/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId:       job.id,
          jobTitle:    job.title,
          companyName: job.company_name,
          location:    job.location,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate link')
      window.location.href = data.url
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Apply via WhatsApp — {job.title} at {job.company_name} | HireHub360</title>
        <meta name="description" content={`Apply instantly on WhatsApp for ${job.title} at ${job.company_name} in ${job.location}. No resume needed — just tap and apply!`} />
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#f5f5f7;color:#1d1d1f}
        a{text-decoration:none;color:inherit}
        .nav{background:#fff;border-bottom:1px solid #e5e5ea;padding:0 5vw;height:52px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
        .logo{font-weight:900;font-size:20px;letter-spacing:-.04em}
        .logo span{color:#ff6b00}
        .tag{padding:5px 12px;border-radius:999px;font-size:13px;font-weight:600;background:#f5f5f7;color:#3d3d3f;display:inline-block}
        .tag.g{background:#f0fdf4;color:#1a8a3c}
        .tag.b{background:#e8f4fd;color:#0071e3}
        .tag.o{background:#fff3e8;color:#ff6b00}
        @media(max-width:480px){.card{padding:20px 16px!important}}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">Hire<span>Hub</span><span style={{ color: '#ff6b00', fontSize: '0.7em', verticalAlign: 'super' }}>360</span></a>
        <a href="/hirehub.html" style={{ padding: '7px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, background: '#f5f5f7', color: '#1d1d1f' }}>Sign In</a>
      </nav>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '28px 16px 60px' }}>

        {/* WhatsApp badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <div style={{ width: 36, height: 36, background: '#25D366', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💬</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>WhatsApp Apply</div>
            <div style={{ fontSize: 12, color: '#6e6e73' }}>No resume needed · Instant reply</div>
          </div>
        </div>

        {/* Job card */}
        <div className="card" style={{ background: '#fff', borderRadius: 16, padding: '24px 20px', boxShadow: '0 1px 4px rgba(0,0,0,.08)', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.03em', marginBottom: 4 }}>{job.title}</h1>
              <p style={{ color: '#3d3d3f', fontSize: 15 }}>{job.company_name} · {job.location}</p>
            </div>
            <div style={{ width: 46, height: 46, background: '#ff6b00', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: '#fff', flexShrink: 0 }}>
              {(job.company_name || '?')[0].toUpperCase()}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {salary && <span className="tag g">{salary}</span>}
            {job.experience && <span className="tag">{job.experience}</span>}
            {job.job_type && <span className="tag b">{job.job_type}</span>}
            {(job.skills || []).map((s, i) => <span key={i} className="tag o">{s}</span>)}
          </div>
        </div>

        {/* How it works */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,.08)', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>How it works</div>
          {[
            ['1️⃣', 'Tap the green button below'],
            ['2️⃣', 'WhatsApp opens with your message ready'],
            ['3️⃣', 'Hit Send — our team connects you to the recruiter'],
          ].map(([emoji, text]) => (
            <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{emoji}</span>
              <span style={{ fontSize: 14, color: '#3d3d3f', lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffcdd2', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: '#c62828' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleWhatsApp}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '16px', background: loading ? '#a5d6a7' : '#25D366', borderRadius: 14, fontWeight: 800, fontSize: 17, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', color: '#fff', marginBottom: 12, boxShadow: '0 4px 14px rgba(37,211,102,.35)', transition: 'background .15s' }}
        >
          <span style={{ fontSize: 22 }}>💬</span>
          {loading ? 'Opening WhatsApp…' : 'Apply on WhatsApp'}
        </button>

        <a
          href="/hirehub.html"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px', background: '#fff3e8', borderRadius: 14, fontWeight: 700, fontSize: 15, color: '#ff6b00', border: '1.5px solid #ff6b00', textDecoration: 'none' }}
        >
          Apply via App instead
        </a>

        <p style={{ fontSize: 12, color: '#aaa', textAlign: 'center', marginTop: 18, lineHeight: 1.6 }}>
          Your details will only be shared with the recruiter for this role. HireHub360 does not sell your data.
        </p>

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <a href={`/jobs/${slug}`} style={{ fontSize: 13, color: '#6e6e73' }}>← View full job details</a>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const slug = params.slug

  // Try DB first
  try {
    const { data: jobs } = await supabaseService.from('jobs').select('*').eq('status', 'active')
    const dbJob = (jobs || []).find(j =>
      mkSlug(j.title) + '-' + mkSlug(j.company_name) + '-' + mkSlug(j.location) === slug
    )
    if (dbJob) return { props: { job: dbJob, slug } }
  } catch (err) {
    console.warn('[whatsapp-apply] DB lookup failed:', err.message)
  }

  // Fall back to demo jobs
  const demoJob = DEMO_JOBS.find(j =>
    mkSlug(j.title) + '-' + mkSlug(j.company_name) + '-' + mkSlug(j.location) === slug
  )
  if (demoJob) return { props: { job: demoJob, slug } }

  return { notFound: true }
}

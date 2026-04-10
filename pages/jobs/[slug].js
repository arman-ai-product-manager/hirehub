import Head from 'next/head'
import { useState, useEffect } from 'react'
const { supabaseService } = require('../../lib/supabase')

function mkSlug(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Demo jobs shown on homepage — also served here so cards don't 404
const DEMO_JOBS = [
  {id:'d1',title:'Senior Software Engineer',company_name:'TechCorp India',location:'Bangalore',salary_label:'₹18–28 LPA',salary_hidden:false,job_type:'Full-time',skills:['React','Node.js','AWS'],created_at:'2026-04-01T00:00:00.000Z',experience:'3–6 yrs',description:'We are looking for a Senior Software Engineer to join our growing engineering team. You will work on scalable backend systems and modern frontend applications.'},
  {id:'d2',title:'Product Manager',company_name:'Swiggy',location:'Mumbai',salary_label:'₹22–35 LPA',salary_hidden:false,job_type:'Full-time',skills:['Product','Analytics','Agile'],created_at:'2026-04-01T00:00:00.000Z',experience:'4–8 yrs',description:'Drive product strategy and roadmap. Work cross-functionally with engineering, design, and business teams to deliver high-impact features.'},
  {id:'d3',title:'Data Analyst',company_name:'Razorpay',location:'Bangalore',salary_label:'₹8–15 LPA',salary_hidden:false,job_type:'Full-time',skills:['SQL','Python','Tableau'],created_at:'2026-04-01T00:00:00.000Z',experience:'1–3 yrs',description:'Analyse large datasets to drive business decisions. Build dashboards, run experiments, and present insights to leadership.'},
  {id:'d4',title:'Marketing Manager',company_name:'Zomato',location:'Delhi',salary_label:'₹12–20 LPA',salary_hidden:false,job_type:'Full-time',skills:['SEO','Content','Analytics'],created_at:'2026-04-01T00:00:00.000Z',experience:'3–6 yrs',description:'Lead digital marketing campaigns across SEO, content, and paid channels. Manage a team of 5 and own marketing KPIs.'},
  {id:'d5',title:'HR Business Partner',company_name:'Infosys',location:'Hyderabad',salary_label:'₹8–14 LPA',salary_hidden:false,job_type:'Full-time',skills:['HR','Recruitment','HRBP'],created_at:'2026-04-01T00:00:00.000Z',experience:'2–5 yrs',description:'Partner with business leaders on people strategy, talent acquisition, performance management, and employee engagement.'},
  {id:'d6',title:'DevOps Engineer',company_name:'Flipkart',location:'Bangalore',salary_label:'₹15–25 LPA',salary_hidden:false,job_type:'Full-time',skills:['Kubernetes','Docker','CI/CD'],created_at:'2026-04-01T00:00:00.000Z',experience:'2–5 yrs',description:'Build and maintain CI/CD pipelines. Manage Kubernetes clusters at scale. Own reliability and uptime of critical infrastructure.'},
  {id:'d7',title:'Sales Executive',company_name:'Jio',location:'Mumbai',salary_label:'₹4–8 LPA',salary_hidden:false,job_type:'Full-time',skills:['Sales','B2B','CRM'],created_at:'2026-04-01T00:00:00.000Z',experience:'0–2 yrs',description:'Drive B2B sales for Jio enterprise solutions. Manage client relationships and close deals in your assigned territory.'},
  {id:'d8',title:'UI/UX Designer',company_name:'CRED',location:'Bangalore',salary_label:'₹10–18 LPA',salary_hidden:false,job_type:'Full-time',skills:['Figma','Design','UX Research'],created_at:'2026-04-01T00:00:00.000Z',experience:'2–4 yrs',description:'Design beautiful, user-centric products. Conduct user research, create wireframes, prototypes, and ship pixel-perfect designs.'},
  {id:'d9',title:'Business Analyst',company_name:'Accenture',location:'Pune',salary_label:'₹7–13 LPA',salary_hidden:false,job_type:'Full-time',skills:['SQL','Excel','Tableau'],created_at:'2026-04-01T00:00:00.000Z',experience:'1–4 yrs',description:'Bridge business and technology. Gather requirements, document processes, and work with dev teams to deliver solutions.'},
  {id:'d10',title:'Content Writer',company_name:'MagicPin',location:'Delhi',salary_label:'₹4–7 LPA',salary_hidden:false,job_type:'Full-time',skills:['Writing','SEO','Research'],created_at:'2026-04-01T00:00:00.000Z',experience:'0–2 yrs',description:'Create engaging content for blogs, social media, and product. Strong SEO knowledge required.'},
  {id:'d11',title:'Finance Analyst',company_name:'HDFC Bank',location:'Mumbai',salary_label:'₹8–16 LPA',salary_hidden:false,job_type:'Full-time',skills:['Excel','Finance','Forecasting'],created_at:'2026-04-01T00:00:00.000Z',experience:'2–5 yrs',description:'Financial modelling, forecasting, and variance analysis. Support leadership with data-driven financial decisions.'},
  {id:'d12',title:'Operations Manager',company_name:'Amazon',location:'Chennai',salary_label:'₹10–18 LPA',salary_hidden:false,job_type:'Full-time',skills:['Ops','Logistics','Six Sigma'],created_at:'2026-04-01T00:00:00.000Z',experience:'3–7 yrs',description:'Manage warehouse operations, drive process efficiency, and lead a team of 20+ associates to meet operational KPIs.'},
]

export default function JobPage({ job }) {
  const [showApply, setShowApply] = useState(false)
  const [copied, setCopied]       = useState(false)
  const canonicalUrl = job ? `https://hirehub360.in/jobs/${mkSlug(job.title)}-${mkSlug(job.company_name)}-${mkSlug(job.location)}` : ''
  const [pageUrl, setPageUrl] = useState(canonicalUrl)
  useEffect(() => { setPageUrl(window.location.href) }, [])

  if (!job) return (
    <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <div style={{fontSize:48,marginBottom:16}}>🔍</div>
      <h2 style={{marginBottom:8}}>Job not found</h2>
      <p style={{color:'#6e6e73',marginBottom:24}}>This job may have been filled or removed.</p>
      <a href="/" style={{ color: '#ff6b00', fontWeight:700 }}>← Browse all jobs</a>
    </div>
  )

  const shareText = `${job.title} at ${job.company_name} — ${job.location} | Apply on Hire Hub`

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: shareText, url: pageUrl }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(pageUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
    }
  }

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || `Hiring ${job.title} at ${job.company_name} in ${job.location}`,
    datePosted: job.created_at?.split('T')[0],
    validThrough: '2026-12-31',
    employmentType: (job.job_type || 'FULL_TIME').toUpperCase().replace(/-/g, '_').replace(/ /g, '_'),
    hiringOrganization: { '@type': 'Organization', name: job.company_name },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: 'IN' } },
    baseSalary: job.salary_label ? { '@type': 'MonetaryAmount', currency: 'INR', value: { '@type': 'QuantitativeValue', description: job.salary_label } } : undefined,
    directApply: true
  }

  const salary = job.salary_hidden ? 'Competitive' : job.salary_label

  return (
    <>
      <Head>
        <title>{job.title} at {job.company_name} — {job.location} | Hire Hub</title>
        <meta name="description" content={`Apply for ${job.title} at ${job.company_name} in ${job.location}. ${job.experience || ''} experience. ${salary || ''}. Apply instantly on Hire Hub — India's AI job platform.`} />
        <meta property="og:title" content={`${job.company_name} is Hiring: ${job.title}`} />
        <meta property="og:description" content={`${job.location} · ${salary} · ${job.job_type} · Apply on Hire Hub`} />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={`https://hirehub360.in/jobs/${mkSlug(job.title)}-${mkSlug(job.company_name)}-${mkSlug(job.location)}`} />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#f5f5f7;color:#1d1d1f}
        a{text-decoration:none;color:inherit}
        .nav{background:#fff;border-bottom:1px solid #e5e5ea;padding:0 5vw;height:52px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
        .logo{font-weight:900;font-size:20px;letter-spacing:-.04em}
        .logo span{color:#ff6b00}
        .nav-r{display:flex;gap:10px;align-items:center}
        .nav-btn{padding:7px 16px;border-radius:999px;font-size:13px;font-weight:700;cursor:pointer;border:none}
        .nav-btn.ghost{background:#f5f5f7;color:#1d1d1f}
        .nav-btn.primary{background:#ff6b00;color:#fff}
        .card{background:#fff;border-radius:16px;padding:28px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
        .tag{padding:5px 12px;border-radius:999px;font-size:13px;font-weight:600;background:#f5f5f7;color:#3d3d3f;display:inline-block}
        .tag.g{background:#f0fdf4;color:#1a8a3c}
        .tag.b{background:#e8f4fd;color:#0071e3}
        .tag.o{background:#fff3e8;color:#ff6b00}
        .apply-btn{display:inline-flex;align-items:center;gap:6px;background:#ff6b00;color:#fff;border-radius:999px;padding:14px 32px;font-weight:700;font-size:16px;cursor:pointer;border:none;transition:opacity .15s;width:100%;;justify-content:center}
        .apply-btn:hover{opacity:.9}
        .share-btn{display:inline-flex;align-items:center;gap:6px;background:#f5f5f7;color:#1d1d1f;border-radius:999px;padding:12px 24px;font-weight:600;font-size:14px;cursor:pointer;border:1.5px solid #e5e5ea;transition:all .15s}
        .share-btn:hover{border-color:#ff6b00;color:#ff6b00}
        /* Apply modal */
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:1000;display:flex;align-items:flex-end;justify-content:center}
        .modal{background:#fff;border-radius:20px 20px 0 0;padding:28px 24px 40px;width:100%;max-width:480px;animation:slideUp .25s ease}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .google-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:13px;border:1.5px solid #e5e5ea;border-radius:12px;background:#fff;font-weight:600;font-size:15px;cursor:pointer;transition:border-color .15s}
        .google-btn:hover{border-color:#4285f4}
        .divider{display:flex;align-items:center;gap:12px;color:#aaa;font-size:13px;margin:16px 0}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:#e5e5ea}
        .inp-m{width:100%;border:1.5px solid #e5e5ea;border-radius:10px;padding:12px 14px;font-size:15px;margin-bottom:10px;outline:none}
        .inp-m:focus{border-color:#ff6b00}
        .soc-row{display:flex;gap:8px;margin-top:12px}
        .soc-btn{flex:1;padding:10px;border-radius:10px;text-align:center;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;display:block}
        @media(max-width:640px){.card{padding:20px 16px}}
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">Hire <span>Hub</span></a>
        <div className="nav-r">
          <a href="/hirehub.html" className="nav-btn ghost">Sign In</a>
          <a href="/hirehub.html" className="nav-btn primary">Post a Job</a>
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 16px 60px' }}>
        <a href="/" style={{ fontSize: 13, color: '#6e6e73' }}>← All Jobs</a>

        {/* JOB CARD */}
        <div className="card" style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: 26, letterSpacing: '-.04em', marginBottom: 6 }}>{job.title}</h1>
              <p style={{ color: '#3d3d3f', fontSize: 16, marginBottom: 16 }}>{job.company_name} · {job.location}</p>
            </div>
            <div style={{ width: 52, height: 52, background: '#ff6b00', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, color: '#fff', flexShrink: 0 }}>
              {(job.company_name || '?')[0].toUpperCase()}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {salary && <span className="tag g">{salary}</span>}
            {job.experience && <span className="tag">{job.experience}</span>}
            {job.job_type && <span className="tag b">{job.job_type}</span>}
            {(job.skills || []).map((s, i) => <span key={i} className="tag o">{s}</span>)}
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
            <button className="apply-btn" style={{ flex: 2, minWidth: 180 }} onClick={() => setShowApply(true)}>
              ⚡ Apply Now
            </button>
            <button className="share-btn" onClick={handleShare}>
              {copied ? '✅ Copied!' : '📤 Share'}
            </button>
          </div>

          {/* SHARE ROW */}
          <div className="soc-row" style={{ marginBottom: 28 }}>
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + pageUrl)}`} target="_blank" rel="noopener" className="soc-btn" style={{ background: '#25D366', color: '#fff' }}>WhatsApp</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener" className="soc-btn" style={{ background: '#0077B5', color: '#fff' }}>LinkedIn</a>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener" className="soc-btn" style={{ background: '#000', color: '#fff' }}>X / Twitter</a>
          </div>

          {job.description && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '.06em' }}>About the Role</div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#3d3d3f', whiteSpace: 'pre-wrap' }}>{job.description}</p>
            </div>
          )}
        </div>

        {/* SIMILAR JOBS PROMPT */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Looking for more {job.title} jobs?</div>
            <div style={{ fontSize: 13, color: '#6e6e73', marginTop: 4 }}>Browse hundreds of similar roles on Hire Hub</div>
          </div>
          <a href="/" style={{ background: '#ff6b00', color: '#fff', padding: '10px 22px', borderRadius: 999, fontWeight: 700, fontSize: 14 }}>Browse All Jobs →</a>
        </div>
      </div>

      {/* APPLY MODAL */}
      {showApply && (
        <div className="modal-bg" onClick={() => setShowApply(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.03em', marginBottom: 4 }}>Apply for this Job</div>
                <div style={{ fontSize: 13, color: '#6e6e73' }}>{job.title} · {job.company_name} · {job.location}</div>
              </div>
              <button onClick={() => setShowApply(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#aaa', marginTop: -4 }}>×</button>
            </div>

            {/* Google */}
            <a href="/hirehub.html" className="google-btn">
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
              Continue with Google
            </a>

            <div className="divider">or use email</div>

            <input className="inp-m" type="email" placeholder="you@email.com" />
            <input className="inp-m" type="password" placeholder="Password" />

            <div style={{ display: 'flex', gap: 8 }}>
              <a href="/hirehub.html" style={{ flex: 1, background: '#ff6b00', color: '#fff', padding: '12px', borderRadius: 10, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>
                Sign In & Apply
              </a>
              <a href="/hirehub.html" style={{ flex: 1, background: '#f5f5f7', color: '#1d1d1f', padding: '12px', borderRadius: 10, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>
                Create Account
              </a>
            </div>

            <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 14 }}>
              By continuing you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export async function getStaticPaths() {
  const { data: jobs } = await supabaseService
    .from('jobs').select('id,title,company_name,location').eq('status','active').limit(500)

  const dbPaths = (jobs || []).map(j => ({
    params: { slug: mkSlug(j.title)+'-'+mkSlug(j.company_name)+'-'+mkSlug(j.location) }
  }))

  const demoPaths = DEMO_JOBS.map(j => ({
    params: { slug: mkSlug(j.title)+'-'+mkSlug(j.company_name)+'-'+mkSlug(j.location) }
  }))

  return { paths: [...dbPaths, ...demoPaths], fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  // 1. Check real DB jobs
  const { data: jobs } = await supabaseService.from('jobs').select('*').eq('status','active')
  const dbJob = (jobs || []).find(j =>
    mkSlug(j.title)+'-'+mkSlug(j.company_name)+'-'+mkSlug(j.location) === params.slug
  )
  if (dbJob) return { props: { job: dbJob }, revalidate: 3600 }

  // 2. Fall back to demo jobs
  const demoJob = DEMO_JOBS.find(j =>
    mkSlug(j.title)+'-'+mkSlug(j.company_name)+'-'+mkSlug(j.location) === params.slug
  )
  if (demoJob) return { props: { job: demoJob }, revalidate: 86400 }

  return { notFound: true }
}

import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import { useSavedJobs } from '../lib/savedJobs'
const { supabaseService } = require('../lib/supabase')

function mkSlug(s: string) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const CITIES = ['Mumbai','Bangalore','Delhi','Hyderabad','Pune','Chennai','Noida','Gurgaon','Kolkata','Ahmedabad']
const CATEGORIES = [
  { icon:'💻', label:'Software Engineer', slug:'software-engineer' },
  { icon:'📊', label:'Product Manager',   slug:'product-manager' },
  { icon:'📈', label:'Data Scientist',    slug:'data-scientist' },
  { icon:'📞', label:'Sales',             slug:'sales-executive' },
  { icon:'📣', label:'Marketing',         slug:'marketing-manager' },
  { icon:'👥', label:'HR',                slug:'hr-executive' },
  { icon:'💰', label:'Finance',           slug:'finance-analyst' },
  { icon:'🎨', label:'Design',            slug:'designer' },
  { icon:'⚙️', label:'DevOps',           slug:'devops-engineer' },
  { icon:'✍️', label:'Content',          slug:'content-writer' },
  { icon:'📦', label:'Operations',        slug:'operations-manager' },
  { icon:'📋', label:'Business Analyst',  slug:'business-analyst' },
]

const DEMO_JOBS = [
  {id:'d1',title:'Senior Software Engineer',company_name:'TechCorp India',location:'Bangalore',salary_label:'₹18–28 LPA',salary_hidden:false,job_type:'Full-time',skills:['React','Node.js','AWS'],created_at:new Date().toISOString(),experience:'3–6 yrs'},
  {id:'d2',title:'Product Manager',company_name:'Swiggy',location:'Mumbai',salary_label:'₹22–35 LPA',salary_hidden:false,job_type:'Full-time',skills:['Product','Analytics','Agile'],created_at:new Date().toISOString(),experience:'4–8 yrs'},
  {id:'d3',title:'Data Analyst',company_name:'Razorpay',location:'Bangalore',salary_label:'₹8–15 LPA',salary_hidden:false,job_type:'Full-time',skills:['SQL','Python','Tableau'],created_at:new Date().toISOString(),experience:'1–3 yrs'},
  {id:'d4',title:'Marketing Manager',company_name:'Zomato',location:'Delhi',salary_label:'₹12–20 LPA',salary_hidden:false,job_type:'Full-time',skills:['SEO','Content','Analytics'],created_at:new Date().toISOString(),experience:'3–6 yrs'},
  {id:'d5',title:'HR Business Partner',company_name:'Infosys',location:'Hyderabad',salary_label:'₹8–14 LPA',salary_hidden:false,job_type:'Full-time',skills:['HR','Recruitment','HRBP'],created_at:new Date().toISOString(),experience:'2–5 yrs'},
  {id:'d6',title:'DevOps Engineer',company_name:'Flipkart',location:'Bangalore',salary_label:'₹15–25 LPA',salary_hidden:false,job_type:'Full-time',skills:['Kubernetes','Docker','CI/CD'],created_at:new Date().toISOString(),experience:'2–5 yrs'},
  {id:'d7',title:'Sales Executive',company_name:'Jio',location:'Mumbai',salary_label:'₹4–8 LPA',salary_hidden:false,job_type:'Full-time',skills:['Sales','B2B','CRM'],created_at:new Date().toISOString(),experience:'0–2 yrs'},
  {id:'d8',title:'UI/UX Designer',company_name:'CRED',location:'Bangalore',salary_label:'₹10–18 LPA',salary_hidden:false,job_type:'Full-time',skills:['Figma','Design','UX Research'],created_at:new Date().toISOString(),experience:'2–4 yrs'},
  {id:'d9',title:'Business Analyst',company_name:'Accenture',location:'Pune',salary_label:'₹7–13 LPA',salary_hidden:false,job_type:'Full-time',skills:['SQL','Excel','Tableau'],created_at:new Date().toISOString(),experience:'1–4 yrs'},
  {id:'d10',title:'Content Writer',company_name:'MagicPin',location:'Delhi',salary_label:'₹4–7 LPA',salary_hidden:false,job_type:'Full-time',skills:['Writing','SEO','Research'],created_at:new Date().toISOString(),experience:'0–2 yrs'},
  {id:'d11',title:'Finance Analyst',company_name:'HDFC Bank',location:'Mumbai',salary_label:'₹8–16 LPA',salary_hidden:false,job_type:'Full-time',skills:['Excel','Finance','Forecasting'],created_at:new Date().toISOString(),experience:'2–5 yrs'},
  {id:'d12',title:'Operations Manager',company_name:'Amazon',location:'Chennai',salary_label:'₹10–18 LPA',salary_hidden:false,job_type:'Full-time',skills:['Ops','Logistics','Six Sigma'],created_at:new Date().toISOString(),experience:'3–7 yrs'},
]

interface Job {
  id: string
  title: string
  company_name: string
  location: string
  salary_label?: string
  salary_hidden?: boolean
  job_type?: string
  skills?: string[]
  created_at: string
  experience?: string
}

export default function Home({ jobs, total, forCompany }: { jobs: Job[], total: number, forCompany: boolean }) {
  const [search, setSearch]   = useState('')
  const [city, setCity]       = useState('')
  const [applyJob, setApplyJob] = useState<Job|null>(null)
  const [copied, setCopied]   = useState('')
  const [origin, setOrigin]   = useState('https://hirehub360.in')
  const [menuOpen, setMenuOpen] = useState(false)
  const copyTimer             = useRef<ReturnType<typeof setTimeout>|null>(null)
  const { isSaved, toggle: toggleSaved, count: savedCount } = useSavedJobs()

  function submitSearch(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (typeof document !== 'undefined') {
      const target = document.querySelector('section[aria-label="Job listings"]')
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin)
  }, [])

  // Close apply modal on Escape (keyboard accessibility)
  useEffect(() => {
    if (!applyJob) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setApplyJob(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [applyJob])

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase()
    const ms = !q || j.title?.toLowerCase().includes(q) || j.company_name?.toLowerCase().includes(q) || (j.skills||[]).some(s => s.toLowerCase().includes(q))
    const mc = !city || j.location?.toLowerCase().includes(city.toLowerCase())
    return ms && mc
  })

  const sal   = (j: Job) => j.salary_hidden ? 'Competitive' : j.salary_label || ''
  const ago   = (d: string) => { const n = Math.floor((Date.now()-new Date(d).getTime())/86400000); return n===0?'Today':n===1?'Yesterday':n+'d ago' }
  const slug  = (j: Job) => mkSlug(j.title)+'-'+mkSlug(j.company_name)+'-'+mkSlug(j.location)

  const schemaWebsite = {
    '@context':'https://schema.org','@type':'WebSite',name:'HireHub360',
    url:'https://hirehub360.in',
    description:'India\'s AI-powered job platform — find jobs, hire candidates, 10,000+ listings',
    potentialAction:{'@type':'SearchAction','target':{'@type':'EntryPoint','urlTemplate':'https://hirehub360.in/?q={search_term_string}'},'query-input':'required name=search_term_string'}
  }
  const schemaOrg = {
    '@context':'https://schema.org','@type':'Organization',name:'HireHub360',
    url:'https://hirehub360.in',
    description:'India\'s smart job portal — AI-matched jobs, instant apply, trusted hiring platform'
  }
  const schemaList = {
    '@context':'https://schema.org','@type':'ItemList',name:'Latest Job Openings in India',
    itemListElement: filtered.slice(0,12).map((j,i)=>({'@type':'ListItem',position:i+1,name:`${j.title} at ${j.company_name} — ${j.location}`,url:`https://hirehub360.in/jobs/${slug(j)}`}))
  }

  return (
    <>
      <Head>
        <title>HireHub360 — Jobs in India | Search {total.toLocaleString()}+ Jobs | Find Jobs, Hire Candidates</title>
        <meta name="description" content={`Search ${total.toLocaleString()}+ jobs in India. Find software engineer, marketing, finance, HR jobs in Mumbai, Bangalore, Delhi, Hyderabad, Pune. AI-matched job search. Apply instantly on HireHub360.`} />
        <meta name="keywords" content="jobs in india, job search, find jobs, naukri, indeed india, linkedin jobs, glassdoor india, monster jobs, shine jobs, timesjobs, freshersworld, angellist, foundit, cutshort, internshala, apna jobs, hirect, quikr jobs, workindia, jobhai, adzuna india, simplyhired, job portal india, hire candidates india, software engineer jobs, marketing jobs, fresher jobs india, remote jobs india, jobs in mumbai, jobs in bangalore, jobs in delhi, jobs in hyderabad, jobs in pune, jobs in chennai, part time jobs, walk in interview" />
        <meta property="og:title" content="HireHub360 — Find Jobs in India | 10,000+ Listings" />
        <meta property="og:description" content="India's smartest job platform. AI-matched jobs, instant apply, trusted by thousands of job seekers and companies across India." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
        <link rel="canonical" href="https://hirehub360.in" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebsite) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaList) }} />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#f5f5f7;color:#1d1d1f}
        a{text-decoration:none;color:inherit}
        /* NAV */
        .nav{background:#fff;border-bottom:1px solid #e5e5ea;padding:0 5vw;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;box-shadow:0 1px 3px rgba(0,0,0,.06)}
        .logo{font-weight:900;font-size:22px;letter-spacing:-.04em}
        .logo span{color:#ff6b00}
        .nav-links{display:flex;gap:20px;align-items:center;font-size:14px;font-weight:500}
        .nav-links a{color:#3d3d3f;transition:color .15s}
        .nav-links a:hover{color:#ff6b00}
        .btn-post{background:#ff6b00;color:#fff!important;padding:8px 20px;border-radius:999px;font-weight:700;font-size:14px;transition:opacity .15s}
        .btn-post:hover{opacity:.88}
        /* Hamburger button — only visible on mobile */
        .ham-btn{display:none;background:none;border:none;cursor:pointer;width:36px;height:36px;flex-direction:column;justify-content:center;gap:5px;align-items:center;padding:0;margin-left:6px}
        .ham-btn span{display:block;width:22px;height:2px;background:#1d1d1f;border-radius:2px;transition:all .2s}
        @media(max-width:640px){.ham-btn{display:flex}}
        /* Mobile drawer */
        .m-bg{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:200;backdrop-filter:blur(2px);animation:fadeIn .2s}
        .m-drawer{position:fixed;top:0;right:0;bottom:0;width:80vw;max-width:300px;background:#fff;z-index:201;padding:72px 20px 20px;box-shadow:-8px 0 32px rgba(0,0,0,.18);display:flex;flex-direction:column;gap:6px;animation:slideInRight .25s ease}
        .m-drawer a{padding:14px 16px;border-radius:10px;font-size:15px;font-weight:600;color:#1d1d1f;background:#f5f5f7;text-decoration:none;transition:background .15s}
        .m-drawer a:hover{background:#e5e5ea}
        @keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        /* HERO */
        .hero{background:linear-gradient(135deg,#0f0f0f 0%,#1a0800 60%,#0f0f0f 100%);padding:56px 5vw 44px;color:#fff}
        .hero h1{font-size:clamp(28px,5vw,58px);font-weight:900;letter-spacing:-.05em;line-height:1.08;margin-bottom:14px}
        .hero h1 span{color:#ff6b00}
        .hero p{font-size:17px;color:#999;margin-bottom:28px;max-width:500px;line-height:1.6}
        .search-wrap{display:flex;gap:8px;max-width:640px;background:#fff;border-radius:14px;padding:8px;box-shadow:0 8px 40px rgba(0,0,0,.35)}
        .search-wrap input{flex:1;border:none;outline:none;font-size:16px;padding:10px 14px;border-radius:8px;color:#1d1d1f;background:transparent}
        .search-wrap button{background:#ff6b00;color:#fff;border:none;border-radius:10px;padding:10px 24px;font-weight:700;font-size:15px;cursor:pointer;white-space:nowrap;transition:opacity .15s}
        .search-wrap button:hover{opacity:.9}
        .stats-row{display:flex;gap:32px;margin-top:28px;flex-wrap:wrap}
        .stat .n{color:#fff;font-size:22px;font-weight:900;display:block;letter-spacing:-.03em}
        .stat .l{font-size:12px;color:#888}
        /* CHIPS */
        .chips-wrap{padding:20px 5vw 0}
        .chips{display:flex;flex-wrap:wrap;gap:9px}
        .chip{padding:7px 16px;border-radius:999px;border:1.5px solid #e5e5ea;background:#fff;cursor:pointer;font-size:13px;font-weight:600;color:#3d3d3f;transition:all .15s}
        .chip:hover,.chip.on{background:#ff6b00;color:#fff;border-color:#ff6b00}
        /* SECTION */
        .section{padding:32px 5vw}
        .sh{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
        .st{font-weight:800;font-size:22px;letter-spacing:-.03em}
        .see-all{font-size:14px;font-weight:700;color:#ff6b00}
        .see-all:hover{opacity:.8}
        /* JOB CARDS */
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:14px}
        .jc{background:#fff;border-radius:16px;padding:20px;border:1.5px solid #e5e5ea;transition:all .2s;display:block;cursor:pointer}
        .jc:hover{border-color:#ff6b00;box-shadow:0 4px 20px rgba(255,107,0,.12);transform:translateY(-2px)}
        .jt{font-weight:800;font-size:16px;margin-bottom:3px;letter-spacing:-.02em;color:#1d1d1f}
        .jco{font-size:13px;color:#6e6e73;margin-bottom:12px}
        .tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
        .tag{padding:4px 10px;border-radius:8px;font-size:12px;font-weight:600;background:#f5f5f7;color:#3d3d3f}
        .tag.g{background:#f0fdf4;color:#1a8a3c}
        .tag.b{background:#e8f4fd;color:#0071e3}
        .jf{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#6e6e73}
        .ab{background:#ff6b00;color:#fff;border:none;border-radius:8px;padding:6px 16px;font-weight:700;font-size:12px;cursor:pointer}
        /* CATEGORY GRID */
        .cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:12px}
        .cc{background:#fff;border-radius:14px;padding:20px 14px;border:1.5px solid #e5e5ea;text-align:center;cursor:pointer;transition:all .18s;display:block}
        .cc:hover{border-color:#ff6b00;box-shadow:0 4px 16px rgba(255,107,0,.1);transform:translateY(-1px)}
        .ci{font-size:30px;margin-bottom:8px}
        .cl{font-weight:700;font-size:13px;color:#1d1d1f}
        /* CITY GRID */
        .city-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
        .city-c{background:#fff;border-radius:14px;padding:16px 18px;border:1.5px solid #e5e5ea;transition:all .18s;display:flex;align-items:center;gap:12px;cursor:pointer}
        .city-c:hover{border-color:#ff6b00;box-shadow:0 4px 14px rgba(255,107,0,.1)}
        .city-icon{font-size:22px}
        .city-name{font-weight:700;font-size:14px}
        .city-cnt{font-size:11px;color:#6e6e73}
        /* FOR CO BANNER */
        .fc{background:linear-gradient(135deg,#0f0f0f,#1a0800);color:#fff;border-radius:20px;padding:40px;margin:0 5vw 32px;display:flex;gap:40px;align-items:center;flex-wrap:wrap}
        .fc-l{flex:1;min-width:260px}
        .fc h2{font-size:clamp(22px,3vw,36px);font-weight:900;letter-spacing:-.04em;line-height:1.2;margin-bottom:10px}
        .fc p{color:#aaa;font-size:14px;margin-bottom:22px;line-height:1.7;max-width:400px}
        .fc-btn{display:inline-block;background:#ff6b00;color:#fff;padding:13px 30px;border-radius:999px;font-weight:700;font-size:14px}
        .fc-btn:hover{opacity:.9}
        .fc-feats{display:flex;flex-direction:column;gap:10px;flex:1;min-width:200px}
        .fc-feat{display:flex;align-items:center;gap:10px;font-size:13px;color:#ccc}
        .fc-icon{width:28px;height:28px;background:rgba(255,107,0,.18);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
        /* 7 FEATURES SECTION */
        .feat-sec{background:#0a0a0a;padding:48px 5vw;margin-bottom:0}
        .feat-sec-head{text-align:center;margin-bottom:32px}
        .feat-sec-head h2{font-size:clamp(22px,4vw,38px);font-weight:900;color:#fff;letter-spacing:-.04em;margin-bottom:8px}
        .feat-sec-head p{color:#666;font-size:15px}
        .feat7-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;max-width:1200px;margin:0 auto}
        .feat7{background:#111;border:1px solid #222;border-radius:16px;padding:22px;transition:border-color .2s,transform .2s;text-decoration:none;display:block}
        .feat7:hover{border-color:#ff6b00;transform:translateY(-2px)}
        .feat7-top{display:flex;align-items:center;gap:12px;margin-bottom:12px}
        .feat7-ic{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
        .feat7-name{font-size:15px;font-weight:800;color:#fff;letter-spacing:-.02em}
        .feat7-badge{font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#666;margin-top:1px}
        .feat7-desc{font-size:13px;color:#777;line-height:1.65}
        @media(max-width:640px){.feat7-grid{grid-template-columns:1fr}.feat-sec{padding:36px 5vw}}
        /* TRUST */
        .trust{background:#fff;padding:36px 5vw;border-top:1px solid #e5e5ea;border-bottom:1px solid #e5e5ea;text-align:center;margin-bottom:0}
        .trust h2{font-size:clamp(20px,3vw,32px);font-weight:900;letter-spacing:-.04em;margin-bottom:8px}
        .trust p{color:#6e6e73;font-size:15px;margin-bottom:28px}
        .trust-stats{display:flex;justify-content:center;gap:48px;flex-wrap:wrap}
        .ts .n{font-size:32px;font-weight:900;color:#ff6b00;display:block;letter-spacing:-.04em}
        .ts .l{font-size:13px;color:#6e6e73}
        /* FOOTER */
        footer{background:#1d1d1f;color:#aaa;padding:44px 5vw 28px}
        .fg{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:32px;margin-bottom:32px}
        .fc-col h4{color:#fff;font-weight:700;margin-bottom:12px;font-size:13px;text-transform:uppercase;letter-spacing:.06em}
        .fc-col a{display:block;margin-bottom:7px;color:#888;font-size:13px;transition:color .15s}
        .fc-col a:hover{color:#ff6b00}
        .fb{border-top:1px solid #333;padding-top:22px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:12px;color:#555}
        /* RESPONSIVE */
        @media(max-width:640px){
          .search-wrap{flex-direction:column;gap:0;padding:6px}
          .search-wrap input{padding:12px}
          .search-wrap button{border-radius:8px;padding:12px}
          .hide-mob{display:none}
          .fc{flex-direction:column;gap:24px;padding:28px 20px}
          .stats-row{gap:20px}
          .hero{padding:40px 5vw 32px}
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">Hire<span>Hub</span><span style={{color:'#ff6b00',fontSize:'0.75em',fontWeight:900,verticalAlign:'super',marginLeft:1}}>360</span></a>
        <div className="nav-links">
          <a href="/" className="hide-mob">Browse Jobs</a>
          <a href="/features" className="hide-mob">Features</a>
          <a href="/pricing" className="hide-mob">Pricing</a>
          <a href="/cv-screener" className="hide-mob" style={{color:'#ff6b00',fontWeight:600}}>🤖 AI CV Screener</a>
          <a href="/job-alerts" className="hide-mob">🔔 Alerts</a>
          <a href="/saved-jobs" className="hide-mob">❤️ Saved{savedCount > 0 ? ` (${savedCount})` : ''}</a>
          <a href="/my-applications" className="hide-mob">My Apps</a>
          <a href="/blog" className="hide-mob">Blog</a>
          <a href="/hirehub.html" className="hide-mob">Sign In</a>
          <a href="/post-job" className="btn-post">Post a Job →</a>
          <button className="ham-btn" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* Mobile drawer menu */}
      {menuOpen && (
        <>
          <div className="m-bg" onClick={() => setMenuOpen(false)} />
          <div className="m-drawer" role="menu">
            <a href="/" onClick={() => setMenuOpen(false)}>🔍 Browse Jobs</a>
            <a href="/features" onClick={() => setMenuOpen(false)}>🚀 Features</a>
            <a href="/pricing" onClick={() => setMenuOpen(false)}>💳 Pricing</a>
            <a href="/cv-screener" onClick={() => setMenuOpen(false)} style={{background:'#fff7ed',color:'#9a3412',fontWeight:600}}>🤖 AI CV Screener (HR)</a>
            <a href="/job-alerts" onClick={() => setMenuOpen(false)}>🔔 Job Alerts</a>
            <a href="/saved-jobs" onClick={() => setMenuOpen(false)}>❤️ Saved Jobs{savedCount > 0 ? ` (${savedCount})` : ''}</a>
            <a href="/my-applications" onClick={() => setMenuOpen(false)}>📋 My Applications</a>
            <a href="/blog" onClick={() => setMenuOpen(false)}>📝 Blog</a>
            <a href="/hirehub.html" onClick={() => setMenuOpen(false)}>👤 Sign In</a>
            <a href="/post-job" onClick={() => setMenuOpen(false)} style={{background:'#ff6b00',color:'#fff'}}>📢 Post a Job</a>
          </div>
        </>
      )}

      {/* HERO */}
      <section className="hero" itemScope itemType="https://schema.org/WebPage">
        <h1 itemProp="name">
          {forCompany
            ? <>Hire India's<br /><span>Top Talent Fast</span></>
            : <>Find Your Next<br /><span>Job in India</span></>
          }
        </h1>
        <p itemProp="description">
          {forCompany
            ? 'AI screens CVs, ranks candidates by fit, and helps you close faster. India\'s smartest hiring platform.'
            : 'AI-matched jobs across India\'s top companies. Real salaries, instant apply, real-time status tracking.'
          }
        </p>
        <form className="search-wrap" role="search" aria-label="Job search" onSubmit={submitSearch}>
          <input
            type="search"
            placeholder="Job title, skill, or company name…"
            aria-label="Search jobs"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" aria-label="Search">🔍 Search Jobs</button>
        </form>
        <div className="stats-row">
          <div className="stat"><span className="n">{total > 0 ? total.toLocaleString()+'+' : '10,000+'}</span><span className="l">Active Jobs</span></div>
          <div className="stat"><span className="n">500+</span><span className="l">Verified Companies</span></div>
          <div className="stat"><span className="n">50+</span><span className="l">Cities</span></div>
          <div className="stat"><span className="n">AI-Ranked</span><span className="l">Candidate Matching</span></div>
        </div>
      </section>

      {/* CITY FILTER */}
      <div className="chips-wrap">
        <div className="chips" role="group" aria-label="Filter by city">
          <button className={`chip${!city?' on':''}`} onClick={() => setCity('')}>🌍 All India</button>
          {CITIES.map(c => (
            <button key={c} className={`chip${city===c?' on':''}`} onClick={() => setCity(city===c?'':c)}>{c}</button>
          ))}
        </div>
      </div>

      {/* JOBS */}
      <section className="section" aria-label="Job listings">
        <div className="sh">
          <h2 className="st">
            {city ? `Jobs in ${city}` : forCompany ? 'Candidate Pool' : 'Latest Job Openings'}
            &nbsp;<span style={{fontSize:14,fontWeight:500,color:'#6e6e73'}}>({filtered.length} jobs)</span>
          </h2>
          <a href="/hirehub.html" className="see-all">View all jobs →</a>
        </div>

        {filtered.length === 0 ? (
          <div style={{textAlign:'center',padding:'48px 20px',color:'#6e6e73'}}>
            <div style={{fontSize:44,marginBottom:12}}>🔍</div>
            <p style={{fontSize:16,marginBottom:8}}>No jobs matching your search.</p>
            <a href="/hirehub.html" style={{color:'#ff6b00',fontWeight:700,fontSize:14}}>Browse all jobs on HireHub360 →</a>
          </div>
        ) : (
          <div className="grid">
            {filtered.map(j => (
              <div key={j.id} className="jc" itemScope itemType="https://schema.org/JobPosting">
                <meta itemProp="title" content={j.title} />
                <meta itemProp="datePosted" content={j.created_at?.split('T')[0]} />
                <meta itemProp="hiringOrganization" content={j.company_name} />
                <meta itemProp="jobLocation" content={j.location} />
                <a href={`/jobs/${slug(j)}`} style={{textDecoration:'none',color:'inherit',display:'block'}}>
                  <div className="jt">{j.title}</div>
                  <div className="jco">{j.company_name} · {j.location}</div>
                  <div className="tags">
                    {sal(j) && <span className="tag g">{sal(j)}</span>}
                    {j.experience && <span className="tag">{j.experience}</span>}
                    {j.job_type && <span className="tag b">{j.job_type}</span>}
                    {(j.skills||[]).slice(0,2).map((s,i) => <span key={i} className="tag">{s}</span>)}
                  </div>
                </a>
                <div className="jf" style={{marginTop:12}}>
                  <span>{ago(j.created_at)}</span>
                  <div style={{display:'flex',gap:6}}>
                    <button className="ab" aria-label={isSaved(j.id) ? 'Remove from saved' : 'Save job'}
                      style={{background:isSaved(j.id) ? '#fff7ed' : '#f5f5f7', color:isSaved(j.id) ? '#ff6b00' : '#1d1d1f', border:'1.5px solid '+(isSaved(j.id) ? '#fed7aa' : '#e5e5ea'), minWidth:42}}
                      onClick={() => toggleSaved(j)}>
                      {isSaved(j.id) ? '❤️' : '🤍'}
                    </button>
                    <button className="ab" style={{background:'#f5f5f7',color:'#1d1d1f',border:'1.5px solid #e5e5ea'}}
                      onClick={()=>{
                        const url = origin+'/jobs/'+slug(j)
                        const text = `${j.title} at ${j.company_name} — ${j.location} | HireHub360`
                        if(typeof navigator !== 'undefined' && navigator.share){navigator.share({title:text,url}).catch(()=>{})}
                        else{
                          navigator.clipboard?.writeText(url)
                          if(copyTimer.current) clearTimeout(copyTimer.current)
                          setCopied(j.id)
                          copyTimer.current = setTimeout(()=>setCopied(''),2000)
                        }
                      }}>
                      {copied===j.id?'✅':'📤'}
                    </button>
                    <button className="ab" onClick={()=>setApplyJob(j)}>Apply →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{textAlign:'center',marginTop:28}}>
          <a href="/hirehub.html" style={{display:'inline-block',background:'#1d1d1f',color:'#fff',padding:'12px 32px',borderRadius:999,fontWeight:700,fontSize:14}}>
            Browse All Jobs on HireHub360 →
          </a>
        </div>
      </section>

      {/* BROWSE BY CATEGORY */}
      <section className="section" style={{paddingTop:8}} aria-label="Browse jobs by category">
        <div className="sh">
          <h2 className="st">Browse by Category</h2>
        </div>
        <div className="cg">
          {CATEGORIES.map(c => (
            <a key={c.label} href={`/jobs/for/${c.slug}`} className="cc" aria-label={`${c.label} jobs`}>
              <div className="ci">{c.icon}</div>
              <div className="cl">{c.label}</div>
            </a>
          ))}
        </div>
      </section>

      {/* BROWSE BY CITY */}
      <section className="section" style={{paddingTop:8}} aria-label="Browse jobs by city">
        <div className="sh">
          <h2 className="st">Jobs by City</h2>
        </div>
        <div className="city-g">
          {[
            {name:'Mumbai',   slug:'mumbai',      icon:'🏙️',cnt:'2,400+'},
            {name:'Dubai',    slug:'dubai',        icon:'🌆',cnt:'1,800+'},
            {name:'Bangalore',slug:'bangalore',    icon:'🌿',cnt:'3,100+'},
            {name:'Delhi',    slug:'delhi',        icon:'🏛️',cnt:'1,900+'},
            {name:'Hyderabad',slug:'hyderabad',    icon:'🕌',cnt:'1,600+'},
            {name:'Pune',     slug:'pune',         icon:'🏛️',cnt:'1,200+'},
            {name:'Chennai',  slug:'chennai',      icon:'🌊',cnt:'1,000+'},
            {name:'Noida',    slug:'noida',        icon:'🏗️',cnt:'900+'},
            {name:'Gurgaon',  slug:'gurgaon',      icon:'💼',cnt:'1,400+'},
            {name:'Kolkata',  slug:'kolkata',      icon:'🌸',cnt:'700+'},
            {name:'Ahmedabad',slug:'ahmedabad',    icon:'🏭',cnt:'600+'},
            {name:'Abu Dhabi',slug:'abu-dhabi',    icon:'🏛️',cnt:'800+'},
          ].map(c => (
            <a key={c.name} href={`/jobs/in/${c.slug}`} className="city-c" aria-label={`Jobs in ${c.name}`} style={{textDecoration:'none'}}>
              <span className="city-icon">{c.icon}</span>
              <div>
                <div className="city-name">{c.name}</div>
                <div className="city-cnt">{c.cnt} jobs</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FOR COMPANIES */}
      <div className="fc" aria-label="For companies — post jobs and hire">
        <div className="fc-l">
          <div style={{background:'rgba(255,107,0,.2)',color:'#ff6b00',padding:'5px 14px',borderRadius:999,fontSize:11,fontWeight:700,display:'inline-block',marginBottom:16,textTransform:'uppercase',letterSpacing:'.06em'}}>🏢 For Companies</div>
          <h2>Hire Smarter,<br /><span style={{color:'#ff6b00'}}>Not Harder</span></h2>
          <p>AI screens hundreds of CVs in seconds. Get ranked candidates by fit score — not a pile of resumes. India's fastest hiring platform.</p>
          <a href="/hirehub.html" className="fc-btn">Post a Job Free →</a>
        </div>
        <div className="fc-feats">
          {[
            ['🤖','AI CV Ranking — top candidates rise automatically'],
            ['⚡','Go live in under 2 minutes'],
            ['📊','Full applicant CRM with status tracking'],
            ['🎯','Candidate Fit Score 0–100'],
            ['🔍','Google-indexed job pages (SEO boost)'],
            ['🎳','Team venue booking when you hire'],
          ].map(([icon,text]) => (
            <div key={String(text)} className="fc-feat">
              <span className="fc-icon">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* 7 WORLD-FIRST FEATURES */}
      <div className="feat-sec">
        <div className="feat-sec-head">
          <div style={{display:'inline-block',background:'rgba(255,107,0,.15)',color:'#ff6b00',padding:'5px 16px',borderRadius:999,fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:14,border:'1px solid rgba(255,107,0,.3)'}}>🚀 7 World-First Features</div>
          <h2>No Platform Has Built <span style={{color:'#ff6b00'}}>Any of These</span></h2>
          <p>We didn't copy LinkedIn. We didn't copy Naukri. Built for India's 500 million workers.</p>
        </div>
        <div className="feat7-grid">
          {[
            {icon:'⭐',color:'#ff6b00',name:'HireHub Score',badge:'Work Credit Score',desc:'India\'s first CIBIL-like work reputation system. Built from attendance, ratings & skill tests — travels with you everywhere.'},
            {icon:'🤖',color:'#6366f1',name:'AI Salary Agent',badge:'AI Salary Negotiator',desc:'You set your desired salary. Our AI negotiates with the company on your behalf — real-time, data-backed, zero awkwardness.'},
            {icon:'📡',color:'#9333ea',name:'LiveWork',badge:'Live Work Streaming',desc:'Freelancers stream their screen live while working. Clients watch in real time. Pay-per-minute billing ticks like a taxi meter.'},
            {icon:'🔗',color:'#0891b2',name:'VerifiedWork',badge:'Blockchain Certificates',desc:'Every project earns a blockchain certificate that cannot be faked, altered, or deleted. Employers scan a QR to verify instantly.'},
            {icon:'🔄',color:'#059669',name:'WorkerFirst',badge:'Reverse Hiring',desc:'Workers post their availability and rate. Companies browse and apply to them. Premium workers get 5+ company applications daily.'},
            {icon:'⚡',color:'#dc2626',name:'InstantHire',badge:'1-Hour Hire',desc:'Post an emergency need. GPS-matched workers confirmed and on-site within 60 minutes. Swiggy delivery speed — for talent.'},
            {icon:'🕶️',color:'#8b5cf6',name:'BlindHire',badge:'Dark Apply',desc:'Apply with skills + score only. Zero name, photo, or age shown until after shortlist. Pure merit. Zero bias. Every MNC\'s dream.'},
          ].map(f => (
            <a key={f.name} href="/features" className="feat7">
              <div className="feat7-top">
                <div className="feat7-ic" style={{background:f.color+'22',border:`1px solid ${f.color}44`}}>
                  <span>{f.icon}</span>
                </div>
                <div>
                  <div className="feat7-name">{f.name}</div>
                  <div className="feat7-badge">{f.badge}</div>
                </div>
              </div>
              <p className="feat7-desc">{f.desc}</p>
            </a>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:28}}>
          <a href="/features" style={{display:'inline-block',background:'#ff6b00',color:'#fff',padding:'12px 32px',borderRadius:999,fontWeight:700,fontSize:14,textDecoration:'none'}}>Explore All 7 Features →</a>
        </div>
      </div>

      {/* VENUE SECTION */}
      <section className="section" style={{paddingTop:8}}>
        <div className="sh">
          <h2 className="st">🎳 Book a Corporate Venue</h2>
          <a href="/hirehub.html" className="see-all">All options →</a>
        </div>
        <p style={{fontSize:14,color:'#6e6e73',marginBottom:20,marginTop:-12}}>Hire a great team, then celebrate in style. Premium venues for every company occasion.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
          {[
            {icon:'🏕️',name:'Corporate Offsite',desc:'Retreats & summits'},
            {icon:'🏆',name:'Annual Day & Awards',desc:'Awards nights'},
            {icon:'🎤',name:'Conference & Launch',desc:'Events & product launches'},
            {icon:'🍽️',name:'Client Entertainment',desc:'Business dinners'},
            {icon:'🎳',name:'Team Sports & Bonding',desc:'Go-karting, bowling & more'},
          ].map(v => (
            <a key={v.name} href="/hirehub.html" style={{background:'#1d1d1f',borderRadius:14,padding:'18px 16px',display:'block',color:'#fff',border:'1.5px solid #333',transition:'border-color .18s'}}
              onMouseOver={e=>(e.currentTarget.style.borderColor='#ff6b00')}
              onMouseOut={e=>(e.currentTarget.style.borderColor='#333')}>
              <div style={{fontSize:28,marginBottom:8}}>{v.icon}</div>
              <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{v.name}</div>
              <div style={{fontSize:12,color:'#888'}}>{v.desc}</div>
            </a>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <div className="trust">
        <h2>Trusted by Job Seekers & Companies Across India</h2>
        <p>From freshers to senior leaders — HireHub360 powers every career step</p>
        <div className="trust-stats">
          <div className="ts"><span className="n">10,000+</span><span className="l">Active Job Seekers</span></div>
          <div className="ts"><span className="n">500+</span><span className="l">Verified Companies</span></div>
          <div className="ts"><span className="n">50+</span><span className="l">Cities Covered</span></div>
          <div className="ts"><span className="n">96%</span><span className="l">AI Match Accuracy</span></div>
        </div>
      </div>

      {/* FOOTER — keyword-rich for SEO */}
      <footer>
        <div className="fg">
          <div className="fc-col">
            <div style={{fontWeight:900,fontSize:21,color:'#fff',marginBottom:8,letterSpacing:'-.04em'}}>Hire<span style={{color:'#ff6b00'}}>Hub</span><span style={{color:'#ff6b00',fontSize:'0.7em',verticalAlign:'super'}}>360</span></div>
            <p style={{fontSize:13,lineHeight:1.7,marginBottom:0}}>India's AI-powered job platform. Find jobs, hire top candidates, and celebrate milestones — all in one place.</p>
          </div>
          <div className="fc-col">
            <h4>Jobs by City</h4>
            {[['Mumbai','mumbai'],['Dubai','dubai'],['Bangalore','bangalore'],['Pune','pune'],['Delhi','delhi'],['Hyderabad','hyderabad']].map(([n,s]) => <a key={s} href={`/jobs/in/${s}`}>Jobs in {n}</a>)}
          </div>
          <div className="fc-col">
            <h4>Jobs by Role</h4>
            {['Software Engineer','Product Manager','Data Analyst','Marketing Manager','HR Executive','Sales Executive'].map(r => (
              <a key={r} href={`/hirehub.html`}>{r} Jobs</a>
            ))}
          </div>
          <div className="fc-col">
            <h4>For Recruiters</h4>
            <a href="/hirehub.html">Post Jobs Free</a>
            <a href="/ats">Recruiter ATS</a>
            <a href="/ai-scoring">AI Candidate Scoring</a>
            <a href="/payroll">Payroll Software</a>
            <a href="/hirehub.html">Company Dashboard</a>
          </div>
          <div className="fc-col">
            <h4>For Workers</h4>
            <a href="/resume-builder">AI Resume Builder</a>
            <a href="/upskilling">Free Courses</a>
            <a href="/worker-loans">Salary Advance</a>
            <a href="/worker-insurance">Worker Insurance</a>
            <a href="/resume/your-name">My Resume Page</a>
          </div>
          <div className="fc-col">
            <h4>Intelligence</h4>
            <a href="/salary-intelligence">Salary Data</a>
            <a href="/skill-intelligence">Skill Trends</a>
            <a href="/workforce-heatmap">Hiring Heatmap</a>
            <a href="/features">7 AI Features</a>
            <a href="/pricing">Pricing</a>
            <a href="/blog">Blog</a>
            <a href="/sitemap.xml">Sitemap</a>
          </div>
        </div>
        <div className="fb">
          <span>© 2026 HireHub360. All rights reserved. India's Job Search Platform.</span>
          <span style={{color:'#444'}}>Jobs in India · Job Search · Hire Candidates · Job Portal</span>
        </div>
      </footer>

      {/* APPLY MODAL */}
      {applyJob && (
        <div role="dialog" aria-modal="true" aria-labelledby="apply-modal-title" style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:1000,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={()=>setApplyJob(null)}>
          <div style={{background:'#fff',borderRadius:'20px 20px 0 0',padding:'28px 24px 44px',width:'100%',maxWidth:480,animation:'slideUp .25s ease'}} onClick={e=>e.stopPropagation()}>
            <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18}}>
              <div>
                <div id="apply-modal-title" style={{fontWeight:800,fontSize:18,letterSpacing:'-.03em',marginBottom:4}}>Apply for this Job</div>
                <div style={{fontSize:13,color:'#6e6e73'}}>{applyJob?.title || 'Job'} · {applyJob?.company_name || ''} · {applyJob?.location || ''}</div>
              </div>
              <button onClick={()=>setApplyJob(null)} style={{background:'none',border:'none',fontSize:24,cursor:'pointer',color:'#aaa'}}>×</button>
            </div>

            {/* Google */}
            <a href="/hirehub.html" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,width:'100%',padding:'13px',border:'1.5px solid #e5e5ea',borderRadius:12,background:'#fff',fontWeight:600,fontSize:15,textDecoration:'none',color:'#1d1d1f',marginBottom:4}}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
              Continue with Google
            </a>

            <div style={{display:'flex',alignItems:'center',gap:12,color:'#aaa',fontSize:13,margin:'14px 0'}}>
              <div style={{flex:1,height:1,background:'#e5e5ea'}}/>or use email<div style={{flex:1,height:1,background:'#e5e5ea'}}/>
            </div>

            <input style={{width:'100%',border:'1.5px solid #e5e5ea',borderRadius:10,padding:'12px 14px',fontSize:15,marginBottom:10,outline:'none',display:'block'}} type="email" placeholder="you@email.com" />
            <input style={{width:'100%',border:'1.5px solid #e5e5ea',borderRadius:10,padding:'12px 14px',fontSize:15,marginBottom:14,outline:'none',display:'block'}} type="password" placeholder="Password" />

            <div style={{display:'flex',gap:8,marginBottom:12}}>
              <a href="/hirehub.html" style={{flex:1,background:'#ff6b00',color:'#fff',padding:'12px',borderRadius:10,textAlign:'center' as const,fontWeight:700,fontSize:15,textDecoration:'none'}}>Sign In & Apply</a>
              <a href="/hirehub.html" style={{flex:1,background:'#f5f5f7',color:'#1d1d1f',padding:'12px',borderRadius:10,textAlign:'center' as const,fontWeight:700,fontSize:15,textDecoration:'none'}}>Create Account</a>
            </div>

            {/* Social share the job */}
            <div style={{borderTop:'1px solid #f0f0f0',paddingTop:14}}>
              <div style={{fontSize:12,color:'#aaa',marginBottom:8,textAlign:'center' as const}}>Or share this job with someone</div>
              <div style={{display:'flex',gap:8}}>
                <a href={`https://wa.me/?text=${encodeURIComponent((applyJob?.title||'Job')+' at '+(applyJob?.company_name||'')+' — '+(applyJob?.location||'')+' | '+origin+'/jobs/'+slug(applyJob))}`} target="_blank" rel="noopener" style={{flex:1,background:'#25D366',color:'#fff',padding:'9px',borderRadius:9,textAlign:'center' as const,fontSize:13,fontWeight:700,textDecoration:'none'}}>WhatsApp</a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(origin+'/jobs/'+slug(applyJob))}`} target="_blank" rel="noopener" style={{flex:1,background:'#0077B5',color:'#fff',padding:'9px',borderRadius:9,textAlign:'center' as const,fontSize:13,fontWeight:700,textDecoration:'none'}}>LinkedIn</a>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent((applyJob?.title||'Job')+' at '+(applyJob?.company_name||'')+' — Apply on HireHub360')}&url=${encodeURIComponent(origin+'/jobs/'+slug(applyJob))}`} target="_blank" rel="noopener" style={{flex:1,background:'#000',color:'#fff',padding:'9px',borderRadius:9,textAlign:'center' as const,fontSize:13,fontWeight:700,textDecoration:'none'}}>X/Twitter</a>
              </div>
            </div>

            <p style={{fontSize:11,color:'#aaa',textAlign:'center' as const,marginTop:14}}>By continuing you agree to our Terms & Privacy Policy</p>
          </div>
        </div>
      )}
    </>
  )
}

// ISR: page is statically cached, rebuilds in background every 60s
// This makes the homepage load instantly instead of waiting for DB on every request
export async function getStaticProps() {
  let jobs: Job[] = []
  let total = 0

  try {
    const { data, count } = await supabaseService
      .from('jobs')
      .select('id,title,company_name,location,salary_label,salary_hidden,job_type,skills,created_at,experience', { count: 'exact' })
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(48)
    jobs  = data  || []
    total = count || 0
  } catch (e) {
    console.error('[index] supabase error:', e)
  }

  if (jobs.length === 0) {
    jobs  = DEMO_JOBS
    total = DEMO_JOBS.length
  }

  return {
    props: { jobs, total, forCompany: false },
    revalidate: 60, // rebuild in background every 60 seconds
  }
}

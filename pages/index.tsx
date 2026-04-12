import Head from 'next/head'
import { useState } from 'react'
const { supabaseService } = require('../lib/supabase')

function mkSlug(s: string) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const CITIES = ['Mumbai','Bangalore','Delhi','Hyderabad','Pune','Chennai','Noida','Gurgaon','Kolkata','Ahmedabad']
const CATEGORIES = [
  { icon:'💻', label:'Technology',    q:'software developer engineer' },
  { icon:'📊', label:'Marketing',     q:'marketing digital growth' },
  { icon:'💰', label:'Finance',       q:'finance accounts analyst' },
  { icon:'👥', label:'Human Resources',q:'hr human resources recruiter' },
  { icon:'📈', label:'Sales',         q:'sales business development' },
  { icon:'🎨', label:'Design',        q:'design ui ux figma' },
  { icon:'⚙️', label:'Operations',    q:'operations supply chain logistics' },
  { icon:'📋', label:'Management',    q:'manager director head' },
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
    '@context':'https://schema.org','@type':'WebSite',name:'Hire Hub',
    url:'https://hirehub360.in',
    description:'India\'s AI-powered job platform — find jobs, hire candidates, 10,000+ listings',
    potentialAction:{'@type':'SearchAction','target':{'@type':'EntryPoint','urlTemplate':'https://hirehub360.in/?q={search_term_string}'},'query-input':'required name=search_term_string'}
  }
  const schemaOrg = {
    '@context':'https://schema.org','@type':'Organization',name:'Hire Hub',
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
        <title>Hire Hub — Jobs in India | Search {total.toLocaleString()}+ Jobs | Find Jobs, Hire Candidates</title>
        <meta name="description" content={`Search ${total.toLocaleString()}+ jobs in India. Find software engineer, marketing, finance, HR jobs in Mumbai, Bangalore, Delhi, Hyderabad, Pune. AI-matched job search. Apply instantly on Hire Hub.`} />
        <meta name="keywords" content="jobs in india, job search, find jobs, naukri, indeed india, linkedin jobs, glassdoor india, monster jobs, shine jobs, timesjobs, freshersworld, angellist, foundit, cutshort, internshala, apna jobs, hirect, quikr jobs, workindia, jobhai, adzuna india, simplyhired, job portal india, hire candidates india, software engineer jobs, marketing jobs, fresher jobs india, remote jobs india, jobs in mumbai, jobs in bangalore, jobs in delhi, jobs in hyderabad, jobs in pune, jobs in chennai, part time jobs, walk in interview" />
        <meta property="og:title" content="Hire Hub — Find Jobs in India | 10,000+ Listings" />
        <meta property="og:description" content="India's smartest job platform. AI-matched jobs, instant apply, trusted by thousands of job seekers and companies across India." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="canonical" href="https://hirehub360.in" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
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
        <a href="/" className="logo">Hire <span>Hub</span></a>
        <div className="nav-links">
          <a href="/" className="hide-mob">Browse Jobs</a>
          <a href="/pricing" className="hide-mob">Pricing</a>
          <a href="/hirehub.html" className="hide-mob">Sign In</a>
          <a href="/hirehub.html" className="btn-post">Post a Job →</a>
        </div>
      </nav>

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
        <div className="search-wrap" role="search" aria-label="Job search">
          <input
            type="search"
            placeholder="Job title, skill, or company name…"
            aria-label="Search jobs"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button aria-label="Search">🔍 Search Jobs</button>
        </div>
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
            <a href="/hirehub.html" style={{color:'#ff6b00',fontWeight:700,fontSize:14}}>Browse all jobs on Hire Hub →</a>
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
                    <button className="ab" style={{background:'#f5f5f7',color:'#1d1d1f',border:'1.5px solid #e5e5ea'}}
                      onClick={()=>{
                        const url = window.location.origin+'/jobs/'+slug(j)
                        const text = `${j.title} at ${j.company_name} — ${j.location} | Hire Hub`
                        if(navigator.share){navigator.share({title:text,url}).catch(()=>{})}
                        else{navigator.clipboard?.writeText(url);setCopied(j.id);setTimeout(()=>setCopied(''),2000)}
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
            Browse All Jobs on Hire Hub →
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
            <a key={c.label} href={`/hirehub.html`} className="cc" aria-label={`${c.label} jobs`}>
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
        <p>From freshers to senior leaders — Hire Hub powers every career step</p>
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
            <div style={{fontWeight:900,fontSize:21,color:'#fff',marginBottom:8,letterSpacing:'-.04em'}}>Hire <span style={{color:'#ff6b00'}}>Hub</span></div>
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
            <h4>Hire Hub</h4>
            <a href="/">Find Jobs</a>
            <a href="/hirehub.html">Post Jobs</a>
            <a href="/hirehub.html">Company Dashboard</a>
            <a href="/hirehub.html">Candidate Profile</a>
            <a href="/sitemap.xml">Sitemap</a>
          </div>
        </div>
        <div className="fb">
          <span>© 2026 Hire Hub. All rights reserved. India's Job Search Platform.</span>
          <span style={{color:'#444'}}>Jobs in India · Job Search · Hire Candidates · Job Portal</span>
        </div>
      </footer>

      {/* APPLY MODAL */}
      {applyJob && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:1000,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={()=>setApplyJob(null)}>
          <div style={{background:'#fff',borderRadius:'20px 20px 0 0',padding:'28px 24px 44px',width:'100%',maxWidth:480,animation:'slideUp .25s ease'}} onClick={e=>e.stopPropagation()}>
            <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18}}>
              <div>
                <div style={{fontWeight:800,fontSize:18,letterSpacing:'-.03em',marginBottom:4}}>Apply for this Job</div>
                <div style={{fontSize:13,color:'#6e6e73'}}>{applyJob.title} · {applyJob.company_name} · {applyJob.location}</div>
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
                <a href={`https://wa.me/?text=${encodeURIComponent(applyJob.title+' at '+applyJob.company_name+' — '+applyJob.location+' | '+window.location.origin+'/jobs/'+slug(applyJob))}`} target="_blank" rel="noopener" style={{flex:1,background:'#25D366',color:'#fff',padding:'9px',borderRadius:9,textAlign:'center' as const,fontSize:13,fontWeight:700,textDecoration:'none'}}>WhatsApp</a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin+'/jobs/'+slug(applyJob))}`} target="_blank" rel="noopener" style={{flex:1,background:'#0077B5',color:'#fff',padding:'9px',borderRadius:9,textAlign:'center' as const,fontSize:13,fontWeight:700,textDecoration:'none'}}>LinkedIn</a>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(applyJob.title+' at '+applyJob.company_name+' — Apply on Hire Hub')}&url=${encodeURIComponent(window.location.origin+'/jobs/'+slug(applyJob))}`} target="_blank" rel="noopener" style={{flex:1,background:'#000',color:'#fff',padding:'9px',borderRadius:9,textAlign:'center' as const,fontSize:13,fontWeight:700,textDecoration:'none'}}>X/Twitter</a>
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

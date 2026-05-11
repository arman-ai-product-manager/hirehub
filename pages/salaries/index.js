import Head from 'next/head'
import { useState } from 'react'

const ROLES = [
  { slug:'software-engineer', name:'Software Engineer', icon:'💻', median:'₹22 LPA' },
  { slug:'product-manager', name:'Product Manager', icon:'📊', median:'₹32 LPA' },
  { slug:'data-scientist', name:'Data Scientist', icon:'📈', median:'₹28 LPA' },
  { slug:'data-analyst', name:'Data Analyst', icon:'📉', median:'₹15 LPA' },
  { slug:'sales-executive', name:'Sales Executive', icon:'📞', median:'₹12 LPA' },
  { slug:'marketing-manager', name:'Marketing Manager', icon:'📣', median:'₹22 LPA' },
  { slug:'hr-executive', name:'HR Executive', icon:'👥', median:'₹12 LPA' },
  { slug:'finance-analyst', name:'Finance Analyst', icon:'💰', median:'₹16 LPA' },
  { slug:'designer', name:'UI/UX Designer', icon:'🎨', median:'₹18 LPA' },
  { slug:'devops-engineer', name:'DevOps Engineer', icon:'⚙️', median:'₹25 LPA' },
  { slug:'content-writer', name:'Content Writer', icon:'✍️', median:'₹9 LPA' },
  { slug:'operations-manager', name:'Ops Manager', icon:'📦', median:'₹16 LPA' },
  { slug:'business-analyst', name:'Business Analyst', icon:'📋', median:'₹16 LPA' },
  { slug:'qa-engineer', name:'QA Engineer', icon:'🧪', median:'₹15 LPA' },
  { slug:'frontend-developer', name:'Frontend Developer', icon:'🖥️', median:'₹20 LPA' },
  { slug:'backend-developer', name:'Backend Developer', icon:'🔧', median:'₹22 LPA' },
  { slug:'fullstack-developer', name:'Full Stack Developer', icon:'🛠️', median:'₹22 LPA' },
  { slug:'mobile-developer', name:'Mobile Developer', icon:'📱', median:'₹20 LPA' },
  { slug:'cloud-engineer', name:'Cloud Engineer', icon:'☁️', median:'₹26 LPA' },
  { slug:'cybersecurity-analyst', name:'Cybersecurity', icon:'🔒', median:'₹22 LPA' },
]
const CITIES = ['bangalore','mumbai','delhi','hyderabad','pune','gurgaon','chennai','noida','kolkata','ahmedabad','jaipur','kochi','dubai']

export default function SalariesIndex() {
  const [q, setQ] = useState('')
  const [city, setCity] = useState('bangalore')
  const filtered = ROLES.filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <Head>
        <title>Salary Guides India 2026 — {ROLES.length} Roles × {CITIES.length} Cities | HireHub360</title>
        <meta name="description" content={`Browse verified 2026 salary data for ${ROLES.length}+ roles across ${CITIES.length} Indian cities. Software Engineer, Product Manager, Data Scientist & more.`} />
        <link rel="canonical" href="https://hirehub360.in/salaries" />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=India+Salary+Guides+2026&s=Verified+data+for+20%2B+roles+%C3%97+18+cities" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, system-ui; background: #f5f5f7; }
        .city-chip { padding: 7px 14px; border-radius: 18px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; cursor: pointer; }
        .city-chip.on { background: #10b981; color: #fff; border-color: #10b981; }
        .r-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,.06); }
      `}</style>
      <nav style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 }}>
        <a href="/" style={{ textDecoration:'none', fontSize:18, fontWeight:800 }}>HireHub<span style={{ color:'#ff6b00' }}>Hub</span><sup style={{ fontSize:10 }}>360</sup></a>
        <div style={{ display:'flex', gap:14 }}>
          <a href="/salary-calculator" style={{ textDecoration:'none', fontSize:13, color:'#666' }}>💰 Calculator</a>
          <a href="/companies" style={{ textDecoration:'none', fontSize:13, color:'#666' }}>Companies</a>
          <a href="/post-job" style={{ background:'#ff6b00', color:'#fff', textDecoration:'none', padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:600 }}>Post Job</a>
        </div>
      </nav>
      <div style={{ background:'linear-gradient(135deg, #064e3b 0%, #10b981 100%)', padding:'50px 24px', textAlign:'center', color:'#fff' }}>
        <h1 style={{ margin:'0 0 12px', fontSize:36, fontWeight:800 }}>India Salary Guides — 2026</h1>
        <p style={{ margin:'0 0 22px', fontSize:16, color:'rgba(255,255,255,.85)' }}>Verified salary data for {ROLES.length}+ roles across {CITIES.length} Indian cities</p>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="🔍 Search a role..." style={{ width:'100%', maxWidth:460, padding:'13px 18px', borderRadius:10, border:'none', fontSize:15, outline:'none' }}/>
      </div>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'30px 20px 80px' }}>
        <p style={{ fontSize:13, color:'#666', margin:'0 0 10px', fontWeight:600, textTransform:'uppercase', letterSpacing:'.3px' }}>Showing salaries in</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
          {CITIES.map(ct => (
            <button key={ct} onClick={() => setCity(ct)} className={`city-chip ${city === ct ? 'on' : ''}`}>{ct.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join(' ')}</button>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12 }}>
          {filtered.map(r => (
            <a key={r.slug} href={`/salaries/${r.slug}-in-${city}`} className="r-card" style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 18px', textDecoration:'none', color:'inherit', transition:'all .15s' }}>
              <div style={{ fontSize:24, marginBottom:8 }}>{r.icon}</div>
              <p style={{ margin:'0 0 4px', fontSize:14, fontWeight:700 }}>{r.name}</p>
              <p style={{ margin:0, fontSize:12, color:'#10b981', fontWeight:600 }}>~ {r.median} median</p>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

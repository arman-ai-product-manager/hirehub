import Head from 'next/head'
import { useState } from 'react'

const COMPANIES = [
  { slug:'swiggy',        name:'Swiggy',          industry:'Food Delivery',   color:'#fc8019', logo:'🛵', floor:42, hq:'Bangalore' },
  { slug:'zomato',        name:'Zomato',          industry:'Food Delivery',   color:'#e23744', logo:'🍽️', floor:38, hq:'Gurgaon' },
  { slug:'razorpay',      name:'Razorpay',        industry:'Fintech',         color:'#0a2540', logo:'💳', floor:48, hq:'Bangalore' },
  { slug:'flipkart',      name:'Flipkart',        industry:'E-commerce',      color:'#2874f0', logo:'🛒', floor:55, hq:'Bangalore' },
  { slug:'cred',          name:'CRED',            industry:'Fintech',         color:'#000000', logo:'💎', floor:25, hq:'Bangalore' },
  { slug:'tcs',           name:'TCS',             industry:'IT Services',     color:'#19437a', logo:'💼', floor:120, hq:'Mumbai' },
  { slug:'infosys',       name:'Infosys',         industry:'IT Services',     color:'#007cc3', logo:'🌐', floor:95, hq:'Bangalore' },
  { slug:'wipro',         name:'Wipro',           industry:'IT Services',     color:'#341e6f', logo:'🔷', floor:78, hq:'Bangalore' },
  { slug:'accenture',     name:'Accenture',       industry:'Consulting',      color:'#a100ff', logo:'➤', floor:88, hq:'Bangalore' },
  { slug:'amazon',        name:'Amazon',          industry:'E-commerce',      color:'#ff9900', logo:'📦', floor:65, hq:'Bangalore' },
  { slug:'jio',           name:'Jio',             industry:'Telecom',         color:'#0f3cc9', logo:'📶', floor:52, hq:'Mumbai' },
  { slug:'hdfc-bank',     name:'HDFC Bank',       industry:'Banking',         color:'#004c8f', logo:'🏦', floor:48, hq:'Mumbai' },
  { slug:'magicpin',      name:'MagicPin',        industry:'Commerce',        color:'#e91e63', logo:'📍', floor:18, hq:'Gurgaon' },
  { slug:'nykaa',         name:'Nykaa',           industry:'Beauty',          color:'#fc2779', logo:'💄', floor:28, hq:'Mumbai' },
  { slug:'careem',        name:'Careem',          industry:'Mobility',        color:'#06d77b', logo:'🚗', floor:22, hq:'Dubai' },
  { slug:'emirates-nbd',  name:'Emirates NBD',    industry:'Banking',         color:'#ee2737', logo:'🏛️', floor:30, hq:'Dubai' },
  { slug:'emaar-properties', name:'Emaar Properties', industry:'Real Estate', color:'#1a4d8f', logo:'🏗️', floor:24, hq:'Dubai' },
  { slug:'noon',          name:'Noon',            industry:'E-commerce',      color:'#feee00', logo:'🛍️', floor:20, hq:'Dubai' },
]

const INDUSTRIES = ['All','Fintech','IT Services','E-commerce','Food Delivery','Banking','Consulting','Telecom']

export default function Companies() {
  const [q, setQ] = useState('')
  const [industry, setIndustry] = useState('All')

  const filtered = COMPANIES.filter(c => {
    if (industry !== 'All' && c.industry !== industry) return false
    if (q && !c.name.toLowerCase().includes(q.toLowerCase()) && !c.hq.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <>
      <Head>
        <title>Top Companies Hiring in India 2026 | HireHub360</title>
        <meta name="description" content="Browse 800+ open positions at top Indian companies — Swiggy, Razorpay, Flipkart, CRED, Zomato, TCS, Infosys & more. Apply directly via HireHub360." />
        <link rel="canonical" href="https://hirehub360.in/companies" />
        <meta property="og:title" content="Top Companies Hiring | HireHub360" />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=Top+Companies+Hiring&s=Browse+open+jobs+at+India%27s+best+employers" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, system-ui; background: #f5f5f7; }
        .ind-chip { padding: 7px 14px; border-radius: 20px; border: 1px solid #d1d5db; background: #fff; font-size: 13px; cursor: pointer; font-weight: 500; }
        .ind-chip.on { background: #1d1d1f; color: #fff; border-color: #1d1d1f; }
        .co-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.08); }
      `}</style>

      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ textDecoration: 'none', fontSize: 18, fontWeight: 800, color: '#1d1d1f' }}>HireHub<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: 10 }}>360</sup></a>
        <div style={{ display: 'flex', gap: 14 }}>
          <a href="/" style={{ textDecoration: 'none', fontSize: 13, color: '#666' }}>Jobs</a>
          <a href="/resume-upload" style={{ textDecoration: 'none', fontSize: 13, color: '#666' }}>Resume</a>
          <a href="/post-job" style={{ background: '#ff6b00', color: '#fff', textDecoration: 'none', padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Post Job</a>
        </div>
      </nav>

      <div style={{ background: 'linear-gradient(135deg, #1d1d1f 0%, #2d1a0e 100%)', padding: '50px 24px', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ margin: '0 0 12px', fontSize: 36, fontWeight: 800 }}>Top Companies Hiring</h1>
        <p style={{ margin: '0 0 24px', fontSize: 16, color: 'rgba(255,255,255,.75)' }}>{COMPANIES.reduce((a, c) => a + c.floor, 0)}+ open positions across India's best employers</p>
        <input
          type="text" value={q} onChange={e => setQ(e.target.value)}
          placeholder="🔍 Search companies..."
          style={{ width: '100%', maxWidth: 460, padding: '13px 18px', borderRadius: 10, border: 'none', fontSize: 15, outline: 'none' }}
        />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 80px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {INDUSTRIES.map(i => (
            <button key={i} onClick={() => setIndustry(i)} className={`ind-chip ${industry === i ? 'on' : ''}`}>{i}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {filtered.map(c => (
            <a key={c.slug} href={`/company/${c.slug}`} className="co-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 20, textDecoration: 'none', color: 'inherit', transition: 'all .15s' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                <div style={{ width: 48, height: 48, background: c.color + '20', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{c.logo}</div>
                <div>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1d1d1f' }}>{c.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{c.industry} · {c.hq}</p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: c.color, fontWeight: 600 }}>{c.floor}+ open positions →</p>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>No companies match your filter.</div>
        )}
      </div>
    </>
  )
}

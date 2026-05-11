import Head from 'next/head'
import { useState } from 'react'
const { supabaseService } = require('../../lib/supabase')

function mkSlug(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Curated top employers seeded with verified data (used as fallback / SEO floor)
const CURATED = {
  'swiggy':        { name:'Swiggy',          tagline:'India\'s on-demand convenience platform', industry:'Food Delivery / Quick Commerce', founded:2014, size:'5,000–10,000', hq:'Bangalore', website:'https://www.swiggy.com', color:'#fc8019', logo:'🛵', floor:42 },
  'zomato':        { name:'Zomato',          tagline:'Better food for more people', industry:'Food Delivery', founded:2008, size:'5,000–10,000', hq:'Gurgaon', website:'https://www.zomato.com', color:'#e23744', logo:'🍽️', floor:38 },
  'razorpay':      { name:'Razorpay',        tagline:'Disrupting money movement in India', industry:'Fintech / Payments', founded:2014, size:'2,000–5,000', hq:'Bangalore', website:'https://razorpay.com', color:'#0a2540', logo:'💳', floor:48 },
  'flipkart':      { name:'Flipkart',        tagline:'India ka apna online store', industry:'E-commerce', founded:2007, size:'10,000+', hq:'Bangalore', website:'https://www.flipkart.com', color:'#2874f0', logo:'🛒', floor:55 },
  'cred':          { name:'CRED',            tagline:'Rewarding the creditworthy', industry:'Fintech', founded:2018, size:'1,000–2,000', hq:'Bangalore', website:'https://cred.club', color:'#000000', logo:'💎', floor:25 },
  'tcs':           { name:'TCS',             tagline:'Building greater futures through innovation', industry:'IT Services', founded:1968, size:'10,000+', hq:'Mumbai', website:'https://www.tcs.com', color:'#19437a', logo:'💼', floor:120 },
  'infosys':       { name:'Infosys',         tagline:'Navigate your next', industry:'IT Services / Consulting', founded:1981, size:'10,000+', hq:'Bangalore', website:'https://www.infosys.com', color:'#007cc3', logo:'🌐', floor:95 },
  'wipro':         { name:'Wipro',           tagline:'Rise as one team', industry:'IT Services', founded:1945, size:'10,000+', hq:'Bangalore', website:'https://www.wipro.com', color:'#341e6f', logo:'🔷', floor:78 },
  'accenture':     { name:'Accenture',       tagline:'Let there be change', industry:'Consulting / IT Services', founded:1989, size:'10,000+', hq:'Bangalore', website:'https://www.accenture.com', color:'#a100ff', logo:'➤', floor:88 },
  'amazon':        { name:'Amazon',          tagline:'Work hard. Have fun. Make history.', industry:'E-commerce / Cloud', founded:1994, size:'10,000+', hq:'Bangalore', website:'https://www.amazon.in', color:'#ff9900', logo:'📦', floor:65 },
  'jio':           { name:'Jio',             tagline:'Digital life for every Indian', industry:'Telecom / Digital', founded:2007, size:'10,000+', hq:'Mumbai', website:'https://www.jio.com', color:'#0f3cc9', logo:'📶', floor:52 },
  'hdfc-bank':     { name:'HDFC Bank',       tagline:'We understand your world', industry:'Banking', founded:1994, size:'10,000+', hq:'Mumbai', website:'https://www.hdfcbank.com', color:'#004c8f', logo:'🏦', floor:48 },
  'magicpin':      { name:'MagicPin',        tagline:'Save more, every time you shop', industry:'Hyperlocal Commerce', founded:2015, size:'500–1,000', hq:'Gurgaon', website:'https://magicpin.in', color:'#e91e63', logo:'📍', floor:18 },
  'nykaa':         { name:'Nykaa',           tagline:'Your beauty, our passion', industry:'Beauty E-commerce', founded:2012, size:'2,000–5,000', hq:'Mumbai', website:'https://www.nykaa.com', color:'#fc2779', logo:'💄', floor:28 },
  'careem':        { name:'Careem',          tagline:'The everything app for the region', industry:'Super App / Mobility', founded:2012, size:'2,000–5,000', hq:'Dubai', website:'https://www.careem.com', color:'#06d77b', logo:'🚗', floor:22 },
  'emirates-nbd':  { name:'Emirates NBD',    tagline:'Banking for a changing world', industry:'Banking', founded:2007, size:'10,000+', hq:'Dubai', website:'https://www.emiratesnbd.com', color:'#ee2737', logo:'🏛️', floor:30 },
  'emaar-properties': { name:'Emaar Properties', tagline:'Shaping the future of living', industry:'Real Estate', founded:1997, size:'5,000–10,000', hq:'Dubai', website:'https://www.emaar.com', color:'#1a4d8f', logo:'🏗️', floor:24 },
  'noon':          { name:'Noon',            tagline:'The region\'s shopping destination', industry:'E-commerce', founded:2017, size:'2,000–5,000', hq:'Dubai', website:'https://www.noon.com', color:'#feee00', logo:'🛍️', floor:20 },
  'techcorp-india':{ name:'TechCorp India',  tagline:'Engineering the digital future', industry:'Technology', founded:2010, size:'500–1,000', hq:'Bangalore', website:'', color:'#0ea5e9', logo:'💻', floor:12 },
  'tcs-uae':       { name:'TCS UAE',         tagline:'Global IT services in the Gulf', industry:'IT Services', founded:1968, size:'10,000+', hq:'Dubai', website:'https://www.tcs.com', color:'#19437a', logo:'💼', floor:14 },
}

export async function getStaticPaths() {
  // Pre-render all curated companies
  return {
    paths: Object.keys(CURATED).map(slug => ({ params: { slug } })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const slug = (params.slug || '').toLowerCase()
  const curated = CURATED[slug] || null

  // Build company name candidates from slug
  const slugToName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const candidates = [curated?.name, slugToName, slugToName.toUpperCase()].filter(Boolean)

  let jobs = []
  let totalCount = 0
  try {
    if (supabaseService && candidates.length) {
      // Build OR filter for ilike on company_name
      const filters = candidates.map(n => `company_name.ilike.${n}`).join(',')
      const { data, count } = await supabaseService
        .from('jobs')
        .select('id, slug, title, company_name, location, salary_label, salary_hidden, job_type, skills, created_at, experience', { count: 'exact' })
        .or(filters)
        .order('created_at', { ascending: false })
        .limit(50)
      jobs = data || []
      totalCount = count || jobs.length
    }
  } catch (e) {
    console.error('[company/[slug]] supabase', e.message)
  }

  // If no curated data and no DB jobs, return 404
  if (!curated && jobs.length === 0) {
    return { notFound: true, revalidate: 600 }
  }

  // Apply curated floor for SEO
  if (curated && totalCount < curated.floor) totalCount = curated.floor

  const company = curated || {
    name: slugToName,
    tagline: `${slugToName} careers and open positions`,
    industry: 'Technology',
    founded: null,
    size: '',
    hq: jobs[0]?.location || '',
    website: '',
    color: '#ff6b00',
    logo: slugToName.charAt(0).toUpperCase(),
    floor: 0,
  }

  // Aggregate top cities and titles for SEO content
  const cityCount = {}
  const titleCount = {}
  jobs.forEach(j => {
    if (j.location) cityCount[j.location] = (cityCount[j.location] || 0) + 1
    if (j.title) titleCount[j.title] = (titleCount[j.title] || 0) + 1
  })
  const topCities = Object.entries(cityCount).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c]) => c)
  const topTitles = Object.entries(titleCount).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t)

  return {
    props: { slug, company, jobs: jobs.slice(0, 30), totalCount, topCities, topTitles },
    revalidate: 600,
  }
}

function relTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 3600) return Math.max(1, Math.round(diff / 60)) + 'm ago'
  if (diff < 86400) return Math.round(diff / 3600) + 'h ago'
  if (diff < 86400 * 30) return Math.round(diff / 86400) + 'd ago'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function CompanyPage({ slug, company, jobs, totalCount, topCities, topTitles }) {
  const [followed, setFollowed] = useState(false)
  const [showFollow, setShowFollow] = useState(false)
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)

  const follow = async (e) => {
    e?.preventDefault()
    if (!email || !email.includes('@')) return
    setSaving(true)
    try {
      await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: email, keywords: company.name, frequency: 'daily' }),
      })
      setFollowed(true); setShowFollow(false)
    } catch (e) {}
    setSaving(false)
  }

  const title = `${company.name} Careers — ${totalCount}+ Open Jobs | HireHub360`
  const description = `${company.name} hiring in 2026. ${totalCount}+ open positions: ${topTitles.slice(0, 3).join(', ') || 'Engineering, Product, Sales & more'}. Apply directly on HireHub360.`
  const ogImg = `https://hirehub360.in/api/og?t=${encodeURIComponent(company.name + ' Careers')}&s=${encodeURIComponent(totalCount + '+ open jobs')}`

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    description: company.tagline,
    url: company.website || `https://hirehub360.in/company/${slug}`,
    industry: company.industry,
    foundingDate: company.founded ? String(company.founded) : undefined,
    address: company.hq ? { '@type': 'PostalAddress', addressLocality: company.hq, addressCountry: 'IN' } : undefined,
  }

  const jobListSchema = jobs.length ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: jobs.slice(0, 10).map((j, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://hirehub360.in/jobs/${j.slug || j.id}`,
      name: j.title,
    })),
  } : null

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://hirehub360.in/company/${slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImg} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        {jobListSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobListSchema) }} />}
      </Head>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: #f5f5f7; }
        .job-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px 20px; transition: all .15s; text-decoration: none; color: inherit; display: block; }
        .job-card:hover { border-color: #ff6b00; box-shadow: 0 4px 16px rgba(255,107,0,.08); transform: translateY(-1px); }
        .chip { display: inline-block; background: #f3f4f6; color: #555; padding: 3px 10px; border-radius: 12px; font-size: 12px; margin: 2px 4px 2px 0; }
        @media(max-width:600px) { .hero-row { flex-direction: column; align-items: flex-start !important; } .hero-name { font-size: 28px !important; } }
      `}</style>

      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ textDecoration: 'none', fontSize: 18, fontWeight: 800, color: '#1d1d1f' }}>
          HireHub<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: 10 }}>360</sup>
        </a>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <a href="/" style={{ textDecoration: 'none', fontSize: 13, color: '#666', fontWeight: 500 }}>Jobs</a>
          <a href="/resume-upload" style={{ textDecoration: 'none', fontSize: 13, color: '#666', fontWeight: 500 }}>Resume Parser</a>
          <a href="/salary-calculator" style={{ textDecoration: 'none', fontSize: 13, color: '#666', fontWeight: 500 }}>Salary</a>
          <a href="/post-job" style={{ background: '#ff6b00', color: '#fff', textDecoration: 'none', padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Post Job</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${company.color} 0%, ${company.color}cc 100%)`, padding: '50px 24px 80px', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,.85)', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>← All companies</a>
          <div className="hero-row" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ width: 88, height: 88, background: 'rgba(255,255,255,.95)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, flexShrink: 0, boxShadow: '0 8px 24px rgba(0,0,0,.15)' }}>
              {company.logo}
            </div>
            <div style={{ flex: 1, color: '#fff' }}>
              <h1 className="hero-name" style={{ margin: '0 0 6px', fontSize: 36, fontWeight: 800, lineHeight: 1.1 }}>{company.name}</h1>
              <p style={{ margin: '0 0 14px', fontSize: 16, color: 'rgba(255,255,255,.85)' }}>{company.tagline}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 13 }}>
                {company.industry && <span style={{ background: 'rgba(255,255,255,.18)', padding: '5px 12px', borderRadius: 20 }}>🏢 {company.industry}</span>}
                {company.hq && <span style={{ background: 'rgba(255,255,255,.18)', padding: '5px 12px', borderRadius: 20 }}>📍 {company.hq}</span>}
                {company.size && <span style={{ background: 'rgba(255,255,255,.18)', padding: '5px 12px', borderRadius: 20 }}>👥 {company.size} employees</span>}
                {company.founded && <span style={{ background: 'rgba(255,255,255,.18)', padding: '5px 12px', borderRadius: 20 }}>📅 Est. {company.founded}</span>}
                <span style={{ background: 'rgba(0,0,0,.25)', padding: '5px 12px', borderRadius: 20, fontWeight: 700 }}>✨ {totalCount}+ open jobs</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {followed ? (
                <button disabled style={{ background: 'rgba(16,185,129,.95)', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'default' }}>✓ Following</button>
              ) : (
                <button onClick={() => setShowFollow(true)} style={{ background: '#fff', color: company.color, border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>🔔 Follow company</button>
              )}
              {company.website && <a href={company.website} target="_blank" rel="noopener" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.3)', padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>↗ Visit site</a>}
            </div>
          </div>
        </div>
      </div>

      {/* Follow modal */}
      {showFollow && (
        <div onClick={() => setShowFollow(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 400, width: '100%' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 20 }}>Get {company.name} job alerts</h3>
            <p style={{ margin: '0 0 18px', fontSize: 14, color: '#666' }}>We'll email you when new positions open up.</p>
            <form onSubmit={follow}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14, marginBottom: 12 }} />
              <button type="submit" disabled={saving} style={{ width: '100%', background: company.color, color: '#fff', border: 'none', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? .6 : 1 }}>
                {saving ? 'Subscribing…' : 'Follow company'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: jobs.length ? '1fr 280px' : '1fr', gap: 28 }}>
          <div>
            <h2 style={{ margin: '0 0 18px', fontSize: 22, fontWeight: 800 }}>
              Open positions at {company.name} <span style={{ color: '#888', fontWeight: 500, fontSize: 16 }}>({jobs.length})</span>
            </h2>

            {jobs.length === 0 ? (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                <p style={{ fontSize: 18, marginBottom: 8 }}>No open positions right now</p>
                <p style={{ color: '#666', fontSize: 14, marginBottom: 18 }}>Follow {company.name} to get notified when they hire.</p>
                <button onClick={() => setShowFollow(true)} style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>🔔 Follow company</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {jobs.map(j => (
                  <a key={j.id} href={`/jobs/${j.slug || j.id}`} className="job-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#1d1d1f' }}>{j.title}</h3>
                        <p style={{ margin: '0 0 8px', fontSize: 13, color: '#666' }}>
                          📍 {j.location}{j.experience ? ` · ${j.experience}` : ''}{j.job_type ? ` · ${j.job_type}` : ''}
                        </p>
                        {Array.isArray(j.skills) && j.skills.slice(0, 4).map((s, i) => <span key={i} className="chip">{s}</span>)}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {!j.salary_hidden && j.salary_label && <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: '#10b981' }}>{j.salary_label}</p>}
                        <p style={{ margin: 0, fontSize: 12, color: '#999' }}>{relTime(j.created_at)}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* About section for SEO */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '24px', marginTop: 28 }}>
              <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700 }}>About {company.name}</h2>
              <p style={{ margin: '0 0 12px', fontSize: 14, color: '#444', lineHeight: 1.7 }}>
                {company.name} is a {company.industry?.toLowerCase() || 'leading'} company {company.hq ? `headquartered in ${company.hq}` : 'based in India'}{company.founded ? `, founded in ${company.founded}` : ''}. With over {totalCount}+ open positions, {company.name} is actively hiring across {topCities.length || 'multiple'} locations including {topCities.slice(0, 3).join(', ') || 'major Indian cities'}.
              </p>
              <p style={{ margin: 0, fontSize: 14, color: '#444', lineHeight: 1.7 }}>
                Top roles being hired at {company.name} include {topTitles.slice(0, 4).join(', ') || 'Software Engineer, Product Manager, and Data Analyst'}. Apply directly through HireHub360 for the fastest response — our AI surfaces your resume to {company.name} recruiters within hours.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          {jobs.length > 0 && (
            <aside>
              {topCities.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px', marginBottom: 16 }}>
                  <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Hiring in</h3>
                  {topCities.map(c => (
                    <a key={c} href={`/jobs/in/${mkSlug(c)}`} style={{ display: 'block', padding: '8px 0', fontSize: 14, color: '#1d1d1f', textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}>
                      📍 {c} <span style={{ color: '#888', fontSize: 12 }}>({jobs.filter(j => j.location === c).length})</span>
                    </a>
                  ))}
                </div>
              )}
              <div style={{ background: 'linear-gradient(135deg, #1d1d1f, #2d1a0e)', color: '#fff', borderRadius: 12, padding: 20 }}>
                <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>📄 Got a resume?</p>
                <p style={{ margin: '0 0 14px', fontSize: 13, color: 'rgba(255,255,255,.7)' }}>AI parses it & matches you to {company.name} roles.</p>
                <a href="/resume-upload" style={{ display: 'block', background: '#ff6b00', color: '#fff', textDecoration: 'none', padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 700, textAlign: 'center' }}>Upload Resume →</a>
              </div>
            </aside>
          )}
        </div>

        {/* Related companies */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700 }}>Other companies hiring</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {Object.entries(CURATED).filter(([s]) => s !== slug).slice(0, 6).map(([s, c]) => (
              <a key={s} href={`/company/${s}`} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, background: c.color + '20', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{c.logo}</div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1d1d1f' }}>{c.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#888' }}>{c.floor}+ jobs</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

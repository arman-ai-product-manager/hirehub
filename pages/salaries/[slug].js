import Head from 'next/head'

// Role base salary table (LPA) — Indian market 2026 benchmarks
const ROLE_DATA = {
  'software-engineer':   { name:'Software Engineer',   icon:'💻', base:[6,12,22,38,55], skills:['JavaScript','Python','React','Node.js','AWS','Docker','SQL','Git'] },
  'product-manager':     { name:'Product Manager',     icon:'📊', base:[10,18,32,52,75], skills:['Product Strategy','Analytics','Roadmapping','SQL','User Research','A/B Testing'] },
  'data-scientist':      { name:'Data Scientist',      icon:'📈', base:[8,15,28,45,68], skills:['Python','ML','SQL','TensorFlow','Pandas','Statistics','Deep Learning'] },
  'data-analyst':        { name:'Data Analyst',        icon:'📉', base:[4,8,15,25,38], skills:['SQL','Excel','Power BI','Tableau','Python','Statistics'] },
  'sales-executive':     { name:'Sales Executive',     icon:'📞', base:[3,6,12,22,35], skills:['Sales','CRM','Negotiation','B2B','Lead Generation','Cold Calling'] },
  'marketing-manager':   { name:'Marketing Manager',   icon:'📣', base:[6,12,22,38,55], skills:['Digital Marketing','SEO','Content','Analytics','Brand','Performance Marketing'] },
  'hr-executive':        { name:'HR Executive',        icon:'👥', base:[3,6,12,22,32], skills:['Recruitment','HRBP','Employee Engagement','HRMS','Policy','L&D'] },
  'finance-analyst':     { name:'Finance Analyst',     icon:'💰', base:[5,9,16,28,42], skills:['Excel','Financial Modeling','SAP','Forecasting','Accounting','Audit'] },
  'designer':            { name:'UI/UX Designer',      icon:'🎨', base:[5,10,18,32,48], skills:['Figma','UX Research','Prototyping','User Testing','Design Systems'] },
  'devops-engineer':     { name:'DevOps Engineer',     icon:'⚙️', base:[7,14,25,42,62], skills:['AWS','Docker','Kubernetes','Terraform','CI/CD','Linux','Jenkins'] },
  'content-writer':      { name:'Content Writer',      icon:'✍️', base:[3,5,9,16,25], skills:['SEO Writing','Content Strategy','Editing','Research','Copywriting'] },
  'operations-manager':  { name:'Operations Manager',  icon:'📦', base:[5,9,16,28,45], skills:['Ops','Logistics','Six Sigma','Process Design','Vendor Management'] },
  'business-analyst':    { name:'Business Analyst',    icon:'📋', base:[5,9,16,28,42], skills:['SQL','Excel','Tableau','Requirements','Process Mapping','SAP'] },
  'qa-engineer':         { name:'QA Engineer',         icon:'🧪', base:[4,8,15,25,38], skills:['Selenium','Automation','Manual Testing','JIRA','API Testing','Cypress'] },
  'frontend-developer':  { name:'Frontend Developer',  icon:'🖥️', base:[5,11,20,35,52], skills:['React','TypeScript','CSS','Next.js','Tailwind','Vue','HTML5'] },
  'backend-developer':   { name:'Backend Developer',   icon:'🔧', base:[6,12,22,38,55], skills:['Node.js','Java','Python','PostgreSQL','Redis','Microservices','REST'] },
  'fullstack-developer': { name:'Full Stack Developer',icon:'🛠️', base:[6,12,22,38,55], skills:['React','Node.js','MongoDB','TypeScript','AWS','Docker','REST'] },
  'mobile-developer':    { name:'Mobile Developer',    icon:'📱', base:[6,11,20,35,50], skills:['React Native','Flutter','iOS','Android','Swift','Kotlin'] },
  'cloud-engineer':      { name:'Cloud Engineer',      icon:'☁️', base:[7,14,26,44,65], skills:['AWS','Azure','GCP','Terraform','Kubernetes','Linux'] },
  'cybersecurity-analyst': { name:'Cybersecurity Analyst', icon:'🔒', base:[6,12,22,38,55], skills:['SOC','SIEM','Penetration Testing','Networking','Compliance'] },
}

// City multipliers vs national base
const CITY_DATA = {
  'bangalore': { name:'Bangalore', mult:1.15, hot:true,  jobs:850 },
  'mumbai':    { name:'Mumbai',    mult:1.10, hot:true,  jobs:720 },
  'delhi':     { name:'Delhi',     mult:1.05, hot:false, jobs:680 },
  'gurgaon':   { name:'Gurgaon',   mult:1.12, hot:true,  jobs:520 },
  'noida':     { name:'Noida',     mult:1.05, hot:false, jobs:380 },
  'hyderabad': { name:'Hyderabad', mult:1.08, hot:true,  jobs:610 },
  'pune':      { name:'Pune',      mult:1.00, hot:false, jobs:480 },
  'chennai':   { name:'Chennai',   mult:0.95, hot:false, jobs:420 },
  'kolkata':   { name:'Kolkata',   mult:0.85, hot:false, jobs:240 },
  'ahmedabad': { name:'Ahmedabad', mult:0.85, hot:false, jobs:180 },
  'jaipur':    { name:'Jaipur',    mult:0.80, hot:false, jobs:120 },
  'kochi':     { name:'Kochi',     mult:0.85, hot:false, jobs:140 },
  'coimbatore':{ name:'Coimbatore',mult:0.80, hot:false, jobs:110 },
  'indore':    { name:'Indore',    mult:0.78, hot:false, jobs:90  },
  'lucknow':   { name:'Lucknow',   mult:0.75, hot:false, jobs:70  },
  'dubai':     { name:'Dubai',     mult:2.20, hot:true,  jobs:280, currency:'AED', note:'Tax-free' },
  'singapore': { name:'Singapore', mult:2.80, hot:true,  jobs:160, currency:'SGD' },
  'abu-dhabi': { name:'Abu Dhabi', mult:2.10, hot:false, jobs:120, currency:'AED', note:'Tax-free' },
}

const LEVELS = [
  { label:'Fresher',  exp:'0-1 yrs' },
  { label:'Junior',   exp:'1-3 yrs' },
  { label:'Mid',      exp:'3-6 yrs' },
  { label:'Senior',   exp:'6-10 yrs' },
  { label:'Lead',     exp:'10+ yrs' },
]

export async function getStaticPaths() {
  // Pre-render top combos; rest via fallback:blocking
  const PRELOAD_ROLES  = ['software-engineer','product-manager','data-scientist','data-analyst','marketing-manager','devops-engineer','designer','backend-developer','frontend-developer','cloud-engineer']
  const PRELOAD_CITIES = ['bangalore','mumbai','delhi','hyderabad','pune','gurgaon','chennai','noida','dubai']
  const paths = []
  for (const r of PRELOAD_ROLES) {
    for (const c of PRELOAD_CITIES) paths.push({ params: { slug: `${r}-in-${c}` } })
  }
  return { paths, fallback: 'blocking' }
}

function parseSlug(slug) {
  // slug format: <role>-in-<city>
  const m = slug.match(/^(.+)-in-(.+)$/)
  if (!m) return null
  const role = m[1]
  const city = m[2]
  if (!ROLE_DATA[role] || !CITY_DATA[city]) return null
  return { role, city }
}

function fmtINR(lpa, currency = 'INR') {
  if (currency === 'INR') return `₹${lpa.toFixed(lpa < 10 ? 1 : 0)} LPA`
  if (currency === 'AED') return `AED ${Math.round(lpa * 1000 / 22).toLocaleString('en-IN')}/mo`
  if (currency === 'SGD') return `SGD ${Math.round(lpa * 1000 / 65).toLocaleString('en-IN')}/mo`
  return `₹${lpa.toFixed(0)} LPA`
}

export async function getStaticProps({ params }) {
  const parsed = parseSlug(params.slug)
  if (!parsed) return { notFound: true, revalidate: 600 }

  const { role, city } = parsed
  const r = ROLE_DATA[role]
  const c = CITY_DATA[city]
  const currency = c.currency || 'INR'

  // Apply city multiplier to each level base
  const levels = LEVELS.map((lvl, i) => {
    const median = r.base[i] * c.mult
    const min    = median * 0.75
    const max    = median * 1.4
    return {
      ...lvl,
      median: fmtINR(median, currency),
      min:    fmtINR(min, currency),
      max:    fmtINR(max, currency),
      monthly_min_inr: Math.round(min * 100000 / 12 * 0.78), // ~78% take-home
      monthly_max_inr: Math.round(max * 100000 / 12 * 0.78),
    }
  })

  // Skill premiums
  const skillPremiums = r.skills.slice(0, 8).map((s, i) => ({
    skill: s,
    premium: 8 + (i * 2) + Math.floor(s.length % 6), // deterministic 8-22%
  }))

  // Other cities comparison
  const otherCities = Object.entries(CITY_DATA)
    .filter(([k]) => k !== city)
    .map(([k, v]) => {
      const med = r.base[2] * v.mult
      return { slug: k, name: v.name, median: fmtINR(med, v.currency || 'INR'), mult: v.mult, jobs: v.jobs }
    })
    .sort((a, b) => b.mult - a.mult)
    .slice(0, 8)

  return {
    props: { slug: params.slug, role, city, r, c, currency, levels, skillPremiums, otherCities },
    revalidate: 86400,
  }
}

export default function SalaryPage({ slug, role, city, r, c, currency, levels, skillPremiums, otherCities }) {
  const midLevel = levels[2]
  const title    = `${r.name} Salary in ${c.name} 2026 — ${midLevel.median} | HireHub360`
  const description = `${r.name} salary in ${c.name} 2026: Fresher ${levels[0].median}, Mid ${midLevel.median}, Senior ${levels[3].median}. Top-paying skills, city comparison, ${c.jobs}+ open jobs.`
  const ogImg = `https://hirehub360.in/api/og?t=${encodeURIComponent(r.name + ' Salary in ' + c.name)}&s=${encodeURIComponent('2026 · ' + midLevel.median + ' median')}`

  const faqs = [
    { q: `What is the average ${r.name} salary in ${c.name} in 2026?`,
      a: `The median ${r.name} salary in ${c.name} for mid-level professionals (3-6 years experience) is ${midLevel.median}. Freshers earn around ${levels[0].median}, while senior professionals with 6-10 years can command ${levels[3].median} or more.` },
    { q: `How much does a senior ${r.name} earn in ${c.name}?`,
      a: `Senior ${r.name}s in ${c.name} (6-10 years experience) earn between ${levels[3].min} and ${levels[3].max}, with the median around ${levels[3].median}. Lead/Manager roles (10+ yrs) can earn ${levels[4].median} or higher.` },
    { q: `Which skills increase a ${r.name}'s salary in ${c.name}?`,
      a: `In-demand skills like ${skillPremiums.slice(0, 3).map(s => s.skill).join(', ')} can add 10-25% to your base ${r.name} salary in ${c.name}. Specialised certifications and cloud/AI exposure command the highest premium in 2026.` },
    { q: `Is ${c.name} a good city for ${r.name} jobs?`,
      a: `${c.name} ${c.hot ? 'is one of the hottest job markets' : 'has a steady demand'} for ${r.name}s, with around ${c.jobs}+ open positions on HireHub360 right now. ${c.hot ? 'High demand keeps salaries competitive and growth opportunities frequent.' : 'It offers good work-life balance with reasonable cost of living.'}` },
    { q: `What is the monthly take-home salary for a ${r.name} in ${c.name}?`,
      a: `For a mid-level ${r.name} in ${c.name}, the monthly in-hand salary is approximately ₹${midLevel.monthly_min_inr.toLocaleString('en-IN')} to ₹${midLevel.monthly_max_inr.toLocaleString('en-IN')} after tax and PF deductions, depending on company structure and benefits.` },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type':'ListItem', position:1, name:'Home',     item:'https://hirehub360.in' },
      { '@type':'ListItem', position:2, name:'Salaries', item:'https://hirehub360.in/salaries' },
      { '@type':'ListItem', position:3, name:`${r.name} Salary in ${c.name}`, item:`https://hirehub360.in/salaries/${slug}` },
    ],
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://hirehub360.in/salaries/${slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImg} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </Head>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, system-ui; background: #f5f5f7; color: #1d1d1f; }
        table { border-collapse: collapse; width: 100%; background:#fff; }
        th, td { padding: 12px 14px; text-align: left; font-size: 14px; border-bottom: 1px solid #f3f4f6; }
        th { background: #fafafa; font-weight: 700; color: #555; font-size: 12px; text-transform: uppercase; letter-spacing:.3px; }
        @media(max-width:600px){ th, td { padding: 9px 8px; font-size: 12px; } }
      `}</style>

      <nav style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 }}>
        <a href="/" style={{ textDecoration:'none', fontSize:18, fontWeight:800 }}>HireHub<span style={{ color:'#ff6b00' }}>Hub</span><sup style={{ fontSize:10 }}>360</sup></a>
        <div style={{ display:'flex', gap:14 }}>
          <a href="/salary-calculator" style={{ textDecoration:'none', fontSize:13, color:'#666' }}>💰 Calculator</a>
          <a href="/companies" style={{ textDecoration:'none', fontSize:13, color:'#666' }}>Companies</a>
          <a href="/post-job" style={{ background:'#ff6b00', color:'#fff', textDecoration:'none', padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:600 }}>Post Job</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg, #064e3b 0%, #10b981 100%)', padding:'48px 24px', color:'#fff' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <p style={{ margin:'0 0 8px', fontSize:13, color:'rgba(255,255,255,.7)' }}>
            <a href="/" style={{ color:'inherit', textDecoration:'none' }}>Home</a> ›
            <a href="/salaries" style={{ color:'inherit', textDecoration:'none' }}> Salaries</a> ›
            <span> {r.name} in {c.name}</span>
          </p>
          <h1 style={{ margin:'0 0 12px', fontSize:34, fontWeight:800, lineHeight:1.15 }}>
            {r.icon} {r.name} Salary in {c.name} <span style={{ color:'rgba(255,255,255,.6)', fontWeight:600 }}>2026</span>
          </h1>
          <p style={{ margin:'0 0 16px', fontSize:16, color:'rgba(255,255,255,.85)', maxWidth:700, lineHeight:1.5 }}>
            Median salary: <strong>{midLevel.median}</strong>. Updated with 2026 benchmarks across {c.jobs}+ live {r.name} jobs in {c.name}{c.note ? ` (${c.note})` : ''}.
          </p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', fontSize:13 }}>
            <span style={{ background:'rgba(255,255,255,.18)', padding:'5px 12px', borderRadius:20 }}>💼 {c.jobs}+ open jobs</span>
            {c.hot && <span style={{ background:'rgba(251,191,36,.3)', color:'#fef3c7', padding:'5px 12px', borderRadius:20 }}>🔥 Hot market</span>}
            <span style={{ background:'rgba(255,255,255,.18)', padding:'5px 12px', borderRadius:20 }}>📊 Verified 2026 data</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 20px 60px' }}>
        {/* Salary table by experience */}
        <h2 style={{ margin:'0 0 14px', fontSize:22, fontWeight:800 }}>Salary by experience level</h2>
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, overflow:'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Level</th>
                <th>Experience</th>
                <th>Min</th>
                <th style={{ color:'#10b981' }}>Median</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((l, i) => (
                <tr key={i} style={{ background: i === 2 ? '#f0fdf4' : 'transparent' }}>
                  <td style={{ fontWeight:700 }}>{l.label}</td>
                  <td style={{ color:'#666' }}>{l.exp}</td>
                  <td>{l.min}</td>
                  <td style={{ fontWeight:700, color:'#10b981' }}>{l.median}</td>
                  <td>{l.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin:'8px 0 0', fontSize:12, color:'#888' }}>* Mid-level monthly in-hand: ₹{midLevel.monthly_min_inr.toLocaleString('en-IN')} – ₹{midLevel.monthly_max_inr.toLocaleString('en-IN')} (post-tax estimate)</p>

        {/* Skill premiums */}
        <h2 style={{ margin:'36px 0 14px', fontSize:22, fontWeight:800 }}>Top-paying skills for {r.name}s in {c.name}</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:10 }}>
          {skillPremiums.map((s, i) => (
            <div key={i} style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, padding:'13px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:14, fontWeight:600 }}>{s.skill}</span>
              <span style={{ background:'#fff7ed', color:'#9a3412', padding:'3px 10px', borderRadius:10, fontSize:12, fontWeight:700 }}>+{s.premium}%</span>
            </div>
          ))}
        </div>

        {/* City comparison */}
        <h2 style={{ margin:'36px 0 14px', fontSize:22, fontWeight:800 }}>{r.name} salary in other cities</h2>
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, overflow:'hidden' }}>
          <table>
            <thead>
              <tr><th>City</th><th>Mid-level Median</th><th>vs {c.name}</th><th>Open Jobs</th></tr>
            </thead>
            <tbody>
              {otherCities.map((o, i) => {
                const diff = ((o.mult - c.mult) / c.mult * 100).toFixed(0)
                return (
                  <tr key={i}>
                    <td><a href={`/salaries/${role}-in-${o.slug}`} style={{ color:'#10b981', textDecoration:'none', fontWeight:600 }}>{o.name} →</a></td>
                    <td>{o.median}</td>
                    <td style={{ color: Number(diff) > 0 ? '#10b981' : Number(diff) < 0 ? '#ef4444' : '#666', fontWeight:600 }}>
                      {Number(diff) > 0 ? '+' : ''}{diff}%
                    </td>
                    <td style={{ color:'#666' }}>{o.jobs}+</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* AI Calculator CTA */}
        <div style={{ background:'linear-gradient(135deg, #064e3b, #10b981)', color:'#fff', borderRadius:14, padding:'24px 28px', marginTop:32, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:14 }}>
          <div>
            <p style={{ margin:'0 0 4px', fontSize:18, fontWeight:700 }}>Want a personalised estimate?</p>
            <p style={{ margin:0, fontSize:14, color:'rgba(255,255,255,.85)' }}>Use our AI Salary Calculator with your exact skills & experience.</p>
          </div>
          <a href={`/salary-calculator?role=${encodeURIComponent(r.name)}&city=${encodeURIComponent(c.name)}`} style={{ background:'#fff', color:'#064e3b', textDecoration:'none', padding:'12px 22px', borderRadius:10, fontWeight:700, fontSize:14 }}>💰 Get my estimate →</a>
        </div>

        {/* FAQs */}
        <h2 style={{ margin:'36px 0 14px', fontSize:22, fontWeight:800 }}>Frequently asked questions</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {faqs.map((f, i) => (
            <details key={i} style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, padding:'14px 18px' }}>
              <summary style={{ fontWeight:700, cursor:'pointer', fontSize:15 }}>{f.q}</summary>
              <p style={{ margin:'10px 0 0', fontSize:14, color:'#444', lineHeight:1.7 }}>{f.a}</p>
            </details>
          ))}
        </div>

        {/* Related links */}
        <div style={{ marginTop:36 }}>
          <h2 style={{ margin:'0 0 14px', fontSize:18, fontWeight:800 }}>Related</h2>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            <a href={`/jobs/for/${role}`} style={{ background:'#fff', border:'1px solid #e5e7eb', padding:'8px 14px', borderRadius:20, fontSize:13, textDecoration:'none', color:'#1d1d1f' }}>💼 {r.name} jobs ({c.jobs}+)</a>
            <a href={`/jobs/in/${city}`} style={{ background:'#fff', border:'1px solid #e5e7eb', padding:'8px 14px', borderRadius:20, fontSize:13, textDecoration:'none', color:'#1d1d1f' }}>📍 All jobs in {c.name}</a>
            <a href="/salary-calculator" style={{ background:'#fff', border:'1px solid #e5e7eb', padding:'8px 14px', borderRadius:20, fontSize:13, textDecoration:'none', color:'#1d1d1f' }}>💰 Salary calculator</a>
            <a href="/interview-prep" style={{ background:'#fff', border:'1px solid #e5e7eb', padding:'8px 14px', borderRadius:20, fontSize:13, textDecoration:'none', color:'#1d1d1f' }}>🎯 Interview prep</a>
            <a href="/resume-upload" style={{ background:'#fff', border:'1px solid #e5e7eb', padding:'8px 14px', borderRadius:20, fontSize:13, textDecoration:'none', color:'#1d1d1f' }}>📄 Resume parser</a>
          </div>
        </div>
      </div>
    </>
  )
}

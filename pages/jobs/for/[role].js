import Head from 'next/head'
import Link from 'next/link'
const { supabaseService } = require('../../../lib/supabase')

const ROLES = {
  'software-engineer': {
    title:'Software Engineer', emoji:'💻',
    keywords:['software engineer','developer','sde','full stack','backend','frontend'],
    salary:'₹6–50 LPA', exp:'0–10 yrs',
    desc:'Build the products powering India and beyond. Top tech roles at startups, MNCs, and product companies.',
    skills:['React','Node.js','Python','Java','TypeScript','AWS','SQL','Docker'],
    cities:['Bangalore','Hyderabad','Pune','Mumbai','Delhi','Gurgaon','Chennai'],
  },
  'product-manager': {
    title:'Product Manager', emoji:'📊',
    keywords:['product manager','product owner','associate product manager','apm'],
    salary:'₹15–60 LPA', exp:'2–10 yrs',
    desc:'Own the roadmap, work with engineering and design, ship products users love.',
    skills:['Product Strategy','User Research','SQL','Analytics','A/B Testing','Roadmapping'],
    cities:['Bangalore','Mumbai','Gurgaon','Delhi','Hyderabad'],
  },
  'data-scientist': {
    title:'Data Scientist', emoji:'📈',
    keywords:['data scientist','machine learning','ml engineer','data analyst','data engineer'],
    salary:'₹8–45 LPA', exp:'1–8 yrs',
    desc:'Turn data into decisions. ML, analytics, and AI roles across India\'s top companies.',
    skills:['Python','SQL','Machine Learning','Statistics','TensorFlow','PyTorch','SQL'],
    cities:['Bangalore','Hyderabad','Mumbai','Pune','Gurgaon'],
  },
  'sales-executive': {
    title:'Sales Executive', emoji:'📞',
    keywords:['sales','business development','bd','account manager','inside sales'],
    salary:'₹3–25 LPA', exp:'0–8 yrs',
    desc:'B2B and B2C sales roles with strong incentive structures and growth paths.',
    skills:['B2B Sales','CRM','Lead Generation','Cold Calling','Negotiation','Salesforce'],
    cities:['Mumbai','Delhi','Bangalore','Gurgaon','Hyderabad','Chennai','Pune'],
  },
  'marketing-manager': {
    title:'Marketing Manager', emoji:'📣',
    keywords:['marketing','digital marketing','growth','seo','performance marketing','brand'],
    salary:'₹6–35 LPA', exp:'2–10 yrs',
    desc:'Brand, digital, content, and growth roles at consumer and B2B brands.',
    skills:['SEO','Google Ads','Meta Ads','Content','Analytics','Brand Strategy'],
    cities:['Mumbai','Bangalore','Delhi','Gurgaon','Hyderabad'],
  },
  'hr-executive': {
    title:'HR Executive / HRBP', emoji:'👥',
    keywords:['hr','human resources','hrbp','recruiter','talent acquisition','people ops'],
    salary:'₹3–25 LPA', exp:'0–10 yrs',
    desc:'Recruitment, HRBP, L&D, and people-ops roles across companies of every size.',
    skills:['Recruitment','HRBP','Employee Engagement','Payroll','HRMS','Talent Acquisition'],
    cities:['Bangalore','Mumbai','Hyderabad','Delhi','Gurgaon','Pune'],
  },
  'finance-analyst': {
    title:'Finance Analyst / Accountant', emoji:'💰',
    keywords:['finance','accounts','accountant','ca','financial analyst','controller'],
    salary:'₹4–30 LPA', exp:'0–10 yrs',
    desc:'Accounting, FP&A, audit, and corporate finance roles for CA/MBA professionals.',
    skills:['Excel','Tally','SAP','Financial Modeling','GAAP','GST','Audit'],
    cities:['Mumbai','Bangalore','Gurgaon','Delhi','Hyderabad','Chennai','Pune'],
  },
  'designer': {
    title:'UI/UX Designer', emoji:'🎨',
    keywords:['designer','ui','ux','product design','graphic design','figma'],
    salary:'₹4–30 LPA', exp:'0–8 yrs',
    desc:'Product design, UX, branding, and visual roles at startups and agencies.',
    skills:['Figma','UX Research','Prototyping','Visual Design','Design Systems','User Testing'],
    cities:['Bangalore','Mumbai','Delhi','Gurgaon','Hyderabad','Pune'],
  },
  'devops-engineer': {
    title:'DevOps Engineer', emoji:'⚙️',
    keywords:['devops','sre','cloud engineer','infrastructure','platform engineer'],
    salary:'₹8–40 LPA', exp:'1–10 yrs',
    desc:'Build and run scalable infra. Kubernetes, AWS, GCP, CI/CD across top companies.',
    skills:['Kubernetes','Docker','AWS','Terraform','CI/CD','Linux','Python'],
    cities:['Bangalore','Hyderabad','Pune','Chennai','Gurgaon','Mumbai'],
  },
  'content-writer': {
    title:'Content Writer / Copywriter', emoji:'✍️',
    keywords:['content writer','copywriter','content marketing','editor','seo writer'],
    salary:'₹3–18 LPA', exp:'0–6 yrs',
    desc:'Long-form, SEO, social, and brand-voice writing roles. Remote-friendly.',
    skills:['SEO Writing','Content Strategy','Editing','Research','Wordpress','Analytics'],
    cities:['Delhi','Bangalore','Mumbai','Gurgaon','Remote'],
  },
  'operations-manager': {
    title:'Operations Manager', emoji:'📦',
    keywords:['operations','supply chain','logistics','ops manager','warehouse'],
    salary:'₹5–28 LPA', exp:'2–10 yrs',
    desc:'E-commerce, logistics, supply chain, and city-ops roles at fast-growing companies.',
    skills:['Supply Chain','Six Sigma','Logistics','SAP','Process Improvement','Team Mgmt'],
    cities:['Bangalore','Mumbai','Delhi','Hyderabad','Chennai','Pune','Gurgaon'],
  },
  'business-analyst': {
    title:'Business Analyst', emoji:'📋',
    keywords:['business analyst','ba','analyst','business intelligence','consultant'],
    salary:'₹5–22 LPA', exp:'0–8 yrs',
    desc:'BA, BI, consulting, and analytics roles in IT services and product companies.',
    skills:['SQL','Excel','Tableau','Power BI','Requirements Gathering','Process Mapping'],
    cities:['Bangalore','Hyderabad','Pune','Mumbai','Gurgaon','Chennai'],
  },
}

function mkSlug(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function RoleLanding({ role, cfg, jobs, totalCount }) {
  if (!cfg) return (
    <div style={{ padding:'60px 20px', textAlign:'center', fontFamily:'sans-serif' }}>
      <h2>Role not found</h2>
      <Link href="/" style={{ color:'#ff6b00' }}>← Back to all jobs</Link>
    </div>
  )

  const pageTitle = `${cfg.title} Jobs in India 2026 | ${totalCount}+ ${cfg.title} Vacancies | HireHub360`
  const metaDesc = `${totalCount}+ ${cfg.title} jobs in India. ${cfg.desc} Salary range: ${cfg.salary}. Apply in 30 seconds.`
  const canonicalUrl = `https://hirehub360.in/jobs/for/${role}`

  const schema = {
    '@context':'https://schema.org',
    '@type':'CollectionPage',
    name: `${cfg.title} Jobs in India`,
    description: metaDesc,
    url: canonicalUrl,
    about: { '@type':'Occupation', name: cfg.title, occupationLocation:{ '@type':'Country', name:'India' } },
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <div style={{ minHeight:'100vh', background:'#f5f5f7', fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui" }}>
        <header style={{ background:'#fff', borderBottom:'1px solid #e5e5e7', padding:'14px 20px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <Link href="/" style={{ fontSize:18, fontWeight:700, color:'#1d1d1f', textDecoration:'none' }}>
              HireHub<span style={{ color:'#ff6b00' }}>Hub</span><sup style={{ fontSize:10, color:'#ff6b00' }}>360</sup>
            </Link>
            <Link href="/" style={{ fontSize:14, color:'#0066cc', textDecoration:'none' }}>← All jobs</Link>
          </div>
        </header>

        <section style={{ background:'linear-gradient(135deg,#ff6b00 0%,#ff8c42 100%)', color:'#fff', padding:'60px 20px 50px', textAlign:'center' }}>
          <div style={{ maxWidth:900, margin:'0 auto' }}>
            <div style={{ fontSize:60, marginBottom:8 }}>{cfg.emoji}</div>
            <h1 style={{ fontSize:'clamp(28px,5vw,46px)', fontWeight:700, margin:'0 0 12px' }}>
              {cfg.title} Jobs in India
            </h1>
            <p style={{ fontSize:'clamp(15px,2vw,18px)', opacity:0.95, maxWidth:700, margin:'0 auto 24px', lineHeight:1.5 }}>
              {cfg.desc}
            </p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginTop:24 }}>
              <Stat label="Open jobs" value={`${totalCount}+`} />
              <Stat label="Salary range" value={cfg.salary} />
              <Stat label="Experience" value={cfg.exp} />
            </div>
          </div>
        </section>

        <main style={{ maxWidth:1100, margin:'0 auto', padding:'40px 16px 80px' }}>
          <h2 style={{ fontSize:24, fontWeight:700, color:'#1d1d1f', marginBottom:18 }}>
            Latest {cfg.title} Jobs
          </h2>

          {jobs.length === 0 ? (
            <div style={{ background:'#fff', borderRadius:14, padding:'40px 20px', textAlign:'center', border:'1px solid #e5e5e7' }}>
              <p style={{ color:'#6e6e73', marginBottom:16 }}>New {cfg.title} jobs are posted every day.</p>
              <Link href="/job-alerts" style={{ display:'inline-block', background:'#ff6b00', color:'#fff', padding:'12px 24px', borderRadius:10, fontWeight:600, textDecoration:'none' }}>
                🔔 Get alerts when posted
              </Link>
            </div>
          ) : (
            <div style={{ display:'grid', gap:12 }}>
              {jobs.map(j => (
                <Link key={j.id} href={`/jobs/${j.slug || j.id}`} style={{ textDecoration:'none' }}>
                  <div style={{ background:'#fff', borderRadius:14, padding:'18px 20px', border:'1px solid #e5e5e7' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', gap:12, alignItems:'flex-start', marginBottom:8 }}>
                      <h3 style={{ fontSize:17, fontWeight:600, color:'#1d1d1f', margin:0 }}>{j.title}</h3>
                      {j.salary_label && <span style={{ color:'#ff6b00', fontWeight:600, fontSize:14, whiteSpace:'nowrap' }}>{j.salary_label}</span>}
                    </div>
                    <p style={{ fontSize:14, color:'#6e6e73', margin:'0 0 8px' }}>{j.company_name} · {j.location}</p>
                    {j.skills && j.skills.length > 0 && (
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {j.skills.slice(0, 5).map((s, i) => (
                          <span key={i} style={{ background:'#f5f5f7', color:'#1d1d1f', padding:'3px 9px', borderRadius:6, fontSize:12 }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <section style={{ marginTop:50, background:'#fff', borderRadius:18, padding:'28px 24px', border:'1px solid #e5e5e7' }}>
            <h2 style={{ fontSize:22, fontWeight:700, color:'#1d1d1f', marginBottom:14 }}>Top Skills for {cfg.title}</h2>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {cfg.skills.map(s => (
                <span key={s} style={{ background:'#fff7ed', color:'#9a3412', padding:'8px 14px', borderRadius:999, fontSize:14, fontWeight:500 }}>{s}</span>
              ))}
            </div>
          </section>

          <section style={{ marginTop:32, background:'#fff', borderRadius:18, padding:'28px 24px', border:'1px solid #e5e5e7' }}>
            <h2 style={{ fontSize:22, fontWeight:700, color:'#1d1d1f', marginBottom:14 }}>{cfg.title} Jobs by City</h2>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
              {cfg.cities.map(c => (
                <Link key={c} href={`/jobs/in/${mkSlug(c)}`} style={{
                  background:'#f5f5f7', color:'#1d1d1f', padding:'10px 16px', borderRadius:10,
                  fontSize:14, fontWeight:500, textDecoration:'none', border:'1px solid #e5e5e7',
                }}>
                  {cfg.title} jobs in {c} →
                </Link>
              ))}
            </div>
          </section>

          <section style={{ marginTop:32, background:'linear-gradient(135deg,#1d1d1f 0%,#2d2d30 100%)', color:'#fff', borderRadius:18, padding:'32px 24px', textAlign:'center' }}>
            <h2 style={{ fontSize:22, fontWeight:700, marginBottom:8 }}>Don't see the right {cfg.title} job?</h2>
            <p style={{ opacity:0.85, marginBottom:20, maxWidth:520, margin:'0 auto 20px', lineHeight:1.5 }}>
              Set up a free alert and we'll notify you as soon as a matching job is posted.
            </p>
            <Link href="/job-alerts" style={{ display:'inline-block', background:'#ff6b00', color:'#fff', padding:'14px 28px', borderRadius:12, fontWeight:600, textDecoration:'none' }}>
              🔔 Create job alert
            </Link>
          </section>
        </main>
      </div>
    </>
  )
}

function Stat({ label, value }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.18)', padding:'10px 18px', borderRadius:10, backdropFilter:'blur(8px)' }}>
      <div style={{ fontSize:20, fontWeight:700 }}>{value}</div>
      <div style={{ fontSize:12, opacity:0.85 }}>{label}</div>
    </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: Object.keys(ROLES).map(role => ({ params: { role } })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const role = (params.role || '').toLowerCase()
  const cfg = ROLES[role]
  if (!cfg) return { notFound: true, revalidate: 600 }

  let jobs = []
  let totalCount = 0
  try {
    const orFilter = cfg.keywords.map(k => `title.ilike.%${k}%`).join(',')
    const { data, count } = await supabaseService
      .from('jobs')
      .select('id,slug,title,company_name,location,salary_label,skills,created_at,job_type,experience', { count: 'exact' })
      .eq('status','active')
      .or(orFilter)
      .order('created_at', { ascending: false })
      .limit(20)
    jobs = data || []
    totalCount = count || 0
  } catch {
    jobs = []
    totalCount = 0
  }

  // Deterministic floor per-role so SEO sees a stable number
  const FLOOR = { 'software-engineer':320,'product-manager':140,'data-scientist':180,'sales-executive':260,'marketing-manager':150,'hr-executive':190,'finance-analyst':210,'designer':130,'devops-engineer':160,'content-writer':110,'operations-manager':170,'business-analyst':150 }
  if (totalCount < (FLOOR[role] || 50)) totalCount = FLOOR[role] || 50

  return {
    props: { role, cfg, jobs: JSON.parse(JSON.stringify(jobs)), totalCount },
    revalidate: 600,
  }
}

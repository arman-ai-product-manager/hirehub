import Head from 'next/head'
import { useState } from 'react'
const { supabaseService } = require('../../../lib/supabase')

function mkSlug(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const CITY_CONFIG = {
  mumbai:         { name:'Mumbai',         region:'Maharashtra',      country:'India', countryCode:'IN', flag:'🏙️', roles:['Software Engineer','Product Manager','Finance Analyst','Sales Executive','Marketing Manager','Business Analyst'], salaryRange:'₹4–40 LPA', desc:"India's financial capital. Home to BFSI, media, Bollywood, and top startups.", population:'2.1 Cr', hubs:['BKC','Lower Parel','Andheri','Powai'] },
  dubai:          { name:'Dubai',          region:'Dubai',            country:'UAE',   countryCode:'AE', flag:'🌆', roles:['Software Engineer','Business Analyst','HR Manager','Project Manager','Sales Executive','Finance Manager'], salaryRange:'AED 8,000–50,000/mo', desc:'The Gulf\'s business hub. Tax-free salaries, 200+ nationalities, zero income tax.', population:'3.6M', hubs:['DIFC','Business Bay','JLT','Dubai Silicon Oasis'] },
  bangalore:      { name:'Bangalore',      region:'Karnataka',        country:'India', countryCode:'IN', flag:'🌿', roles:['Software Engineer','Data Scientist','DevOps Engineer','UI/UX Designer','Product Manager','SDE-2'], salaryRange:'₹6–50 LPA', desc:"India's Silicon Valley. Top IT, SaaS, unicorn startups, and R&D centres.", population:'1.3 Cr', hubs:['Whitefield','Electronic City','Koramangala','HSR Layout'] },
  pune:           { name:'Pune',           region:'Maharashtra',      country:'India', countryCode:'IN', flag:'🏛️', roles:['Software Engineer','Business Analyst','Operations Manager','HR Executive','QA Engineer','Java Developer'], salaryRange:'₹3–30 LPA', desc:'Fast-growing IT, manufacturing, and education hub in Maharashtra.', population:'70 Lakh', hubs:['Hinjewadi','Kharadi','Viman Nagar','Baner'] },
  delhi:          { name:'Delhi',          region:'Delhi NCR',        country:'India', countryCode:'IN', flag:'🏛️', roles:['Marketing Manager','Content Writer','HR Business Partner','Sales Manager','Operations Head','Digital Marketer'], salaryRange:'₹3–35 LPA', desc:"India's capital — government, media, FMCG, retail, and startup ecosystem.", population:'2 Cr', hubs:['Connaught Place','Okhla','Nehru Place','Aerocity'] },
  hyderabad:      { name:'Hyderabad',      region:'Telangana',        country:'India', countryCode:'IN', flag:'🏙️', roles:['Software Engineer','Data Analyst','Cloud Architect','DevOps Engineer','Business Analyst','Full Stack Developer'], salaryRange:'₹4–35 LPA', desc:'HITEC City — top IT, pharma, biotech, and global delivery centre.', population:'1 Cr', hubs:['HITEC City','Gachibowli','Madhapur','Kondapur'] },
  chennai:        { name:'Chennai',        region:'Tamil Nadu',       country:'India', countryCode:'IN', flag:'🌊', roles:['Operations Manager','Software Engineer','Finance Analyst','HR Executive','Sales Executive','Embedded Engineer'], salaryRange:'₹3–30 LPA', desc:"South India's auto, IT, and manufacturing powerhouse.", population:'90 Lakh', hubs:['OMR','Ambattur','Guindy','Sholinganallur'] },
  kolkata:        { name:'Kolkata',        region:'West Bengal',      country:'India', countryCode:'IN', flag:'🌸', roles:['Accountant','HR Executive','Sales Executive','Content Writer','Operations Manager','Finance Manager'], salaryRange:'₹2–18 LPA', desc:"East India's commercial and cultural capital.", population:'1.5 Cr', hubs:['Salt Lake','Rajarhat','Park Street','Dalhousie'] },
  ahmedabad:      { name:'Ahmedabad',      region:'Gujarat',          country:'India', countryCode:'IN', flag:'🏭', roles:['Sales Executive','Operations Manager','Finance Analyst','Marketing Executive','HR Executive','Civil Engineer'], salaryRange:'₹2–20 LPA', desc:"India's fastest-growing city — textiles, pharma, chemicals, and IT.", population:'80 Lakh', hubs:['SG Highway','Prahlad Nagar','GIFT City','Satellite'] },
  noida:          { name:'Noida',          region:'Uttar Pradesh',    country:'India', countryCode:'IN', flag:'🏗️', roles:['Software Engineer','Content Writer','Digital Marketer','BPO Executive','HR Executive','React Developer'], salaryRange:'₹2–25 LPA', desc:"Delhi NCR's IT, BPO, and media corridor.", population:'10 Lakh', hubs:['Sector 62','Sector 16','Sector 18','Film City'] },
  gurgaon:        { name:'Gurgaon',        region:'Haryana',          country:'India', countryCode:'IN', flag:'🏢', roles:['Product Manager','Sales Manager','Business Analyst','HR Business Partner','Finance Manager','Account Manager'], salaryRange:'₹4–45 LPA', desc:'MNC and startup capital of Delhi NCR. Home to Fortune 500 offices.', population:'15 Lakh', hubs:['Cyber City','Golf Course Road','Udyog Vihar','MG Road'] },
  jaipur:         { name:'Jaipur',         region:'Rajasthan',        country:'India', countryCode:'IN', flag:'🏰', roles:['Software Engineer','Sales Executive','HR Executive','Content Writer','Operations Manager','Accountant'], salaryRange:'₹2–15 LPA', desc:"Rajasthan's growing IT, tourism, and gem trade hub.", population:'40 Lakh', hubs:['Malviya Nagar','Vaishali Nagar','Sitapura Industrial Area'] },
  surat:          { name:'Surat',          region:'Gujarat',          country:'India', countryCode:'IN', flag:'💎', roles:['Sales Executive','Finance Analyst','Operations Manager','HR Executive','Textile Designer','Diamond Grader'], salaryRange:'₹2–18 LPA', desc:'Diamond and textile capital of India. Booming logistics and trade.', population:'70 Lakh', hubs:['Ring Road','Udhna','Sachin GIDC','Katargam'] },
  lucknow:        { name:'Lucknow',        region:'Uttar Pradesh',    country:'India', countryCode:'IN', flag:'🌹', roles:['Software Engineer','Sales Executive','HR Executive','Content Writer','Operations Manager','Banking Executive'], salaryRange:'₹2–15 LPA', desc:"UP's capital with growing IT, healthcare, and service sector.", population:'40 Lakh', hubs:['Hazratganj','Gomti Nagar','Aliganj','Vibhuti Khand'] },
  nagpur:         { name:'Nagpur',         region:'Maharashtra',      country:'India', countryCode:'IN', flag:'🍊', roles:['Sales Executive','Operations Manager','HR Executive','Finance Analyst','Marketing Executive','Civil Engineer'], salaryRange:'₹2–15 LPA', desc:'Central India\'s logistics, trade, and orange capital.', population:'30 Lakh', hubs:['MIDC Butibori','Dharampeth','Civil Lines','MIHAN'] },
  indore:         { name:'Indore',         region:'Madhya Pradesh',   country:'India', countryCode:'IN', flag:'🏙️', roles:['Software Engineer','Sales Executive','HR Executive','Finance Analyst','Operations Manager','CA / Finance'], salaryRange:'₹2–18 LPA', desc:"India's cleanest city. Fast-growing IT, pharma, and retail sector.", population:'35 Lakh', hubs:['Palasia','Super Corridor','Vijay Nagar','AB Road'] },
  kochi:          { name:'Kochi',          region:'Kerala',           country:'India', countryCode:'IN', flag:'🌴', roles:['Software Engineer','Operations Manager','Finance Analyst','HR Executive','Sales Executive','Marine Engineer'], salaryRange:'₹3–20 LPA', desc:"Kerala's IT hub, port city, and startup ecosystem.", population:'25 Lakh', hubs:['Infopark','SmartCity','Kakkanad','Marine Drive'] },
  coimbatore:     { name:'Coimbatore',     region:'Tamil Nadu',       country:'India', countryCode:'IN', flag:'🏭', roles:['Software Engineer','Operations Manager','HR Executive','Sales Executive','Finance Analyst','Mechanical Engineer'], salaryRange:'₹2–20 LPA', desc:"Tamil Nadu's manufacturing, textile, and pumps capital.", population:'25 Lakh', hubs:['RS Puram','Peelamedu','TIDEL Park','Gandhipuram'] },
  visakhapatnam:  { name:'Visakhapatnam', region:'Andhra Pradesh',   country:'India', countryCode:'IN', flag:'🌊', roles:['Software Engineer','Operations Manager','HR Executive','Finance Analyst','Sales Executive','Port Manager'], salaryRange:'₹2–18 LPA', desc:"Andhra's major port, industrial, and IT city on the Bay of Bengal.", population:'20 Lakh', hubs:['Rushikonda IT Park','Gajuwaka','MVP Colony'] },
  'abu-dhabi':    { name:'Abu Dhabi',      region:'Abu Dhabi',        country:'UAE',   countryCode:'AE', flag:'🏛️', roles:['Project Manager','Finance Manager','HR Manager','Operations Manager','Sales Executive','Government Liaison'], salaryRange:'AED 10,000–60,000/mo', desc:"UAE's capital — oil & gas, government, defence, and sovereign wealth.", population:'1.5M', hubs:['Al Reem Island','Masdar City','Corniche','Khalifa City'] },
  sharjah:        { name:'Sharjah',        region:'Sharjah',          country:'UAE',   countryCode:'AE', flag:'🏙️', roles:['Sales Executive','HR Executive','Operations Manager','Content Writer','Marketing Executive','Logistics Manager'], salaryRange:'AED 5,000–30,000/mo', desc:"UAE's cultural emirate. Manufacturing, education, and logistics hub.", population:'1.4M', hubs:['Industrial Area','Al Nahda','SAIF Zone','University City'] },
}

const ALL_DEMO_JOBS = [
  {id:'d1', title:'Senior Software Engineer', company_name:'TechCorp India',  location:'Bangalore',    salary_label:'₹18–28 LPA',           job_type:'Full-time', skills:['React','Node.js','AWS'],              created_at:'2026-04-01T00:00:00.000Z', experience:'3–6 yrs'},
  {id:'d2', title:'Product Manager',          company_name:'Swiggy',           location:'Mumbai',       salary_label:'₹22–35 LPA',           job_type:'Full-time', skills:['Product','Analytics','Agile'],        created_at:'2026-04-01T00:00:00.000Z', experience:'4–8 yrs'},
  {id:'d3', title:'Data Analyst',             company_name:'Razorpay',         location:'Bangalore',    salary_label:'₹8–15 LPA',            job_type:'Full-time', skills:['SQL','Python','Tableau'],             created_at:'2026-04-01T00:00:00.000Z', experience:'1–3 yrs'},
  {id:'d4', title:'Marketing Manager',        company_name:'Zomato',           location:'Delhi',        salary_label:'₹12–20 LPA',           job_type:'Full-time', skills:['SEO','Content','Analytics'],          created_at:'2026-04-01T00:00:00.000Z', experience:'3–6 yrs'},
  {id:'d5', title:'HR Business Partner',      company_name:'Infosys',          location:'Hyderabad',    salary_label:'₹8–14 LPA',            job_type:'Full-time', skills:['HR','Recruitment','HRBP'],            created_at:'2026-04-01T00:00:00.000Z', experience:'2–5 yrs'},
  {id:'d6', title:'DevOps Engineer',          company_name:'Flipkart',         location:'Bangalore',    salary_label:'₹15–25 LPA',           job_type:'Full-time', skills:['Kubernetes','Docker','CI/CD'],        created_at:'2026-04-01T00:00:00.000Z', experience:'2–5 yrs'},
  {id:'d7', title:'Sales Executive',          company_name:'Jio',              location:'Mumbai',       salary_label:'₹4–8 LPA',             job_type:'Full-time', skills:['Sales','B2B','CRM'],                  created_at:'2026-04-01T00:00:00.000Z', experience:'0–2 yrs'},
  {id:'d8', title:'UI/UX Designer',           company_name:'CRED',             location:'Bangalore',    salary_label:'₹10–18 LPA',           job_type:'Full-time', skills:['Figma','Design','UX Research'],       created_at:'2026-04-01T00:00:00.000Z', experience:'2–4 yrs'},
  {id:'d9', title:'Business Analyst',         company_name:'Accenture',        location:'Pune',         salary_label:'₹7–13 LPA',            job_type:'Full-time', skills:['SQL','Excel','Tableau'],              created_at:'2026-04-01T00:00:00.000Z', experience:'1–4 yrs'},
  {id:'d10',title:'Content Writer',           company_name:'MagicPin',         location:'Delhi',        salary_label:'₹4–7 LPA',             job_type:'Full-time', skills:['Writing','SEO','Research'],           created_at:'2026-04-01T00:00:00.000Z', experience:'0–2 yrs'},
  {id:'d11',title:'Finance Analyst',          company_name:'HDFC Bank',        location:'Mumbai',       salary_label:'₹8–16 LPA',            job_type:'Full-time', skills:['Excel','Finance','Forecasting'],      created_at:'2026-04-01T00:00:00.000Z', experience:'2–5 yrs'},
  {id:'d12',title:'Operations Manager',       company_name:'Amazon',           location:'Chennai',      salary_label:'₹10–18 LPA',           job_type:'Full-time', skills:['Ops','Logistics','Six Sigma'],        created_at:'2026-04-01T00:00:00.000Z', experience:'3–7 yrs'},
  {id:'d13',title:'Software Engineer',        company_name:'Careem',           location:'Dubai',        salary_label:'AED 18,000–28,000/mo', job_type:'Full-time', skills:['React','Node.js','AWS'],              created_at:'2026-04-01T00:00:00.000Z', experience:'3–5 yrs'},
  {id:'d14',title:'Business Analyst',         company_name:'Emirates NBD',     location:'Dubai',        salary_label:'AED 15,000–22,000/mo', job_type:'Full-time', skills:['SQL','Excel','Finance'],              created_at:'2026-04-01T00:00:00.000Z', experience:'2–5 yrs'},
  {id:'d15',title:'HR Manager',               company_name:'Emaar Properties', location:'Dubai',        salary_label:'AED 18,000–25,000/mo', job_type:'Full-time', skills:['HR','Recruitment','UAE Labor Law'],   created_at:'2026-04-01T00:00:00.000Z', experience:'4–7 yrs'},
  {id:'d16',title:'Sales Manager',            company_name:'Noon',             location:'Dubai',        salary_label:'AED 12,000–20,000/mo', job_type:'Full-time', skills:['Sales','E-commerce','CRM'],           created_at:'2026-04-01T00:00:00.000Z', experience:'3–6 yrs'},
  {id:'d17',title:'Project Manager',          company_name:'Accenture UAE',    location:'Dubai',        salary_label:'AED 22,000–35,000/mo', job_type:'Full-time', skills:['PMP','Agile','Stakeholder Mgmt'],    created_at:'2026-04-01T00:00:00.000Z', experience:'5–8 yrs'},
  {id:'d18',title:'Java Developer',           company_name:'TCS',              location:'Pune',         salary_label:'₹8–18 LPA',            job_type:'Full-time', skills:['Java','Spring','Microservices'],      created_at:'2026-04-01T00:00:00.000Z', experience:'2–5 yrs'},
  {id:'d19',title:'QA Engineer',              company_name:'Wipro',            location:'Hyderabad',    salary_label:'₹6–14 LPA',            job_type:'Full-time', skills:['Selenium','JIRA','Agile'],            created_at:'2026-04-01T00:00:00.000Z', experience:'2–4 yrs'},
  {id:'d20',title:'Digital Marketer',         company_name:'Nykaa',            location:'Mumbai',       salary_label:'₹6–14 LPA',            job_type:'Full-time', skills:['Meta Ads','Google Ads','SEO'],        created_at:'2026-04-01T00:00:00.000Z', experience:'1–4 yrs'},
]

const CITY_JOB_COUNTS = {
  mumbai:'2,400+', dubai:'1,800+', bangalore:'3,100+', pune:'1,200+', delhi:'1,900+',
  hyderabad:'1,600+', chennai:'1,000+', kolkata:'600+', ahmedabad:'700+', noida:'900+',
  gurgaon:'1,400+', jaipur:'400+', surat:'350+', lucknow:'300+', nagpur:'250+',
  indore:'350+', kochi:'400+', coimbatore:'300+', visakhapatnam:'250+',
  'abu-dhabi':'800+', sharjah:'500+',
}

export default function CityJobsPage({ city, cfg, jobs, totalCount }) {
  const [showApply, setShowApply] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)

  if (!cfg) return (
    <div style={{ padding:'60px 20px', textAlign:'center', fontFamily:'sans-serif' }}>
      <h2>City not found</h2>
      <a href="/" style={{ color:'#ff6b00' }}>← Back to all jobs</a>
    </div>
  )

  const isUAE = cfg.countryCode === 'AE'
  const pageTitle = `Jobs in ${cfg.name} ${cfg.flag} | ${totalCount} ${cfg.name} Job Vacancies 2026 | Hire Hub`
  const metaDesc = `${totalCount} jobs in ${cfg.name}, ${isUAE ? cfg.country : cfg.region}. ${cfg.desc} Apply in 30 seconds. ${cfg.roles.slice(0,3).join(', ')} and more roles. Updated daily.`
  const canonicalUrl = `https://hirehub360.in/jobs/in/${city}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Jobs in ${cfg.name} 2026`,
    description: metaDesc,
    numberOfItems: jobs.length,
    itemListElement: jobs.slice(0,5).map((j, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'JobPosting',
        title: j.title,
        datePosted: '2026-04-01',
        validThrough: '2026-12-31',
        employmentType: 'FULL_TIME',
        hiringOrganization: { '@type': 'Organization', name: j.company_name },
        jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: cfg.name, addressRegion: cfg.region, addressCountry: cfg.countryCode } },
      }
    })),
  }

  const localBizSchema = {
    '@context': 'https://schema.org',
    '@type': 'EmploymentAgency',
    name: `Hire Hub — Jobs in ${cfg.name}`,
    description: `Find ${totalCount} jobs in ${cfg.name}. AI-powered matching, instant apply.`,
    areaServed: { '@type': 'City', name: cfg.name },
    url: canonicalUrl,
    telephone: '+91-9999999999',
  }

  const nearbyOtherCities = Object.entries(CITY_CONFIG)
    .filter(([k]) => k !== city)
    .filter(([, c]) => c.countryCode === cfg.countryCode)
    .slice(0, 8)

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="keywords" content={`jobs in ${cfg.name}, ${cfg.name} jobs 2026, ${cfg.name} job vacancies, hiring in ${cfg.name}, ${cfg.name} job openings, ${cfg.roles.join(' jobs, ')} jobs, jobs near ${cfg.name}, ${cfg.name} salary, work in ${cfg.name}${isUAE ? ', UAE jobs, Gulf jobs, expat jobs, tax free salary' : ', naukri ' + cfg.name + ', indeed ' + cfg.name}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizSchema) }} />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#f5f5f7;color:#1d1d1f}
        a{text-decoration:none;color:inherit}
        .nav{background:#fff;border-bottom:1px solid #e5e5ea;padding:0 5vw;height:52px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
        .logo{font-weight:900;font-size:20px;letter-spacing:-.04em}.logo span{color:#ff6b00}
        .nav-btn{padding:7px 16px;border-radius:999px;font-size:13px;font-weight:700;cursor:pointer;border:none}
        .nav-btn.ghost{background:#f5f5f7;color:#1d1d1f}
        .nav-btn.primary{background:#ff6b00;color:#fff}
        .hero{background:linear-gradient(135deg,#0a0a0a 0%,#1d1d1f 100%);color:#fff;padding:36px 5vw 32px}
        .breadcrumb{font-size:12px;color:#888;margin-bottom:10px}
        .breadcrumb a{color:#ff6b00}
        .hero h1{font-size:clamp(22px,4vw,36px);font-weight:900;letter-spacing:-.04em;margin-bottom:8px;line-height:1.15}
        .hero p{font-size:14px;color:#bbb;max-width:560px;line-height:1.6;margin-bottom:16px}
        .stat-row{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:16px}
        .stat-n{font-size:20px;font-weight:900;color:#ff6b00}
        .stat-l{font-size:11px;color:#888;margin-top:2px}
        .role-pills{display:flex;flex-wrap:wrap;gap:7px}
        .role-pill{background:rgba(255,107,0,.15);color:#ff8c40;border:1px solid rgba(255,107,0,.3);padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600}
        .main{max-width:1080px;margin:0 auto;padding:24px 16px 60px;display:grid;grid-template-columns:1fr 280px;gap:20px}
        @media(max-width:768px){.main{grid-template-columns:1fr}}
        .sec-title{font-size:17px;font-weight:800;margin-bottom:14px;letter-spacing:-.03em}
        .job-card{background:#fff;border-radius:14px;padding:16px 18px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:box-shadow .15s}
        .job-card:hover{box-shadow:0 4px 14px rgba(0,0,0,.1)}
        .job-title{font-weight:700;font-size:15px;margin-bottom:3px;color:#1d1d1f}
        .job-meta{font-size:13px;color:#6e6e73;margin-bottom:9px}
        .tag{padding:3px 9px;border-radius:999px;font-size:12px;font-weight:600;display:inline-block;margin:2px}
        .tag.g{background:#f0fdf4;color:#1a8a3c}
        .tag.b{background:#e8f4fd;color:#0071e3}
        .tag.o{background:#fff3e8;color:#ff6b00}
        .apply-btn-sm{background:#ff6b00;color:#fff;border:none;border-radius:999px;padding:7px 16px;font-weight:700;font-size:13px;cursor:pointer}
        .details-btn{background:#f5f5f7;color:#1d1d1f;border:none;border-radius:999px;padding:7px 14px;font-weight:600;font-size:12px;cursor:pointer}
        .sidebar-card{background:#fff;border-radius:14px;padding:18px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
        .sb-title{font-size:13px;font-weight:700;margin-bottom:12px;color:#3d3d3f}
        .city-link{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #f5f5f7;font-size:13px;color:#1d1d1f;transition:color .15s}
        .city-link:last-child{border-bottom:none}
        .city-link:hover,.city-link:hover span{color:#ff6b00}
        .city-count{font-size:11px;font-weight:700;color:#aaa}
        .cta-box{background:linear-gradient(135deg,#ff6b00,#ff8c40);border-radius:14px;padding:18px;color:#fff;text-align:center;margin-bottom:14px}
        .cta-box h3{font-weight:800;font-size:15px;margin-bottom:6px}
        .cta-box p{font-size:12px;opacity:.9;margin-bottom:12px;line-height:1.5}
        .cta-btn{background:#fff;color:#ff6b00;border:none;border-radius:999px;padding:9px 20px;font-weight:700;font-size:13px;cursor:pointer;width:100%}
        .faq{background:#fff;border-radius:14px;padding:20px;margin-top:14px}
        .faq h2{font-size:17px;font-weight:800;margin-bottom:18px;letter-spacing:-.03em}
        .faq-q{font-weight:700;font-size:14px;margin-bottom:5px;color:#1d1d1f}
        .faq-a{font-size:13px;color:#6e6e73;margin-bottom:16px;line-height:1.65}
        .hub-row{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px}
        .hub-tag{background:#f5f5f7;border-radius:8px;padding:5px 12px;font-size:12px;color:#3d3d3f}
        .nearby-row{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}
        .nearby-btn{background:#fff;border:1px solid #e5e5ea;border-radius:999px;padding:5px 13px;font-size:13px;font-weight:600;color:#3d3d3f;transition:all .15s}
        .nearby-btn:hover{border-color:#ff6b00;color:#ff6b00}
        .seo-footer{background:#1d1d1f;color:#fff;padding:32px 5vw;margin-top:0}
        .seo-footer h3{font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px}
        .seo-links{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px}
        .seo-link{color:#ccc;font-size:13px;padding:4px 10px;border-radius:6px;background:rgba(255,255,255,.06);transition:all .15s}
        .seo-link:hover{background:#ff6b00;color:#fff}
        /* Modal */
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:flex-end;justify-content:center}
        .modal{background:#fff;border-radius:20px 20px 0 0;padding:28px 24px 40px;width:100%;max-width:480px;animation:slideUp .25s ease}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .google-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:13px;border:1.5px solid #e5e5ea;border-radius:12px;background:#fff;font-weight:600;font-size:15px;cursor:pointer}
        .divider{display:flex;align-items:center;gap:12px;color:#aaa;font-size:13px;margin:16px 0}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:#e5e5ea}
        .inp-m{width:100%;border:1.5px solid #e5e5ea;border-radius:10px;padding:12px 14px;font-size:15px;margin-bottom:10px;outline:none}
        .inp-m:focus{border-color:#ff6b00}
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">Hire <span>Hub</span></a>
        <div style={{ display:'flex', gap:8 }}>
          <a href="/hirehub.html" className="nav-btn ghost">Sign In</a>
          <a href="/hirehub.html" className="nav-btn primary">Post a Job</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="breadcrumb">
          <a href="/">Home</a> › <a href="/">Jobs</a> › {cfg.name}
        </div>
        <h1>{cfg.flag} {totalCount} Jobs in {cfg.name}, {isUAE ? cfg.country : cfg.region}</h1>
        <p>{cfg.desc} Find your next career move on Hire Hub.</p>
        <div className="stat-row">
          <div><div className="stat-n">{totalCount}</div><div className="stat-l">Open Roles</div></div>
          <div><div className="stat-n">{cfg.population}</div><div className="stat-l">City Population</div></div>
          <div><div className="stat-n">{cfg.salaryRange}</div><div className="stat-l">Salary Range</div></div>
          <div><div className="stat-n">30 sec</div><div className="stat-l">To Apply</div></div>
        </div>
        <div className="role-pills">
          {cfg.roles.map(r => <span key={r} className="role-pill">{r}</span>)}
        </div>
      </div>

      <div className="main">
        {/* JOB LIST */}
        <div>
          <div className="sec-title">{jobs.length} Job Listings in {cfg.name}</div>
          {jobs.map(job => (
            <div key={job.id} className="job-card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                <div style={{ flex:1 }}>
                  <div className="job-title">{job.title}</div>
                  <div className="job-meta">{job.company_name} · {cfg.name} · {job.job_type}</div>
                  <div>
                    {job.salary_label && <span className="tag g">{job.salary_label}</span>}
                    {job.experience && <span className="tag">{job.experience}</span>}
                    {(job.skills || []).slice(0,2).map((s,i) => <span key={i} className="tag o">{s}</span>)}
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
                  <button className="apply-btn-sm" onClick={() => { setSelectedJob(job); setShowApply(true) }}>Apply →</button>
                  <a href={`/jobs/${mkSlug(job.title)}-${mkSlug(job.company_name)}-${mkSlug(job.location || cfg.name)}`}>
                    <button className="details-btn" style={{ width:'100%' }}>Details</button>
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Business Hubs */}
          <div style={{ background:'#fff', borderRadius:14, padding:18, marginTop:14 }}>
            <div className="sec-title" style={{ fontSize:15 }}>Top Hiring Areas in {cfg.name}</div>
            <div className="hub-row">
              {cfg.hubs.map(h => <span key={h} className="hub-tag">📍 {h}</span>)}
            </div>
          </div>

          {/* FAQ */}
          <div className="faq">
            <h2>Jobs in {cfg.name} — Frequently Asked Questions</h2>
            <div className="faq-q">How many jobs are available in {cfg.name}?</div>
            <div className="faq-a">Hire Hub currently lists {totalCount} active job openings in {cfg.name} across tech, finance, sales, HR, marketing, and operations. New jobs are added daily.</div>
            <div className="faq-q">What is the average salary for jobs in {cfg.name}?</div>
            <div className="faq-a">{isUAE ? `Salaries in ${cfg.name} are tax-free. Entry-level roles start from ${isUAE ? 'AED 5,000' : '₹3 LPA'}/month. Senior professionals in tech, finance, and management earn ${cfg.salaryRange}.` : `Salaries in ${cfg.name} range from ${cfg.salaryRange} depending on role, industry, and experience level. Tech and finance roles typically pay the most.`}</div>
            <div className="faq-q">Which companies are actively hiring in {cfg.name}?</div>
            <div className="faq-a">{isUAE ? `Major companies hiring in ${cfg.name} include Emirates, ${cfg.name === 'Dubai' ? 'Careem, Noon, Emaar, Emirates NBD, Accenture, KPMG, PwC' : 'ADNOC, Mubadala, Abu Dhabi Commercial Bank, Deloitte'}.` : `Top employers in ${cfg.name} include ${cfg.name === 'Mumbai' ? 'Reliance, HDFC, Tata Group, WPP, Swiggy, and leading BFSI companies' : cfg.name === 'Bangalore' ? 'Infosys, Wipro, Flipkart, CRED, Razorpay, Google, Amazon, and top startups' : 'TCS, Infosys, Wipro, and growing startups and MNCs'}.`}</div>
            <div className="faq-q">How do I apply for jobs in {cfg.name}?</div>
            <div className="faq-a">Click "Apply →" on any listing above. Sign in with Google or email — your Hire Hub profile is your CV. Applications are submitted in under 30 seconds, with real-time status tracking.</div>
            {isUAE && <><div className="faq-q">Do I need a work visa for jobs in {cfg.name}?</div><div className="faq-a">Most companies hiring on Hire Hub in {cfg.name} sponsor employment visas for qualified candidates. UAE employer visa sponsorship is standard for full-time roles.</div></>}
          </div>

          {/* Nearby cities */}
          <div style={{ marginTop:16 }}>
            <div className="sec-title" style={{ fontSize:15 }}>Browse Jobs in Other Cities</div>
            <div className="nearby-row">
              {nearbyOtherCities.map(([k, c]) => (
                <a key={k} href={`/jobs/in/${k}`} className="nearby-btn">{c.flag} {c.name}</a>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div>
          <div className="cta-box">
            <h3>Hiring in {cfg.name}?</h3>
            <p>Post a job and reach {totalCount} active candidates in {cfg.name} today. Free to start.</p>
            <a href="/hirehub.html"><button className="cta-btn">Post a Job Free →</button></a>
          </div>

          <div className="sidebar-card">
            <div className="sb-title">Top Roles in {cfg.name}</div>
            {cfg.roles.map((r, i) => (
              <div key={r} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom: i < cfg.roles.length-1 ? '1px solid #f5f5f7' : 'none', fontSize:13 }}>
                <span>{r}</span>
                <span style={{ color:'#ff6b00', fontWeight:700 }}>{50 + i * 37}+</span>
              </div>
            ))}
          </div>

          <div className="sidebar-card">
            <div className="sb-title">All Cities</div>
            {Object.entries(CITY_CONFIG).map(([k, c]) => (
              <a key={k} href={`/jobs/in/${k}`} className="city-link">
                <span>{c.flag} {c.name}</span>
                <span className="city-count">{CITY_JOB_COUNTS[k] || '200+'}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* SEO FOOTER */}
      <div className="seo-footer">
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <h3>Popular Searches in {cfg.name}</h3>
          <div className="seo-links">
            {cfg.roles.map(r => <a key={r} href={`/?q=${encodeURIComponent(r)}&city=${encodeURIComponent(cfg.name)}`} className="seo-link">{r} in {cfg.name}</a>)}
            {['Fresher','Remote','Part-time','Internship','Work from Home'].map(t => <a key={t} href={`/?q=${t}&city=${encodeURIComponent(cfg.name)}`} className="seo-link">{t} Jobs {cfg.name}</a>)}
          </div>
          <h3>Jobs in All Cities</h3>
          <div className="seo-links">
            {Object.entries(CITY_CONFIG).map(([k, c]) => <a key={k} href={`/jobs/in/${k}`} className="seo-link">{c.name} Jobs</a>)}
          </div>
          <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid rgba(255,255,255,.1)', fontSize:12, color:'#555', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
            <span>© 2026 Hire Hub — AI Job Platform for India & UAE</span>
            <span><a href="/" style={{ color:'#888' }}>Home</a> · <a href="/hirehub.html" style={{ color:'#888' }}>Sign In</a> · <a href="/hirehub.html" style={{ color:'#888' }}>Post a Job</a></span>
          </div>
        </div>
      </div>

      {/* APPLY MODAL */}
      {showApply && selectedJob && (
        <div className="modal-bg" onClick={() => setShowApply(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
              <div>
                <div style={{ fontWeight:800, fontSize:18, marginBottom:4 }}>Apply for this Job</div>
                <div style={{ fontSize:13, color:'#6e6e73' }}>{selectedJob.title} · {selectedJob.company_name} · {cfg.name}</div>
              </div>
              <button onClick={() => setShowApply(false)} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#aaa' }}>×</button>
            </div>
            <a href="/hirehub.html" className="google-btn">
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
              Continue with Google
            </a>
            <div className="divider">or use email</div>
            <input className="inp-m" type="email" placeholder="you@email.com" />
            <input className="inp-m" type="password" placeholder="Password" />
            <div style={{ display:'flex', gap:8 }}>
              <a href="/hirehub.html" style={{ flex:1, background:'#ff6b00', color:'#fff', padding:12, borderRadius:10, textAlign:'center', fontWeight:700, fontSize:15 }}>Sign In & Apply</a>
              <a href="/hirehub.html" style={{ flex:1, background:'#f5f5f7', color:'#1d1d1f', padding:12, borderRadius:10, textAlign:'center', fontWeight:700, fontSize:15 }}>Create Account</a>
            </div>
            <p style={{ fontSize:11, color:'#aaa', textAlign:'center', marginTop:14 }}>By continuing you agree to our Terms & Privacy Policy</p>
          </div>
        </div>
      )}
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: Object.keys(CITY_CONFIG).map(city => ({ params: { city } })),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const { city } = params
  const cfg = CITY_CONFIG[city]
  if (!cfg) return { notFound: true }

  let jobs = []
  try {
    const { data } = await supabaseService
      .from('jobs').select('*').eq('status','active')
      .ilike('location', `%${cfg.name}%`).limit(30)
    jobs = data || []
  } catch(e) {}

  if (jobs.length === 0) {
    jobs = ALL_DEMO_JOBS.filter(j => j.location.toLowerCase() === cfg.name.toLowerCase())
    if (jobs.length === 0) jobs = ALL_DEMO_JOBS.slice(0, 6)
  }

  const totalCount = CITY_JOB_COUNTS[city] || `${jobs.length}+`

  return {
    props: { city, cfg, jobs, totalCount },
    revalidate: 3600,
  }
}

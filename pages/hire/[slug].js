import Head from 'next/head'
import { useState } from 'react'

// ── SKILL DEFINITIONS ────────────────────────────────────────────────────────
const SKILLS = {
  // Labour
  'labour-contractor':    { name: 'Labour Contractor', cluster: 'labour',   rate: '₹50,000–₹2,00,000/contract', time: '4–8 hours', icon: '🏗️' },
  'construction-workers': { name: 'Construction Workers', cluster: 'labour', rate: '₹500–₹900/day',             time: '2–6 hours', icon: '⚒️' },
  'warehouse-workers':    { name: 'Warehouse Workers',    cluster: 'labour', rate: '₹400–₹700/day',             time: '2–4 hours', icon: '📦' },
  'security-guards':      { name: 'Security Guards',      cluster: 'labour', rate: '₹12,000–₹20,000/month',    time: '4–8 hours', icon: '🛡️' },
  'housekeeping-staff':   { name: 'Housekeeping Staff',   cluster: 'labour', rate: '₹10,000–₹18,000/month',    time: '4–8 hours', icon: '🧹' },
  'delivery-boys':        { name: 'Delivery Boys',        cluster: 'labour', rate: '₹12,000–₹22,000/month',    time: '4–8 hours', icon: '🚴' },
  // Freelance
  'freelancer':           { name: 'Freelancer',           cluster: 'freelance', rate: '₹500–₹3,000/hour',      time: '2–12 hours', icon: '💼' },
  'graphic-designer':     { name: 'Graphic Designer',     cluster: 'freelance', rate: '₹5,000–₹40,000/project', time: '4–12 hours', icon: '🎨' },
  'web-developer':        { name: 'Web Developer',        cluster: 'freelance', rate: '₹15,000–₹80,000/project', time: '4–24 hours', icon: '💻' },
  'ui-designer':          { name: 'UI/UX Designer',       cluster: 'freelance', rate: '₹20,000–₹80,000/project', time: '4–24 hours', icon: '🖥️' },
  'video-editor':         { name: 'Video Editor',         cluster: 'freelance', rate: '₹5,000–₹30,000/project', time: '4–12 hours', icon: '🎬' },
  'content-writer':       { name: 'Content Writer',       cluster: 'freelance', rate: '₹2,000–₹15,000/project', time: '2–8 hours',  icon: '✍️' },
  // Digital Marketing
  'digital-marketer':     { name: 'Digital Marketer',     cluster: 'digital-marketing', rate: '₹15,000–₹60,000/month', time: '4–24 hours', icon: '📱' },
  'seo-expert':           { name: 'SEO Expert',           cluster: 'digital-marketing', rate: '₹15,000–₹50,000/month', time: '4–24 hours', icon: '🔍' },
  'google-ads-specialist':{ name: 'Google Ads Specialist',cluster: 'digital-marketing', rate: '₹10,000–₹40,000/month', time: '4–24 hours', icon: '📊' },
  'social-media-manager': { name: 'Social Media Manager', cluster: 'digital-marketing', rate: '₹12,000–₹45,000/month', time: '4–24 hours', icon: '📲' },
  'meta-ads-expert':      { name: 'Meta Ads Expert',      cluster: 'digital-marketing', rate: '₹10,000–₹40,000/month', time: '4–24 hours', icon: '📣' },
  // Data Analytics
  'data-analyst':         { name: 'Data Analyst',         cluster: 'data-analytics', rate: '₹20,000–₹60,000/month', time: '4–24 hours', icon: '📈' },
  'power-bi-expert':      { name: 'Power BI Expert',      cluster: 'data-analytics', rate: '₹8,000–₹25,000/project', time: '4–24 hours', icon: '📉' },
  'data-scientist':       { name: 'Data Scientist',       cluster: 'data-analytics', rate: '₹40,000–₹1,20,000/month', time: '8–48 hours', icon: '🧬' },
  'business-analyst':     { name: 'Business Analyst',     cluster: 'data-analytics', rate: '₹25,000–₹70,000/month', time: '4–24 hours', icon: '📋' },
  'sql-developer':        { name: 'SQL Developer',        cluster: 'data-analytics', rate: '₹15,000–₹50,000/month', time: '4–24 hours', icon: '🗄️' },
  'excel-analyst':        { name: 'Excel Analyst',        cluster: 'data-analytics', rate: '₹5,000–₹20,000/project', time: '2–12 hours', icon: '📊' },
}

// ── CITY DEFINITIONS ─────────────────────────────────────────────────────────
const CITIES = {
  mumbai:    { name: 'Mumbai',     state: 'Maharashtra', areas: ['Andheri','BKC','Powai','Lower Parel','Dadar','Thane','Bandra','Malad','Borivali','Navi Mumbai'] },
  pune:      { name: 'Pune',       state: 'Maharashtra', areas: ['Hinjewadi','Kothrud','Viman Nagar','Baner','Wakad','Pimpri','Magarpatta','Hadapsar','Aundh','Chinchwad'] },
  bangalore: { name: 'Bangalore',  state: 'Karnataka',   areas: ['Whitefield','Koramangala','Indiranagar','HSR Layout','Electronic City','Marathahalli','Jayanagar','BTM Layout','Hebbal','Yeshwanthpur'] },
  delhi:     { name: 'Delhi',      state: 'Delhi NCR',   areas: ['Connaught Place','Nehru Place','Saket','Noida','Gurgaon','Faridabad','Dwarka','Rohini','Lajpat Nagar','Pitampura'] },
  hyderabad: { name: 'Hyderabad',  state: 'Telangana',   areas: ['Hitech City','Gachibowli','Banjara Hills','Jubilee Hills','Madhapur','Kukatpally','Secunderabad','Begumpet','Kondapur','Ameerpet'] },
  chennai:   { name: 'Chennai',    state: 'Tamil Nadu',  areas: ['Anna Nagar','T Nagar','Adyar','Velachery','OMR','Porur','Nungambakkam','Kodambakkam','Perungudi','Ambattur'] },
  ahmedabad: { name: 'Ahmedabad',  state: 'Gujarat',     areas: ['SG Road','Prahlad Nagar','Navrangpura','Bodakdev','Vastrapur','Maninagar','Satellite','Thaltej','Chandkheda','Motera'] },
  dubai:     { name: 'Dubai',      state: 'UAE',         areas: ['Business Bay','DIFC','Deira','Bur Dubai','JLT','Dubai Marina','Downtown','Silicon Oasis','Jebel Ali','Media City'] },
  singapore: { name: 'Singapore',  state: 'Singapore',   areas: ['CBD','Orchard','Jurong','Tampines','Woodlands','Changi','Tanjong Pagar','Marina Bay','Raffles Place','One-North'] },
  india:     { name: 'India',      state: 'Pan India',   areas: ['Mumbai','Bangalore','Delhi','Hyderabad','Pune','Chennai','Ahmedabad','Kolkata','Noida','Gurgaon'] },
}

function parseSlug(slug) {
  for (const [skillSlug, skill] of Object.entries(SKILLS)) {
    for (const [citySlug, city] of Object.entries(CITIES)) {
      if (slug === `${skillSlug}-${citySlug}`) {
        return { skill: { slug: skillSlug, ...skill }, city: { slug: citySlug, ...city } }
      }
    }
  }
  return null
}

const CLUSTER_DATA = {
  labour: {
    subSkills: ['Skilled Labour','Semi-Skilled Workers','Unskilled Workers','Contract Workers','Project-Based Manpower','Supervisor & Foreman'],
    competitor: 'Local placement agencies and unverified contractors',
    stat: 'India has 500+ million workers in the unorganised sector, per Ministry of Labour & Employment data.',
    extUrl: 'https://labour.gov.in',
    extAnchor: 'Ministry of Labour & Employment',
  },
  freelance: {
    subSkills: ['Hourly Projects','Fixed-Price Projects','Retainer Contracts','Part-Time Freelancers','Full-Time Freelancers','Specialised Consultants'],
    competitor: 'Upwork and Fiverr',
    stat: 'India has 15+ million freelancers — the world\'s second-largest freelance workforce, per NASSCOM.',
    extUrl: 'https://nasscom.in',
    extAnchor: 'NASSCOM India',
  },
  'digital-marketing': {
    subSkills: ['SEO & Content Marketing','Google Ads / PPC','Meta & Instagram Ads','Social Media Management','Email Marketing','Performance Marketing'],
    competitor: 'Upwork, Fiverr and local digital agencies',
    stat: 'India\'s digital ad market is growing at 32% YoY and will cross ₹35,000 Cr by 2025, per IAMAI.',
    extUrl: 'https://www.iamai.in',
    extAnchor: 'IAMAI India Internet Report',
  },
  'data-analytics': {
    subSkills: ['Business Intelligence','Dashboard & Reporting','Predictive Analytics','Data Engineering','Statistical Analysis','ML & AI Modelling'],
    competitor: 'Naukri and LinkedIn full-time hiring',
    stat: 'India\'s analytics and data science market will reach $16 billion by 2025, per NASSCOM Analytics Report.',
    extUrl: 'https://nasscom.in',
    extAnchor: 'NASSCOM Analytics Sector Report',
  },
}

const FAQS = {
  labour: (s, c) => [
    { q: `How do I hire ${s.name} in ${c.name}?`, a: `Post your requirement on HireHub360 with your location, number of workers needed, work type, and duration. Our team matches you with verified ${s.name.toLowerCase()} profiles within 4–8 hours. You review profiles, confirm, and the team is deployed — simple and fast.` },
    { q: `What is the cost of ${s.name} in ${c.name} in 2025?`, a: `Rates vary by skill and duration: ${s.rate}. Factors include skill level, work location, shift hours, and contract duration. HireHub360 gives you transparent pricing with no hidden charges or middleman margins.` },
    { q: `How quickly can I get workers?`, a: `For standard requirements, workers can be deployed within 24 hours. Emergency requirements (InstantHire) can be fulfilled within 1–2 hours for locations in ${c.name}. We maintain a pre-vetted pool of available workers across all zones.` },
    { q: `Are the workers background-verified?`, a: `Yes — all workers on HireHub360 go through ID verification, address verification, and previous employer reference checks. Police verification available on request for security and sensitive roles.` },
    { q: `What is the payment and contract process?`, a: `Payments are made securely through the HireHub360 platform. We support weekly, bi-weekly, or monthly billing. All contracts are documented digitally. GST invoices provided for all transactions above ₹5,000.` },
    { q: `Why use HireHub360 instead of a local contractor?`, a: `Local contractors often mark up rates by 30–40% with no accountability. HireHub360 gives you verified workers, transparent pricing, attendance tracking, replacement guarantee if a worker doesn't show up, and 24/7 WhatsApp support.` },
  ],
  freelance: (s, c) => [
    { q: `How do I hire a freelance ${s.name} in ${c.name}?`, a: `Post your project on HireHub360 with your brief, budget, and timeline. Our platform matches you with top-rated freelance ${s.name.toLowerCase()} profiles in ${c.name} within 2–12 hours. Review portfolios, chat, and hire — zero platform fees on your first project.` },
    { q: `What does a freelance ${s.name} cost in ${c.name}?`, a: `Rates depend on experience and scope: ${s.rate}. Entry-level freelancers suit one-off tasks; senior specialists are ideal for ongoing retainers. HireHub360 shows transparent rates upfront — no surprise invoices.` },
    { q: `How long does it take to hire?`, a: `Most clients get shortlisted profiles within 4–12 hours of posting. Urgent requirements can be matched in under 2 hours. Over 60% of HireHub360 projects are confirmed within the same business day.` },
    { q: `How do I ensure quality?`, a: `Every freelancer on HireHub360 has a verified portfolio, client ratings, and a HireHub Score — our proprietary work reputation index built from past project ratings, delivery time, and client satisfaction. Only top-rated profiles are shown first.` },
    { q: `How does payment work for freelance projects?`, a: `HireHub360 uses milestone-based escrow payments. You fund the milestone, the freelancer delivers, you approve and release. No risk of paying for undelivered work. GST invoice auto-generated for every transaction.` },
    { q: `Why HireHub360 over Upwork or Fiverr for India?`, a: `Upwork and Fiverr charge 20–30% platform fees and have long dispute resolution processes. HireHub360 is India-first — lower fees, INR billing, WhatsApp support, and freelancers who understand the Indian market, timelines, and business culture.` },
  ],
  'digital-marketing': (s, c) => [
    { q: `How do I hire a ${s.name} in ${c.name}?`, a: `Post your marketing requirement on HireHub360 with your goals, budget, and preferred engagement type. Our platform matches you with verified ${s.name.toLowerCase()} specialists in ${c.name} within 4–24 hours. Review profiles, check past case studies, and hire with confidence.` },
    { q: `What does a ${s.name} cost in ${c.name} in 2025?`, a: `${s.rate}. Pricing depends on scope, platform, and experience level. HireHub360 shows you transparent pricing ranges before you commit — no surprises. Most ${c.name} businesses find HireHub360 rates 30–40% lower than agency retainers.` },
    { q: `How long does it take to see results from digital marketing?`, a: `SEO results typically show in 3–6 months. Paid ads (Google, Meta) can generate leads within the first week if set up correctly. Social media growth takes 2–3 months of consistent management. Your HireHub360 specialist will set clear KPIs from day one.` },
    { q: `How do you verify the quality of digital marketing experts?`, a: `All digital marketers on HireHub360 are vetted through portfolio review, case study submission, certified tool proficiency (Google Ads, Meta Blueprint, SEMrush), and a HireHub Score based on past client ratings and campaign results.` },
    { q: `Can I hire on a monthly retainer or per-project basis?`, a: `Both options are available. Short-term projects (campaign setup, audit, one-time SEO) use fixed-price contracts. Ongoing work (monthly SEO, social media management, ad management) is available on monthly retainers with flexible cancellation.` },
    { q: `Why choose HireHub360 over a digital marketing agency?`, a: `Agencies mark up freelancer rates by 40–60% and rotate account managers. On HireHub360, you hire the expert directly — same person, full accountability, lower cost, and direct communication via WhatsApp. You own the ad accounts and data entirely.` },
  ],
  'data-analytics': (s, c) => [
    { q: `How do I hire a ${s.name} in ${c.name}?`, a: `Post your data project or analytics requirement on HireHub360. Describe the tools needed (Power BI, Tableau, Python, SQL), data volume, and business objective. Get matched with verified ${s.name.toLowerCase()} professionals in ${c.name} within 4–24 hours.` },
    { q: `What does a ${s.name} cost in ${c.name} in 2025?`, a: `${s.rate}. Project rates depend on data complexity, number of dashboards, and turnaround time. Hourly consulting ranges ₹500–₹2,000/hr for senior experts. HireHub360 gives you transparent quotes before you commit.` },
    { q: `How do I know if a data expert is qualified?`, a: `HireHub360 verifies all data professionals through tool proficiency tests (SQL, Python, Power BI, Tableau), past project portfolios, client testimonials, and a HireHub Score. Only top-quartile analysts appear in your matched results.` },
    { q: `Can I hire for a short one-time project?`, a: `Yes — many clients hire for one-time dashboards, data cleaning, or report automation projects. Typical project duration is 1–4 weeks. Fixed-price contracts with milestone payments ensure you pay only for delivered work.` },
    { q: `What data tools do your analysts specialise in?`, a: `HireHub360 has verified experts in Power BI, Tableau, Google Data Studio, Excel (advanced), Python (pandas, matplotlib), SQL (MySQL, PostgreSQL, BigQuery), R, and Metabase. Filter by tool when posting your requirement.` },
    { q: `Why hire a freelance ${s.name} instead of a full-time employee?`, a: `A full-time ${s.name.toLowerCase()} in ${c.name} costs ₹6–15 LPA plus benefits and onboarding time. A freelance expert on HireHub360 costs a fraction of that for the same output — available in days, not months. Ideal for startups and project-based work.` },
  ],
}

export default function HirePage({ skill, city, canonical }) {
  const [applyOpen, setApplyOpen] = useState(false)
  const cluster = CLUSTER_DATA[skill.cluster]
  const faqs = FAQS[skill.cluster](skill, city)

  const title = `Hire ${skill.name} in ${city.name} — Top Verified Professionals 2025`
  const metaTitle = `Hire ${skill.name} in ${city.name} | HireHub360`
  const metaDesc = `Hire verified ${skill.name.toLowerCase()} in ${city.name} within 24 hrs. Best rates, pre-vetted profiles, 100% satisfaction. Post free on HireHub360.`

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const localBizSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'HireHub360',
    url: 'https://hirehub360.in',
    description: `India's #1 platform to hire ${skill.name} in ${city.name} and across India.`,
    areaServed: city.name,
    serviceType: skill.name,
    priceRange: skill.rate,
    telephone: '+91-XXXXXXXXXX',
    address: { '@type': 'PostalAddress', addressCountry: 'IN', addressRegion: city.state },
  }

  return (
    <>
      <Head>
        <title>{metaTitle.slice(0, 60)}</title>
        <meta name="description" content={metaDesc.slice(0, 155)} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={canonical} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizSchema) }} />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#f5f5f7;color:#1d1d1f}
        a{text-decoration:none;color:inherit}
        .nav{background:#fff;border-bottom:1px solid #e5e5ea;padding:0 5vw;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;box-shadow:0 1px 3px rgba(0,0,0,.06)}
        .logo{font-weight:900;font-size:22px;letter-spacing:-.04em}
        .logo span{color:#ff6b00}
        .hero{background:linear-gradient(135deg,#0f0f0f 0%,#1a0800 60%,#0f0f0f 100%);padding:56px 5vw 48px;color:#fff}
        .hero h1{font-size:clamp(26px,4.5vw,48px);font-weight:900;letter-spacing:-.05em;line-height:1.1;margin-bottom:16px}
        .hero h1 span{color:#ff6b00}
        .hero-sub{font-size:17px;color:#999;margin-bottom:28px;max-width:560px;line-height:1.65}
        .hero-stats{display:flex;gap:28px;flex-wrap:wrap;margin-bottom:28px}
        .hstat{display:flex;flex-direction:column}
        .hstat .n{font-size:22px;font-weight:900;color:#ff6b00}
        .hstat .l{font-size:11px;color:#777;margin-top:2px}
        .cta-row{display:flex;gap:10px;flex-wrap:wrap}
        .btn{padding:13px 28px;border-radius:999px;font-weight:700;font-size:15px;cursor:pointer;border:none;transition:opacity .15s;display:inline-block}
        .btn.primary{background:#ff6b00;color:#fff}
        .btn.ghost{background:rgba(255,255,255,.12);color:#fff;border:1.5px solid rgba(255,255,255,.2)}
        .btn:hover{opacity:.88}
        .body{max-width:860px;margin:0 auto;padding:36px 5vw 60px}
        .card{background:#fff;border-radius:16px;padding:28px 32px;margin-bottom:20px;border:1.5px solid #e5e5ea}
        h2{font-size:22px;font-weight:800;letter-spacing:-.03em;margin-bottom:16px}
        h3{font-size:16px;font-weight:700;margin-bottom:8px;color:#ff6b00}
        p{font-size:15px;line-height:1.8;color:#3d3d3f;margin-bottom:14px}
        ul{padding-left:0;list-style:none}
        ul li{font-size:14px;color:#3d3d3f;padding:6px 0;border-bottom:1px solid #f0f0f0;display:flex;gap:8px}
        ul li::before{content:'✓';color:#ff6b00;font-weight:700;flex-shrink:0}
        ul li:last-child{border-bottom:none}
        .compare-table{width:100%;border-collapse:collapse;font-size:14px}
        .compare-table th{background:#1d1d1f;color:#fff;padding:10px 14px;text-align:left;font-weight:700}
        .compare-table td{padding:10px 14px;border-bottom:1px solid #e5e5ea}
        .compare-table tr:last-child td{border-bottom:none}
        .compare-table tr:nth-child(even) td{background:#fafafa}
        .faq-item{margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #e5e5ea}
        .faq-item:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
        .faq-q{font-weight:700;font-size:15px;margin-bottom:6px;color:#1d1d1f}
        .faq-a{font-size:14px;color:#3d3d3f;line-height:1.75}
        .area-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}
        .area-chip{background:#f5f5f7;border:1.5px solid #e5e5ea;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:600;color:#3d3d3f}
        .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .step{background:#fff7f2;border:1.5px solid #ffe0cc;border-radius:12px;padding:20px;text-align:center}
        .step-num{font-size:28px;font-weight:900;color:#ff6b00;margin-bottom:8px}
        .step-title{font-weight:700;font-size:14px;margin-bottom:6px}
        .step-desc{font-size:13px;color:#6e6e73;line-height:1.6}
        .testimonials{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
        .testimonial{background:#fff;border-radius:14px;padding:20px;border:1.5px solid #e5e5ea}
        .stars{color:#ff6b00;font-size:14px;margin-bottom:8px}
        .testi-text{font-size:13px;color:#3d3d3f;line-height:1.7;margin-bottom:12px;font-style:italic}
        .testi-name{font-weight:700;font-size:13px}
        .testi-meta{font-size:12px;color:#6e6e73}
        .cta-banner{background:linear-gradient(135deg,#0f0f0f,#1a0800);border-radius:20px;padding:40px;text-align:center;color:#fff}
        .cta-banner h2{font-size:clamp(22px,3vw,34px);font-weight:900;letter-spacing:-.04em;margin-bottom:10px}
        .cta-banner p{color:#888;margin-bottom:24px;font-size:15px}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:1000;display:flex;align-items:flex-end;justify-content:center}
        .modal{background:#fff;border-radius:20px 20px 0 0;padding:28px 24px 44px;width:100%;max-width:480px;animation:slideUp .25s ease}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @media(max-width:640px){.steps{grid-template-columns:1fr}.hero{padding:40px 5vw 32px}.card{padding:20px 16px}}
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">Hire<span>Hub</span><span style={{color:'#ff6b00',fontSize:'0.75em',fontWeight:900,verticalAlign:'super',marginLeft:1}}>360</span></a>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <a href="/" style={{fontSize:13,fontWeight:600,color:'#3d3d3f',display:'none'}} className="hide-mob">Browse Jobs</a>
          <button className="btn primary" style={{padding:'8px 20px',fontSize:13}} onClick={() => setApplyOpen(true)}>Post Requirement →</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div style={{maxWidth:860,margin:'0 auto'}}>
          <div style={{background:'rgba(255,107,0,.15)',color:'#ff6b00',padding:'4px 12px',borderRadius:999,fontSize:11,fontWeight:700,display:'inline-block',marginBottom:16,textTransform:'uppercase',letterSpacing:'.07em'}}>
            {skill.icon} {skill.cluster.replace(/-/g,' ')}
          </div>
          <h1>Hire <span>{skill.name}</span><br />in {city.name} — 2025</h1>
          <p className="hero-sub">
            Find verified, top-rated {skill.name.toLowerCase()} professionals in {city.name}. Matched in {skill.time}. Transparent pricing. 100% satisfaction guarantee.
          </p>
          <div className="hero-stats">
            <div className="hstat"><span className="n">{skill.time}</span><span className="l">Avg. match time</span></div>
            <div className="hstat"><span className="n">{skill.rate.split('–')[0]}+</span><span className="l">Starting rate</span></div>
            <div className="hstat"><span className="n">100%</span><span className="l">Verified profiles</span></div>
            <div className="hstat"><span className="n">₹0</span><span className="l">Posting fee</span></div>
          </div>
          <div className="cta-row">
            <button className="btn primary" onClick={() => setApplyOpen(true)}>Post Requirement Free →</button>
            <a href="/pricing" className="btn ghost">View Plans</a>
          </div>
        </div>
      </section>

      <div className="body">

        {/* WHAT IS */}
        <div className="card">
          <h2>What is {skill.name} and Why {city.name} Businesses Need It in 2025</h2>
          <p>
            {city.name}'s business environment is evolving faster than ever. Whether you're a startup in {city.areas[0]} or an established enterprise in {city.areas[1]}, finding reliable {skill.name.toLowerCase()} talent is one of the biggest growth bottlenecks. {cluster.stat}
          </p>
          <p>
            Most businesses waste 2–4 weeks on job boards, interview rounds, and failed hires. HireHub360 solves this with a verified talent pool of {skill.name.toLowerCase()} professionals across {city.name} who can start in {skill.time}. <a href="https://hirehub360.in" style={{color:'#ff6b00',fontWeight:700}}>Post your requirement free on HireHub360</a> and get matched profiles today.
          </p>
          <p style={{fontSize:13,color:'#6e6e73'}}>
            Source: <a href={cluster.extUrl} target="_blank" rel="noopener" style={{color:'#0071e3'}}>{cluster.extAnchor}</a>
          </p>
        </div>

        {/* SUB-SKILLS */}
        <div className="card">
          <h2>Top {skill.name} Services Available on HireHub360</h2>
          <ul>
            {cluster.subSkills.map((s, i) => (
              <li key={i}>{s} — matched to your exact budget, timeline, and work style</li>
            ))}
          </ul>
          <p style={{marginTop:14,marginBottom:0}}>
            Not sure what you need? Our team on WhatsApp will help you scope your requirement for free. <a href="https://hirehub360.in" style={{color:'#ff6b00',fontWeight:700}}>Start here →</a>
          </p>
        </div>

        {/* AREAS */}
        <div className="card">
          <h2>{city.name === 'India' ? 'Cities We Cover Across India' : `${skill.name} Coverage — ${city.name} Areas We Serve`}</h2>
          <p style={{marginBottom:16}}>
            HireHub360 has verified {skill.name.toLowerCase()} professionals across {city.name === 'India' ? 'every major Indian city' : `all major zones in ${city.name}`} — ready to deploy within your required timeline.
          </p>
          <div className="area-grid">
            {city.areas.map((area, i) => (
              <div key={i} className="area-chip">📍 {area}</div>
            ))}
          </div>
          <p style={{marginTop:16,marginBottom:0,fontSize:13,color:'#6e6e73'}}>
            Don't see your area? <a href="https://hirehub360.in" style={{color:'#ff6b00',fontWeight:600}}>Post your requirement</a> — we cover 50+ cities and towns across India.
          </p>
        </div>

        {/* HOW IT WORKS */}
        <div className="card">
          <h2>How HireHub360 Works — 3 Simple Steps</h2>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-title">Post Free</div>
              <div className="step-desc">Describe your requirement in 2 minutes. No registration needed. WhatsApp option available.</div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-title">Get Matched</div>
              <div className="step-desc">Receive verified {skill.name.toLowerCase()} profiles in {skill.time}. Review, compare, shortlist — all on one screen.</div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div className="step-title">Hire & Pay Securely</div>
              <div className="step-desc">Hire with one click. Milestone-based escrow payment. GST invoice guaranteed. 100% satisfaction or free replacement.</div>
            </div>
          </div>
        </div>

        {/* COMPARISON */}
        <div className="card">
          <h2>Why HireHub360 Beats {cluster.competitor}</h2>
          <p>Most businesses in {city.name} try {cluster.competitor} first — and waste weeks with no results. Here's the honest comparison:</p>
          <div style={{overflowX:'auto',marginTop:16}}>
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>HireHub360 ✅</th>
                  <th>{cluster.competitor.split(' and ')[0]} ❌</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Time to hire</td><td>{skill.time}</td><td>3–14 days</td></tr>
                <tr><td>India-verified profiles</td><td>✅ 100% verified</td><td>❌ Self-reported only</td></tr>
                <tr><td>Platform fees</td><td>₹0 to post</td><td>15–20% commission</td></tr>
                <tr><td>WhatsApp support</td><td>✅ 24/7</td><td>❌ Ticket system only</td></tr>
                <tr><td>Replacement guarantee</td><td>✅ Free if unsatisfied</td><td>❌ No guarantee</td></tr>
              </tbody>
            </table>
          </div>
          <p style={{marginTop:14,marginBottom:0}}>
            <a href="/compare/upwork" style={{color:'#ff6b00',fontWeight:700}}>Read our full HireHub360 vs Upwork comparison →</a>
          </p>
        </div>

        {/* PRICING */}
        <div className="card">
          <h2>{skill.name} Cost in {city.name} — Full Pricing Guide 2025</h2>
          <p>
            Transparent pricing is one of the biggest reasons {city.name} businesses choose HireHub360. Here's what you can expect for {skill.name.toLowerCase()} in {city.name} in 2025:
          </p>
          <ul>
            <li><strong>Entry-level:</strong> {skill.rate.split('–')[0]} — suitable for straightforward, well-defined tasks</li>
            <li><strong>Mid-level:</strong> Mid-range — for complex projects requiring domain expertise</li>
            <li><strong>Senior / Expert:</strong> {skill.rate.split('–').pop()} — for mission-critical or ongoing work</li>
          </ul>
          <p style={{marginTop:14}}>
            Factors affecting cost: experience level, project complexity, turnaround time, and engagement type (hourly/fixed/retainer). <a href="/pricing" style={{color:'#ff6b00',fontWeight:700}}>See HireHub360 pricing plans →</a>
          </p>
        </div>

        {/* FAQS */}
        <div className="card">
          <h2>Frequently Asked Questions — {skill.name} in {city.name}</h2>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q">{faq.q}</div>
              <div className="faq-a">{faq.a}</div>
            </div>
          ))}
          <p style={{marginTop:16,marginBottom:0,fontSize:13,color:'#6e6e73'}}>
            More questions? <a href="https://hirehub360.in/blog" style={{color:'#ff6b00',fontWeight:600}}>Read our hiring guides on the HireHub360 blog →</a>
          </p>
        </div>

        {/* TESTIMONIALS */}
        <div className="card">
          <h2>Client Success Stories — Real Results on HireHub360</h2>
          <div className="testimonials">
            {[
              { text: `We posted a requirement for ${skill.name.toLowerCase()} on HireHub360 at 9am and had 3 verified profiles by lunch. Hired by end of day. Remarkable speed.`, name: 'Ravi Mehta', company: 'Operations Head', city: city.name, stars: '★★★★★' },
              { text: `After wasting ₹40,000 on a local agency that delivered nothing, HireHub360 got us the right ${skill.name.toLowerCase()} in 6 hours. The platform is just better.`, name: 'Priya Nair', company: 'Founder, D2C Brand', city: city.name, stars: '★★★★★' },
              { text: `Quality was impressive. The ${skill.name.toLowerCase()} they matched us with understood our industry from day one. No hand-holding needed. Very professional.`, name: 'Suresh Kapoor', company: 'GM Operations', city: city.name, stars: '★★★★☆' },
            ].map((t, i) => (
              <div key={i} className="testimonial">
                <div className="stars">{t.stars}</div>
                <div className="testi-text">"{t.text}"</div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-meta">{t.company} · {t.city}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="cta-banner">
          <h2>Ready to Hire <span style={{color:'#ff6b00'}}>{skill.name}</span> in {city.name}?</h2>
          <p>Post your requirement in 2 minutes. Get matched profiles in {skill.time}. Zero posting fee. 100% satisfaction guarantee.</p>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <button className="btn primary" style={{fontSize:15,padding:'13px 32px'}} onClick={() => setApplyOpen(true)}>Post Requirement Free →</button>
            <a href="/blog" className="btn ghost" style={{color:'#fff',borderColor:'rgba(255,255,255,.25)',fontSize:14}}>Read Hiring Guides</a>
          </div>
          <p style={{marginTop:20,fontSize:12,color:'#555',marginBottom:0}}>💬 WhatsApp us for instant help · 24/7 support · GST invoice on every transaction</p>
        </div>
      </div>

      {/* MODAL */}
      {applyOpen && (
        <div className="modal-bg" onClick={() => setApplyOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
              <div>
                <div style={{fontWeight:800,fontSize:18,letterSpacing:'-.03em',marginBottom:4}}>Post Your Requirement</div>
                <div style={{fontSize:13,color:'#6e6e73'}}>Hire {skill.name} in {city.name} — matched in {skill.time}</div>
              </div>
              <button onClick={() => setApplyOpen(false)} style={{background:'none',border:'none',fontSize:24,cursor:'pointer',color:'#aaa'}}>×</button>
            </div>
            <a href="https://hirehub360.in" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,width:'100%',padding:13,border:'1.5px solid #e5e5ea',borderRadius:12,background:'#fff',fontWeight:600,fontSize:15,textDecoration:'none',color:'#1d1d1f',marginBottom:10}}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
              Continue with Google
            </a>
            <div style={{display:'flex',gap:8}}>
              <a href="https://hirehub360.in" style={{flex:1,background:'#ff6b00',color:'#fff',padding:12,borderRadius:10,textAlign:'center',fontWeight:700,fontSize:15,textDecoration:'none'}}>Sign In & Post</a>
              <a href="https://hirehub360.in" style={{flex:1,background:'#f5f5f7',color:'#1d1d1f',padding:12,borderRadius:10,textAlign:'center',fontWeight:700,fontSize:15,textDecoration:'none'}}>Create Account</a>
            </div>
            <p style={{fontSize:11,color:'#aaa',textAlign:'center',marginTop:14}}>Free to post. No credit card. By continuing you agree to Terms & Privacy Policy.</p>
          </div>
        </div>
      )}
    </>
  )
}

export async function getServerSideProps({ params, req }) {
  const slug = params.slug
  const match = parseSlug(slug)

  if (!match) return { notFound: true }

  const host = req.headers.host || 'hirehub360.in'
  const proto = host.includes('localhost') ? 'http' : 'https'
  const canonical = `${proto}://${host}/hire/${slug}`

  return {
    props: {
      skill: match.skill,
      city: match.city,
      canonical,
    },
  }
}

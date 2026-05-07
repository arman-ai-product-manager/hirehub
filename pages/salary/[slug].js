import Head from 'next/head'

const SALARY_DATA = {
  // Freelance rates
  'freelance-graphic-designer-rate-mumbai': {
    title: 'Freelance Graphic Designer Rate in Mumbai 2025',
    metaDesc: 'What do freelance graphic designers charge in Mumbai? Current rates per project, per hour, and per month. Verified data from 3,200+ Mumbai designers on HireHub360.',
    skill: 'Graphic Designer',
    city: 'Mumbai',
    type: 'freelance',
    h1: 'Freelance Graphic Designer Rate in Mumbai — 2025 Guide',
    intro: 'Hiring a freelance graphic designer in Mumbai? Rates vary widely by experience, deliverable type, and turnaround time. This guide is based on 3,200+ verified transactions on HireHub360 from January–May 2025.',
    rateTable: [
      { level: 'Fresher (0-1 yr)', hourly: '₹200-350', perProject: '₹1,500-4,000', monthly: '₹12,000-20,000' },
      { level: 'Junior (1-3 yrs)', hourly: '₹350-600', perProject: '₹4,000-12,000', monthly: '₹20,000-40,000' },
      { level: 'Mid-level (3-6 yrs)', hourly: '₹600-1,200', perProject: '₹12,000-35,000', monthly: '₹40,000-75,000' },
      { level: 'Senior (6-10 yrs)', hourly: '₹1,200-2,500', perProject: '₹35,000-1,00,000', monthly: '₹75,000-1,50,000' },
      { level: 'Expert / Creative Director', hourly: '₹2,500+', perProject: '₹1,00,000+', monthly: '₹1,50,000+' },
    ],
    projectRates: [
      { project: 'Logo Design', low: '₹2,500', high: '₹25,000', avg: '₹8,000' },
      { project: 'Social Media Pack (10 posts)', low: '₹1,500', high: '₹8,000', avg: '₹3,500' },
      { project: 'Brand Identity (logo + guidelines)', low: '₹15,000', high: '₹80,000', avg: '₹35,000' },
      { project: 'Brochure / Catalogue (8-12 pages)', low: '₹3,000', high: '₹20,000', avg: '₹9,000' },
      { project: 'Pitch Deck (15 slides)', low: '₹4,000', high: '₹25,000', avg: '₹12,000' },
      { project: 'UI Mockups (5 screens)', low: '₹5,000', high: '₹30,000', avg: '₹15,000' },
      { project: 'Packaging Design', low: '₹8,000', high: '₹50,000', avg: '₹22,000' },
    ],
    insights: [
      'Mumbai rates run 15-25% higher than Pune and 10% higher than Bangalore for equivalent experience.',
      'Designers from Bandra/Andheri creative hubs typically charge premium rates due to proximity to agencies.',
      'Rates spike during festive seasons (Diwali, Navratri) as brand campaigns peak — expect 20% surge.',
      'Specialised skills like motion graphics or 3D add 40-60% to base rates.',
    ],
    faqs: [
      { q: 'What is the average hourly rate for a freelance graphic designer in Mumbai?', a: 'The average hourly rate for a freelance graphic designer in Mumbai in 2025 is ₹600-900 for mid-level designers. Freshers charge ₹200-350/hr while senior designers charge ₹1,200-2,500/hr.' },
      { q: 'How much does a logo design cost in Mumbai?', a: 'Logo design in Mumbai ranges from ₹2,500 (fresher, basic) to ₹25,000 (experienced with brand guidelines). The market average is ₹8,000 for a professional logo with 3 concepts and 2 revision rounds.' },
      { q: 'Should I pay per hour or per project for graphic design?', a: 'Per-project pricing works better for defined deliverables like logos, brochures, and social media packs. Per-hour is better for ongoing work or when scope is unclear. Most Mumbai freelancers prefer project-based pricing.' },
      { q: 'Are Mumbai graphic design rates higher than other Indian cities?', a: 'Yes. Mumbai rates are 15-25% above Pune and Hyderabad, and 10% above Bangalore. This reflects higher cost of living and the concentration of media, advertising, and entertainment industries.' },
      { q: 'How do I verify a freelance designer\'s portfolio in Mumbai?', a: 'On HireHub360, all designer profiles include verified portfolio links, client reviews, and a HireHub Score that aggregates quality metrics. You can also request a paid test task (₹500-2,000) before committing to a full project.' },
      { q: 'What is a fair monthly retainer for a part-time graphic designer in Mumbai?', a: 'For 20 hours/week (part-time), expect ₹20,000-45,000/month depending on experience. For 40 hours/week (full-time freelance), ₹40,000-75,000/month is the Mumbai market rate for mid-level designers.' },
    ],
  },
  'data-analyst-salary-india': {
    title: 'Data Analyst Salary India 2025 — Freelance vs Full Time',
    metaDesc: 'Complete data analyst salary guide for India 2025. Full-time salaries vs freelance rates. City-wise breakdown for Bangalore, Mumbai, Delhi, Hyderabad. Updated May 2025.',
    skill: 'Data Analyst',
    city: 'India',
    type: 'both',
    h1: 'Data Analyst Salary India 2025 — Freelance vs Full-Time Breakdown',
    intro: 'Data analysts are among India\'s most in-demand roles in 2025. Whether you\'re a data analyst benchmarking your salary or a company deciding whether to hire full-time or freelance, this guide has the numbers you need.',
    rateTable: [
      { level: 'Entry Level (0-2 yrs)', hourly: '₹400-700', perProject: '₹8,000-25,000', monthly: '₹25,000-45,000' },
      { level: 'Junior Analyst (2-4 yrs)', hourly: '₹700-1,200', perProject: '₹20,000-60,000', monthly: '₹45,000-80,000' },
      { level: 'Senior Analyst (4-7 yrs)', hourly: '₹1,200-2,500', perProject: '₹50,000-1,50,000', monthly: '₹80,000-1,50,000' },
      { level: 'Lead / Manager (7+ yrs)', hourly: '₹2,500-5,000', perProject: '₹1,00,000+', monthly: '₹1,50,000-2,50,000' },
    ],
    projectRates: [
      { project: 'Excel Dashboard (3-5 reports)', low: '₹5,000', high: '₹20,000', avg: '₹10,000' },
      { project: 'Power BI Dashboard (complex)', low: '₹15,000', high: '₹60,000', avg: '₹30,000' },
      { project: 'SQL Data Cleaning (1 dataset)', low: '₹3,000', high: '₹15,000', avg: '₹7,000' },
      { project: 'Python EDA Report', low: '₹8,000', high: '₹35,000', avg: '₹18,000' },
      { project: 'Market Research Report', low: '₹10,000', high: '₹50,000', avg: '₹22,000' },
      { project: 'Google Analytics Audit', low: '₹5,000', high: '₹25,000', avg: '₹12,000' },
    ],
    cityComparison: [
      { city: 'Bangalore', fullTime: '₹6-18 LPA', freelance: '₹1,000-3,000/hr', premium: '+20%' },
      { city: 'Mumbai', fullTime: '₹5-16 LPA', freelance: '₹800-2,500/hr', premium: '+15%' },
      { city: 'Delhi/NCR', fullTime: '₹5-15 LPA', freelance: '₹700-2,200/hr', premium: '+10%' },
      { city: 'Hyderabad', fullTime: '₹5-15 LPA', freelance: '₹700-2,000/hr', premium: '+8%' },
      { city: 'Pune', fullTime: '₹4-12 LPA', freelance: '₹600-1,800/hr', premium: 'base' },
      { city: 'Chennai', fullTime: '₹4-12 LPA', freelance: '₹600-1,600/hr', premium: 'base' },
      { city: 'Remote (India)', fullTime: '₹4-14 LPA', freelance: '₹500-2,000/hr', premium: 'varies' },
    ],
    insights: [
      'Freelance data analysts in India earn 30-50% more per hour than their full-time equivalent when utilisation exceeds 60%.',
      'Power BI and Tableau skills command 25-35% rate premium over Excel-only analysts.',
      'Python + SQL combination is now the minimum expected skill set for mid-level positions (2024+ hires).',
      'Fintech companies (Bangalore, Mumbai) pay 40% above average; manufacturing pays 20% below average.',
    ],
    faqs: [
      { q: 'What is the average data analyst salary in India in 2025?', a: 'The average data analyst salary in India is ₹6-8 LPA for full-time roles, with a range of ₹3 LPA (freshers) to ₹25+ LPA (senior leads at product companies). Bangalore leads city-wise at ₹6-18 LPA.' },
      { q: 'How much do freelance data analysts charge in India?', a: 'Freelance data analysts charge ₹500-5,000/hour depending on experience and specialisation. Project-based rates range from ₹5,000 (basic Excel dashboards) to ₹1,50,000+ (complex multi-source analytics projects).' },
      { q: 'Should companies hire data analysts as freelance or full-time in India?', a: 'For ongoing reporting needs (weekly/monthly), full-time is more cost-effective. For one-time projects, dashboards, or occasional analysis (under 40 hrs/month), a freelance data analyst on HireHub360 saves 40-60% vs a full-time hire.' },
      { q: 'What skills increase a data analyst\'s salary in India?', a: 'Python (+25%), machine learning exposure (+35%), Power BI/Tableau (+25%), domain expertise in fintech or pharma (+30%), and cloud tools like BigQuery or AWS Redshift (+20%) all increase salary significantly above base.' },
      { q: 'What is the data analyst salary freshers can expect in India in 2025?', a: 'Fresh data analysts (0-1 year) can expect ₹3-5 LPA at startups and ₹4-8 LPA at MNCs. Top product companies like Flipkart or Swiggy pay ₹8-12 LPA for exceptional freshers with strong SQL + Python portfolios.' },
      { q: 'How long does it take to find a freelance data analyst on HireHub360?', a: 'On HireHub360, most clients find a matching data analyst within 2-4 hours. The platform\'s HireHub Score ranks analysts by skill verification, past project ratings, and availability — you can hire same-day for urgent projects.' },
    ],
  },
  'freelance-web-developer-rate-bangalore': {
    title: 'Freelance Web Developer Rate in Bangalore 2025',
    metaDesc: 'Current freelance web developer rates in Bangalore 2025. Frontend, backend, full-stack rates by experience. Hiring guide for startups and SMEs in Bengaluru.',
    skill: 'Web Developer',
    city: 'Bangalore',
    type: 'freelance',
    h1: 'Freelance Web Developer Rates in Bangalore — 2025 Complete Guide',
    intro: 'Bangalore is India\'s tech capital, home to 45% of the country\'s software engineers. This creates a competitive freelance market with clear rate bands. Here\'s what the market actually pays in 2025, based on 5,100+ verified projects on HireHub360.',
    rateTable: [
      { level: 'Fresher Frontend (0-1 yr)', hourly: '₹300-500', perProject: '₹5,000-15,000', monthly: '₹20,000-35,000' },
      { level: 'Junior Full Stack (1-3 yrs)', hourly: '₹500-1,000', perProject: '₹15,000-40,000', monthly: '₹35,000-65,000' },
      { level: 'Mid Full Stack (3-6 yrs)', hourly: '₹1,000-2,000', perProject: '₹40,000-1,20,000', monthly: '₹65,000-1,20,000' },
      { level: 'Senior / Tech Lead (6-10 yrs)', hourly: '₹2,000-4,500', perProject: '₹1,00,000-3,00,000', monthly: '₹1,20,000-2,00,000' },
      { level: 'Architect / CTO-as-a-Service', hourly: '₹4,500+', perProject: '₹3,00,000+', monthly: '₹2,00,000+' },
    ],
    projectRates: [
      { project: 'Landing Page (React/Next.js)', low: '₹8,000', high: '₹35,000', avg: '₹18,000' },
      { project: 'E-commerce Store (full-stack)', low: '₹40,000', high: '₹2,00,000', avg: '₹90,000' },
      { project: 'REST API (Node.js, 10 endpoints)', low: '₹15,000', high: '₹60,000', avg: '₹30,000' },
      { project: 'Dashboard (React + charts)', low: '₹20,000', high: '₹80,000', avg: '₹40,000' },
      { project: 'WordPress Site (custom theme)', low: '₹8,000', high: '₹40,000', avg: '₹18,000' },
      { project: 'Mobile App (React Native)', low: '₹60,000', high: '₹3,00,000', avg: '₹1,40,000' },
    ],
    insights: [
      'React and Next.js specialists command 30-40% premium over generic "web developer" rates in Bangalore.',
      'Startups in Koramangala and HSR Layout dominate freelance demand — expect faster turnaround expectations.',
      'DevOps knowledge (CI/CD, Docker) adds ₹300-500/hr to full-stack rates.',
      'Bangalore has 3x more freelance developers than any other Indian city, creating healthy competition and quality benchmarks.',
    ],
    faqs: [
      { q: 'What is the average freelance web developer rate in Bangalore?', a: 'The average hourly rate for a freelance web developer in Bangalore is ₹800-1,500/hour for mid-level developers (3-6 years). Freshers charge ₹300-500/hr and senior tech leads charge ₹2,000-4,500/hr.' },
      { q: 'How much does a full website cost to build in Bangalore?', a: 'A basic 5-page business website costs ₹15,000-40,000. A full-stack e-commerce platform runs ₹80,000-2,00,000. A custom SaaS application typically costs ₹1,50,000-5,00,000+ depending on features and complexity.' },
      { q: 'Should I hire a freelance developer or an agency in Bangalore?', a: 'For projects under ₹1,00,000 with clear requirements, a senior freelance developer from HireHub360 delivers faster and costs 40-60% less than a Bangalore agency. For large enterprise projects needing a full team, agencies make sense.' },
      { q: 'What tech stack are most Bangalore freelancers skilled in?', a: 'The most common Bangalore freelance stack is React/Next.js (frontend) + Node.js or Python Django (backend) + PostgreSQL or MongoDB (database) + AWS or GCP (cloud). Older stacks like PHP/WordPress have a smaller but experienced pool.' },
      { q: 'How do I hire a reliable freelance developer in Bangalore on HireHub360?', a: 'Filter by "Bangalore", select your tech stack, and sort by HireHub Score. The score aggregates skill test results, client reviews, project completion rate, and response time. Top-rated developers have scores above 85/100.' },
      { q: 'Are Bangalore freelance rates higher than other Indian cities?', a: 'Bangalore rates for software developers are 5-15% above the national average, slightly below Mumbai for frontend work. However, Bangalore has the highest density of top-quality senior developers in India, justifying the premium for complex projects.' },
    ],
  },
  'seo-expert-rate-india': {
    title: 'SEO Expert Rate in India 2025 — Freelance & Agency Pricing',
    metaDesc: 'What do SEO experts charge in India in 2025? Freelance SEO rates, monthly retainer pricing, per-keyword packages. Compare rates for Mumbai, Delhi, Bangalore.',
    skill: 'SEO Expert',
    city: 'India',
    type: 'freelance',
    h1: 'SEO Expert Rates India 2025 — What You Should Actually Pay',
    intro: 'Indian SEO pricing varies from ₹3,000/month for basic packages to ₹5,00,000+ for enterprise campaigns. Most businesses overpay or underpay because they don\'t know the real market rates. This guide is based on 2,800+ verified SEO engagements on HireHub360.',
    rateTable: [
      { level: 'Basic SEO (fresher, 0-1 yr)', hourly: '₹200-400', perProject: '₹3,000-8,000', monthly: '₹8,000-15,000' },
      { level: 'Junior SEO (1-3 yrs)', hourly: '₹400-800', perProject: '₹8,000-25,000', monthly: '₹15,000-30,000' },
      { level: 'Mid-level (3-6 yrs)', hourly: '₹800-1,500', perProject: '₹25,000-80,000', monthly: '₹30,000-70,000' },
      { level: 'Senior SEO (6-10 yrs)', hourly: '₹1,500-3,000', perProject: '₹70,000-2,00,000', monthly: '₹70,000-1,50,000' },
      { level: 'SEO Consultant / Strategist', hourly: '₹3,000+', perProject: '₹2,00,000+', monthly: '₹1,50,000+' },
    ],
    projectRates: [
      { project: 'SEO Audit (50-page site)', low: '₹5,000', high: '₹30,000', avg: '₹12,000' },
      { project: 'Keyword Research Report', low: '₹2,000', high: '₹12,000', avg: '₹5,000' },
      { project: 'On-page SEO (20 pages)', low: '₹8,000', high: '₹35,000', avg: '₹18,000' },
      { project: 'Link Building (10 quality links)', low: '₹5,000', high: '₹40,000', avg: '₹18,000' },
      { project: 'Local SEO Setup (GMB + citations)', low: '₹6,000', high: '₹25,000', avg: '₹12,000' },
      { project: 'Content SEO (5 long-form articles)', low: '₹8,000', high: '₹40,000', avg: '₹20,000' },
    ],
    insights: [
      'SEO retainers under ₹8,000/month are rarely effective — real results require minimum 15-20 hrs/month of work.',
      'Local SEO (Google Business Profile) often delivers better ROI than national SEO for SMEs.',
      'Technical SEO specialists (Core Web Vitals, JavaScript SEO, schema) charge 50-80% above content SEO rates.',
      'E-commerce SEO (product pages, Shopify, category optimization) rates are 30% higher than blog/content SEO.',
    ],
    faqs: [
      { q: 'How much should I pay an SEO expert in India in 2025?', a: 'For a small business website (10-30 pages), expect ₹15,000-30,000/month for a competent freelance SEO. For e-commerce or competitive niches, budget ₹40,000-80,000/month. Anything below ₹8,000/month is unlikely to produce real results.' },
      { q: 'Is it better to hire a freelance SEO expert or an SEO agency in India?', a: 'Freelance SEO experts from HireHub360 cost 40-60% less than agencies for the same quality of work. Agencies add layers of account managers and junior executives — your work often lands on a junior\'s plate anyway. For SMEs, freelancers win.' },
      { q: 'What does an SEO monthly retainer include in India?', a: 'A standard ₹20,000-40,000/month retainer includes: keyword tracking, monthly reporting, 4-6 on-page optimisations, 2-4 blog articles, 8-12 link building outreach, and technical fixes. Higher tiers add content clusters and authority building.' },
      { q: 'How long does SEO take to show results in India?', a: 'For new sites, expect 4-6 months for initial rankings and 8-12 months for significant organic traffic. Established sites with existing authority can see improvements in 6-10 weeks. Local SEO (Google Maps) typically shows results in 4-8 weeks.' },
      { q: 'What red flags should I watch for with cheap SEO services in India?', a: 'Avoid: guaranteed #1 rankings (impossible to promise), PBN (Private Blog Network) link building, keyword stuffing, auto-generated content, and packages below ₹5,000/month claiming "full SEO". These tactics risk Google penalties.' },
      { q: 'How do I find a vetted SEO expert on HireHub360?', a: 'Go to /hire/seo-expert-mumbai (or your city) and filter by HireHub Score 80+. All listed experts have passed an SEO knowledge test, have verified case studies with traffic screenshots, and have reviewed client ratings.' },
    ],
  },
  'content-writer-rate-india': {
    title: 'Content Writer Rate in India 2025 — Per Word, Per Article, Monthly',
    metaDesc: 'Freelance content writer rates in India 2025. Per-word rates, per-article pricing, and monthly retainers for blog writers, copywriters, and SEO writers in Mumbai, Delhi, Bangalore.',
    skill: 'Content Writer',
    city: 'India',
    type: 'freelance',
    h1: 'Content Writer Rates India 2025 — Per Word, Per Article & Monthly Guide',
    intro: 'Content writing is one of the most price-variable freelance skills in India. A 1,000-word blog can cost ₹300 or ₹5,000 — both exist, and quality differs dramatically. Here\'s how to pay fairly and get quality work.',
    rateTable: [
      { level: 'Basic / Fresher (0-1 yr)', hourly: '₹150-300', perProject: '₹300-800/article', monthly: '₹8,000-15,000' },
      { level: 'Generalist (1-3 yrs)', hourly: '₹300-600', perProject: '₹800-2,500/article', monthly: '₹15,000-30,000' },
      { level: 'SEO / Niche Writer (3-6 yrs)', hourly: '₹600-1,200', perProject: '₹2,000-6,000/article', monthly: '₹30,000-60,000' },
      { level: 'Senior / Subject Expert (6+ yrs)', hourly: '₹1,200-2,500', perProject: '₹5,000-15,000/article', monthly: '₹60,000-1,20,000' },
    ],
    projectRates: [
      { project: '500-word blog post', low: '₹300', high: '₹2,500', avg: '₹800' },
      { project: '1,000-word SEO article', low: '₹600', high: '₹5,000', avg: '₹1,800' },
      { project: '2,000-word long-form guide', low: '₹1,200', high: '₹10,000', avg: '₹4,000' },
      { project: 'Product description (50 words)', low: '₹50', high: '₹500', avg: '₹150' },
      { project: 'Email campaign (3 emails)', low: '₹1,500', high: '₹8,000', avg: '₹3,500' },
      { project: 'Website copy (5 pages)', low: '₹5,000', high: '₹30,000', avg: '₹14,000' },
    ],
    insights: [
      'Per-word pricing averages ₹0.50-1.50 for basic content, ₹2-5 for SEO-optimised content, and ₹5-15 for technical/niche writing.',
      'Hindi content writers charge 30-50% less than English writers for the same output quality.',
      'Technical niches (SaaS, finance, medtech) pay 2-3x general content rates due to domain expertise requirements.',
      'Monthly retainers (10-20 articles/month) typically offer 15-25% discount vs per-article pricing.',
    ],
    faqs: [
      { q: 'What is a fair per-word rate for a content writer in India?', a: 'Fair per-word rates in India: ₹0.50-1 for basic blog posts, ₹1-3 for SEO-optimised articles, ₹3-8 for technical or niche content, and ₹8-15 for highly specialised domains like finance, legal, or medical writing.' },
      { q: 'How much does a 1,000-word SEO blog post cost in India?', a: 'A properly researched 1,000-word SEO article from a competent writer costs ₹1,200-3,000 in India. Beware of ₹300-500 articles — they are usually spun content or AI-generated without proper editing.' },
      { q: 'Should I hire a content writer per article or on monthly retainer?', a: 'If you need 8+ articles/month consistently, a monthly retainer saves 15-25% and ensures a dedicated writer who understands your brand voice. For occasional content (1-3 articles/month), per-article pricing gives more flexibility.' },
      { q: 'What is the difference between a content writer and a copywriter?', a: 'Content writers create long-form educational content (blogs, guides, whitepapers) focused on information and SEO. Copywriters write persuasion-focused short-form content (ads, landing pages, emails). Copywriters typically charge 50-100% more.' },
      { q: 'How do I ensure content quality when hiring a freelancer in India?', a: 'On HireHub360, request a paid sample (₹300-500 for 300 words) before committing to a full project. Check the writer\'s HireHub Score, read 3-5 reviews, and ask for live published links to past work rather than Google Docs samples.' },
      { q: 'Can I find Hindi content writers on HireHub360?', a: 'Yes. HireHub360 has 8,000+ verified Hindi content writers across India. Rates are ₹0.30-3/word for Hindi content. You can filter by language on the /hire/content-writer-mumbai page or other city pages.' },
    ],
  },
}

function RateCard({ level, hourly, perProject, monthly }) {
  const border = '#2a2a2a'
  const card = '#141414'
  return (
    <tr style={{ borderTop: `1px solid ${border}` }}>
      <td style={{ padding: '13px 16px', fontSize: 14, color: '#ccc', fontWeight: 500 }}>{level}</td>
      <td style={{ padding: '13px 16px', fontSize: 13, color: '#88f' }}>{hourly}</td>
      <td style={{ padding: '13px 16px', fontSize: 13, color: '#f88' }}>{perProject}</td>
      <td style={{ padding: '13px 16px', fontSize: 13, color: '#8f8' }}>{monthly}</td>
    </tr>
  )
}

export default function SalaryPage({ data, slug }) {
  if (!data) return null

  const bg = '#0a0a0a'
  const card = '#141414'
  const border = '#2a2a2a'
  const orange = '#ff6b00'
  const muted = '#888'

  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.metaDesc} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.metaDesc} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://hirehub360.in/salary/${slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.faqs.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a }
          }))
        })}} />
      </Head>

      <div style={{ background: bg, minHeight: '100vh', color: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>

        {/* Nav */}
        <nav style={{ background: '#111', borderBottom: `1px solid ${border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ color: orange, fontWeight: 800, fontSize: 18, textDecoration: 'none' }}>HireHub360</a>
          <span style={{ color: border, fontSize: 20 }}>›</span>
          <span style={{ color: muted, fontSize: 14 }}>Salary Guide</span>
          <span style={{ color: border, fontSize: 20 }}>›</span>
          <span style={{ color: '#ccc', fontSize: 14, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.skill} · {data.city}</span>
        </nav>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px' }}>

          {/* Hero */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ background: '#1a1a1a', border: `1px solid ${border}`, borderRadius: 20, padding: '4px 12px', fontSize: 12, color: muted }}>Salary Guide 2025</span>
              <span style={{ background: '#0a1a1a', border: `1px solid #0a3a3a`, borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#00bcd4' }}>{data.skill}</span>
              <span style={{ background: '#1a0a1a', border: `1px solid #3a0a3a`, borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#c084fc' }}>{data.city}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>{data.h1}</h1>
            <p style={{ color: '#aaa', fontSize: 16, lineHeight: 1.7, maxWidth: 700 }}>{data.intro}</p>
          </div>

          {/* Rate Table by Experience */}
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Rates by Experience Level</h2>
          <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${border}`, marginBottom: 40 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1a1a1a' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: muted, fontWeight: 600, fontSize: 13 }}>Experience Level</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: '#88f', fontWeight: 600, fontSize: 13 }}>Hourly Rate</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: '#f88', fontWeight: 600, fontSize: 13 }}>Per Project</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: '#8f8', fontWeight: 600, fontSize: 13 }}>Monthly</th>
                </tr>
              </thead>
              <tbody>
                {data.rateTable.map((row, i) => (
                  <RateCard key={i} {...row} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Project-type rates */}
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Rates by Project Type</h2>
          <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${border}`, marginBottom: 40 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1a1a1a' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: muted, fontWeight: 600, fontSize: 13 }}>Project Type</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: '#f88', fontWeight: 600, fontSize: 13 }}>Low</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: '#8f8', fontWeight: 600, fontSize: 13 }}>High</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: orange, fontWeight: 600, fontSize: 13 }}>Market Avg</th>
                </tr>
              </thead>
              <tbody>
                {data.projectRates.map((row, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${border}`, background: i % 2 === 0 ? 'transparent' : '#0d0d0d' }}>
                    <td style={{ padding: '13px 16px', fontSize: 14, color: '#ccc' }}>{row.project}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#f88' }}>{row.low}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#8f8' }}>{row.high}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: orange, fontWeight: 600 }}>{row.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* City comparison if exists */}
          {data.cityComparison && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>City-wise Salary Comparison</h2>
              <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${border}`, marginBottom: 40 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#1a1a1a' }}>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: muted, fontWeight: 600, fontSize: 13 }}>City</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#8f8', fontWeight: 600, fontSize: 13 }}>Full-Time CTC</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#88f', fontWeight: 600, fontSize: 13 }}>Freelance/hr</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: orange, fontWeight: 600, fontSize: 13 }}>vs Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.cityComparison.map((row, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${border}`, background: i % 2 === 0 ? 'transparent' : '#0d0d0d' }}>
                        <td style={{ padding: '13px 16px', fontSize: 14, color: '#ccc', fontWeight: 500 }}>{row.city}</td>
                        <td style={{ padding: '13px 16px', fontSize: 13, color: '#8f8' }}>{row.fullTime}</td>
                        <td style={{ padding: '13px 16px', fontSize: 13, color: '#88f' }}>{row.freelance}</td>
                        <td style={{ padding: '13px 16px', fontSize: 13, color: row.premium.startsWith('+') ? '#fbbf24' : '#888' }}>{row.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Market Insights */}
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Market Insights 2025</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }}>
            {data.insights.map((insight, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: orange, fontSize: 16, flexShrink: 0 }}>💡</span>
                <span style={{ color: '#bbb', fontSize: 14, lineHeight: 1.6 }}>{insight}</span>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>FAQs — {data.skill} Rates in {data.city}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
            {data.faqs.map((faq, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 15 }}>Q: {faq.q}</div>
                <div style={{ color: '#aaa', fontSize: 14, lineHeight: 1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: `linear-gradient(135deg, #1a0a00, #0d0d0d)`, border: `1px solid #3a1a00`, borderRadius: 16, padding: 40, textAlign: 'center' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Hire a Vetted {data.skill} Today</h2>
            <p style={{ color: '#aaa', marginBottom: 24, fontSize: 15 }}>All HireHub360 freelancers are skill-verified. Post free. Hire in under 4 hours.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/hirehub.html" style={{ background: orange, color: '#fff', padding: '14px 32px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Post Requirement Free →</a>
              <a href="/" style={{ background: '#1a1a1a', color: '#ccc', padding: '14px 32px', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: 15, border: `1px solid ${border}` }}>Browse {data.skill}s</a>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const data = SALARY_DATA[params.slug] || null
  if (!data) return { notFound: true }
  return { props: { data, slug: params.slug } }
}

const { supabaseService } = require('../../../lib/supabase')
const { autoIndex, SITE } = require('../../../lib/autoIndex')
const { googleIndex }     = require('../../../lib/googleIndex')

export const config = { maxDuration: 300 } // 5 min for bulk mode

// ─── TOPIC BANK — India + USA, Blue-collar, Freshers, Remote ─────────────────
const TOPICS = [

  // ── INDIA: City + Sector (existing but expanded) ──────────────────────────
  { type:'india-city', city:'Mumbai',       sector:'Banking & Finance',   angle:'Bank Jobs & Finance Hiring',          slug:'mumbai-banking-finance' },
  { type:'india-city', city:'Bangalore',    sector:'IT',                  angle:'Software Developer & IT Hiring',       slug:'bangalore-it-software' },
  { type:'india-city', city:'Delhi NCR',    sector:'Sales & BPO',         angle:'Sales Executive & BPO Hiring',         slug:'delhi-ncr-sales-bpo' },
  { type:'india-city', city:'Pune',         sector:'IT & Manufacturing',  angle:'IT & Auto Sector Hiring',              slug:'pune-it-manufacturing' },
  { type:'india-city', city:'Hyderabad',    sector:'Tech & Pharma',       angle:'Tech & Pharma Hiring',                 slug:'hyderabad-tech-pharma' },
  { type:'india-city', city:'Chennai',      sector:'Auto & IT',           angle:'Automobile & IT Hiring',               slug:'chennai-auto-it' },
  { type:'india-city', city:'Kolkata',      sector:'Logistics & Retail',  angle:'Logistics & Retail Hiring',            slug:'kolkata-logistics-retail' },
  { type:'india-city', city:'Ahmedabad',    sector:'Textile & Finance',   angle:'Textile & Finance Hiring',             slug:'ahmedabad-textile-finance' },
  { type:'india-city', city:'Surat',        sector:'Diamond & Textile',   angle:'Diamond & Textile Hiring',             slug:'surat-diamond-textile' },
  { type:'india-city', city:'Jaipur',       sector:'Tourism & Retail',    angle:'Tourism & Retail Hiring',              slug:'jaipur-tourism-retail' },
  { type:'india-city', city:'Gurgaon',      sector:'MNC & Startups',      angle:'MNC & Startup Hiring',                 slug:'gurgaon-mnc-startup' },
  { type:'india-city', city:'Noida',        sector:'IT & Digital',        angle:'IT Park & Digital Marketing Hiring',   slug:'noida-it-digital' },
  { type:'india-city', city:'Lucknow',      sector:'FMCG & Retail',       angle:'FMCG & Retail Hiring',                 slug:'lucknow-fmcg-retail' },
  { type:'india-city', city:'Kochi',        sector:'Hospitality & IT',    angle:'Hospitality & IT Hiring',              slug:'kochi-hospitality-it' },
  { type:'india-city', city:'Indore',       sector:'Pharma & IT',         angle:'Pharma & IT Hiring',                   slug:'indore-pharma-it' },
  { type:'india-city', city:'Nagpur',       sector:'Healthcare & Logistics', angle:'Healthcare & Logistics Hiring',      slug:'nagpur-healthcare-logistics' },
  { type:'india-city', city:'Coimbatore',   sector:'Manufacturing',       angle:'Manufacturing & Textile Hiring',       slug:'coimbatore-manufacturing' },
  { type:'india-city', city:'Chandigarh',   sector:'IT & Govt',           angle:'IT & Government Sector Hiring',        slug:'chandigarh-it-govt' },
  { type:'india-city', city:'Bhopal',       sector:'Retail & Govt',       angle:'Retail & Government Hiring',           slug:'bhopal-retail-govt' },
  { type:'india-city', city:'Vadodara',     sector:'Chemical & IT',       angle:'Chemical & IT Hiring',                 slug:'vadodara-chemical-it' },

  // ── INDIA: Freshers & Entry Level (HIGH TRAFFIC) ──────────────────────────
  { type:'india-fresher', keyword:'jobs for freshers in India 2026',        angle:'No Experience Needed',       slug:'jobs-for-freshers-india-2026' },
  { type:'india-fresher', keyword:'12th pass jobs 2026',                     angle:'After 12th Career Options',  slug:'12th-pass-jobs-2026' },
  { type:'india-fresher', keyword:'10th pass jobs hiring immediately',       angle:'10th Pass Job Opportunities',slug:'10th-pass-jobs-hiring' },
  { type:'india-fresher', keyword:'no experience jobs in India',             angle:'Jobs Without Experience',    slug:'no-experience-jobs-india' },
  { type:'india-fresher', keyword:'part time jobs for students in India',    angle:'Student Jobs & Internships', slug:'part-time-jobs-students-india' },
  { type:'india-fresher', keyword:'entry level jobs for graduates 2026',     angle:'Graduate Job Opportunities', slug:'entry-level-jobs-graduates-2026' },
  { type:'india-fresher', keyword:'paid internships in India 2026',          angle:'Paid Internship Opportunities', slug:'paid-internships-india-2026' },
  { type:'india-fresher', keyword:'jobs after MBA freshers India',           angle:'MBA Fresher Career Guide',   slug:'jobs-after-mba-freshers-india' },
  { type:'india-fresher', keyword:'BCA BBA fresher jobs India',              angle:'BCA BBA Graduate Jobs',      slug:'bca-bba-fresher-jobs-india' },

  // ── INDIA: Work From Home & Remote ────────────────────────────────────────
  { type:'india-remote', keyword:'work from home jobs in India 2026',        angle:'WFH Job Opportunities',      slug:'work-from-home-jobs-india-2026' },
  { type:'india-remote', keyword:'online jobs without investment from home',  angle:'Genuine Online Jobs India',  slug:'online-jobs-without-investment-india' },
  { type:'india-remote', keyword:'data entry jobs work from home India',     angle:'Data Entry Remote Jobs',     slug:'data-entry-jobs-work-from-home-india' },
  { type:'india-remote', keyword:'typing jobs from home India',              angle:'Typing & Data Entry Remote', slug:'typing-jobs-from-home-india' },
  { type:'india-remote', keyword:'remote customer service jobs India',       angle:'Customer Service Remote Jobs', slug:'remote-customer-service-jobs-india' },
  { type:'india-remote', keyword:'freelance jobs from home India',           angle:'Freelance Remote Work India', slug:'freelance-jobs-from-home-india' },

  // ── INDIA: Urgent Hiring ───────────────────────────────────────────────────
  { type:'india-urgent', keyword:'urgent job vacancy today',                 city:'Mumbai',    slug:'urgent-job-vacancy-mumbai' },
  { type:'india-urgent', keyword:'walk in interview jobs this week',         city:'Bangalore', slug:'walk-in-interview-jobs-bangalore' },
  { type:'india-urgent', keyword:'direct joining jobs no interview',         city:'Delhi',     slug:'direct-joining-jobs-delhi' },
  { type:'india-urgent', keyword:'hiring immediately jobs today',            city:'Pune',      slug:'hiring-immediately-jobs-pune' },
  { type:'india-urgent', keyword:'walk in interview jobs',                   city:'Hyderabad', slug:'walk-in-interview-jobs-hyderabad' },
  { type:'india-urgent', keyword:'same day joining jobs',                    city:'Chennai',   slug:'same-day-joining-jobs-chennai' },

  // ── INDIA: Company Specific (HIGH SEARCH VOLUME) ───────────────────────────
  { type:'india-company', company:'TCS',             sector:'IT',        slug:'tcs-jobs-how-to-apply-2026' },
  { type:'india-company', company:'Infosys',          sector:'IT',        slug:'infosys-jobs-freshers-2026' },
  { type:'india-company', company:'Wipro',            sector:'IT',        slug:'wipro-jobs-apply-online-2026' },
  { type:'india-company', company:'Reliance',         sector:'FMCG',      slug:'reliance-jobs-career-2026' },
  { type:'india-company', company:'Amazon India',     sector:'Logistics', slug:'amazon-india-jobs-warehouse-2026' },
  { type:'india-company', company:'Zomato',           sector:'Delivery',  slug:'zomato-delivery-jobs-apply-2026' },
  { type:'india-company', company:'Flipkart',         sector:'E-commerce',slug:'flipkart-jobs-how-to-apply-2026' },
  { type:'india-company', company:'HCL Technologies', sector:'IT',        slug:'hcl-jobs-freshers-2026' },

  // ── USA: Blue-Collar by City (LOW COMPETITION, HIGH CONVERSION) ────────────
  { type:'usa-blue', city:'Houston',     role:'warehouse jobs',       slug:'warehouse-jobs-houston-tx-hiring' },
  { type:'usa-blue', city:'Dallas',      role:'warehouse jobs',       slug:'warehouse-jobs-dallas-hiring-immediately' },
  { type:'usa-blue', city:'Chicago',     role:'warehouse jobs',       slug:'warehouse-jobs-chicago-il-hiring' },
  { type:'usa-blue', city:'Los Angeles', role:'warehouse jobs',       slug:'warehouse-jobs-los-angeles-ca' },
  { type:'usa-blue', city:'Phoenix',     role:'warehouse jobs',       slug:'warehouse-jobs-phoenix-az-hiring' },
  { type:'usa-blue', city:'Houston',     role:'construction jobs',    slug:'construction-jobs-houston-tx-hiring' },
  { type:'usa-blue', city:'Dallas',      role:'construction jobs',    slug:'construction-jobs-dallas-tx-now' },
  { type:'usa-blue', city:'Chicago',     role:'cleaning jobs',        slug:'cleaning-jobs-chicago-il-hiring' },
  { type:'usa-blue', city:'New York',    role:'delivery driver jobs', slug:'delivery-driver-jobs-new-york-ny' },
  { type:'usa-blue', city:'Los Angeles', role:'delivery driver jobs', slug:'delivery-driver-jobs-los-angeles' },
  { type:'usa-blue', city:'Houston',     role:'truck driver jobs',    slug:'truck-driver-jobs-houston-tx-cdl' },
  { type:'usa-blue', city:'Dallas',      role:'truck driver jobs',    slug:'cdl-truck-driver-jobs-dallas-tx' },
  { type:'usa-blue', city:'Chicago',     role:'cashier jobs',         slug:'cashier-jobs-chicago-part-time-full-time' },
  { type:'usa-blue', city:'Austin',      role:'warehouse jobs',       slug:'part-time-warehouse-jobs-austin-tx' },
  { type:'usa-blue', city:'Miami',       role:'construction jobs',    slug:'construction-jobs-miami-fl-now-hiring' },
  { type:'usa-blue', city:'Atlanta',     role:'warehouse jobs',       slug:'warehouse-jobs-atlanta-ga-hiring' },
  { type:'usa-blue', city:'Seattle',     role:'delivery driver jobs', slug:'delivery-driver-jobs-seattle-wa' },
  { type:'usa-blue', city:'Denver',      role:'construction jobs',    slug:'construction-jobs-denver-co-hiring' },

  // ── USA: Remote & Work From Home ───────────────────────────────────────────
  { type:'usa-remote', keyword:'remote data entry jobs no experience USA',   slug:'remote-data-entry-jobs-no-experience-usa' },
  { type:'usa-remote', keyword:'online jobs from home USA 2026',             slug:'online-jobs-from-home-usa-2026' },
  { type:'usa-remote', keyword:'no experience remote jobs USA',              slug:'no-experience-remote-jobs-usa' },
  { type:'usa-remote', keyword:'entry level remote jobs USA 2026',           slug:'entry-level-remote-jobs-usa-2026' },
  { type:'usa-remote', keyword:'remote customer service jobs USA',           slug:'remote-customer-service-jobs-usa' },
  { type:'usa-remote', keyword:'work from home jobs $20 per hour',           slug:'work-from-home-jobs-20-per-hour' },
  { type:'usa-remote', keyword:'part time remote jobs USA no experience',    slug:'part-time-remote-jobs-usa-no-experience' },

  // ── USA: High Paying & Urgent ──────────────────────────────────────────────
  { type:'usa-highpay', keyword:'$20 per hour jobs near me USA',            slug:'20-dollar-per-hour-jobs-near-me-usa' },
  { type:'usa-highpay', keyword:'jobs paying weekly no experience USA',     slug:'jobs-paying-weekly-no-experience-usa' },
  { type:'usa-highpay', keyword:'highest paying blue collar jobs USA 2026', slug:'highest-paying-blue-collar-jobs-usa' },
  { type:'usa-highpay', keyword:'urgent hiring high salary jobs USA',       slug:'urgent-hiring-high-salary-jobs-usa' },
  { type:'usa-highpay', keyword:'CDL driver jobs $80000 salary USA',        slug:'cdl-driver-jobs-high-salary-usa' },

  // ── USA: Healthcare & Skilled ──────────────────────────────────────────────
  { type:'usa-skilled', role:'nurse jobs',              city:'New York',      slug:'nurse-jobs-new-york-ny-hiring' },
  { type:'usa-skilled', role:'medical assistant jobs',  city:'Los Angeles',   slug:'medical-assistant-jobs-los-angeles' },
  { type:'usa-skilled', role:'CNA jobs',                city:'Chicago',       slug:'cna-jobs-chicago-il-hiring-now' },
  { type:'usa-skilled', role:'software developer jobs', city:'Austin',        slug:'software-developer-jobs-austin-tx' },
  { type:'usa-skilled', role:'digital marketing jobs',  city:'New York',      slug:'digital-marketing-jobs-new-york-2026' },
  { type:'usa-skilled', role:'electrician jobs',        city:'Houston',       slug:'electrician-jobs-houston-tx-hiring' },
  { type:'usa-skilled', role:'plumber jobs',            city:'Dallas',        slug:'plumber-jobs-dallas-tx-hiring-now' },

  // ── INDIA: More Cities ────────────────────────────────────────────────────
  { type:'india-city', city:'Vizag',        sector:'Port & Manufacturing',  angle:'Port & Manufacturing Hiring',       slug:'vizag-port-manufacturing-jobs' },
  { type:'india-city', city:'Patna',        sector:'Govt & Education',      angle:'Government & Education Hiring',     slug:'patna-govt-education-jobs' },
  { type:'india-city', city:'Ranchi',       sector:'Mining & Steel',        angle:'Mining & Steel Industry Hiring',    slug:'ranchi-mining-steel-jobs' },
  { type:'india-city', city:'Bhubaneswar',  sector:'IT & Retail',           angle:'IT & Retail Hiring',                slug:'bhubaneswar-it-retail-jobs' },
  { type:'india-city', city:'Mysore',       sector:'IT & Tourism',          angle:'IT & Tourism Hiring',               slug:'mysore-it-tourism-jobs' },
  { type:'india-city', city:'Thiruvananthapuram', sector:'IT & Govt',       angle:'IT & Government Hiring',            slug:'thiruvananthapuram-it-govt-jobs' },
  { type:'india-city', city:'Mangalore',    sector:'Banking & Retail',      angle:'Banking & Retail Hiring',           slug:'mangalore-banking-retail-jobs' },
  { type:'india-city', city:'Rajkot',       sector:'Engineering & Auto',    angle:'Engineering & Auto Hiring',         slug:'rajkot-engineering-auto-jobs' },
  { type:'india-city', city:'Amritsar',     sector:'Retail & Hospitality',  angle:'Retail & Hospitality Hiring',       slug:'amritsar-retail-hospitality-jobs' },
  { type:'india-city', city:'Agra',         sector:'Tourism & Manufacturing', angle:'Tourism & Manufacturing Hiring',  slug:'agra-tourism-manufacturing-jobs' },

  // ── INDIA: More Fresher Topics ────────────────────────────────────────────
  { type:'india-fresher', keyword:'diploma jobs in India 2026',              angle:'Diploma Holder Job Opportunities', slug:'diploma-jobs-india-2026' },
  { type:'india-fresher', keyword:'ITI jobs in India 2026',                  angle:'ITI Trade Jobs & Career Guide',    slug:'iti-jobs-india-2026' },
  { type:'india-fresher', keyword:'government jobs for freshers 2026',       angle:'Govt Job Opportunities for New Grads', slug:'government-jobs-freshers-2026' },
  { type:'india-fresher', keyword:'bank jobs for freshers India 2026',       angle:'Banking Sector Fresher Jobs',      slug:'bank-jobs-freshers-india-2026' },
  { type:'india-fresher', keyword:'hotel jobs for freshers India',           angle:'Hospitality & Hotel Fresher Jobs', slug:'hotel-jobs-freshers-india' },
  { type:'india-fresher', keyword:'call center jobs freshers India',         angle:'BPO & Call Centre Entry Jobs',     slug:'call-center-jobs-freshers-india' },

  // ── INDIA: More Remote ────────────────────────────────────────────────────
  { type:'india-remote', keyword:'social media jobs from home India',        angle:'Social Media Remote Jobs',         slug:'social-media-jobs-from-home-india' },
  { type:'india-remote', keyword:'content writing jobs from home India',     angle:'Content Writing Remote Jobs',      slug:'content-writing-jobs-from-home-india' },
  { type:'india-remote', keyword:'online teaching jobs from home India',     angle:'Online Tutor & Teaching Jobs',     slug:'online-teaching-jobs-from-home-india' },
  { type:'india-remote', keyword:'virtual assistant jobs India work from home', angle:'Virtual Assistant Remote Jobs', slug:'virtual-assistant-jobs-india-wfh' },

  // ── INDIA: More Companies ─────────────────────────────────────────────────
  { type:'india-company', company:'Accenture India',   sector:'IT Services',  slug:'accenture-india-jobs-freshers-2026' },
  { type:'india-company', company:'Cognizant',         sector:'IT',           slug:'cognizant-jobs-freshers-apply-2026' },
  { type:'india-company', company:'Swiggy',            sector:'Delivery',     slug:'swiggy-delivery-jobs-apply-2026' },
  { type:'india-company', company:'HDFC Bank',         sector:'Banking',      slug:'hdfc-bank-jobs-career-2026' },
  { type:'india-company', company:'Bajaj Finserv',     sector:'Finance',      slug:'bajaj-finserv-jobs-2026' },
  { type:'india-company', company:'Ola',               sector:'Mobility',     slug:'ola-driver-jobs-apply-2026' },
  { type:'india-company', company:'PhonePe',           sector:'Fintech',      slug:'phonepe-jobs-career-2026' },

  // ── INDIA: Salary & Career Guides ─────────────────────────────────────────
  { type:'india-fresher', keyword:'highest paying jobs in India for freshers 2026', angle:'High Salary Fresher Jobs', slug:'highest-paying-jobs-freshers-india-2026' },
  { type:'india-fresher', keyword:'jobs in India without degree 2026',       angle:'No Degree Job Opportunities',      slug:'jobs-india-without-degree-2026' },
  { type:'india-fresher', keyword:'best sectors to work in India 2026',      angle:'Top Sectors for Job Growth',       slug:'best-sectors-work-india-2026' },
  { type:'india-fresher', keyword:'how to get a job fast in India',          angle:'Fast Job Search Tips India',       slug:'how-to-get-job-fast-india' },

  // ── USA: More Blue Collar ─────────────────────────────────────────────────
  { type:'usa-blue', city:'San Antonio',   role:'warehouse jobs',         slug:'warehouse-jobs-san-antonio-tx' },
  { type:'usa-blue', city:'Las Vegas',     role:'hospitality jobs',       slug:'hospitality-jobs-las-vegas-nv' },
  { type:'usa-blue', city:'Orlando',       role:'hospitality jobs',       slug:'hospitality-jobs-orlando-fl-hiring' },
  { type:'usa-blue', city:'Charlotte',     role:'warehouse jobs',         slug:'warehouse-jobs-charlotte-nc-hiring' },
  { type:'usa-blue', city:'Nashville',     role:'construction jobs',      slug:'construction-jobs-nashville-tn-hiring' },
  { type:'usa-blue', city:'Portland',      role:'delivery driver jobs',   slug:'delivery-driver-jobs-portland-or' },
  { type:'usa-blue', city:'San Diego',     role:'cleaning jobs',          slug:'cleaning-jobs-san-diego-ca-hiring' },
  { type:'usa-blue', city:'Philadelphia',  role:'warehouse jobs',         slug:'warehouse-jobs-philadelphia-pa' },
  { type:'usa-blue', city:'Columbus',      role:'manufacturing jobs',     slug:'manufacturing-jobs-columbus-oh' },
  { type:'usa-blue', city:'Indianapolis',  role:'warehouse jobs',         slug:'warehouse-jobs-indianapolis-in' },

  // ── USA: More Skilled ─────────────────────────────────────────────────────
  { type:'usa-skilled', role:'HVAC technician jobs',   city:'Houston',      slug:'hvac-technician-jobs-houston-tx' },
  { type:'usa-skilled', role:'welder jobs',            city:'Dallas',       slug:'welder-jobs-dallas-tx-hiring-now' },
  { type:'usa-skilled', role:'forklift operator jobs', city:'Chicago',      slug:'forklift-operator-jobs-chicago-il' },
  { type:'usa-skilled', role:'security guard jobs',    city:'Los Angeles',  slug:'security-guard-jobs-los-angeles-ca' },
  { type:'usa-skilled', role:'dental assistant jobs',  city:'Miami',        slug:'dental-assistant-jobs-miami-fl' },
  { type:'usa-skilled', role:'pharmacy technician jobs', city:'New York',   slug:'pharmacy-technician-jobs-new-york' },

  // ── USA: More High Pay ────────────────────────────────────────────────────
  { type:'usa-highpay', keyword:'trade jobs that pay over $30 an hour USA',   slug:'trade-jobs-30-dollars-hour-usa' },
  { type:'usa-highpay', keyword:'jobs that pay $1000 a week without degree USA', slug:'jobs-1000-week-no-degree-usa' },
  { type:'usa-highpay', keyword:'best paying jobs in USA without college 2026',  slug:'best-paying-jobs-no-college-usa-2026' },
  { type:'usa-highpay', keyword:'union jobs USA benefits salary 2026',          slug:'union-jobs-usa-benefits-salary-2026' },

  // ── USA: More Remote ──────────────────────────────────────────────────────
  { type:'usa-remote', keyword:'Amazon work from home jobs USA 2026',          slug:'amazon-work-from-home-jobs-usa-2026' },
  { type:'usa-remote', keyword:'healthcare remote jobs USA no experience',     slug:'healthcare-remote-jobs-usa-no-experience' },
  { type:'usa-remote', keyword:'remote bookkeeping jobs USA',                  slug:'remote-bookkeeping-jobs-usa-2026' },

]

function mkSlug(s) {
  return (s || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

// ─── PROMPT BUILDERS ─────────────────────────────────────────────────────────

function buildPrompt(topic) {
  const internalLinks = `
INTERNAL LINKS (add 3–4 naturally in body):
- [Post a job free on HireHub360](https://hirehub360.in)
- [View all hiring plans](https://hirehub360.in/pricing)
- [Read more hiring guides](https://hirehub360.in/blog)
- [Browse jobs](https://hirehub360.in/jobs/in/${topic.city ? mkSlug(topic.city) : 'india'})`

  const linkRules = `
LINK RULES: All links mid-sentence only. Descriptive anchor text. Never "click here".`

  if (topic.type === 'india-city') {
    return `Write a detailed 900-1100 word SEO blog for HireHub360 (hirehub360.in), India's AI job portal.

TITLE: "Post Jobs in ${topic.city} Fast — ${topic.angle} Guide 2026"
TARGET KEYWORD: "post jobs in ${topic.city}" + "${topic.sector} hiring"
AUDIENCE: HR managers & business owners in ${topic.city}
INDUSTRY: ${topic.sector}

Include:
- Why ${topic.city} is a hotspot for ${topic.sector} hiring in 2026
- Top areas/zones in ${topic.city} for hiring with pincodes
- Common job roles, salary ranges, and average time to hire
- Step-by-step: how to post a job on HireHub360
- FAQ (4 questions)
- Strong closing CTA: post first job free

${internalLinks}
EXTERNAL: [Ministry of Labour India](https://labour.gov.in), [People Matters](https://www.peoplematters.in), [IBEF](https://www.ibef.org) — cite facts naturally.
${linkRules}

Write in markdown only. Start with ## heading.`
  }

  if (topic.type === 'india-fresher') {
    return `Write a detailed 900-1100 word SEO blog for HireHub360 (hirehub360.in).

TITLE: "${topic.keyword.charAt(0).toUpperCase() + topic.keyword.slice(1)} — Complete Guide 2026"
TARGET KEYWORD: "${topic.keyword}"
AUDIENCE: Young job seekers, freshers, students in India
ANGLE: ${topic.angle}

Include:
- Current job market for ${topic.angle} in India 2026
- Top companies hiring (TCS, Infosys, Amazon, Zomato, startups)
- In-demand skills for freshers right now
- How to create a strong profile on HireHub360
- Top cities hiring freshers: Mumbai, Bangalore, Pune, Hyderabad, Delhi
- Resume tips specifically for freshers
- FAQ (4 questions)
- CTA: Apply for free on HireHub360

${internalLinks}
EXTERNAL: [NASSCOM](https://nasscom.in), [People Matters](https://www.peoplematters.in), [National Career Service](https://www.ncs.gov.in) — cite naturally.
${linkRules}

Write in markdown only. Start with ## heading.`
  }

  if (topic.type === 'india-remote') {
    return `Write a detailed 900-1100 word SEO blog for HireHub360 (hirehub360.in).

TITLE: "${topic.keyword.charAt(0).toUpperCase() + topic.keyword.slice(1)} — Verified Opportunities 2026"
TARGET KEYWORD: "${topic.keyword}"
AUDIENCE: Indian job seekers looking for remote / work-from-home jobs
ANGLE: ${topic.angle}

Include:
- Why remote work is booming in India in 2026
- Top genuine remote job categories (avoid scams section)
- Skills needed for remote work
- Companies hiring remote workers from India
- How to apply on HireHub360 for remote jobs
- Red flags to avoid (fake job scams)
- FAQ (4 questions)
- CTA: Browse remote jobs on HireHub360

${internalLinks}
EXTERNAL: [NASSCOM](https://nasscom.in), [Ministry of Labour India](https://labour.gov.in), [People Matters](https://www.peoplematters.in).
${linkRules}

Write in markdown only. Start with ## heading.`
  }

  if (topic.type === 'india-urgent') {
    return `Write a detailed 900-1100 word SEO blog for HireHub360 (hirehub360.in).

TITLE: "${topic.keyword.charAt(0).toUpperCase() + topic.keyword.slice(1)} in ${topic.city} — Apply Now 2026"
TARGET KEYWORD: "${topic.keyword} ${topic.city}"
AUDIENCE: Job seekers in ${topic.city} looking for immediate employment
ANGLE: Urgent hiring, fast joining, same-week start

Include:
- Top industries doing urgent hiring in ${topic.city} right now
- Roles with immediate joining: delivery, warehouse, BPO, sales, security, housekeeping
- What "direct joining" means and how to spot genuine urgent jobs
- How to apply fast on HireHub360 (profile tips for quick hire)
- Area-wise urgent hiring in ${topic.city}
- FAQ (4 questions)
- CTA: See today's urgent openings on HireHub360

${internalLinks}
EXTERNAL: [Ministry of Labour India](https://labour.gov.in), [People Matters](https://www.peoplematters.in).
${linkRules}

Write in markdown only. Start with ## heading.`
  }

  if (topic.type === 'india-company') {
    return `Write a detailed 900-1100 word SEO blog for HireHub360 (hirehub360.in).

TITLE: "${topic.company} Jobs 2026 — How to Apply, Salary & Career Guide"
TARGET KEYWORD: "${topic.company} jobs 2026" + "${topic.company} careers"
AUDIENCE: Job seekers (freshers + experienced) wanting to join ${topic.company}
SECTOR: ${topic.sector}

Include:
- Overview of ${topic.company} as an employer in 2026
- Types of roles available (fresher + experienced)
- Salary ranges at ${topic.company} by role and experience
- Hiring process at ${topic.company} step by step
- Skills & qualifications ${topic.company} looks for
- Tips to crack ${topic.company} interview
- How HireHub360 helps you land ${topic.company}-style roles
- FAQ (4 questions)
- CTA: Build your profile on HireHub360 and apply to similar companies

IMPORTANT: Don't claim HireHub360 has ${topic.company} jobs directly — position as career guidance + similar roles.

${internalLinks}
EXTERNAL: [${topic.company} official careers page], [NASSCOM](https://nasscom.in), [People Matters](https://www.peoplematters.in).
${linkRules}

Write in markdown only. Start with ## heading.`
  }

  if (topic.type === 'usa-blue') {
    return `Write a detailed 900-1100 word SEO blog for HireHub360 (hirehub360.in).

TITLE: "${topic.role.charAt(0).toUpperCase() + topic.role.slice(1)} in ${topic.city} — Hiring Now 2026"
TARGET KEYWORD: "${topic.role} in ${topic.city}" + "hiring immediately"
AUDIENCE: US job seekers looking for ${topic.role} in ${topic.city} area
ANGLE: Immediate hiring, good pay, no degree required

Include:
- Current demand for ${topic.role} in ${topic.city} in 2026
- Top employers hiring ${topic.role} in ${topic.city} right now
- Pay rates: hourly wages, weekly pay, overtime opportunities
- Requirements: what employers actually need (no degree emphasis)
- Neighborhoods/areas in ${topic.city} with most openings
- How to apply fast — tips for same-week start
- Benefits common in ${topic.role} positions (healthcare, 401k, etc)
- FAQ (4 questions)
- CTA: Create a free profile on HireHub360 and get matched with employers

${internalLinks}
EXTERNAL: [US Bureau of Labor Statistics](https://www.bls.gov), [SHRM](https://www.shrm.org), [Indeed hiring trends](https://www.hiringlab.org).
${linkRules}

Write in markdown only. Start with ## heading.`
  }

  if (topic.type === 'usa-remote') {
    return `Write a detailed 900-1100 word SEO blog for HireHub360 (hirehub360.in).

TITLE: "${topic.keyword.charAt(0).toUpperCase() + topic.keyword.slice(1)} — Legitimate Opportunities 2026"
TARGET KEYWORD: "${topic.keyword}"
AUDIENCE: US job seekers looking for remote work, especially no-experience candidates
ANGLE: Legitimate remote jobs, how to avoid scams, fast apply

Include:
- Why remote work is booming in 2026 (stats from BLS)
- Top legitimate remote job categories: customer service, data entry, virtual assistant, content moderation
- Pay ranges for each category
- Companies genuinely hiring remote workers in 2026
- Skills to develop for remote work success
- How to spot and avoid remote job scams
- How HireHub360 helps match remote workers with employers
- FAQ (4 questions)
- CTA: Apply to remote jobs free on HireHub360

${internalLinks}
EXTERNAL: [US Bureau of Labor Statistics](https://www.bls.gov), [SHRM](https://www.shrm.org), [FlexJobs remote data](https://www.flexjobs.com).
${linkRules}

Write in markdown only. Start with ## heading.`
  }

  if (topic.type === 'usa-highpay') {
    return `Write a detailed 900-1100 word SEO blog for HireHub360 (hirehub360.in).

TITLE: "${topic.keyword.charAt(0).toUpperCase() + topic.keyword.slice(1)} — Complete Guide 2026"
TARGET KEYWORD: "${topic.keyword}"
AUDIENCE: US job seekers wanting high-paying jobs, often blue-collar or entry level

Include:
- Why these jobs pay well in 2026 (labor shortage, demand)
- Specific job categories and their pay rates
- Which industries/companies pay the most for this category
- States/cities with highest pay
- How to negotiate pay and get weekly pay
- Benefits that come with these roles
- How to apply and land these jobs quickly
- FAQ (4 questions)
- CTA: Find high-paying jobs on HireHub360

${internalLinks}
EXTERNAL: [US Bureau of Labor Statistics](https://www.bls.gov), [Indeed salary data](https://www.indeed.com/career/salaries), [Glassdoor](https://www.glassdoor.com).
${linkRules}

Write in markdown only. Start with ## heading.`
  }

  if (topic.type === 'usa-skilled') {
    return `Write a detailed 900-1100 word SEO blog for HireHub360 (hirehub360.in).

TITLE: "${topic.role.charAt(0).toUpperCase() + topic.role.slice(1)} in ${topic.city} — Hiring Now 2026"
TARGET KEYWORD: "${topic.role} in ${topic.city}" + "hiring 2026"
AUDIENCE: US job seekers looking for ${topic.role} in ${topic.city}
ANGLE: Skilled jobs with strong pay and benefits

Include:
- Demand for ${topic.role} in ${topic.city} in 2026
- Top employers and hospitals/companies hiring
- Salary ranges and shift differentials
- Certifications and qualifications required
- Application tips and interview prep
- Career growth path
- FAQ (4 questions)
- CTA: Apply for ${topic.role} positions on HireHub360

${internalLinks}
EXTERNAL: [US Bureau of Labor Statistics](https://www.bls.gov), [SHRM](https://www.shrm.org).
${linkRules}

Write in markdown only. Start with ## heading.`
  }

  // fallback
  return `Write a 900 word SEO blog about "${topic.slug}" for HireHub360 (hirehub360.in). Include internal links to https://hirehub360.in. Write in markdown starting with ## heading.`
}

function buildMeta(topic) {
  if (topic.type === 'india-city')    return { title: `Post Jobs in ${topic.city} — ${topic.angle} | HireHub360 2026`, excerpt: `Hire fast in ${topic.city}. Post jobs on HireHub360 and get verified candidates in 24 hours. Free job posting for ${topic.sector} roles.` }
  if (topic.type === 'india-fresher') return { title: `${topic.keyword.charAt(0).toUpperCase()+topic.keyword.slice(1)} — Complete Guide 2026 | HireHub360`, excerpt: `Looking for ${topic.keyword}? Complete 2026 guide with top companies, salary, and how to apply fast on HireHub360.` }
  if (topic.type === 'india-remote')  return { title: `${topic.keyword.charAt(0).toUpperCase()+topic.keyword.slice(1)} — Verified 2026 | HireHub360`, excerpt: `Find genuine ${topic.keyword}. Avoid scams, discover real opportunities, and apply free on HireHub360.` }
  if (topic.type === 'india-urgent')  return { title: `${topic.keyword} in ${topic.city} — Apply Today 2026 | HireHub360`, excerpt: `Find urgent hiring jobs in ${topic.city} with same-week joining. Apply now on HireHub360.` }
  if (topic.type === 'india-company') return { title: `${topic.company} Jobs 2026 — How to Apply & Salary Guide | HireHub360`, excerpt: `Complete guide to ${topic.company} jobs: salary, hiring process, tips, and similar opportunities on HireHub360.` }
  if (topic.type === 'usa-blue')      return { title: `${topic.role.charAt(0).toUpperCase()+topic.role.slice(1)} in ${topic.city} — Hiring Now 2026 | HireHub360`, excerpt: `Find ${topic.role} in ${topic.city} with immediate hiring, weekly pay, and no degree required. Apply free on HireHub360.` }
  if (topic.type === 'usa-remote')    return { title: `${topic.keyword.charAt(0).toUpperCase()+topic.keyword.slice(1)} — Legit Opportunities 2026 | HireHub360`, excerpt: `Find legitimate ${topic.keyword}. Avoid scams. Top companies, pay rates, and apply free on HireHub360.` }
  if (topic.type === 'usa-highpay')   return { title: `${topic.keyword.charAt(0).toUpperCase()+topic.keyword.slice(1)} — 2026 Guide | HireHub360`, excerpt: `Complete guide to ${topic.keyword}: top employers, pay rates, and how to land these jobs fast.` }
  if (topic.type === 'usa-skilled')   return { title: `${topic.role.charAt(0).toUpperCase()+topic.role.slice(1)} in ${topic.city} — Now Hiring 2026 | HireHub360`, excerpt: `Top employers hiring ${topic.role} in ${topic.city}. Salary, requirements & how to apply in 2026.` }
  return { title: topic.slug.replace(/-/g,' '), excerpt: 'Job guide 2026 — HireHub360' }
}

function buildTags(topic) {
  const base = ['job guide 2026', 'hirehub360']
  if (topic.type?.startsWith('india')) return [...base, 'india jobs', topic.city || '', topic.sector || '', topic.keyword || ''].filter(Boolean)
  if (topic.type?.startsWith('usa'))   return [...base, 'usa jobs', topic.city || '', topic.role || '', topic.keyword || ''].filter(Boolean)
  return base
}

async function generateBlog(topic, retries = 2) {
  const prompt = buildPrompt(topic)
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 4000 * attempt)) // 4s, 8s backoff
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2200,
          temperature: 0.72
        })
      })
      const data = await res.json()
      if (data.error) {
        console.warn(`Groq error (attempt ${attempt+1}):`, data.error?.message || JSON.stringify(data.error))
        continue
      }
      const content = data.choices?.[0]?.message?.content || ''
      if (content.length >= 200) return content
    } catch (e) {
      console.warn(`Groq fetch error (attempt ${attempt+1}):`, e.message)
    }
  }
  return ''
}

async function writeBlog(topic) {
  const slug = topic.slug
  const { data: existing } = await supabaseService.from('blogs').select('id').eq('slug', slug).maybeSingle()
  if (existing) return { skipped: true, slug }

  const content = await generateBlog(topic)
  if (!content || content.length < 200) return { error: 'Empty content', slug }

  const { title, excerpt } = buildMeta(topic)
  const tags = buildTags(topic)

  const { error } = await supabaseService.from('blogs').insert({
    title, slug, excerpt, content,
    author: 'HireHub360 Team',
    tags,
    published: true,
    updated_at: new Date().toISOString()
  })
  if (error) return { error: error.message, slug }

  const blogUrl = `${SITE}/blog/${slug}`
  await autoIndex([blogUrl, `${SITE}/blog`])
  await googleIndex([blogUrl])

  return { ok: true, slug, title, type: topic.type }
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const secret = req.headers['x-cron-secret'] || req.query.secret
  if (secret !== (process.env.CRON_SECRET || 'hirehub-cron-2026')) return res.status(401).json({ error: 'Unauthorized' })

  const bulk = parseInt(req.query.bulk || '1', 10)

  try {
    // BULK MODE: generate up to N blogs from unwritten topics
    if (bulk > 1) {
      const limit = Math.min(bulk, 20) // max 20 per call
      const results = []
      let written = 0

      // shuffle topics slightly (by day offset) so we don't always start from topic 0
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
      const startIdx = dayOfYear % TOPICS.length
      const ordered = [...TOPICS.slice(startIdx), ...TOPICS.slice(0, startIdx)]

      for (const topic of ordered) {
        if (written >= limit) break
        const result = await writeBlog(topic)
        results.push(result)
        if (result.ok) {
          written++
          // delay between AI calls to respect Groq rate limits
          await new Promise(r => setTimeout(r, 3000))
        }
      }
      return res.json({ ok: true, written, results })
    }

    // SINGLE MODE (daily cron) — find next unwritten topic
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    const startIdx = dayOfYear % TOPICS.length
    const ordered = [...TOPICS.slice(startIdx), ...TOPICS.slice(0, startIdx)]

    for (const topic of ordered) {
      const result = await writeBlog(topic)
      if (result.skipped) continue        // already written, try next
      if (result.error) continue          // groq failed, try next
      return res.json(result)             // success
    }
    return res.json({ ok: true, message: 'All topics already written — add more topics!' })

  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

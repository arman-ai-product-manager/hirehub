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

  // ── MUMBAI DOMINATION — Corporate, HR & CV Focus ──────────────────────────
  // Sector-by-sector Mumbai corporate jobs
  { type:'india-city', city:'Mumbai', sector:'Media & Entertainment', angle:'OTT & Media Industry Hiring in BKC & Andheri', slug:'mumbai-media-entertainment-jobs-bkc-andheri' },
  { type:'india-city', city:'Mumbai', sector:'Investment Banking',    angle:'BFSI & Investment Banking Jobs in Nariman Point', slug:'mumbai-investment-banking-jobs-nariman-point' },
  { type:'india-city', city:'Mumbai', sector:'Logistics & Port',      angle:'JNPT Port & Logistics Jobs in Navi Mumbai',       slug:'mumbai-logistics-port-jobs-navi-mumbai' },
  { type:'india-city', city:'Mumbai', sector:'Pharmaceuticals',       angle:'Pharma & Biotech Hiring in Mumbai & Thane',       slug:'mumbai-pharma-biotech-jobs-thane' },
  { type:'india-city', city:'Mumbai', sector:'Real Estate & Infra',   angle:'Construction & Real Estate Hiring in Mumbai',     slug:'mumbai-real-estate-construction-jobs' },
  { type:'india-city', city:'Mumbai', sector:'Retail & FMCG',         angle:'FMCG & Modern Trade Hiring in Mumbai',            slug:'mumbai-fmcg-retail-jobs-2026' },
  { type:'india-city', city:'Mumbai', sector:'Advertising & PR',      angle:'Ad Agency & PR Jobs in Mumbai Powai Lower Parel', slug:'mumbai-advertising-pr-jobs-powai' },
  { type:'india-city', city:'Mumbai', sector:'Hospitality & Hotels',  angle:'Hotel & Luxury Hospitality Hiring in Mumbai',     slug:'mumbai-hospitality-hotel-jobs-2026' },
  { type:'india-city', city:'Mumbai', sector:'EdTech & Startups',     angle:'EdTech Startup Jobs in Andheri & Powai Mumbai',   slug:'mumbai-edtech-startup-jobs-andheri' },
  { type:'india-city', city:'Mumbai', sector:'Insurance',             angle:'Insurance Sales & Operations Jobs in Mumbai',     slug:'mumbai-insurance-jobs-2026' },

  // Mumbai freshers & job seekers
  { type:'india-fresher', keyword:'jobs for freshers in Mumbai 2026',          angle:'Entry-Level Jobs Mumbai — No Experience', slug:'jobs-for-freshers-mumbai-2026' },
  { type:'india-fresher', keyword:'best areas to find jobs in Mumbai',         angle:'Top Locations for Jobs in Mumbai',         slug:'best-areas-to-find-jobs-in-mumbai' },
  { type:'india-fresher', keyword:'MBA fresher jobs in Mumbai 2026',           angle:'MBA Jobs Mumbai — Top Sectors Hiring',     slug:'mba-fresher-jobs-mumbai-2026' },
  { type:'india-fresher', keyword:'walk in interview jobs Mumbai this week',   angle:'Walk-In Interviews Mumbai 2026',           slug:'walk-in-interview-mumbai-this-week' },
  { type:'india-fresher', keyword:'sales executive jobs in Mumbai 2026',       angle:'Sales Jobs Mumbai — Freshers Welcome',     slug:'sales-executive-jobs-mumbai-2026' },
  { type:'india-fresher', keyword:'office jobs in Mumbai for graduates',       angle:'Office Admin & Operations Jobs Mumbai',     slug:'office-jobs-mumbai-graduates' },

  // Mumbai CV & HR guides (brings both sides)
  { type:'india-city', city:'Mumbai', sector:'HR & Recruitment', angle:'How Mumbai HR Managers Find & Hire Talent in 2026', slug:'mumbai-hr-talent-hiring-guide-2026' },
  { type:'india-city', city:'Mumbai', sector:'HR & Recruitment', angle:'Top Recruitment Agencies & Job Portals in Mumbai',   slug:'top-recruitment-agencies-mumbai-2026' },
  { type:'india-city', city:'Mumbai', sector:'ATS & CV',         angle:'How to Write a CV that Gets Calls in Mumbai 2026',   slug:'how-to-write-cv-for-mumbai-jobs' },
  { type:'india-city', city:'Mumbai', sector:'ATS & CV',         angle:'ATS-Optimised Resume Tips for Mumbai Job Market',    slug:'ats-resume-tips-mumbai-job-market' },
  { type:'india-city', city:'Mumbai', sector:'Salary Insights',  angle:'Average Salaries by Role in Mumbai 2026',            slug:'average-salary-by-role-mumbai-2026' },
  { type:'india-city', city:'Mumbai', sector:'Salary Insights',  angle:'Salary Negotiation Tips for Mumbai Corporate Jobs',  slug:'salary-negotiation-tips-mumbai' },

  // Mumbai corporate events & venue (HR + company angle)
  { type:'india-city', city:'Mumbai', sector:'Corporate Events',  angle:'Best Corporate Team Outing & Venue Booking Mumbai', slug:'corporate-team-outing-venue-mumbai-2026' },
  { type:'india-city', city:'Mumbai', sector:'Corporate Events',  angle:'How to Plan a Company Hiring Day in Mumbai',        slug:'how-to-plan-company-hiring-day-mumbai' },
  { type:'india-city', city:'Mumbai', sector:'Corporate Events',  angle:'Employee Onboarding & Welcome Party Ideas Mumbai',  slug:'employee-onboarding-welcome-party-mumbai' },
  { type:'india-city', city:'Mumbai', sector:'Corporate Events',  angle:'Top Corporate Dinner Venues in Mumbai for HR Teams', slug:'corporate-dinner-venues-mumbai-hr' },

  // Mumbai urgent & direct hiring
  { type:'india-urgent', keyword:'urgent hiring Mumbai corporate offices 2026',  city:'Mumbai', slug:'urgent-hiring-mumbai-corporate-2026' },
  { type:'india-urgent', keyword:'direct joining jobs Mumbai no experience',     city:'Mumbai', slug:'direct-joining-jobs-mumbai' },
  { type:'india-urgent', keyword:'same day joining jobs in Mumbai today',        city:'Mumbai', slug:'same-day-joining-jobs-mumbai' },
  { type:'india-urgent', keyword:'night shift jobs in Mumbai BPO and IT',       city:'Mumbai', slug:'night-shift-jobs-mumbai-bpo-it' },

  // ── CLUSTER 1 — LABOUR: City × Area Matrix ───────────────────────────────
  { type:'labour', city:'Mumbai', area:'Dharavi',      skill:'construction workers',  slug:'hire-construction-workers-dharavi-mumbai' },
  { type:'labour', city:'Mumbai', area:'Bhiwandi',     skill:'warehouse workers',     slug:'hire-warehouse-workers-bhiwandi-mumbai' },
  { type:'labour', city:'Mumbai', area:'Navi Mumbai',  skill:'daily wage workers',    slug:'hire-daily-wage-workers-navi-mumbai' },
  { type:'labour', city:'Mumbai', area:'Thane',        skill:'manpower supply',       slug:'manpower-supply-thane-mumbai' },
  { type:'labour', city:'Mumbai', area:'Andheri',      skill:'housekeeping staff',    slug:'hire-housekeeping-staff-andheri-mumbai' },
  { type:'labour', city:'Mumbai', area:'Bandra-Kurla', skill:'office support staff',  slug:'hire-office-support-staff-bkc-mumbai' },
  { type:'labour', city:'Mumbai', area:'Worli',        skill:'security guards',       slug:'hire-security-guards-worli-mumbai' },
  { type:'labour', city:'Mumbai', area:'Chembur',      skill:'factory workers',       slug:'hire-factory-workers-chembur-mumbai' },
  { type:'labour', city:'Mumbai', area:'Malad',        skill:'delivery staff',        slug:'hire-delivery-staff-malad-mumbai' },
  { type:'labour', city:'Mumbai', area:'Borivali',     skill:'labour contractor',     slug:'labour-contractor-borivali-mumbai' },
  { type:'labour', city:'Pune',   area:'Pimpri-Chinchwad', skill:'factory workers',  slug:'hire-factory-workers-pimpri-chinchwad-pune' },
  { type:'labour', city:'Pune',   area:'Hadapsar',     skill:'warehouse workers',     slug:'hire-warehouse-workers-hadapsar-pune' },
  { type:'labour', city:'Bangalore', area:'Whitefield', skill:'construction workers', slug:'hire-construction-workers-whitefield-bangalore' },
  { type:'labour', city:'Bangalore', area:'Electronic City', skill:'factory workers', slug:'hire-factory-workers-electronic-city-bangalore' },
  { type:'labour', city:'Delhi',  area:'Noida',        skill:'manpower supply',       slug:'manpower-supply-noida-delhi' },
  { type:'labour', city:'Delhi',  area:'Gurgaon',      skill:'security guards',       slug:'hire-security-guards-gurgaon-delhi' },
  { type:'labour', city:'Hyderabad', area:'Hitech City', skill:'office support staff', slug:'hire-office-support-staff-hitech-city-hyderabad' },
  { type:'labour', city:'Chennai', area:'Ambattur',    skill:'factory workers',       slug:'hire-factory-workers-ambattur-chennai' },

  // ── CLUSTER 2 — FREELANCE: Skill × City Matrix ───────────────────────────
  { type:'freelance', skill:'graphic designer',       city:'Mumbai',    slug:'hire-freelance-graphic-designer-mumbai' },
  { type:'freelance', skill:'web developer',          city:'Mumbai',    slug:'hire-freelance-web-developer-mumbai' },
  { type:'freelance', skill:'UI UX designer',         city:'India',     slug:'hire-freelance-ui-ux-designer-india' },
  { type:'freelance', skill:'content writer',         city:'Mumbai',    slug:'hire-freelance-content-writer-mumbai' },
  { type:'freelance', skill:'video editor',           city:'India',     slug:'hire-freelance-video-editor-india' },
  { type:'freelance', skill:'social media manager',   city:'Mumbai',    slug:'hire-freelance-social-media-manager-mumbai' },
  { type:'freelance', skill:'graphic designer',       city:'Bangalore', slug:'hire-freelance-graphic-designer-bangalore' },
  { type:'freelance', skill:'web developer',          city:'Bangalore', slug:'hire-freelance-web-developer-bangalore' },
  { type:'freelance', skill:'React developer',        city:'India',     slug:'hire-freelance-react-developer-india' },
  { type:'freelance', skill:'WordPress developer',    city:'Mumbai',    slug:'hire-freelance-wordpress-developer-mumbai' },
  { type:'freelance', skill:'logo designer',          city:'India',     slug:'hire-freelance-logo-designer-india' },
  { type:'freelance', skill:'copywriter',             city:'Mumbai',    slug:'hire-freelance-copywriter-mumbai' },
  { type:'freelance', skill:'video editor',           city:'Mumbai',    slug:'hire-freelance-video-editor-mumbai' },
  { type:'freelance', skill:'app developer',          city:'India',     slug:'hire-freelance-app-developer-india' },
  { type:'freelance', skill:'Python developer',       city:'Bangalore', slug:'hire-freelance-python-developer-bangalore' },
  { type:'freelance', skill:'graphic designer',       city:'Delhi',     slug:'hire-freelance-graphic-designer-delhi' },
  { type:'freelance', skill:'web developer',          city:'Pune',      slug:'hire-freelance-web-developer-pune' },
  { type:'freelance', skill:'motion graphics artist', city:'Mumbai',    slug:'hire-freelance-motion-graphics-artist-mumbai' },

  // ── CLUSTER 3 — DIGITAL MARKETING: Skill × City ──────────────────────────
  { type:'digital-mkt', skill:'digital marketer',           city:'Mumbai',    slug:'hire-digital-marketer-mumbai' },
  { type:'digital-mkt', skill:'SEO expert',                 city:'Mumbai',    slug:'hire-seo-expert-mumbai' },
  { type:'digital-mkt', skill:'Google Ads specialist',      city:'India',     slug:'hire-google-ads-specialist-india' },
  { type:'digital-mkt', skill:'social media manager',       city:'Mumbai',    slug:'hire-social-media-manager-mumbai' },
  { type:'digital-mkt', skill:'Meta Ads expert',            city:'India',     slug:'hire-meta-ads-expert-india' },
  { type:'digital-mkt', skill:'content marketer',           city:'Mumbai',    slug:'hire-content-marketer-mumbai' },
  { type:'digital-mkt', skill:'email marketing expert',     city:'India',     slug:'hire-email-marketing-expert-india' },
  { type:'digital-mkt', skill:'SEO expert',                 city:'Bangalore', slug:'hire-seo-expert-bangalore' },
  { type:'digital-mkt', skill:'digital marketer',           city:'Delhi',     slug:'hire-digital-marketer-delhi' },
  { type:'digital-mkt', skill:'Google Ads specialist',      city:'Mumbai',    slug:'hire-google-ads-specialist-mumbai' },
  { type:'digital-mkt', skill:'PPC expert',                 city:'India',     slug:'hire-ppc-expert-india' },
  { type:'digital-mkt', skill:'social media manager',       city:'Bangalore', slug:'hire-social-media-manager-bangalore' },
  { type:'digital-mkt', skill:'digital marketer',           city:'Hyderabad', slug:'hire-digital-marketer-hyderabad' },
  { type:'digital-mkt', skill:'YouTube channel manager',    city:'India',     slug:'hire-youtube-channel-manager-india' },
  { type:'digital-mkt', skill:'influencer marketing manager', city:'Mumbai',  slug:'hire-influencer-marketing-manager-mumbai' },
  { type:'digital-mkt-problem', problem:'business is not getting leads online', city:'Mumbai', slug:'mumbai-business-not-getting-leads-fix' },
  { type:'digital-mkt-problem', problem:'Google Ads campaign is burning budget with no results', city:'India', slug:'google-ads-failing-hire-specialist-india' },
  { type:'digital-mkt-problem', problem:'social media has zero engagement', city:'Mumbai', slug:'social-media-no-engagement-hire-expert-mumbai' },

  // ── CLUSTER 4 — DATA ANALYTICS: Skill × City ─────────────────────────────
  { type:'data-analytics', skill:'data analyst',              city:'Mumbai',    slug:'hire-data-analyst-mumbai' },
  { type:'data-analytics', skill:'Power BI expert',           city:'India',     slug:'hire-power-bi-expert-india' },
  { type:'data-analytics', skill:'data scientist',            city:'Mumbai',    slug:'hire-freelance-data-scientist-mumbai' },
  { type:'data-analytics', skill:'Excel analyst',             city:'India',     slug:'hire-excel-analyst-india' },
  { type:'data-analytics', skill:'business analyst',          city:'Mumbai',    slug:'hire-business-analyst-mumbai' },
  { type:'data-analytics', skill:'SQL developer',             city:'India',     slug:'hire-sql-developer-india' },
  { type:'data-analytics', skill:'data analyst',              city:'Bangalore', slug:'hire-data-analyst-bangalore' },
  { type:'data-analytics', skill:'Tableau expert',            city:'India',     slug:'hire-tableau-expert-india' },
  { type:'data-analytics', skill:'data engineer',             city:'Bangalore', slug:'hire-data-engineer-bangalore' },
  { type:'data-analytics', skill:'Python data analyst',       city:'India',     slug:'hire-python-data-analyst-india' },
  { type:'data-analytics', skill:'machine learning engineer', city:'Bangalore', slug:'hire-machine-learning-engineer-bangalore' },
  { type:'data-analytics', skill:'data analyst',              city:'Delhi',     slug:'hire-data-analyst-delhi' },
  { type:'data-analytics', skill:'business analyst',          city:'Pune',      slug:'hire-business-analyst-pune' },

  // ── COMPARISON PAGES (rank fast, high buying intent) ─────────────────────
  { type:'comparison', vs:'Upwork',      angle:'Indian businesses',   slug:'hirehub360-vs-upwork-which-is-better-india' },
  { type:'comparison', vs:'Fiverr',      angle:'Indian businesses',   slug:'hirehub360-vs-fiverr-honest-comparison-india-2025' },
  { type:'comparison', vs:'Naukri',      angle:'freelancers in India', slug:'hirehub360-vs-naukri-for-freelancers-india' },
  { type:'comparison', vs:'LinkedIn',    angle:'Mumbai businesses',   slug:'hirehub360-vs-linkedin-hiring-mumbai' },
  { type:'comparison', vs:'Internshala', angle:'freshers in India',   slug:'hirehub360-vs-internshala-india-freshers' },

  // ── SALARY & RATE PAGES (immediate conversion) ───────────────────────────
  { type:'salary-rate', skill:'freelance graphic designer', city:'Mumbai', slug:'freelance-graphic-designer-rate-mumbai-2025' },
  { type:'salary-rate', skill:'data analyst',               city:'India',  slug:'data-analyst-salary-india-2025-freelance-vs-fulltime' },
  { type:'salary-rate', skill:'SEO services',               city:'Mumbai', slug:'how-much-does-seo-cost-mumbai-2025' },
  { type:'salary-rate', skill:'social media management',    city:'India',  slug:'social-media-manager-rate-india-2025' },
  { type:'salary-rate', skill:'freelance web development',  city:'Mumbai', slug:'freelance-web-developer-rate-mumbai-2025' },
  { type:'salary-rate', skill:'digital marketing agency',   city:'India',  slug:'digital-marketing-agency-cost-india-2025' },
  { type:'salary-rate', skill:'Power BI consultant',        city:'India',  slug:'power-bi-consultant-rate-india-2025' },
  { type:'salary-rate', skill:'warehouse manpower supply',  city:'Mumbai', slug:'warehouse-manpower-cost-mumbai-2025' },

  // ── NEAR ME HYPERLOCAL PAGES ─────────────────────────────────────────────
  { type:'near-me', skill:'digital marketer',  city:'Mumbai',    slug:'digital-marketer-near-me-mumbai' },
  { type:'near-me', skill:'freelance developer', city:'Thane',   slug:'freelance-developer-near-me-thane' },
  { type:'near-me', skill:'SEO expert',        city:'Pune',      slug:'seo-expert-near-me-pune' },
  { type:'near-me', skill:'data analyst',      city:'Bangalore', slug:'data-analyst-near-me-bangalore' },
  { type:'near-me', skill:'labour contractor', city:'Mumbai',    slug:'labour-contractor-near-me-mumbai' },
  { type:'near-me', skill:'graphic designer',  city:'Mumbai',    slug:'graphic-designer-near-me-mumbai' },
  { type:'near-me', skill:'Google Ads expert', city:'Mumbai',    slug:'google-ads-expert-near-me-mumbai' },

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

  if (topic.type === 'labour') {
    const cityArea = topic.area ? `${topic.area}, ${topic.city}` : topic.city
    return `You are India's top Local SEO content strategist. Write a 2000-2200 word expert blog for HireHub360 (hirehub360.in) targeting business owners and HR managers in ${cityArea}.

H1 (use exactly once): "How to Hire ${topic.skill} in ${cityArea} — 2025 Complete Guide"
PRIMARY KEYWORD: "hire ${topic.skill} ${cityArea}" — use at 1.5% density
META TITLE (under 60 chars): "Hire ${topic.skill} in ${topic.area||topic.city} 2025 | HireHub360"

STRUCTURE (follow exactly):
## How to Hire ${topic.skill} in ${cityArea} — 2025 Complete Guide
**Intro (150 words):** Open with the hiring pain point businesses in ${cityArea} face. Mention HireHub360 naturally. Include primary keyword in first 100 words.

## Why ${cityArea} Businesses Need Reliable ${topic.skill} in 2025
200 words. Industry stats, labour shortage data, why demand is rising. Cite [Ministry of Labour India](https://labour.gov.in) or [IBEF](https://www.ibef.org).

## Types of ${topic.skill} Available on HireHub360 in ${topic.city}
List 6-8 sub-roles with 2-line descriptions each. Be specific to ${cityArea} industry.

## Areas in ${topic.city} We Cover for ${topic.skill} Hiring
List 10 areas in ${topic.city} — each with 2 lines on why that area, typical demand, and pincodes where relevant.

## How HireHub360 Works — Hire ${topic.skill} in 3 Steps
Step 1: Post your ${topic.skill} requirement free — takes 2 minutes
Step 2: Get matched profiles in 2-24 hours — verified, background-checked
Step 3: Interview, hire, pay securely — zero middleman fees

## Why HireHub360 Beats Local Labour Agencies in ${topic.city}
Comparison table: HireHub360 ✅ vs Traditional Agency ❌ — cover: cost, speed, verification, transparency, replacement guarantee.

## What Does It Cost to Hire ${topic.skill} in ${cityArea}? — 2025 Rates
Give realistic daily/monthly rate ranges. Break down by experience level. This section ranks for high-intent searches.

## 6 FAQs — ${topic.skill} Hiring in ${cityArea}
Use questions people actually search. Answer each in 60-80 words. Format as ### Q: ... / **A:** ...

## Client Success Stories from ${topic.city}
3 realistic testimonials: Name, company, area in ${topic.city}, star rating (4.8-5.0), specific result achieved (e.g., "reduced hiring time from 3 weeks to 48 hours").

**Conclusion:** Strong WhatsApp CTA. Repeat primary keyword. Post your ${topic.skill} requirement free on HireHub360 today.

INTERNAL LINKS (add 3 naturally): [Post a job free](https://hirehub360.in) · [Browse all hiring plans](https://hirehub360.in) · [Read more hiring guides](https://hirehub360.in/blog)
TONE: Premium, confident, expert. Speak to business owners. Use data. Never sound generic or AI-written.
Output markdown only. FAQPage schema data embedded as <!-- FAQ_JSON: [...] --> comment at end.`
  }

  if (topic.type === 'freelance') {
    return `You are India's top Local SEO content strategist. Write a 2000-2200 word expert blog for HireHub360 (hirehub360.in) targeting startup founders and business owners wanting to hire freelancers in ${topic.city}.

H1 (use exactly once): "Where to Hire Top Freelance ${topic.skill} in ${topic.city} — 2025 Guide"
PRIMARY KEYWORD: "hire freelance ${topic.skill} ${topic.city}" — 1.5% density
META TITLE (under 60 chars): "Hire Freelance ${topic.skill} ${topic.city} 2025 | HireHub360"

STRUCTURE (follow exactly):
## Where to Hire Top Freelance ${topic.skill} in ${topic.city} — 2025 Guide
**Intro (150 words):** Open with the pain point: finding reliable, affordable freelance ${topic.skill} in ${topic.city} is hard. Mention HireHub360 as the solution naturally. Primary keyword in first 100 words.

## Why ${topic.city} Businesses Are Choosing Freelance ${topic.skill} in 2025
200 words. Cost savings vs agency, flexibility, India freelance market growth. Cite [NASSCOM](https://nasscom.in) or [Statista India](https://www.statista.com).

## Top Skills to Look for When Hiring a Freelance ${topic.skill}
List 6-8 specific skills/tools with 2-line descriptions. Be technical enough to build trust.

## Cities and Areas We Cover for Freelance ${topic.skill} Hiring
List 8 Indian cities (Mumbai, Bangalore, Delhi, Pune, Hyderabad, Chennai, Ahmedabad, Noida) — 2 lines each on freelance talent pool.

## How HireHub360 Works — Hire a Freelance ${topic.skill} in 3 Steps
Step 1: Post your project free — takes 2 minutes
Step 2: Get matched top ${topic.skill} profiles in 2-24 hours
Step 3: Hire, collaborate, pay securely — milestone-based payments

## Best Freelance ${topic.skill} Platforms in India Compared — 2025
Comparison table: HireHub360 ✅ vs Upwork ❌ vs Fiverr ❌ vs Freelancer.com ❌
Criteria: India focus, pricing, quality vetting, payment security, response time, Hindi support.

## How Much Does a Freelance ${topic.skill} Cost in ${topic.city}? — 2025 Rates
Break down: hourly rate, per-project rate, monthly retainer. Give realistic ranges by experience level (fresher / mid / expert).

## 6 FAQs — Hiring Freelance ${topic.skill} in ${topic.city}
Real questions people search. Each answer 60-80 words. Format as ### Q: ... / **A:** ...

## Success Stories — ${topic.city} Businesses Who Hired on HireHub360
3 realistic client testimonials: founder name, company type, city area, rating, specific result.

**Conclusion:** Strong WhatsApp CTA. Repeat primary keyword. Post your project free on HireHub360 — get matched with top freelance ${topic.skill} in ${topic.city} today.

INTERNAL LINKS (3 natural): [Post a project free](https://hirehub360.in) · [Browse freelancers](https://hirehub360.in) · [Read more guides](https://hirehub360.in/blog)
EXTERNAL LINKS (1): [NASSCOM](https://nasscom.in) or [Statista](https://www.statista.com)
TONE: Premium, confident. Speak to startup founders and SME owners. Use real numbers.
Output markdown only. FAQPage schema data embedded as <!-- FAQ_JSON: [...] --> comment at end.`
  }

  if (topic.type === 'digital-mkt') {
    return `You are India's top Local SEO content strategist. Write a 2000-2200 word expert blog for HireHub360 (hirehub360.in) targeting business owners in ${topic.city} who need to hire digital marketing talent.

H1 (use exactly once): "How to Hire a ${topic.skill} in ${topic.city} — 2025 Complete Guide"
PRIMARY KEYWORD: "hire ${topic.skill} ${topic.city}" — 1.5% density
META TITLE (under 60 chars): "Hire ${topic.skill} in ${topic.city} 2025 | HireHub360"

STRUCTURE (follow exactly):
## How to Hire a ${topic.skill} in ${topic.city} — 2025 Complete Guide
**Intro (150 words):** Pain point: finding a genuine, results-driven ${topic.skill} in ${topic.city} is expensive and time-consuming. HireHub360 solves this. Primary keyword in first 100 words.

## What a ${topic.skill} Does and Why ${topic.city} Businesses Need One in 2025
200 words. Digital ad spend growth in India, ROI of hiring right specialist, why generalists fail. Cite [NASSCOM](https://nasscom.in) or [Google India report](https://economictimes.indiatimes.com).

## Top Skills to Demand When Hiring a ${topic.skill} in ${topic.city}
List 6-8 tools/skills (e.g. GA4, Meta Business Suite, SEMrush) with 2-line descriptions.

## Areas in ${topic.city} and Sectors We Serve
List 8-10 areas in ${topic.city} or 8 cities if ${topic.city}==='India'. 2 lines each on digital marketing demand.

## How HireHub360 Works — Hire a ${topic.skill} in 3 Steps
Step 1: Post your requirement free — describe your goal, budget, timeline
Step 2: Get matched vetted ${topic.skill} profiles in 2-24 hours
Step 3: Interview, hire, pay securely — performance milestones

## Why HireHub360 Beats Other Platforms for Hiring ${topic.skill} in ${topic.city}
Comparison table: HireHub360 ✅ vs LinkedIn Recruiter ❌ vs Naukri ❌ vs Local Agency ❌
Criteria: cost, talent quality, speed, India-market expertise, accountability.

## How Much Does It Cost to Hire a ${topic.skill} in ${topic.city}? — 2025 Rates
Monthly retainer ranges, per-campaign rates, freelance vs agency vs in-house cost breakdown.

## 6 FAQs — Hiring a ${topic.skill} in ${topic.city}
Real search queries. 60-80 words each. Format: ### Q: ... / **A:** ...

## Results Our Clients Achieved After Hiring on HireHub360
3 realistic case studies: business type, city area, challenge, solution, measurable result (e.g., "leads increased 3x in 90 days").

**Conclusion:** Repeat primary keyword. WhatsApp CTA. Post your ${topic.skill} requirement free on HireHub360 today.

INTERNAL LINKS (3): [Post requirement free](https://hirehub360.in) · [Browse digital marketers](https://hirehub360.in) · [More hiring guides](https://hirehub360.in/blog)
EXTERNAL: [NASSCOM](https://nasscom.in)
TONE: Expert, data-driven. Talk to business owners who have been burned by bad hires before.
Output markdown only. FAQPage schema data embedded as <!-- FAQ_JSON: [...] --> comment at end.`
  }

  if (topic.type === 'digital-mkt-problem') {
    return `You are India's top content strategist. Write a 2000-word problem-solution blog for HireHub360 (hirehub360.in).

H1: "Your ${topic.problem} in ${topic.city} — Here's the Fix (2025)"
PRIMARY KEYWORD: "${topic.problem} ${topic.city}" — 1.5% density

STRUCTURE:
## Your ${topic.problem} in ${topic.city} — Here's the Fix
**Intro:** Empathise hard. This is a real problem thousands of ${topic.city} businesses face. Primary keyword in first 100 words.
## Why This Happens — The Root Cause Most Businesses Miss
Real reasons: wrong hire, wrong strategy, no accountability, chasing vanity metrics.
## 5 Signs Your Current Setup Is Failing
Bullet checklist business owners can self-audit.
## The Real Fix — Hire a Specialist, Not a Generalist
What specialist skills solve this exact problem. What to look for, what to avoid.
## How HireHub360 Solves This for ${topic.city} Businesses in 3 Steps
Step 1 → 2 → 3. Specific to this problem type.
## Case Study — How a ${topic.city} Business Fixed This in 60 Days
Realistic story: business type, problem, specialist hired via HireHub360, result with numbers.
## What It Costs to Fix This Right — ${topic.city} Market Rates 2025
Budget ranges. Why cheap is expensive. ROI of hiring right.
## 6 FAQs
Format: ### Q: ... / **A:** ... (60-80 words each)
**Conclusion:** Strong CTA. WhatsApp. Primary keyword repeat.
INTERNAL LINKS (3): [Post requirement free](https://hirehub360.in) · [Browse experts](https://hirehub360.in) · [Blog](https://hirehub360.in/blog)
Output markdown only.`
  }

  if (topic.type === 'data-analytics') {
    return `You are India's top Local SEO content strategist. Write a 2000-2200 word expert blog for HireHub360 (hirehub360.in) targeting startup founders and business leaders in ${topic.city} who need data talent.

H1 (use exactly once): "How to Hire a ${topic.skill} in ${topic.city} — 2025 Complete Guide"
PRIMARY KEYWORD: "hire ${topic.skill} ${topic.city}" — 1.5% density
META TITLE (under 60 chars): "Hire ${topic.skill} ${topic.city} 2025 | HireHub360"

STRUCTURE (follow exactly):
## How to Hire a ${topic.skill} in ${topic.city} — 2025 Complete Guide
**Intro (150 words):** Pain: data talent is scarce and expensive. Businesses in ${topic.city} are falling behind without proper analytics. HireHub360 bridges the gap. Primary keyword in first 100 words.

## Why ${topic.city} Startups and Enterprises Are Hiring ${topic.skill}s in 2025
200 words. Data economy growth in India, how analytics drives decisions, cost of bad data. Cite [NASSCOM](https://nasscom.in) or [Statista](https://www.statista.com).

## Key Skills and Tools a ${topic.skill} Must Have in 2025
List 6-8 tools/skills specific to ${topic.skill} (e.g., Python, SQL, Power BI, Tableau, Excel) — 2 lines each.

## Cities and Industries We Cover for ${topic.skill} Hiring
List 8 cities (Bangalore, Mumbai, Hyderabad, Pune, Delhi, Chennai, Ahmedabad, Noida) with 2 lines each on data talent pool.

## How HireHub360 Works — Hire a ${topic.skill} in 3 Steps
Step 1: Post your data project free — describe deliverables, tools needed, timeline
Step 2: Get matched verified ${topic.skill} profiles in 2-24 hours
Step 3: Hire on hourly/project/full-time basis. Pay securely.

## Why HireHub360 Beats Other Platforms for ${topic.skill} Hiring in India
Comparison table: HireHub360 ✅ vs Naukri ❌ vs LinkedIn ❌ vs Consulting firms ❌
Criteria: cost, vetting depth, data skill specialisation, turnaround, India market rates.

## How Much Does It Cost to Hire a ${topic.skill} in ${topic.city}? — 2025 Rates
Hourly, monthly, per-project breakdown. Fresher vs mid vs senior. Freelance vs full-time cost comparison.

## 6 FAQs — Hiring a ${topic.skill} in ${topic.city}
Real questions from Google. 60-80 words each. Format: ### Q: ... / **A:** ...

## How Mumbai and Bangalore Startups Are Using Data to Win in 2025
3 realistic mini-case-studies: industry, data problem, ${topic.skill} hired via HireHub360, business outcome with numbers.

**Conclusion:** Repeat primary keyword. WhatsApp CTA. Post your ${topic.skill} requirement free today.

INTERNAL LINKS (3): [Post requirement free](https://hirehub360.in) · [Browse analysts](https://hirehub360.in) · [Blog](https://hirehub360.in/blog)
EXTERNAL: [NASSCOM](https://nasscom.in) or [Statista](https://www.statista.com)
TONE: Expert, data-driven, premium. Speak to founders who understand ROI.
Output markdown only. FAQPage schema data embedded as <!-- FAQ_JSON: [...] --> comment at end.`
  }

  if (topic.type === 'comparison') {
    return `You are India's top SEO content strategist. Write a 2000-word honest comparison blog for HireHub360 (hirehub360.in).

H1 (use exactly once): "HireHub360 vs ${topic.vs} — Which is Better for ${topic.angle}? (2025)"
PRIMARY KEYWORD: "HireHub360 vs ${topic.vs}" — 1.5% density
META TITLE (under 60 chars): "HireHub360 vs ${topic.vs} for India 2025 | Honest Review"

These comparison pages rank FAST because people search them before deciding. Be honest but position HireHub360's strengths clearly.

STRUCTURE:
## HireHub360 vs ${topic.vs} — Which is Better for ${topic.angle}? (2025)
**Intro (150 words):** Why this comparison matters for ${topic.angle}. Primary keyword in first 100 words.

## Quick Verdict — Which Platform Wins?
2-paragraph summary: for which use cases HireHub360 wins, and for which ${topic.vs} might still make sense.

## HireHub360 vs ${topic.vs} — Feature-by-Feature Comparison Table
Full markdown table with 10 rows:
| Feature | HireHub360 | ${topic.vs} |
Rows: India focus, pricing, talent quality vetting, payment security, response time, Hindi/regional language support, blue-collar support, data privacy, customer support, refund policy
Use ✅/❌/⚠️ emojis.

## Pricing Comparison — HireHub360 vs ${topic.vs}
Real price ranges. Show where HireHub360 saves money for Indian businesses.

## Quality of Talent — HireHub360 vs ${topic.vs}
Depth of vetting, India-specific expertise, how each platform matches talent.

## Which Platform is Better for Different Use Cases?
3 scenarios: (1) hiring a freelancer fast, (2) blue-collar labour, (3) long-term specialist hire. Winner for each.

## What ${topic.angle} Say About Both Platforms
3 realistic reviews from Indian business owners (not generic).

## 6 FAQs
Format: ### Q: ... / **A:** ... (60-80 words each)

**Conclusion:** Honest summary. WhatsApp CTA. Try HireHub360 free today.
INTERNAL LINKS (3): [Post requirement free](https://hirehub360.in) · [Browse talent](https://hirehub360.in) · [Blog](https://hirehub360.in/blog)
Output markdown only.`
  }

  if (topic.type === 'salary-rate') {
    return `You are India's top SEO content strategist. Write a 2000-word pricing/salary guide for HireHub360 (hirehub360.in).

H1 (use exactly once): "${topic.skill.charAt(0).toUpperCase()+topic.skill.slice(1)} Cost in ${topic.city} 2025 — Complete Pricing Guide"
PRIMARY KEYWORD: "${topic.skill} rate ${topic.city} 2025" — 1.5% density
META TITLE (under 60 chars): "${topic.skill} Cost ${topic.city} 2025 | HireHub360"

Salary/rate pages convert IMMEDIATELY because they attract people ready to hire. Be specific with numbers.

STRUCTURE:
## ${topic.skill.charAt(0).toUpperCase()+topic.skill.slice(1)} Cost in ${topic.city} 2025 — Complete Pricing Guide
**Intro (150 words):** Business owners search this before making a hiring decision. Give them the answer fast. Primary keyword in first 100 words.

## What Affects the Cost of ${topic.skill} in ${topic.city}?
6-8 factors: experience level, project complexity, turnaround time, tools used, industry, full-time vs freelance.

## ${topic.skill.charAt(0).toUpperCase()+topic.skill.slice(1)} Rate Card — ${topic.city} 2025
Detailed table with columns: Experience Level | Hourly Rate | Monthly Rate | Per-Project Range
Rows: Fresher (0-1 yr), Mid-level (2-4 yr), Senior (5+ yr), Expert/Specialist
Use INR ranges. Be realistic.

## Freelance vs Full-Time vs Agency — Cost Comparison
Table comparing total cost of ownership for each model. Include hidden costs.

## What You Get at Each Price Point
What ₹10k/month gets you vs ₹30k vs ₹60k+ — manage expectations clearly.

## Red Flags — Why Cheap ${topic.skill} in ${topic.city} Costs More in the End
3-4 real scenarios where lowballing backfired. Brief case-study format.

## How to Get the Best Rate on HireHub360
Step-by-step: write a clear brief, set realistic budget, evaluate portfolios, do a paid trial project.

## 6 FAQs — ${topic.skill} Pricing in ${topic.city}
Format: ### Q: ... / **A:** ... (60-80 words each)

**Conclusion:** Repeat primary keyword. WhatsApp CTA. Post your requirement and get quotes from verified talent — free on HireHub360.
INTERNAL LINKS (3): [Post requirement free](https://hirehub360.in) · [Browse talent](https://hirehub360.in) · [Pricing guides](https://hirehub360.in/blog)
EXTERNAL: [NASSCOM](https://nasscom.in) or [Glassdoor India](https://www.glassdoor.co.in)
Output markdown only.`
  }

  if (topic.type === 'near-me') {
    return `You are India's top hyperlocal SEO content strategist. Write a 2000-word near-me landing page blog for HireHub360 (hirehub360.in).

H1 (use exactly once): "${topic.skill.charAt(0).toUpperCase()+topic.skill.slice(1)} Near Me in ${topic.city} — Find & Hire Today (2025)"
PRIMARY KEYWORD: "${topic.skill} near me ${topic.city}" — 1.5% density
META TITLE (under 60 chars): "${topic.skill} Near Me ${topic.city} 2025 | HireHub360"

Google loves hyperlocal near-me pages. Write with maximum local intent signals.

STRUCTURE:
## ${topic.skill.charAt(0).toUpperCase()+topic.skill.slice(1)} Near Me in ${topic.city} — Find & Hire Today (2025)
**Intro (150 words):** You're in ${topic.city} and need a ${topic.skill} fast. Stop Googling. HireHub360 has verified, local ${topic.skill}s available now. Primary keyword in first 100 words.

## Why Hire a Local ${topic.skill} in ${topic.city}?
Benefits of local vs remote for this skill type. Timezone, in-person meetings, local market understanding.

## ${topic.city} Areas We Cover for ${topic.skill} Hiring
List 12 specific areas/neighbourhoods in ${topic.city} — 1-2 lines each on availability and demand.

## How to Find a ${topic.skill} Near You in ${topic.city} — HireHub360 Process
Step 1: Post your location and requirement — free
Step 2: Get matched with local ${topic.skill}s near ${topic.city} in 2-24 hours
Step 3: Meet, verify, hire. Pay only when satisfied.

## What to Look for in a ${topic.skill} in ${topic.city}
Portfolio, references, tools, local clients they've worked with.

## Average Cost of a ${topic.skill} in ${topic.city} — 2025 Rates
Realistic local rate ranges. Monthly, per-project, hourly.

## Verified ${topic.skill}s in ${topic.city} — What Sets HireHub360 Apart
How HireHub360 vets local talent: background checks, portfolio review, client references, test project.

## 6 FAQs — ${topic.skill} Near Me ${topic.city}
Local-intent questions people actually search. Format: ### Q: ... / **A:** ...

**Conclusion:** You don't need to search anymore. Post your requirement on HireHub360 and get matched with a ${topic.skill} near you in ${topic.city} today. WhatsApp CTA.
INTERNAL LINKS (3): [Post requirement free](https://hirehub360.in) · [Browse local talent](https://hirehub360.in) · [More guides](https://hirehub360.in/blog)
Output markdown only. Include LocalBusiness schema hint as <!-- LOCAL_SCHEMA: city=${topic.city}, skill=${topic.skill} --> at end.`
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
  if (topic.type === 'labour')        return { title: `Hire ${topic.skill} in ${topic.area||topic.city} 2025 | HireHub360`, excerpt: `Find verified ${topic.skill} in ${topic.area||topic.city}. Post your requirement free and get matched in 24 hours on HireHub360.` }
  if (topic.type === 'freelance')     return { title: `Hire Freelance ${topic.skill} in ${topic.city} 2025 | HireHub360`, excerpt: `Find top freelance ${topic.skill} in ${topic.city}. Compare rates, portfolios & hire the best. Post free on HireHub360.` }
  if (topic.type === 'digital-mkt')   return { title: `Hire ${topic.skill} in ${topic.city} 2025 | HireHub360`, excerpt: `Find vetted ${topic.skill}s in ${topic.city}. Get matched in 24 hours. Post your requirement free on HireHub360.` }
  if (topic.type === 'digital-mkt-problem') return { title: `${topic.problem} in ${topic.city} — Fix It Now | HireHub360`, excerpt: `Is your ${topic.problem}? Hire a specialist from HireHub360 and fix it in 60 days. Real results, real accountability.` }
  if (topic.type === 'data-analytics') return { title: `Hire ${topic.skill} in ${topic.city} 2025 | HireHub360`, excerpt: `Find expert ${topic.skill}s in ${topic.city}. Vetted profiles, fast matching, competitive rates. Post free on HireHub360.` }
  if (topic.type === 'comparison')    return { title: `HireHub360 vs ${topic.vs} — Which Is Better for India? 2025`, excerpt: `Honest comparison of HireHub360 vs ${topic.vs} for ${topic.angle}. Pricing, talent quality, India focus — full breakdown.` }
  if (topic.type === 'salary-rate')   return { title: `${topic.skill} Cost in ${topic.city} 2025 — Full Pricing Guide`, excerpt: `Exact ${topic.skill} rates in ${topic.city} 2025. Hourly, monthly & per-project ranges. Find the best value on HireHub360.` }
  if (topic.type === 'near-me')       return { title: `${topic.skill} Near Me in ${topic.city} 2025 | HireHub360`, excerpt: `Find verified ${topic.skill}s near you in ${topic.city}. Local talent, fast matching, free to post on HireHub360.` }
  return { title: topic.slug.replace(/-/g,' '), excerpt: 'Hiring guide 2025 — HireHub360' }
}

function buildTags(topic) {
  const base = ['hirehub360']
  if (topic.type?.startsWith('india')) return [...base, 'india jobs', 'job guide 2026', topic.city || '', topic.sector || '', topic.keyword || ''].filter(Boolean)
  if (topic.type?.startsWith('usa'))   return [...base, 'usa jobs', 'job guide 2026', topic.city || '', topic.role || '', topic.keyword || ''].filter(Boolean)
  if (topic.type === 'labour')         return [...base, 'labour hiring', 'manpower supply', topic.city, topic.area || '', topic.skill].filter(Boolean)
  if (topic.type === 'freelance')      return [...base, 'hire freelancer', 'freelance india', topic.city, topic.skill, 'best freelance platform india 2025'].filter(Boolean)
  if (topic.type === 'digital-mkt' || topic.type === 'digital-mkt-problem') return [...base, 'digital marketing', topic.city || '', topic.skill || '', 'hire digital marketer india 2025', 'seo expert mumbai'].filter(Boolean)
  if (topic.type === 'data-analytics') return [...base, 'data analytics', 'hire data analyst', topic.city, topic.skill, 'power bi expert india'].filter(Boolean)
  if (topic.type === 'comparison')     return [...base, 'platform comparison', topic.vs, 'best freelance platform india', 'hirehub360 review'].filter(Boolean)
  if (topic.type === 'salary-rate')    return [...base, 'freelance rates india', topic.skill, topic.city, 'hiring cost india 2025'].filter(Boolean)
  if (topic.type === 'near-me')        return [...base, 'near me hiring', topic.skill, topic.city, 'local talent india'].filter(Boolean)
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

    // DAILY MODE — publish 4 blogs: one per cluster (labour, freelance, digital-mkt, data-analytics)
    // Each cluster also falls back to comparison/salary/near-me if its primary pool is exhausted
    const CLUSTER_TYPES = [
      ['labour'],
      ['freelance', 'freelance-compare'],
      ['digital-mkt', 'digital-mkt-problem', 'comparison', 'near-me'],
      ['data-analytics', 'salary-rate'],
    ]

    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    const dailyResults = []

    for (const clusterTypes of CLUSTER_TYPES) {
      // Within each cluster, rotate by day so we don't always pick the same topic
      const clusterTopics = TOPICS.filter(t => clusterTypes.includes(t.type))
      const startIdx = dayOfYear % Math.max(clusterTopics.length, 1)
      const ordered = [...clusterTopics.slice(startIdx), ...clusterTopics.slice(0, startIdx)]

      for (const topic of ordered) {
        const result = await writeBlog(topic)
        if (result.skipped) continue
        if (result.error) continue
        dailyResults.push(result)
        await new Promise(r => setTimeout(r, 3000)) // respect Groq rate limits
        break
      }
    }

    if (dailyResults.length === 0) return res.json({ ok: true, message: 'All topics already written — add more topics!' })
    return res.json({ ok: true, written: dailyResults.length, results: dailyResults })

  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const { supabaseService } = require('../../../lib/supabase')
const { autoIndex, SITE } = require('../../../lib/autoIndex')
const { randomUUID } = require('crypto')

// ── STATE → REGIONAL LANGUAGE MAP ──────────────────────────────────────────
const STATE_LANG = {
  Maharashtra:      'mr',
  'Tamil Nadu':     'ta',
  Karnataka:        'kn',
  Telangana:        'te',
  'Andhra Pradesh': 'te',
  'West Bengal':    'bn',
  Gujarat:          'gu',
  Punjab:           'pa',
  Kerala:           'ml',
}

const CITY_STATE = {
  Mumbai: 'Maharashtra', Pune: 'Maharashtra', Thane: 'Maharashtra',
  'Navi Mumbai': 'Maharashtra', Bhiwandi: 'Maharashtra', Nagpur: 'Maharashtra',
  Chennai: 'Tamil Nadu', Coimbatore: 'Tamil Nadu',
  Bangalore: 'Karnataka',
  Hyderabad: 'Telangana',
  Kolkata: 'West Bengal',
  Ahmedabad: 'Gujarat', Surat: 'Gujarat',
  Kochi: 'Kerala',
  Chandigarh: 'Punjab', Ludhiana: 'Punjab',
  // Hindi belt — no regional:
  Delhi: null, Noida: null, Gurgaon: null, Jaipur: null,
  Lucknow: null, Indore: null, Bhopal: null, Patna: null, India: null,
}

const LANG_META = {
  en: { name: 'English',    native: 'English',     htmlLang: 'en-IN', ogLocale: 'en_IN' },
  hi: { name: 'Hindi',      native: 'हिंदी',        htmlLang: 'hi-IN', ogLocale: 'hi_IN' },
  mr: { name: 'Marathi',    native: 'मराठी',        htmlLang: 'mr-IN', ogLocale: 'mr_IN' },
  ta: { name: 'Tamil',      native: 'தமிழ்',        htmlLang: 'ta-IN', ogLocale: 'ta_IN' },
  kn: { name: 'Kannada',    native: 'ಕನ್ನಡ',        htmlLang: 'kn-IN', ogLocale: 'kn_IN' },
  te: { name: 'Telugu',     native: 'తెలుగు',       htmlLang: 'te-IN', ogLocale: 'te_IN' },
  bn: { name: 'Bengali',    native: 'বাংলা',        htmlLang: 'bn-IN', ogLocale: 'bn_IN' },
  gu: { name: 'Gujarati',   native: 'ગુજરાતી',      htmlLang: 'gu-IN', ogLocale: 'gu_IN' },
  pa: { name: 'Punjabi',    native: 'ਪੰਜਾਬੀ',       htmlLang: 'pa-IN', ogLocale: 'pa_IN' },
  ml: { name: 'Malayalam',  native: 'മലയാളം',       htmlLang: 'ml-IN', ogLocale: 'ml_IN' },
}

// ── CLUSTER 1: LABOUR ──────────────────────────────────────────────────────
const LABOUR_TOPICS = [
  { kw: 'labour contractor Mumbai', city: 'Mumbai', area: 'Dharavi', skill: 'Construction Workers', segment: 'labour' },
  { kw: 'manpower supply Thane', city: 'Thane', area: 'Bhiwandi', skill: 'Warehouse Workers', segment: 'labour' },
  { kw: 'construction workers Dharavi', city: 'Mumbai', area: 'Dharavi', skill: 'Construction Workers', segment: 'labour' },
  { kw: 'warehouse workers Bhiwandi', city: 'Bhiwandi', area: 'MIDC', skill: 'Warehouse Workers', segment: 'labour' },
  { kw: 'daily wage workers Navi Mumbai', city: 'Navi Mumbai', area: 'Vashi', skill: 'Daily Wage Workers', segment: 'labour' },
  { kw: 'labour contractor Pune', city: 'Pune', area: 'Pimpri Chinchwad', skill: 'Factory Workers', segment: 'labour' },
  { kw: 'manpower supply Bangalore', city: 'Bangalore', area: 'Peenya', skill: 'Industrial Workers', segment: 'labour' },
  { kw: 'contract labour Delhi', city: 'Delhi', area: 'Okhla', skill: 'Packing Workers', segment: 'labour' },
  { kw: 'skilled workers hire Hyderabad', city: 'Hyderabad', area: 'Patancheru', skill: 'Factory Workers', segment: 'labour' },
  { kw: 'construction labour Chennai', city: 'Chennai', area: 'Ambattur', skill: 'Construction Workers', segment: 'labour' },
  { kw: 'security guards hire Mumbai', city: 'Mumbai', area: 'Andheri', skill: 'Security Guards', segment: 'labour' },
  { kw: 'housekeeping staff hire Mumbai', city: 'Mumbai', area: 'BKC', skill: 'Housekeeping Staff', segment: 'labour' },
  { kw: 'delivery boys hire Mumbai', city: 'Mumbai', area: 'Kurla', skill: 'Delivery Boys', segment: 'labour' },
  { kw: 'loading unloading workers Bhiwandi', city: 'Bhiwandi', area: 'Warehouse Zone', skill: 'Loading Workers', segment: 'labour' },
  { kw: 'plumber electrician hire Mumbai', city: 'Mumbai', area: 'Malad', skill: 'Plumber & Electrician', segment: 'labour' },
]

const FREELANCE_TOPICS = [
  { kw: 'hire freelancer Mumbai', city: 'Mumbai', skill: 'Freelancer', segment: 'freelance' },
  { kw: 'freelance graphic designer India', city: 'India', skill: 'Graphic Designer', segment: 'freelance' },
  { kw: 'freelance web developer Mumbai', city: 'Mumbai', skill: 'Web Developer', segment: 'freelance' },
  { kw: 'best freelance platform India 2025', city: 'India', skill: 'Freelancer', segment: 'freelance' },
  { kw: 'hire UI designer online India', city: 'India', skill: 'UI Designer', segment: 'freelance' },
  { kw: 'hire freelance video editor Mumbai', city: 'Mumbai', skill: 'Video Editor', segment: 'freelance' },
  { kw: 'freelance content writer India', city: 'India', skill: 'Content Writer', segment: 'freelance' },
  { kw: 'hire freelance app developer Mumbai', city: 'Mumbai', skill: 'App Developer', segment: 'freelance' },
  { kw: 'freelance logo designer India', city: 'India', skill: 'Logo Designer', segment: 'freelance' },
  { kw: 'hire freelance photographer Mumbai', city: 'Mumbai', skill: 'Photographer', segment: 'freelance' },
  { kw: 'freelance copywriter hire India', city: 'India', skill: 'Copywriter', segment: 'freelance' },
  { kw: 'hire freelance motion graphic designer India', city: 'India', skill: 'Motion Graphic Designer', segment: 'freelance' },
  { kw: 'React developer freelance Mumbai', city: 'Mumbai', skill: 'React Developer', segment: 'freelance' },
  { kw: 'freelance Node.js developer India', city: 'India', skill: 'Node.js Developer', segment: 'freelance' },
  { kw: 'hire freelance WordPress developer Mumbai', city: 'Mumbai', skill: 'WordPress Developer', segment: 'freelance' },
]

const DIGMKT_TOPICS = [
  { kw: 'hire digital marketer Mumbai', city: 'Mumbai', skill: 'Digital Marketer', segment: 'digital-marketing' },
  { kw: 'SEO expert Mumbai', city: 'Mumbai', skill: 'SEO Expert', segment: 'digital-marketing' },
  { kw: 'Google Ads specialist India', city: 'India', skill: 'Google Ads Specialist', segment: 'digital-marketing' },
  { kw: 'social media manager hire Mumbai', city: 'Mumbai', skill: 'Social Media Manager', segment: 'digital-marketing' },
  { kw: 'best digital marketing agency Mumbai 2025', city: 'Mumbai', skill: 'Digital Marketing Agency', segment: 'digital-marketing' },
  { kw: 'Meta ads expert India', city: 'India', skill: 'Meta Ads Expert', segment: 'digital-marketing' },
  { kw: 'hire SEO expert Bangalore', city: 'Bangalore', skill: 'SEO Expert', segment: 'digital-marketing' },
  { kw: 'performance marketing expert Mumbai', city: 'Mumbai', skill: 'Performance Marketer', segment: 'digital-marketing' },
  { kw: 'hire email marketing expert India', city: 'India', skill: 'Email Marketing Expert', segment: 'digital-marketing' },
  { kw: 'YouTube ads expert hire India', city: 'India', skill: 'YouTube Ads Expert', segment: 'digital-marketing' },
  { kw: 'PPC expert hire Mumbai', city: 'Mumbai', skill: 'PPC Expert', segment: 'digital-marketing' },
  { kw: 'influencer marketing manager hire India', city: 'India', skill: 'Influencer Marketing Manager', segment: 'digital-marketing' },
  { kw: 'hire content marketer Mumbai', city: 'Mumbai', skill: 'Content Marketer', segment: 'digital-marketing' },
  { kw: 'ecommerce marketing expert India', city: 'India', skill: 'Ecommerce Marketer', segment: 'digital-marketing' },
  { kw: 'WhatsApp marketing expert hire India', city: 'India', skill: 'WhatsApp Marketing Expert', segment: 'digital-marketing' },
]

const DATA_TOPICS = [
  { kw: 'hire data analyst Mumbai', city: 'Mumbai', skill: 'Data Analyst', segment: 'data-analytics' },
  { kw: 'Power BI expert India', city: 'India', skill: 'Power BI Expert', segment: 'data-analytics' },
  { kw: 'freelance data scientist Mumbai', city: 'Mumbai', skill: 'Data Scientist', segment: 'data-analytics' },
  { kw: 'Excel analyst for hire India', city: 'India', skill: 'Excel Analyst', segment: 'data-analytics' },
  { kw: 'business analyst Mumbai', city: 'Mumbai', skill: 'Business Analyst', segment: 'data-analytics' },
  { kw: 'SQL developer hire India', city: 'India', skill: 'SQL Developer', segment: 'data-analytics' },
  { kw: 'Tableau developer hire Mumbai', city: 'Mumbai', skill: 'Tableau Developer', segment: 'data-analytics' },
  { kw: 'Python data analyst hire India', city: 'India', skill: 'Python Data Analyst', segment: 'data-analytics' },
  { kw: 'hire data engineer Mumbai', city: 'Mumbai', skill: 'Data Engineer', segment: 'data-analytics' },
  { kw: 'Google Analytics expert hire India', city: 'India', skill: 'Google Analytics Expert', segment: 'data-analytics' },
  { kw: 'hire machine learning engineer India', city: 'India', skill: 'Machine Learning Engineer', segment: 'data-analytics' },
  { kw: 'data visualisation expert hire India', city: 'India', skill: 'Data Visualisation Expert', segment: 'data-analytics' },
  { kw: 'freelance R programmer India', city: 'India', skill: 'R Programmer', segment: 'data-analytics' },
  { kw: 'hire financial analyst Mumbai', city: 'Mumbai', skill: 'Financial Analyst', segment: 'data-analytics' },
  { kw: 'CRM analyst hire India', city: 'India', skill: 'CRM Analyst', segment: 'data-analytics' },
]

const CLUSTERS = { a: LABOUR_TOPICS, b: FREELANCE_TOPICS, c: DIGMKT_TOPICS, d: DATA_TOPICS }

const CLUSTER_META = {
  labour: {
    competitor: 'local placement agencies',
    extLink: '[Ministry of Labour & Employment](https://labour.gov.in)',
    extContext: 'according to Ministry of Labour & Employment data',
    cta: 'WhatsApp HireHub360 now',
    pricingContext: '₹400–₹900/day for daily wage, ₹12,000–₹35,000/month for skilled labour, ₹50,000–₹2,00,000 for contractor agreements',
  },
  freelance: {
    competitor: 'Upwork and Fiverr',
    extLink: '[NASSCOM India Digital Talent Report](https://nasscom.in)',
    extContext: 'as per NASSCOM India workforce data',
    cta: 'post your requirement on HireHub360',
    pricingContext: '₹5,000–₹15,000 for logo/graphic work, ₹15,000–₹80,000 for web development, ₹500–₹3,000/hour for specialist work',
  },
  'digital-marketing': {
    competitor: 'Upwork, Fiverr and local agencies',
    extLink: '[IAMAI India Internet Report](https://www.iamai.in)',
    extContext: "per IAMAI's India Internet & Mobile Association data",
    cta: 'hire your digital marketing expert on HireHub360',
    pricingContext: '₹15,000–₹40,000/month for SEO, ₹20,000–₹80,000/month for full digital marketing, ₹10,000–₹50,000 for ad management',
  },
  'data-analytics': {
    competitor: 'Naukri and LinkedIn',
    extLink: '[NASSCOM Analytics India Sector Report](https://nasscom.in)',
    extContext: "per NASSCOM's India Analytics sector report",
    cta: 'post your data project on HireHub360',
    pricingContext: '₹20,000–₹60,000/month for data analyst, ₹8,000–₹25,000 per project for dashboards, ₹500–₹2,000/hour for expert consultants',
  },
}

function mkSlug(s) {
  return (s || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function buildEnPrompt(topic) {
  const meta = CLUSTER_META[topic.segment]
  const isLocal = topic.city !== 'India'
  const cityLine = isLocal
    ? `Primary city: ${topic.city}. Cover 10 specific areas/zones in ${topic.city} with 2 lines each.`
    : `National scope. List 8 Indian cities: Mumbai, Bangalore, Delhi, Hyderabad, Pune, Chennai, Ahmedabad, Kolkata.`

  return `You are India's top B2B SEO writer. Write a 1,800–2,200 word blog post for HireHub360 (hirehub360.in), India's #1 all-in-one talent platform.

TARGET KEYWORD: "${topic.kw}"
SKILL: ${topic.skill}
PRIMARY LOCATION: ${topic.city}
SEGMENT: ${topic.segment}

STRICT BLOG STRUCTURE (follow EXACTLY):

---
# [H1 — Primary keyword "${topic.kw}" + year 2025 — once only, under 70 chars]

[INTRO — 150 words exactly. Open with the client's biggest pain point. Use "${topic.kw}" within the first 80 words. Mention HireHub360 naturally as the solution. High urgency, direct tone.]

## What is ${topic.skill} and Why ${topic.city} Businesses Need It in 2025
[200 words. Market stats, India industry growth data, urgency drivers. Cite: ${meta.extLink} ${meta.extContext}.]

## Top ${topic.skill} Services Available on HireHub360
[List 6–8 sub-skills/specialisations with 2-line descriptions each. Use bullet points.]

## ${isLocal ? `${topic.skill} Coverage — ${topic.city} Areas We Serve` : `Cities We Cover Across India`}
[${cityLine}]

## How HireHub360 Works — 3 Simple Steps
Step 1 — Post your requirement free (takes 2 minutes)
Step 2 — Get matched ${topic.skill} profiles in 2–24 hours
Step 3 — Hire, pay securely, get results — 100% satisfaction guarantee
[Add 2–3 lines of detail per step. Mention WhatsApp support.]

## Why HireHub360 Beats ${meta.competitor}
[Comparison table with 5 rows: Speed, Price, Quality Verification, India Focus, Support. HireHub360 ✅ vs Others ❌. 3-line intro + 3-line conclusion after table.]

## ${topic.skill} Cost in ${topic.city === 'India' ? 'India' : topic.city} — Full Pricing Guide 2025
[Realistic price ranges for 3–4 service tiers. Use this data: ${meta.pricingContext}. Explain what drives cost.]

## Frequently Asked Questions — ${topic.skill} Hiring in ${topic.city}
[Exactly 6 FAQs. Answer each in 60–80 words.]

---

CONCLUSION (100 words): Repeat "${topic.kw}" naturally. End with CTA to HireHub360.

MANDATORY INTERNAL LINKS (weave naturally):
- [Post your requirement free on HireHub360](https://hirehub360.in)
- [Browse ${topic.city === 'India' ? 'all' : topic.city} job listings](https://hirehub360.in${topic.city === 'India' ? '' : '/jobs/in/' + mkSlug(topic.city)})
- [View HireHub360 pricing plans](https://hirehub360.in/pricing)
- [Read more hiring guides on our blog](https://hirehub360.in/blog)

MANDATORY EXTERNAL LINK (one only):
- ${meta.extLink}

SEO: "${topic.kw}" appears 8–10 times. H1 once. H2 exactly 7. Tone: premium, expert, direct. Indian English. ₹ for currency.

Write ONLY the markdown blog content. Start directly with the # H1. No preamble.`
}

function buildHiPrompt(topic) {
  const meta = CLUSTER_META[topic.segment]
  const isLocal = topic.city !== 'India'
  return `आप HireHub360 (hirehub360.in) के लिए एक SEO विशेषज्ञ हिंदी कंटेंट राइटर हैं। HireHub360 भारत का #1 AI-पावर्ड नौकरी प्लेटफ़ॉर्म है।

TARGET KEYWORD: "${topic.city} में ${topic.skill} hire करें / ${topic.skill} kahan milega ${topic.city}"
SKILL: ${topic.skill}
CITY: ${topic.city}
SEGMENT: ${topic.segment}

1,400–1,800 शब्दों का SEO ब्लॉग पोस्ट हिंदी (देवनागरी) में लिखें। भाषा natural हो — Hindi और Hinglish का mix जैसे Indians actually बोलते और search करते हैं।

STRUCTURE (exactly follow करें):

# [H1 — ${topic.city} में ${topic.skill} + 2025 — 65 chars से कम]

[INTRO — 120 words. Hiring problem का दर्द बताओ। "${topic.city} mein ${topic.skill}" को पहले 60 words में include करो।]

## ${topic.skill} क्या होता है और ${topic.city} के बिज़नेस को क्यों चाहिए 2025 में
[180 words. Market stats. India growth data. Natural Hindi/Hinglish mix. Cite: ${meta.extLink}]

## HireHub360 पर उपलब्ध ${topic.skill} सर्विसेज़
[6-8 sub-skills, bullet points, 2 lines each]

## ${isLocal ? `${topic.city} में हम कहाँ-कहाँ काम करते हैं` : 'भारत के किन शहरों में हम हैं'}
[${isLocal ? `${topic.city} के 8-10 areas/zones. 2 lines per area.` : 'Mumbai, Delhi, Bangalore, Hyderabad, Pune, Chennai, Ahmedabad, Kolkata — 2 lines each.'}]

## HireHub360 पर कैसे काम करता है — 3 आसान स्टेप्स
[Step 1: Free post करो, Step 2: 2-24 घंटे में match, Step 3: Hire करो और result पाओ]

## HireHub360 ${meta.competitor} से बेहतर क्यों है
[5-row comparison table: Speed, Price, Quality, India Focus, Support. HireHub360 ✅ vs Others ❌]

## ${topic.city} में ${topic.skill} की Rates — 2025 पूरी जानकारी
[Realistic price ranges in ₹. Data: ${meta.pricingContext}. Cost क्यों vary करता है explain करो।]

## अक्सर पूछे जाने वाले सवाल — ${topic.skill} Hiring
[6 FAQs. Real questions जो Indians Google पर type करते हैं। हर answer 60-70 words में।]

CONCLUSION (80 words): "${topic.city} mein ${topic.skill}" naturally repeat करो। HireHub360 पर CTA दो।

MANDATORY LINKS:
- [HireHub360 पर फ्री पोस्ट करें](https://hirehub360.in)
- [HireHub360 Pricing देखें](https://hirehub360.in/pricing)
- [और Hiring Guides पढ़ें](https://hirehub360.in/blog)

केवल markdown content लिखें। # H1 से शुरू करें। कोई preamble नहीं।`
}

const REGIONAL_PROMPTS = {
  mr: (topic, meta) => `You are an SEO content writer for HireHub360 (hirehub360.in), India's #1 AI hiring platform.
Write a 1,200–1,600 word blog post in authentic Marathi (Devanagari script) about hiring ${topic.skill} in ${topic.city}.

TARGET KEYWORD: "${topic.city} मध्ये ${topic.skill} कुठे मिळेल | ${topic.skill} hire कसे करावे"
SKILL: ${topic.skill} | CITY: ${topic.city}

Write in authentic Marathi that Maharashtra locals actually search and read. Mix formal Marathi with common spoken phrases naturally.

STRUCTURE:
# [H1 — Marathi keyword with ${topic.city} and ${topic.skill} — under 65 chars]
[INTRO — 100 words. ${topic.city} मधील ${topic.skill} hire करण्याची समस्या सांगा.]
## ${topic.skill} म्हणजे काय आणि ${topic.city} मधील व्यवसायांना ते का हवे
## HireHub360 वर उपलब्ध ${topic.skill} सेवा [6-8 bullet points]
## ${topic.city} मधील आमची कव्हरेज [8 areas, 2 lines each]
## HireHub360 कसे काम करते — 3 सोपे टप्पे
## HireHub360 का निवडावे [comparison table]
## ${topic.city} मध्ये ${topic.skill} दर — 2025 [price ranges in ₹: ${meta.pricingContext}]
## वारंवार विचारले जाणारे प्रश्न [6 FAQs in Marathi]

LINKS: [HireHub360 वर विनामूल्य पोस्ट करा](https://hirehub360.in) | [किंमत पहा](https://hirehub360.in/pricing)
Write ONLY markdown. Start with # H1. Authentic Marathi, not translated.`,

  ta: (topic, meta) => `You are an SEO content writer for HireHub360 (hirehub360.in), India's #1 AI hiring platform.
Write a 1,200–1,600 word blog post in authentic Tamil (Tamil script) about hiring ${topic.skill} in ${topic.city}.

TARGET KEYWORD: "${topic.city}ல் ${topic.skill} எங்கு கிடைக்கும் | ${topic.skill} hire செய்வது எப்படி"
SKILL: ${topic.skill} | CITY: ${topic.city}

Write in authentic Tamil that Tamil Nadu locals actually search for. Mix formal Tamil with natural spoken phrases.

STRUCTURE:
# [H1 — Tamil keyword with ${topic.city} and ${topic.skill} — under 65 chars]
[INTRO — 100 words. ${topic.city}ல் ${topic.skill} hire செய்வதில் உள்ள சிரமங்கள் பற்றி எழுதுங்கள்.]
## ${topic.skill} என்றால் என்ன — ${topic.city} தொழில்களுக்கு ஏன் தேவை
## HireHub360-ல் கிடைக்கும் ${topic.skill} சேவைகள் [6-8 bullet points]
## ${topic.city}ல் நாங்கள் சேவை செய்யும் இடங்கள் [8 areas]
## HireHub360 எப்படி செயல்படுகிறது — 3 எளிய படிகள்
## HireHub360 ஏன் சிறந்தது [comparison table]
## ${topic.city}ல் ${topic.skill} கட்டணங்கள் — 2025 [price ranges in ₹: ${meta.pricingContext}]
## அடிக்கடி கேட்கப்படும் கேள்விகள் [6 FAQs in Tamil]

LINKS: [HireHub360-ல் இலவசமாக பதிவிடுங்கள்](https://hirehub360.in) | [விலை பார்க்க](https://hirehub360.in/pricing)
Write ONLY markdown. Start with # H1. Authentic Tamil, not translated.`,

  kn: (topic, meta) => `You are an SEO content writer for HireHub360 (hirehub360.in), India's #1 AI hiring platform.
Write a 1,200–1,600 word blog post in authentic Kannada (Kannada script) about hiring ${topic.skill} in ${topic.city}.

TARGET KEYWORD: "${topic.city}ದಲ್ಲಿ ${topic.skill} ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ | ${topic.skill} hire ಮಾಡುವುದು ಹೇಗೆ"
SKILL: ${topic.skill} | CITY: ${topic.city}

Write in authentic Kannada that Bangalore/Karnataka locals actually search for.

STRUCTURE:
# [H1 — Kannada keyword with ${topic.city} and ${topic.skill} — under 65 chars]
[INTRO — 100 words in Kannada.]
## ${topic.skill} ಎಂದರೇನು — ${topic.city} ವ್ಯವಹಾರಗಳಿಗೆ ಏಕೆ ಬೇಕು
## HireHub360 ನಲ್ಲಿ ಲಭ್ಯವಿರುವ ${topic.skill} ಸೇವೆಗಳು [6-8 bullets]
## ${topic.city} ನಲ್ಲಿ ನಾವು ಸೇವೆ ಸಲ್ಲಿಸುವ ಪ್ರದೇಶಗಳು [8 areas]
## HireHub360 ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ — 3 ಸರಳ ಹಂತಗಳು
## HireHub360 ಏಕೆ ಉತ್ತಮ [comparison table]
## ${topic.city} ನಲ್ಲಿ ${topic.skill} ದರಗಳು — 2025 [price ranges in ₹: ${meta.pricingContext}]
## ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು [6 FAQs]

LINKS: [HireHub360 ನಲ್ಲಿ ಉಚಿತವಾಗಿ ಪೋಸ್ಟ್ ಮಾಡಿ](https://hirehub360.in) | [ಬೆಲೆ ನೋಡಿ](https://hirehub360.in/pricing)
Write ONLY markdown. Start with # H1. Authentic Kannada.`,

  te: (topic, meta) => `You are an SEO content writer for HireHub360 (hirehub360.in), India's #1 AI hiring platform.
Write a 1,200–1,600 word blog post in authentic Telugu (Telugu script) about hiring ${topic.skill} in ${topic.city}.

TARGET KEYWORD: "${topic.city}లో ${topic.skill} ఎక్కడ దొరుకుతుంది | ${topic.skill} hire చేయడం ఎలా"
SKILL: ${topic.skill} | CITY: ${topic.city}

Write in authentic Telugu that Hyderabad/Andhra locals actually search for.

STRUCTURE:
# [H1 — Telugu keyword with ${topic.city} and ${topic.skill} — under 65 chars]
[INTRO — 100 words in Telugu.]
## ${topic.skill} అంటే ఏమిటి — ${topic.city} వ్యాపారాలకు ఎందుకు అవసరం
## HireHub360 లో అందుబాటులో ఉన్న ${topic.skill} సేవలు [6-8 bullets]
## ${topic.city} లో మేము సేవలు అందించే ప్రాంతాలు [8 areas]
## HireHub360 ఎలా పని చేస్తుందో — 3 సులభమైన దశలు
## HireHub360 ఎందుకు మెరుగైనది [comparison table]
## ${topic.city} లో ${topic.skill} రేట్లు — 2025 [price ranges in ₹: ${meta.pricingContext}]
## తరచుగా అడిగే ప్రశ్నలు [6 FAQs]

LINKS: [HireHub360 లో ఉచితంగా పోస్ట్ చేయండి](https://hirehub360.in) | [ధర చూడండి](https://hirehub360.in/pricing)
Write ONLY markdown. Start with # H1. Authentic Telugu.`,

  bn: (topic, meta) => `You are an SEO content writer for HireHub360 (hirehub360.in), India's #1 AI hiring platform.
Write a 1,200–1,600 word blog post in authentic Bengali (Bengali script) about hiring ${topic.skill} in ${topic.city}.

TARGET KEYWORD: "${topic.city}তে ${topic.skill} কোথায় পাওয়া যায় | ${topic.skill} hire করার উপায়"
SKILL: ${topic.skill} | CITY: ${topic.city}

Write in authentic Bengali that Kolkata/West Bengal locals actually search for.

STRUCTURE:
# [H1 — Bengali keyword with ${topic.city} and ${topic.skill} — under 65 chars]
[INTRO — 100 words in Bengali.]
## ${topic.skill} কী এবং ${topic.city} এর ব্যবসায়ীদের এটি কেন দরকার
## HireHub360 এ উপলব্ধ ${topic.skill} সেবাসমূহ [6-8 bullets]
## ${topic.city} এ আমাদের কভারেজ [8 areas]
## HireHub360 কীভাবে কাজ করে — ৩টি সহজ ধাপ
## HireHub360 কেন সেরা [comparison table]
## ${topic.city}তে ${topic.skill} এর রেট — ২০২৫ [price ranges in ₹: ${meta.pricingContext}]
## প্রায়শই জিজ্ঞাসিত প্রশ্নসমূহ [6 FAQs]

LINKS: [HireHub360 এ বিনামূল্যে পোস্ট করুন](https://hirehub360.in) | [মূল্য দেখুন](https://hirehub360.in/pricing)
Write ONLY markdown. Start with # H1. Authentic Bengali.`,

  gu: (topic, meta) => `You are an SEO content writer for HireHub360 (hirehub360.in), India's #1 AI hiring platform.
Write a 1,200–1,600 word blog post in authentic Gujarati (Gujarati script) about hiring ${topic.skill} in ${topic.city}.

TARGET KEYWORD: "${topic.city}માં ${topic.skill} ક્યાં મળશે | ${topic.skill} hire કેવી રીતે કરવું"
SKILL: ${topic.skill} | CITY: ${topic.city}

Write in authentic Gujarati that Ahmedabad/Gujarat locals actually search for.

STRUCTURE:
# [H1 — Gujarati keyword with ${topic.city} and ${topic.skill} — under 65 chars]
[INTRO — 100 words in Gujarati.]
## ${topic.skill} એટલે શું અને ${topic.city}ના બિઝનેસને શા માટે જોઈએ
## HireHub360 પર ઉપલબ્ધ ${topic.skill} સેવાઓ [6-8 bullets]
## ${topic.city}માં અમારી કવરેજ [8 areas]
## HireHub360 કેવી રીતે કામ કરે છે — 3 સરળ પગલાં
## HireHub360 શ્રેષ્ઠ કેમ છે [comparison table]
## ${topic.city}માં ${topic.skill}ના રેટ — 2025 [price ranges in ₹: ${meta.pricingContext}]
## વારંવાર પૂછાતા પ્રશ્નો [6 FAQs]

LINKS: [HireHub360 પર મફત પોસ્ટ કરો](https://hirehub360.in) | [ભાવ જુઓ](https://hirehub360.in/pricing)
Write ONLY markdown. Start with # H1. Authentic Gujarati.`,

  pa: (topic, meta) => `You are an SEO content writer for HireHub360 (hirehub360.in), India's #1 AI hiring platform.
Write a 1,200–1,600 word blog post in authentic Punjabi (Gurmukhi script) about hiring ${topic.skill} in ${topic.city}.

TARGET KEYWORD: "${topic.city} ਵਿੱਚ ${topic.skill} ਕਿੱਥੇ ਮਿਲੇਗਾ | ${topic.skill} hire ਕਿਵੇਂ ਕਰੀਏ"
SKILL: ${topic.skill} | CITY: ${topic.city}

Write in authentic Punjabi (Gurmukhi) that Punjab/Chandigarh locals actually search for.

STRUCTURE:
# [H1 — Punjabi keyword with ${topic.city} and ${topic.skill} — under 65 chars]
[INTRO — 100 words in Punjabi.]
## ${topic.skill} ਕੀ ਹੈ ਅਤੇ ${topic.city} ਦੇ ਕਾਰੋਬਾਰਾਂ ਨੂੰ ਇਸਦੀ ਲੋੜ ਕਿਉਂ ਹੈ
## HireHub360 'ਤੇ ${topic.skill} ਸੇਵਾਵਾਂ [6-8 bullets]
## ${topic.city} ਵਿੱਚ ਸਾਡੀ ਕਵਰੇਜ [8 areas]
## HireHub360 ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ — 3 ਆਸਾਨ ਕਦਮ
## HireHub360 ਕਿਉਂ ਬਿਹਤਰ ਹੈ [comparison table]
## ${topic.city} ਵਿੱਚ ${topic.skill} ਦੀਆਂ ਦਰਾਂ — 2025 [price ranges in ₹: ${meta.pricingContext}]
## ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ [6 FAQs]

LINKS: [HireHub360 'ਤੇ ਮੁਫ਼ਤ ਪੋਸਟ ਕਰੋ](https://hirehub360.in) | [ਕੀਮਤ ਦੇਖੋ](https://hirehub360.in/pricing)
Write ONLY markdown. Start with # H1. Authentic Punjabi.`,

  ml: (topic, meta) => `You are an SEO content writer for HireHub360 (hirehub360.in), India's #1 AI hiring platform.
Write a 1,200–1,600 word blog post in authentic Malayalam (Malayalam script) about hiring ${topic.skill} in ${topic.city}.

TARGET KEYWORD: "${topic.city}ൽ ${topic.skill} എവിടെ കിട്ടും | ${topic.skill} hire ചെയ്യുന്നത് എങ്ങനെ"
SKILL: ${topic.skill} | CITY: ${topic.city}

Write in authentic Malayalam that Kerala locals actually search for.

STRUCTURE:
# [H1 — Malayalam keyword with ${topic.city} and ${topic.skill} — under 65 chars]
[INTRO — 100 words in Malayalam.]
## ${topic.skill} എന്തൊക്കെ — ${topic.city} ബിസിനസുകൾക്ക് എന്തുകൊണ്ട് ആവശ്യം
## HireHub360-ൽ ലഭ്യമായ ${topic.skill} സേവനങ്ങൾ [6-8 bullets]
## ${topic.city}ൽ ഞങ്ങൾ സേവനം നൽകുന്ന പ്രദേശങ്ങൾ [8 areas]
## HireHub360 എങ്ങനെ പ്രവർത്തിക്കുന്നു — 3 ലളിതമായ ഘട്ടങ്ങൾ
## HireHub360 എന്തുകൊണ്ട് മികച്ചത് [comparison table]
## ${topic.city}ൽ ${topic.skill} നിരക്കുകൾ — 2025 [price ranges in ₹: ${meta.pricingContext}]
## പലപ്പോഴും ചോദിക്കുന്ന ചോദ്യങ്ങൾ [6 FAQs]

LINKS: [HireHub360-ൽ സൗജന്യമായി പോസ്റ്റ് ചെയ്യൂ](https://hirehub360.in) | [വില കാണുക](https://hirehub360.in/pricing)
Write ONLY markdown. Start with # H1. Authentic Malayalam.`,
}

function buildRegionalPrompt(topic, lang) {
  const meta = CLUSTER_META[topic.segment]
  const builder = REGIONAL_PROMPTS[lang]
  return builder ? builder(topic, meta) : buildEnPrompt(topic)
}

async function callGroq(prompt, maxTokens = 4000) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.68,
    }),
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

async function generateAndSave({ topic, lang, baseSlug, canonicalId, dateStr }) {
  const slug = baseSlug
  const langSlug = lang === 'en' ? slug : `${lang}-${slug}`

  // Check if already exists
  const { data: existing } = await supabaseService
    .from('blogs').select('id').eq('slug', langSlug).eq('lang', lang).maybeSingle()
  if (existing) return { ok: true, skipped: true, slug: langSlug }

  const prompt = lang === 'en'
    ? buildEnPrompt(topic)
    : lang === 'hi'
      ? buildHiPrompt(topic)
      : buildRegionalPrompt(topic, lang)

  const maxTok = lang === 'en' ? 4000 : 3000
  const content = await callGroq(prompt, maxTok)
  if (!content || content.length < 400) return { ok: false, error: 'Empty AI response', lang }

  const firstLine = content.split('\n').find(l => l.trim())
  const title = firstLine?.replace(/^#+\s*/, '').trim() || `Hire ${topic.skill} in ${topic.city}`
  const metaTitle = title.slice(0, 60)

  const excerptMap = {
    en: `Looking to hire ${topic.skill} in ${topic.city}? HireHub360 matches you with verified ${topic.skill.toLowerCase()} professionals in 2–24 hours. Post free.`,
    hi: `${topic.city} में ${topic.skill} hire करना चाहते हैं? HireHub360 पर verified professionals मिलते हैं 2-24 घंटे में। Free post करें।`,
  }
  const excerpt = excerptMap[lang] || excerptMap.en

  const authorMap = {
    en: 'HireHub360 SEO Team', hi: 'HireHub360 टीम',
    mr: 'HireHub360 संपादकीय टीम', ta: 'HireHub360 குழு',
    kn: 'HireHub360 ತಂಡ', te: 'HireHub360 బృందం',
    bn: 'HireHub360 দল', gu: 'HireHub360 ટીम',
    pa: 'HireHub360 ਟੀਮ', ml: 'HireHub360 ടീം',
  }

  const state = CITY_STATE[topic.city] || null
  const tags = [topic.kw, topic.skill.toLowerCase(), topic.city.toLowerCase(), topic.segment, `hire india 2025`, lang]

  const { error } = await supabaseService.from('blogs').insert({
    title,
    slug: langSlug,
    excerpt,
    content,
    author: authorMap[lang] || 'HireHub360 Team',
    tags,
    published: true,
    lang,
    canonical_id: canonicalId,
    region_state: state,
    city: topic.city,
    meta_title: metaTitle,
    meta_description: `${title.slice(0, 120)} — HireHub360`.slice(0, 155),
    updated_at: new Date().toISOString(),
  })

  if (error) return { ok: false, error: error.message, lang }

  const urlPath = lang === 'en' ? `/blog/${langSlug}` : `/blog/${lang}/${slug}`
  await autoIndex([`${SITE}${urlPath}`]).catch(() => {})

  return { ok: true, slug: langSlug, lang, title }
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = req.headers['x-cron-secret'] || req.query.secret
  if (secret !== (process.env.CRON_SECRET || 'hirehub-cron-2026')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const slot = (req.query.slot || 'a').toLowerCase()
  const topics = CLUSTERS[slot]
  if (!topics) return res.status(400).json({ error: 'Invalid slot. Use a/b/c/d.' })

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  const dateStr = new Date().toISOString().slice(0, 10)

  // Pick 4 topics for this run
  const baseIdx = (dayOfYear * 4) % topics.length
  const selectedTopics = [0, 1, 2, 3].map(i => topics[(baseIdx + i) % topics.length])

  // Build work list: 4 EN + 4 HI + up to 2 regional
  const workList = []
  let regionalCount = 0

  for (const topic of selectedTopics) {
    const canonicalId = randomUUID()
    const baseSlug = `hire-${mkSlug(topic.skill)}-${mkSlug(topic.city)}-${dateStr}`

    workList.push({ topic, lang: 'en', baseSlug, canonicalId, dateStr })
    workList.push({ topic, lang: 'hi', baseSlug, canonicalId, dateStr })

    if (regionalCount < 2) {
      const state = CITY_STATE[topic.city]
      const regionalLang = state ? STATE_LANG[state] : null
      if (regionalLang) {
        workList.push({ topic, lang: regionalLang, baseSlug, canonicalId, dateStr })
        regionalCount++
      }
    }
  }

  // Generate in parallel (3 batches to stay within Groq rate limits)
  const enWork = workList.filter(w => w.lang === 'en')
  const hiWork = workList.filter(w => w.lang === 'hi')
  const regWork = workList.filter(w => w.lang !== 'en' && w.lang !== 'hi')

  const results = []

  const enResults = await Promise.all(enWork.map(w => generateAndSave(w).catch(e => ({ ok: false, error: e.message }))))
  results.push(...enResults)

  const hiResults = await Promise.all(hiWork.map(w => generateAndSave(w).catch(e => ({ ok: false, error: e.message }))))
  results.push(...hiResults)

  const regResults = await Promise.all(regWork.map(w => generateAndSave(w).catch(e => ({ ok: false, error: e.message }))))
  results.push(...regResults)

  const ok = results.filter(r => r.ok).length
  const skipped = results.filter(r => r.skipped).length
  const failed = results.filter(r => !r.ok).length

  return res.json({ ok: true, generated: ok - skipped, skipped, failed, total: results.length, slot, results })
}

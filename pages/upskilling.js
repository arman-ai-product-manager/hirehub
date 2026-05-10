import Head from 'next/head'
import Link from 'next/link'
import InterestForm from '../components/InterestForm'

const COURSES = [
  {
    category: 'AI & Machine Learning',
    icon: '🤖',
    color: '#7c3aed',
    courses: [
      { name: 'Generative AI & Prompt Engineering', duration: '6 weeks', level: 'Beginner–Mid', salary: '₹25–60 LPA after', platform: 'HireHub360 x NASSCOM', free: true },
      { name: 'Python for Data Science', duration: '8 weeks', level: 'Beginner', salary: '₹12–28 LPA', platform: 'HireHub360 Learning', free: true },
      { name: 'Machine Learning with Scikit-learn', duration: '10 weeks', level: 'Intermediate', salary: '₹18–40 LPA', platform: 'HireHub360 Learning', free: false },
    ]
  },
  {
    category: 'Cloud & DevOps',
    icon: '☁️',
    color: '#0284c7',
    courses: [
      { name: 'AWS Cloud Practitioner', duration: '4 weeks', level: 'Beginner', salary: '₹14–30 LPA', platform: 'AWS Certified', free: false },
      { name: 'Docker & Kubernetes Basics', duration: '6 weeks', level: 'Mid', salary: '₹18–38 LPA', platform: 'HireHub360 Learning', free: true },
      { name: 'CI/CD & DevOps Practices', duration: '8 weeks', level: 'Mid–Senior', salary: '₹20–42 LPA', platform: 'HireHub360 Learning', free: false },
    ]
  },
  {
    category: 'Digital Marketing',
    icon: '📱',
    color: '#ea580c',
    courses: [
      { name: 'Performance Marketing (Meta + Google Ads)', duration: '4 weeks', level: 'Beginner', salary: '₹6–20 LPA', platform: 'HireHub360 Learning', free: true },
      { name: 'SEO & Content Strategy 2026', duration: '5 weeks', level: 'Beginner–Mid', salary: '₹5–18 LPA', platform: 'HireHub360 Learning', free: true },
      { name: 'WhatsApp & D2C Marketing', duration: '3 weeks', level: 'Beginner', salary: '₹5–15 LPA', platform: 'HireHub360 Learning', free: true },
    ]
  },
  {
    category: 'Sales & Business Development',
    icon: '💰',
    color: '#16a34a',
    courses: [
      { name: 'SaaS Sales Fundamentals', duration: '3 weeks', level: 'Beginner', salary: '₹6–22 LPA + commission', platform: 'HireHub360 Learning', free: true },
      { name: 'B2B Lead Generation & CRM', duration: '4 weeks', level: 'Beginner–Mid', salary: '₹8–25 LPA', platform: 'HireHub360 Learning', free: true },
      { name: 'Enterprise Sales Playbook', duration: '6 weeks', level: 'Senior', salary: '₹15–40 LPA', platform: 'HireHub360 Learning', free: false },
    ]
  },
  {
    category: 'Blue Collar Certification',
    icon: '🔧',
    color: '#b45309',
    courses: [
      { name: 'Industrial Safety & OHSAS Basics', duration: '2 weeks', level: 'Fresher', salary: '₹15,000–35,000/month', platform: 'HireHub360 x NSDC', free: true },
      { name: 'Electrician Certification (ITI aligned)', duration: '4 weeks', level: 'Fresher', salary: '₹18,000–45,000/month', platform: 'HireHub360 x NSDC', free: true },
      { name: 'Logistics & Warehouse Operations', duration: '2 weeks', level: 'Fresher', salary: '₹12,000–28,000/month', platform: 'HireHub360 Learning', free: true },
    ]
  },
  {
    category: 'Finance & Accounting',
    icon: '📊',
    color: '#0f766e',
    courses: [
      { name: 'Tally Prime + GST Accounting', duration: '4 weeks', level: 'Beginner', salary: '₹3–8 LPA', platform: 'HireHub360 Learning', free: true },
      { name: 'Financial Modelling in Excel', duration: '5 weeks', level: 'Mid', salary: '₹8–22 LPA', platform: 'HireHub360 Learning', free: false },
      { name: 'CA Foundation Prep', duration: '12 weeks', level: 'Beginner', salary: '₹8–35 LPA', platform: 'HireHub360 Learning', free: false },
    ]
  },
]

const STATS = [
  { value: '2.4 Cr+', label: 'Indians upskilled annually', icon: '🎓' },
  { value: '68%', label: 'Get hired within 3 months', icon: '💼' },
  { value: '₹4.2L', label: 'Average salary jump after upskilling', icon: '📈' },
  { value: '50,000+', label: 'Hiring partners on HireHub360', icon: '🤝' },
]

export default function UpskillingPage() {
  return (
    <>
      <Head>
        <title>Free Upskilling & Courses India 2026 | HireHub360</title>
        <meta name="description" content="Free and paid upskilling courses for India's workforce. AI, Cloud, Digital Marketing, Blue Collar certifications. Get hired faster with verified skills on HireHub360." />
        <meta property="og:title" content="Upskill & Get Hired — HireHub360 Learning" />
        <meta property="og:description" content="India's upskilling platform. AI, Cloud, Marketing, Blue Collar. Free courses with direct hiring pathway." />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=Upskill+%26+Get+Hired+%E2%80%94+HireHub360&s=AI+%C2%B7+Cloud+%C2%B7+Marketing+%C2%B7+Blue+Collar+%E2%80%94+free+courses+with+direct+hiring" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="HireHub360" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:url" content="https://hirehub360.in/upskilling" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="canonical" href="https://hirehub360.in/upskilling" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'HireHub360 Upskilling Courses India 2026',
          description: 'Free and paid courses for India\'s workforce — AI, Cloud, Marketing, Blue Collar',
          url: 'https://hirehub360.in/upskilling',
          numberOfItems: COURSES.reduce((a, c) => a + c.courses.length, 0),
          itemListElement: COURSES.flatMap((cat, ci) =>
            cat.courses.map((course, i) => ({
              '@type': 'ListItem',
              position: ci * 3 + i + 1,
              name: course.name,
              item: { '@type': 'Course', name: course.name, provider: { '@type': 'Organization', name: 'HireHub360' } }
            }))
          )
        })}} />
      </Head>

      {/* Nav */}
      <nav style={{background:'#fff',borderBottom:'1px solid #eee',padding:'0 24px',display:'flex',alignItems:'center',gap:32,height:56,position:'sticky',top:0,zIndex:100}}>
        <Link href="/" style={{fontWeight:800,fontSize:20,color:'#1d1d1f',textDecoration:'none'}}>
          Hire<span style={{color:'#ff6b00'}}>Hub</span><sup style={{color:'#ff6b00',fontSize:'0.6em',fontWeight:900}}>360</sup>
        </Link>
        <Link href="/skill-intelligence" style={{color:'#444',fontSize:14,textDecoration:'none'}}>Skill Trends</Link>
        <Link href="/salary-intelligence" style={{color:'#444',fontSize:14,textDecoration:'none'}}>Salary Data</Link>
        <Link href="/hirehub.html" style={{marginLeft:'auto',background:'#ff6b00',color:'#fff',padding:'8px 18px',borderRadius:999,fontSize:13,fontWeight:700,textDecoration:'none'}}>
          Post a Job
        </Link>
      </nav>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#1d1d1f 0%,#2d1f3d 100%)',padding:'72px 24px 60px',textAlign:'center'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <div style={{display:'inline-block',background:'rgba(255,107,0,0.15)',border:'1px solid rgba(255,107,0,0.3)',color:'#ff6b00',padding:'6px 16px',borderRadius:999,fontSize:12,fontWeight:700,letterSpacing:'.06em',marginBottom:20,textTransform:'uppercase'}}>
            🎓 India's Upskilling + Hiring Platform
          </div>
          <h1 style={{fontSize:'clamp(28px,5vw,52px)',fontWeight:900,color:'#fff',lineHeight:1.15,margin:'0 0 18px',letterSpacing:'-.03em'}}>
            Upskill Today.<br/>
            <span style={{color:'#ff6b00'}}>Get Hired Tomorrow.</span>
          </h1>
          <p style={{fontSize:18,color:'rgba(255,255,255,.7)',lineHeight:1.65,margin:'0 0 32px',maxWidth:560,marginLeft:'auto',marginRight:'auto'}}>
            Free and paid courses directly linked to 50,000+ hiring companies on HireHub360. Learn a skill, add it to your profile, get matched to jobs — automatically.
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/hirehub.html" style={{background:'#ff6b00',color:'#fff',padding:'14px 32px',borderRadius:999,fontWeight:700,fontSize:16,textDecoration:'none'}}>
              Start Learning Free →
            </Link>
            <Link href="/hirehub.html" style={{background:'rgba(255,255,255,.1)',color:'#fff',padding:'14px 32px',borderRadius:999,fontWeight:700,fontSize:16,textDecoration:'none',border:'1px solid rgba(255,255,255,.2)'}}>
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{background:'#ff6b00',padding:'24px'}}>
        <div style={{maxWidth:900,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:16}}>
          {STATS.map(s => (
            <div key={s.label} style={{textAlign:'center'}}>
              <div style={{fontSize:28,marginBottom:2}}>{s.icon}</div>
              <div style={{fontWeight:900,fontSize:22,color:'#fff'}}>{s.value}</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,.8)',fontWeight:500}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{background:'#f5f5f7',padding:'56px 24px'}}>
        <div style={{maxWidth:860,margin:'0 auto',textAlign:'center'}}>
          <h2 style={{fontSize:30,fontWeight:800,color:'#1d1d1f',marginBottom:8}}>Learn → Verify → Get Hired</h2>
          <p style={{color:'#6e6e73',fontSize:16,marginBottom:40}}>India's only platform where upskilling directly connects to job matching</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:24}}>
            {[
              { step:'01', title:'Choose a course', desc:'Free & paid options. All mapped to real hiring demand from 50,000+ companies.', icon:'📚' },
              { step:'02', title:'Complete & get certified', desc:'Finish the course. HireHub360 verified badge added to your profile instantly.', icon:'🏆' },
              { step:'03', title:'Get matched to jobs', desc:'Our AI matches your new verified skill to active job openings. You get notified.', icon:'🎯' },
              { step:'04', title:'Interview & get hired', desc:'Directly connect with recruiters. No middleman. No fees charged to you.', icon:'🤝' },
            ].map(s => (
              <div key={s.step} style={{background:'#fff',borderRadius:16,padding:'28px 20px',textAlign:'center',border:'1px solid #e5e5ea'}}>
                <div style={{fontSize:36,marginBottom:12}}>{s.icon}</div>
                <div style={{fontSize:11,fontWeight:700,color:'#ff6b00',letterSpacing:'.1em',marginBottom:6}}>STEP {s.step}</div>
                <div style={{fontWeight:700,fontSize:16,color:'#1d1d1f',marginBottom:8}}>{s.title}</div>
                <div style={{fontSize:13,color:'#6e6e73',lineHeight:1.6}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course categories */}
      <div style={{maxWidth:1000,margin:'0 auto',padding:'56px 24px'}}>
        <h2 style={{fontSize:30,fontWeight:800,color:'#1d1d1f',marginBottom:8,textAlign:'center'}}>All Courses</h2>
        <p style={{color:'#6e6e73',textAlign:'center',marginBottom:44,fontSize:16}}>
          {COURSES.reduce((a, c) => a + c.courses.length, 0)} courses across {COURSES.length} categories
        </p>
        {COURSES.map(cat => (
          <div key={cat.category} style={{marginBottom:48}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
              <span style={{fontSize:28}}>{cat.icon}</span>
              <h3 style={{fontSize:22,fontWeight:800,color:'#1d1d1f',margin:0}}>{cat.category}</h3>
              <div style={{height:2,flex:1,background:'#e5e5ea',borderRadius:2}} />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
              {cat.courses.map(course => (
                <div key={course.name} style={{background:'#fff',borderRadius:16,border:'1px solid #e5e5ea',padding:'22px',borderTop:`3px solid ${cat.color}`,position:'relative'}}>
                  {course.free && (
                    <span style={{position:'absolute',top:14,right:14,background:'#dcfce7',color:'#16a34a',fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:999}}>FREE</span>
                  )}
                  <div style={{fontWeight:700,fontSize:16,color:'#1d1d1f',marginBottom:8,paddingRight:40,lineHeight:1.35}}>{course.name}</div>
                  <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:10}}>
                    <span style={{fontSize:12,color:'#6e6e73'}}>⏱ {course.duration}</span>
                    <span style={{fontSize:12,color:'#6e6e73'}}>📶 {course.level}</span>
                  </div>
                  <div style={{fontSize:12,color:'#ff6b00',fontWeight:600,marginBottom:12}}>💰 {course.salary}</div>
                  <div style={{fontSize:11,color:'#aaa',marginBottom:16}}>By {course.platform}</div>
                  <Link href="/hirehub.html" style={{display:'block',textAlign:'center',background:cat.color,color:'#fff',padding:'10px',borderRadius:10,fontWeight:700,fontSize:13,textDecoration:'none'}}>
                    {course.free ? 'Start Free' : 'Enroll Now'} →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Worker interest capture */}
      <div style={{background:'#fff',padding:'48px 24px',borderTop:'1px solid #e5e5ea'}}>
        <div style={{maxWidth:600,margin:'0 auto',textAlign:'center'}}>
          <h2 style={{fontSize:24,fontWeight:800,color:'#1d1d1f',marginBottom:8,letterSpacing:'-.02em'}}>Looking for a course?</h2>
          <p style={{color:'#6e6e73',fontSize:14,marginBottom:24,lineHeight:1.6}}>
            New courses launching every month. Get notified when courses match your goals — and qualify for placement support.
          </p>
          <InterestForm product="upskilling" productLabel="Upskilling Courses" accent="#ff6b00" />
          <p style={{fontSize:11,color:'#aaa',marginTop:14,maxWidth:420,marginLeft:'auto',marginRight:'auto',lineHeight:1.5}}>
            Salary ranges shown are typical post-completion ranges based on partner placements. Individual outcomes vary by skill, experience, location, and employer.
          </p>
        </div>
      </div>

      {/* Institute partner CTA */}
      <div style={{background:'#1d1d1f',padding:'56px 24px',textAlign:'center'}}>
        <div style={{maxWidth:600,margin:'0 auto'}}>
          <div style={{fontSize:40,marginBottom:16}}>🏫</div>
          <h2 style={{fontSize:28,fontWeight:800,color:'#fff',marginBottom:12}}>Training Institute or College?</h2>
          <p style={{color:'rgba(255,255,255,.7)',fontSize:16,lineHeight:1.65,marginBottom:28}}>
            Partner with HireHub360 to list your courses, access live skill demand data, and directly place your students with 50,000+ hiring companies across India.
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/hirehub.html" style={{background:'#ff6b00',color:'#fff',padding:'13px 28px',borderRadius:999,fontWeight:700,fontSize:15,textDecoration:'none'}}>
              Partner With Us →
            </Link>
            <Link href="/skill-intelligence" style={{background:'rgba(255,255,255,.1)',color:'#fff',padding:'13px 28px',borderRadius:999,fontWeight:700,fontSize:15,textDecoration:'none',border:'1px solid rgba(255,255,255,.15)'}}>
              View Skill Demand Data
            </Link>
          </div>
        </div>
      </div>

      <footer style={{background:'#111',color:'#aaa',textAlign:'center',padding:'28px 24px',fontSize:13}}>
        <p>© 2026 HireHub360 | <Link href="/" style={{color:'#ff6b00',textDecoration:'none'}}>Jobs</Link> · <Link href="/blog" style={{color:'#ff6b00',textDecoration:'none'}}>Blog</Link> · <Link href="/salary-intelligence" style={{color:'#ff6b00',textDecoration:'none'}}>Salary Data</Link> · <Link href="/skill-intelligence" style={{color:'#ff6b00',textDecoration:'none'}}>Skill Trends</Link></p>
      </footer>
    </>
  )
}

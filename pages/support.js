import Head from 'next/head'
import { useState } from 'react'

const FAQS = [
  {
    category: 'Job Seekers',
    icon: '🔍',
    color: '#fff7ed',
    items: [
      { q: 'How do I apply for a job on HireHub360?', a: 'Click "Apply Now" on any job listing. Fill in your name, email, phone, and upload your resume (PDF or DOCX). Your application is sent directly to the employer.' },
      { q: 'Is HireHub360 free for job seekers?', a: 'Yes — searching jobs, applying, using Resume Parser, Cover Letter Generator, Interview Prep, Mock Interview, and Skill Gap Analyzer are all completely free.' },
      { q: 'How does AI Resume Parsing work?', a: 'Upload your PDF or DOCX resume. Our AI extracts your skills, experience, and education automatically, then shows a structured analysis and improvement tips.' },
      { q: 'Can I save jobs and apply later?', a: 'Yes. Click the bookmark icon on any job card. Saved jobs are stored locally in your browser and accessible from the "Saved Jobs" link.' },
      { q: 'How do I set up job alerts?', a: 'Go to Job Alerts (bell icon in nav), enter your role, location, and email. You\'ll receive new matching jobs directly to your inbox.' },
    ]
  },
  {
    category: 'AI Tools',
    icon: '🤖',
    color: '#f0f9ff',
    items: [
      { q: 'What AI tools are available?', a: 'HireHub360 offers: Resume Parser, Cover Letter Generator, Interview Prep Coach, Mock Interview Simulator, Skill Gap Analyzer, Salary Calculator, Salary Negotiation Coach, JD Optimizer, and Bulk CV Screener.' },
      { q: 'How accurate is the Skill Gap Analyzer?', a: 'The analyzer uses Groq\'s Llama 3.3 70B model trained on real-world job market data. Results are highly accurate for Indian tech job market context. Always cross-reference with actual job descriptions.' },
      { q: 'How does the AI Salary Negotiation Coach work?', a: 'You set your role, current offer, and target salary. The AI plays a tough HR/hiring manager. You practice your negotiation, and after each exchange you get a coaching score and tip.' },
      { q: 'Are AI-generated cover letters plagiarism-free?', a: 'Yes. Every cover letter is generated fresh for your specific inputs (role, company, your background). No two outputs are identical.' },
      { q: 'What\'s the difference between Mock Interview and Interview Prep?', a: 'Interview Prep gives you curated Q&A banks and tips for specific roles. Mock Interview is an interactive live simulation where AI asks questions and evaluates your answers in real time.' },
    ]
  },
  {
    category: 'Employers & Hiring',
    icon: '🏢',
    color: '#f0fdf4',
    items: [
      { q: 'How do I post a job?', a: 'Click "Post a Job" in the top nav. Fill in job title, description, location, salary, and skills. Choose between our free and premium listing plans.' },
      { q: 'How does Bulk CV Screener work?', a: 'Upload multiple resumes (PDF/DOCX) and paste your job description. The AI ranks candidates by fit score, highlights key skills, and flags gaps — saving hours of manual review.' },
      { q: 'What is JD Optimizer?', a: 'Paste your job description and our AI rewrites it to attract better candidates, remove unconscious bias, include relevant keywords for search visibility, and improve clarity.' },
      { q: 'What are premium features for employers?', a: 'Premium includes: featured job listings (top of search), unlimited CV screening, WorkerFirst (candidates apply to you), InstantHire, and dedicated support.' },
    ]
  },
  {
    category: 'Account & Sign In',
    icon: '👤',
    color: '#fdf4ff',
    items: [
      { q: 'How do I create an account?', a: 'Click "Sign In" in the top navbar. You can sign up with Google, LinkedIn, or email. Account creation takes under 30 seconds.' },
      { q: 'I forgot my password. How do I reset it?', a: 'On the Sign In page, click "Forgot Password". Enter your email and we\'ll send a reset link within 2 minutes. Check your spam folder if you don\'t see it.' },
      { q: 'Can I use HireHub360 without creating an account?', a: 'Yes. Browsing jobs, applying, and using most AI tools work without an account. An account unlocks saved applications, job alerts, and premium features.' },
      { q: 'How do I delete my account?', a: 'Email support@hirehub360.in with subject "Delete My Account" from your registered email. We\'ll process it within 7 business days and send confirmation.' },
    ]
  },
  {
    category: 'Billing & Plans',
    icon: '💳',
    color: '#f0fdf4',
    items: [
      { q: 'What plans does HireHub360 offer?', a: 'Starter (free), Pro (₹999/mo), and Enterprise (custom). See /pricing for full feature breakdown. Job seekers are always free.' },
      { q: 'Can I cancel my plan anytime?', a: 'Yes. Cancel anytime from your account settings. You keep access until the end of your current billing period. No cancellation fees.' },
      { q: 'Do you offer refunds?', a: 'We offer a 7-day money-back guarantee for first-time subscriptions. Email billing@hirehub360.in within 7 days of purchase.' },
      { q: 'What payment methods do you accept?', a: 'UPI, credit/debit cards (Visa, Mastercard, RuPay), net banking, and corporate invoicing for Enterprise plans.' },
    ]
  },
]

export default function Support() {
  const [openCategory, setOpenCategory] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', category: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')

  function toggleFaq(key) {
    setOpenFaq(f => f === key ? null : key)
  }

  const filteredFaqs = search.trim()
    ? FAQS.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
        )
      })).filter(cat => cat.items.length > 0)
    : FAQS

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSubmitted(true)
  }

  return (
    <>
      <Head>
        <title>Support Center — HireHub360</title>
        <meta name="description" content="Get help with HireHub360. Browse FAQs, contact support, or chat with our team. We're here to help job seekers and employers." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="canonical" href="https://hirehub360.in/support" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#f5f5f7;color:#1d1d1f}
        a{text-decoration:none;color:inherit}
        .nav{background:rgba(255,255,255,.97);backdrop-filter:blur(12px);border-bottom:1px solid #e5e5ea;padding:0 5vw;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200;box-shadow:0 1px 0 rgba(0,0,0,.06)}
        .logo{font-weight:900;font-size:22px;letter-spacing:-.04em}
        .logo span{color:#ff6b00}
        .nav-links{display:flex;gap:8px;align-items:center;font-size:14px;font-weight:500}
        .nav-links a{color:#3d3d3f;padding:7px 12px;border-radius:8px;transition:all .15s}
        .nav-links a:hover{color:#ff6b00;background:#fff7f0}
        .btn-post{background:#ff6b00;color:#fff!important;padding:8px 18px;border-radius:999px;font-weight:700;font-size:13px}
        .btn-post:hover{opacity:.88}
        /* Hero */
        .hero{background:linear-gradient(135deg,#0f0f0f 0%,#1a0800 60%,#0f0f0f 100%);padding:56px 5vw 48px;color:#fff;text-align:center}
        .hero h1{font-size:clamp(28px,5vw,52px);font-weight:900;letter-spacing:-.05em;margin-bottom:12px}
        .hero h1 span{color:#ff6b00}
        .hero p{font-size:17px;color:#999;max-width:520px;margin:0 auto 28px;line-height:1.6}
        .search-box{max-width:520px;margin:0 auto;position:relative}
        .search-box input{width:100%;padding:14px 20px 14px 48px;border-radius:14px;border:none;font-size:15px;outline:none;box-shadow:0 4px 24px rgba(0,0,0,.3)}
        .search-box svg{position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#aaa;width:18px;height:18px}
        /* Stats */
        .stats-strip{background:#fff;border-bottom:1px solid #e5e5ea;padding:16px 5vw}
        .stats-inner{display:flex;gap:40px;justify-content:center;flex-wrap:wrap}
        .stat-item{text-align:center}
        .stat-item .n{font-size:22px;font-weight:900;color:#ff6b00;letter-spacing:-.03em}
        .stat-item .l{font-size:12px;color:#888;margin-top:2px}
        /* Quick links */
        .quick{padding:36px 5vw 0;max-width:1100px;margin:0 auto}
        .quick h2{font-size:20px;font-weight:800;margin-bottom:16px;letter-spacing:-.02em}
        .quick-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-bottom:40px}
        .quick-card{background:#fff;border:1.5px solid #e5e5ea;border-radius:14px;padding:18px 14px;text-align:center;cursor:pointer;transition:all .18s;display:block}
        .quick-card:hover{border-color:#ff6b00;box-shadow:0 4px 16px rgba(255,107,0,.12);transform:translateY(-1px)}
        .quick-card .icon{font-size:28px;margin-bottom:8px}
        .quick-card .label{font-weight:700;font-size:13px;color:#1d1d1f}
        /* FAQ section */
        .faq-section{padding:0 5vw 48px;max-width:1100px;margin:0 auto}
        .faq-cat{background:#fff;border-radius:16px;border:1.5px solid #e5e5ea;margin-bottom:12px;overflow:hidden}
        .faq-cat-header{display:flex;align-items:center;gap:12px;padding:18px 20px;cursor:pointer;transition:background .15s;user-select:none}
        .faq-cat-header:hover{background:#fafafa}
        .faq-cat-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
        .faq-cat-name{font-weight:800;font-size:15px;flex:1}
        .faq-cat-count{font-size:12px;color:#999;font-weight:600;margin-right:8px}
        .faq-chevron{width:20px;height:20px;color:#aaa;transition:transform .2s}
        .faq-items{border-top:1px solid #f0f0f0}
        .faq-item{border-bottom:1px solid #f5f5f7}
        .faq-item:last-child{border-bottom:none}
        .faq-q{display:flex;align-items:flex-start;gap:10px;padding:14px 20px;cursor:pointer;font-weight:600;font-size:14px;transition:color .15s}
        .faq-q:hover{color:#ff6b00}
        .faq-q-icon{width:20px;height:20px;flex-shrink:0;color:#ccc;margin-top:1px;transition:transform .2s}
        .faq-a{padding:0 20px 16px 50px;font-size:14px;color:#555;line-height:1.7}
        /* Contact form */
        .contact-wrap{padding:0 5vw 64px;max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:32px}
        @media(max-width:700px){.contact-wrap{grid-template-columns:1fr}}
        .contact-left h2{font-size:clamp(20px,3vw,30px);font-weight:900;letter-spacing:-.04em;margin-bottom:10px}
        .contact-left p{color:#6e6e73;font-size:14px;line-height:1.7;margin-bottom:24px}
        .contact-channel{display:flex;align-items:center;gap:14px;padding:14px 16px;background:#fff;border-radius:12px;border:1.5px solid #e5e5ea;margin-bottom:10px;text-decoration:none;transition:border-color .15s}
        .contact-channel:hover{border-color:#ff6b00}
        .contact-channel-icon{width:36px;height:36px;border-radius:10px;background:#fff7ed;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
        .contact-channel-label{font-weight:700;font-size:14px}
        .contact-channel-sub{font-size:12px;color:#888;margin-top:2px}
        .form-card{background:#fff;border-radius:16px;border:1.5px solid #e5e5ea;padding:28px}
        .form-card h3{font-size:18px;font-weight:800;margin-bottom:20px;letter-spacing:-.02em}
        .form-row{margin-bottom:14px}
        .form-row label{display:block;font-size:12px;font-weight:700;color:#555;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em}
        .form-row input,.form-row select,.form-row textarea{width:100%;padding:10px 14px;border:1.5px solid #e5e5ea;border-radius:10px;font-size:14px;font-family:inherit;outline:none;transition:border-color .15s;background:#fff}
        .form-row input:focus,.form-row select:focus,.form-row textarea:focus{border-color:#ff6b00}
        .form-row textarea{height:110px;resize:vertical}
        .submit-btn{width:100%;background:#ff6b00;color:#fff;border:none;border-radius:10px;padding:13px;font-weight:700;font-size:15px;cursor:pointer;transition:opacity .15s;font-family:inherit}
        .submit-btn:hover{opacity:.88}
        .submit-btn:disabled{opacity:.55;cursor:not-allowed}
        .success-msg{text-align:center;padding:32px 20px}
        .success-msg .tick{font-size:48px;margin-bottom:12px}
        .success-msg h3{font-size:20px;font-weight:800;margin-bottom:8px}
        .success-msg p{color:#6e6e73;font-size:14px}
        /* Footer */
        footer{background:#1d1d1f;color:#aaa;padding:32px 5vw;text-align:center;font-size:13px}
        footer a{color:#888;margin:0 10px;transition:color .15s}
        footer a:hover{color:#ff6b00}
        .footer-copy{margin-top:16px;color:#555;font-size:12px}
        @media(max-width:640px){
          .hero{padding:40px 5vw 36px}
          .faq-section,.contact-wrap,.quick{padding-left:4vw;padding-right:4vw}
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">Hire<span>Hub</span><span style={{color:'#ff6b00',fontSize:'0.7em',fontWeight:900,verticalAlign:'super',marginLeft:1}}>360</span></a>
        <div className="nav-links">
          <a href="/">Jobs</a>
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/blog">Blog</a>
          <a href="/hirehub.html" style={{fontSize:13,fontWeight:600,color:'#3d3d3f',padding:'7px 14px',border:'1px solid #e5e5ea',borderRadius:8}}>Sign In</a>
          <a href="/post-job" className="btn-post">Post a Job</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <h1>HireHub360 <span>Support</span></h1>
        <p>Find answers instantly or reach our team. We typically respond within 2 hours.</p>
        <div className="search-box">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            type="text"
            placeholder="Search FAQs — e.g. 'how to apply', 'cancel plan', 'resume upload'…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* STATS */}
      <div className="stats-strip">
        <div className="stats-inner">
          <div className="stat-item"><span className="n">&lt;2 hrs</span><div className="l">Avg response time</div></div>
          <div className="stat-item"><span className="n">98%</span><div className="l">Satisfaction rate</div></div>
          <div className="stat-item"><span className="n">24/7</span><div className="l">Self-serve FAQs</div></div>
          <div className="stat-item"><span className="n">50+</span><div className="l">Help articles</div></div>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="quick">
        <h2>Browse by topic</h2>
        <div className="quick-grid">
          {FAQS.map(cat => (
            <a key={cat.category} href={`#${cat.category.replace(/\s+/g,'-').toLowerCase()}`} className="quick-card">
              <div className="icon">{cat.icon}</div>
              <div className="label">{cat.category}</div>
            </a>
          ))}
          <a href="#contact" className="quick-card">
            <div className="icon">✉️</div>
            <div className="label">Contact Us</div>
          </a>
        </div>

        {/* FAQ */}
        <div className="faq-section" style={{padding:0,maxWidth:'100%'}}>
          {filteredFaqs.length === 0 && (
            <div style={{textAlign:'center',padding:'48px 20px',color:'#888'}}>
              <div style={{fontSize:40,marginBottom:12}}>🔍</div>
              <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>No results found</div>
              <div style={{fontSize:14}}>Try different keywords, or <a href="#contact" style={{color:'#ff6b00',fontWeight:600}}>contact us</a> directly.</div>
            </div>
          )}
          {filteredFaqs.map(cat => (
            <div key={cat.category} id={cat.category.replace(/\s+/g,'-').toLowerCase()} className="faq-cat">
              <div className="faq-cat-header" onClick={() => setOpenCategory(c => c === cat.category ? null : cat.category)}>
                <div className="faq-cat-icon" style={{background:cat.color}}>{cat.icon}</div>
                <span className="faq-cat-name">{cat.category}</span>
                <span className="faq-cat-count">{cat.items.length} articles</span>
                <svg className="faq-chevron" style={{transform: openCategory === cat.category ? 'rotate(180deg)' : 'none'}} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
              </div>
              {(openCategory === cat.category || search.trim()) && (
                <div className="faq-items">
                  {cat.items.map((item, idx) => {
                    const key = `${cat.category}-${idx}`
                    return (
                      <div key={key} className="faq-item">
                        <div className="faq-q" onClick={() => toggleFaq(key)}>
                          <svg className="faq-q-icon" style={{transform: openFaq === key ? 'rotate(90deg)' : 'none', color: openFaq === key ? '#ff6b00' : '#ccc'}} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                          {item.q}
                        </div>
                        {openFaq === key && <div className="faq-a">{item.a}</div>}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <div id="contact" className="contact-wrap" style={{marginTop:40}}>
        <div className="contact-left">
          <h2>Still need help?</h2>
          <p>Our support team is available Monday–Saturday, 9 AM – 8 PM IST. We aim to reply within 2 business hours.</p>

          <a href="mailto:support@hirehub360.in" className="contact-channel">
            <div className="contact-channel-icon">📧</div>
            <div>
              <div className="contact-channel-label">Email Support</div>
              <div className="contact-channel-sub">support@hirehub360.in · reply in &lt;2 hrs</div>
            </div>
          </a>

          <a href="https://wa.me/919999999999" className="contact-channel">
            <div className="contact-channel-icon" style={{background:'#f0fdf4'}}>💬</div>
            <div>
              <div className="contact-channel-label">WhatsApp Chat</div>
              <div className="contact-channel-sub">Mon–Sat, 9 AM – 8 PM IST</div>
            </div>
          </a>

          <a href="mailto:billing@hirehub360.in" className="contact-channel">
            <div className="contact-channel-icon" style={{background:'#fdf4ff'}}>💳</div>
            <div>
              <div className="contact-channel-label">Billing Queries</div>
              <div className="contact-channel-sub">billing@hirehub360.in</div>
            </div>
          </a>

          <div className="contact-channel" style={{cursor:'default',borderStyle:'dashed'}}>
            <div className="contact-channel-icon" style={{background:'#f5f5f7'}}>🏢</div>
            <div>
              <div className="contact-channel-label">Enterprise Sales</div>
              <div className="contact-channel-sub">enterprise@hirehub360.in · dedicated account manager</div>
            </div>
          </div>
        </div>

        <div className="form-card">
          {submitted ? (
            <div className="success-msg">
              <div className="tick">✅</div>
              <h3>Message received!</h3>
              <p>We'll reply to <strong>{form.email}</strong> within 2 business hours.<br/>Check your spam folder if you don't hear from us.</p>
            </div>
          ) : (
            <>
              <h3>Send us a message</h3>
              <form onSubmit={handleSubmit}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div className="form-row">
                    <label>Your Name</label>
                    <input type="text" placeholder="Ravi Kumar" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required />
                  </div>
                  <div className="form-row">
                    <label>Email Address</label>
                    <input type="email" placeholder="ravi@email.com" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} required />
                  </div>
                </div>
                <div className="form-row">
                  <label>Topic</label>
                  <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}>
                    <option value="">Select a topic…</option>
                    <option>Job Application Issue</option>
                    <option>AI Tools</option>
                    <option>Account & Sign In</option>
                    <option>Billing & Plans</option>
                    <option>Employer / Posting Jobs</option>
                    <option>Bug Report</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Message</label>
                  <textarea placeholder="Describe your issue or question in detail…" value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))} required />
                </div>
                <button type="submit" className="submit-btn" disabled={sending}>
                  {sending ? 'Sending…' : 'Send Message →'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div>
          <a href="/">Home</a>
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/blog">Blog</a>
          <a href="/support">Support</a>
          <a href="/privacy">Privacy</a>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:10,margin:'16px 0'}}>
          <a href="https://www.linkedin.com/company/121424037/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            style={{width:36,height:36,borderRadius:8,background:'#0a66c2',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="https://www.facebook.com/hirehub360.in" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
            style={{width:36,height:36,borderRadius:8,background:'#1877f2',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://www.instagram.com/hirehub360" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
            style={{width:36,height:36,borderRadius:8,background:'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
          <a href="https://twitter.com/hirehub360" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
            style={{width:36,height:36,borderRadius:8,background:'#000',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="16" height="16" fill="#fff" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
        <div className="footer-copy">© 2025 HireHub360. Made with ❤️ in India.</div>
      </footer>
    </>
  )
}

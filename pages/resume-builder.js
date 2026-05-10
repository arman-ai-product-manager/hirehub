import Head from 'next/head'
import { useState } from 'react'

const YEARS_OPTIONS = ['Fresher', '1-2 yrs', '3-5 yrs', '5-10 yrs', '10+ yrs']

const EMPTY_EXP = { company: '', role: '', duration: '', achievement: '' }

function StepIndicator({ step }) {
  const steps = ['Your Details', 'AI Magic', 'Preview & Download']
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
      {steps.map((label, i) => {
        const num = i + 1
        const active = step === num
        const done = step > num
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: done ? '#ff6b00' : active ? '#ff6b00' : '#e5e5e5',
                color: done || active ? '#fff' : '#999',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 15, transition: 'all 0.3s',
              }}>
                {done ? '✓' : num}
              </div>
              <span style={{ fontSize: 12, color: active ? '#ff6b00' : done ? '#ff6b00' : '#999', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 60, height: 2, background: done ? '#ff6b00' : '#e5e5e5', margin: '0 8px', marginBottom: 22, transition: 'background 0.3s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1f' }}>
        {label}{required && <span style={{ color: '#ff6b00' }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          border: '1.5px solid #e5e5e5', borderRadius: 10, padding: '10px 14px',
          fontSize: 15, outline: 'none', fontFamily: 'inherit',
          transition: 'border-color 0.2s', background: '#fff',
        }}
        onFocus={e => e.target.style.borderColor = '#ff6b00'}
        onBlur={e => e.target.style.borderColor = '#e5e5e5'}
      />
    </div>
  )
}

function ResumePreview({ form, generated }) {
  const skills = generated.skills_formatted || form.skills
  const expList = generated.experience || (form.experience || []).map(e => ({
    company: e.company, role: e.role, duration: e.duration,
    bullets: [e.achievement].filter(Boolean),
  }))
  const edu = generated.education_formatted ||
    (form.education.degree ? `${form.education.degree}${form.education.college ? ', ' + form.education.college : ''}${form.education.year ? ' (${form.education.year})' : ''}` : '')

  return (
    <div className="resume-preview" style={{
      background: '#fff', padding: '40px 44px', maxWidth: 720, margin: '0 auto',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      boxShadow: '0 4px 32px rgba(0,0,0,0.12)', borderRadius: 4,
      lineHeight: 1.5,
    }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid #1d1d1f', paddingBottom: 16, marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.5px' }}>
          {form.name}
        </h1>
        <div style={{ fontSize: 15, color: '#ff6b00', fontWeight: 600, marginTop: 4 }}>{form.title}</div>
        <div style={{ marginTop: 8, fontSize: 13, color: '#555', display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
          {form.phone && <span>{form.phone}</span>}
          {form.email && <span>{form.email}</span>}
          {form.location && <span>{form.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {generated.summary && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 8px' }}>
            Professional Summary
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: '#333', lineHeight: 1.7 }}>{generated.summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 8px' }}>
            Skills
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: '#333', lineHeight: 1.7 }}>{skills}</p>
        </div>
      )}

      {/* Experience */}
      {expList.length > 0 && expList.some(e => e.company || e.role) && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 12px' }}>
            Work Experience
          </h2>
          {expList.filter(e => e.company || e.role).map((e, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#1d1d1f' }}>{e.role}</div>
                  <div style={{ fontSize: 13, color: '#555', fontStyle: 'italic' }}>{e.company}</div>
                </div>
                {e.duration && <div style={{ fontSize: 13, color: '#777' }}>{e.duration}</div>}
              </div>
              {e.bullets && e.bullets.length > 0 && (
                <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
                  {e.bullets.filter(Boolean).map((b, j) => (
                    <li key={j} style={{ fontSize: 14, color: '#333', marginBottom: 4, lineHeight: 1.6 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {edu && (
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 8px' }}>
            Education
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: '#333' }}>{edu}</p>
        </div>
      )}
    </div>
  )
}

export default function ResumeBuilder() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', phone: '', location: '',
    title: '', years: 'Fresher', skills: '', summary: '',
    experience: [{ ...EMPTY_EXP }],
    education: { degree: '', college: '', year: '' },
  })

  const [generated, setGenerated] = useState({})

  function setField(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function setExp(i, key, val) {
    setForm(f => {
      const exp = [...f.experience]
      exp[i] = { ...exp[i], [key]: val }
      return { ...f, experience: exp }
    })
  }

  function addExp() {
    if (form.experience.length < 3) {
      setForm(f => ({ ...f, experience: [...f.experience, { ...EMPTY_EXP }] }))
    }
  }

  function removeExp(i) {
    setForm(f => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }))
  }

  async function handleGenerate(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setStep(2)

    try {
      const res = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setGenerated(data)
      setStep(3)
    } catch (err) {
      setError(err.message)
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  async function handleCopy() {
    const skills = generated.skills_formatted || form.skills
    const expText = (generated.experience || form.experience.map(e => ({
      company: e.company, role: e.role, duration: e.duration, bullets: [e.achievement],
    }))).filter(e => e.company || e.role).map(e =>
      `${e.role} | ${e.company} | ${e.duration}\n${(e.bullets || []).filter(Boolean).map(b => '• ' + b).join('\n')}`
    ).join('\n\n')

    const text = `${form.name}
${form.title}
${[form.phone, form.email, form.location].filter(Boolean).join(' | ')}

PROFESSIONAL SUMMARY
${generated.summary || ''}

SKILLS
${skills}

WORK EXPERIENCE
${expText}

EDUCATION
${generated.education_formatted || ''}
    `.trim()

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
    }
  }

  const inputStyle = {
    border: '1.5px solid #e5e5e5', borderRadius: 10, padding: '10px 14px',
    fontSize: 15, outline: 'none', fontFamily: 'inherit', width: '100%',
    boxSizing: 'border-box', background: '#fff',
  }

  const labelStyle = { fontSize: 13, fontWeight: 600, color: '#1d1d1f', display: 'block', marginBottom: 6 }

  const sectionHead = { fontSize: 17, fontWeight: 700, color: '#1d1d1f', margin: '32px 0 16px', borderBottom: '1.5px solid #f0f0f0', paddingBottom: 8 }

  return (
    <>
      <Head>
        <title>Free AI Resume Builder India 2026 | HireHub360</title>
        <meta name="description" content="Create a professional resume in 2 minutes with AI. Free resume builder for freshers, experienced professionals. Download as PDF instantly." />
        <meta name="keywords" content="free resume builder india, AI resume builder, resume maker online, resume builder for freshers, PDF resume download" />
        <meta property="og:title" content="Free AI Resume Builder India 2026 | HireHub360" />
        <meta property="og:description" content="Create a professional resume in 2 minutes with AI. Free for everyone." />
        <meta property="og:url" content="https://hirehub360.in/resume-builder" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=Free+AI+Resume+Builder+India+2026&s=Create+a+professional+resume+in+2+minutes+%E2%80%94+free+for+everyone" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="HireHub360" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hirehub360.in/resume-builder" />
        <style>{`
          @media print {
            nav, .no-print { display: none !important; }
            body { background: #fff !important; }
            .resume-preview { box-shadow: none !important; border-radius: 0 !important; }
          }
          * { box-sizing: border-box; }
        `}</style>
      </Head>

      {/* Nav */}
      <nav className="no-print" style={{
        background: '#fff', borderBottom: '1px solid #f0f0f0',
        padding: '0 24px', height: 56, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        <a href="/" style={{ textDecoration: 'none', color: '#1d1d1f', fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
          HireHub<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: 11 }}>360</sup>
        </a>
        <a href="/hirehub.html" style={{
          background: '#ff6b00', color: '#fff', padding: '7px 18px', borderRadius: 20,
          textDecoration: 'none', fontSize: 13, fontWeight: 600,
        }}>
          Find Jobs →
        </a>
      </nav>

      <div style={{ background: '#f5f5f7', minHeight: 'calc(100vh - 56px)', padding: '40px 16px 80px' }}>

        {/* Hero */}
        <div className="no-print" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-block', background: '#fff3e8', color: '#ff6b00',
            fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', padding: '5px 14px',
            borderRadius: 20, marginBottom: 16, textTransform: 'uppercase',
          }}>
            Free · No Sign-up · AI-Powered
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 800, color: '#1d1d1f', margin: '0 0 12px', letterSpacing: '-1px' }}>
            Build Your Resume with AI
          </h1>
          <p style={{ fontSize: 16, color: '#555', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Fill in your details. Our AI writes the professional content. Download as PDF in 2 minutes. Free forever.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="no-print" style={{ maxWidth: 720, margin: '0 auto 32px' }}>
          <StepIndicator step={step} />
        </div>

        {/* Step 1 — Form */}
        {step === 1 && (
          <form onSubmit={handleGenerate} style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>

              <h2 style={sectionHead}>Personal Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Full Name <span style={{ color: '#ff6b00' }}>*</span></label>
                  <input required value={form.name} onChange={e => setField('name', e.target.value)}
                    placeholder="e.g. Priya Sharma" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#ff6b00'}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
                </div>
                <div>
                  <label style={labelStyle}>Email <span style={{ color: '#ff6b00' }}>*</span></label>
                  <input required type="email" value={form.email} onChange={e => setField('email', e.target.value)}
                    placeholder="priya@example.com" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#ff6b00'}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setField('phone', e.target.value)}
                    placeholder="+91 98765 43210" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#ff6b00'}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input value={form.location} onChange={e => setField('location', e.target.value)}
                    placeholder="Bangalore, India" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#ff6b00'}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
                </div>
              </div>

              <h2 style={sectionHead}>Career Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Current / Target Role <span style={{ color: '#ff6b00' }}>*</span></label>
                  <input required value={form.title} onChange={e => setField('title', e.target.value)}
                    placeholder="e.g. Software Engineer" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#ff6b00'}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
                </div>
                <div>
                  <label style={labelStyle}>Years of Experience</label>
                  <select value={form.years} onChange={e => setField('years', e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}>
                    {YEARS_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={labelStyle}>Skills <span style={{ color: '#999', fontWeight: 400 }}>(comma-separated)</span></label>
                <input value={form.skills} onChange={e => setField('skills', e.target.value)}
                  placeholder="React, Node.js, SQL, Figma, Python..." style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#ff6b00'}
                  onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={labelStyle}>
                  Summary / About <span style={{ color: '#999', fontWeight: 400 }}>(optional — AI writes one if empty)</span>
                </label>
                <textarea value={form.summary} onChange={e => setField('summary', e.target.value)}
                  placeholder="Brief intro about yourself, your strengths, what you're looking for..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = '#ff6b00'}
                  onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
              </div>

              {/* Work Experience */}
              <h2 style={sectionHead}>Work Experience</h2>
              {form.experience.map((exp, i) => (
                <div key={i} style={{
                  background: '#fafafa', border: '1.5px solid #ececec',
                  borderRadius: 12, padding: '20px 18px', marginBottom: 16, position: 'relative',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#ff6b00' }}>Experience {i + 1}</span>
                    {i > 0 && (
                      <button type="button" onClick={() => removeExp(i)}
                        style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1 }}>
                        ×
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                    <div>
                      <label style={{ ...labelStyle, marginBottom: 4 }}>Company Name</label>
                      <input value={exp.company} onChange={e => setExp(i, 'company', e.target.value)}
                        placeholder="e.g. Razorpay" style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#ff6b00'}
                        onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, marginBottom: 4 }}>Your Role</label>
                      <input value={exp.role} onChange={e => setExp(i, 'role', e.target.value)}
                        placeholder="e.g. Software Engineer" style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#ff6b00'}
                        onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, marginBottom: 4 }}>Duration</label>
                      <input value={exp.duration} onChange={e => setExp(i, 'duration', e.target.value)}
                        placeholder="e.g. Jun 2022 – Present" style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#ff6b00'}
                        onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <label style={{ ...labelStyle, marginBottom: 4 }}>Key Achievement / Responsibility</label>
                    <input value={exp.achievement} onChange={e => setExp(i, 'achievement', e.target.value)}
                      placeholder="e.g. Reduced API latency by 40%, built payment flow used by 1M+ users"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#ff6b00'}
                      onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
                  </div>
                </div>
              ))}
              {form.experience.length < 3 && (
                <button type="button" onClick={addExp}
                  style={{
                    background: 'none', border: '1.5px dashed #ccc', borderRadius: 10,
                    padding: '10px 20px', color: '#777', cursor: 'pointer', fontSize: 14,
                    width: '100%', marginBottom: 8,
                  }}>
                  + Add Another Experience
                </button>
              )}

              {/* Education */}
              <h2 style={sectionHead}>Education</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Degree / Qualification</label>
                  <input value={form.education.degree} onChange={e => setForm(f => ({ ...f, education: { ...f.education, degree: e.target.value } }))}
                    placeholder="e.g. B.Tech Computer Science" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#ff6b00'}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
                </div>
                <div>
                  <label style={labelStyle}>College / University</label>
                  <input value={form.education.college} onChange={e => setForm(f => ({ ...f, education: { ...f.education, college: e.target.value } }))}
                    placeholder="e.g. IIT Bombay" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#ff6b00'}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
                </div>
                <div>
                  <label style={labelStyle}>Graduation Year</label>
                  <input value={form.education.year} onChange={e => setForm(f => ({ ...f, education: { ...f.education, year: e.target.value } }))}
                    placeholder="e.g. 2023" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#ff6b00'}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
                </div>
              </div>

              {error && (
                <div style={{ marginTop: 20, padding: '12px 16px', background: '#fff0f0', borderRadius: 10, color: '#c00', fontSize: 14 }}>
                  {error}
                </div>
              )}

              <button type="submit" style={{
                marginTop: 32, width: '100%', background: '#ff6b00', color: '#fff',
                border: 'none', borderRadius: 12, padding: '15px', fontSize: 17,
                fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.3px',
                boxShadow: '0 4px 16px rgba(255,107,0,0.35)',
              }}>
                Generate My Resume with AI →
              </button>
              <p style={{ textAlign: 'center', fontSize: 13, color: '#999', marginTop: 12 }}>
                Free · No account needed · Takes ~10 seconds
              </p>
            </div>
          </form>
        )}

        {/* Step 2 — Loading */}
        {step === 2 && (
          <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', padding: '60px 24px' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b00, #ff9500)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px', fontSize: 32,
              animation: 'spin 1.5s linear infinite',
            }}>
              ✨
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1d1d1f', margin: '0 0 12px' }}>
              AI is writing your resume...
            </h2>
            <p style={{ color: '#777', fontSize: 15, lineHeight: 1.7 }}>
              Crafting your professional summary, enhancing work bullets with quantified achievements, and formatting your skills section.
            </p>
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              {['Writing professional summary...', 'Enhancing work experience bullets...', 'Formatting skills section...'].map((t, i) => (
                <div key={i} style={{ fontSize: 14, color: '#aaa', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff6b00', opacity: loading ? 1 : 0.3 }} />
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Preview + Download */}
        {step === 3 && (
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {/* Action bar */}
            <div className="no-print" style={{
              display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center',
              marginBottom: 28, padding: '0 8px',
            }}>
              <button onClick={handlePrint} style={{
                background: '#1d1d1f', color: '#fff', border: 'none', borderRadius: 10,
                padding: '11px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                ⬇ Download PDF
              </button>
              <button onClick={handleCopy} style={{
                background: copied ? '#22c55e' : '#fff', color: copied ? '#fff' : '#1d1d1f',
                border: '1.5px solid #e5e5e5', borderRadius: 10,
                padding: '11px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
              }}>
                {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
              </button>
              <button onClick={() => { setStep(1); setGenerated({}) }} style={{
                background: '#f5f5f7', color: '#555', border: 'none', borderRadius: 10,
                padding: '11px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}>
                ✏ Edit Details
              </button>
              <a href="/hirehub.html" style={{
                background: '#ff6b00', color: '#fff', textDecoration: 'none',
                borderRadius: 10, padding: '11px 24px', fontSize: 15, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                🚀 Create Profile on HireHub360
              </a>
            </div>

            {/* Resume */}
            <ResumePreview form={form} generated={generated} />

            {/* Bottom CTA */}
            <div className="no-print" style={{
              marginTop: 40, background: '#fff', borderRadius: 16, padding: '28px 24px',
              textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
            }}>
              <h3 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 700, color: '#1d1d1f' }}>
                Resume ready? Now get hired faster.
              </h3>
              <p style={{ color: '#555', fontSize: 15, marginBottom: 20, lineHeight: 1.6 }}>
                Create your public HireHub360 profile and let companies come to you. AI-matched jobs, instant apply.
              </p>
              <a href="/hirehub.html" style={{
                display: 'inline-block', background: '#ff6b00', color: '#fff',
                padding: '13px 32px', borderRadius: 30, textDecoration: 'none',
                fontWeight: 700, fontSize: 16, boxShadow: '0 4px 16px rgba(255,107,0,0.35)',
              }}>
                Find Jobs on HireHub360 →
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="no-print" style={{
        background: '#1d1d1f', color: '#999', textAlign: 'center',
        padding: '24px 16px', fontSize: 13,
      }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: '#fff', fontWeight: 700 }}>HireHub<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: 10 }}>360</sup></span>
          {' '}— India's AI-Powered Job Platform
        </div>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Jobs</a>
          <a href="/features" style={{ color: '#999', textDecoration: 'none' }}>Features</a>
          <a href="/pricing" style={{ color: '#999', textDecoration: 'none' }}>Pricing</a>
          <a href="/blog" style={{ color: '#999', textDecoration: 'none' }}>Blog</a>
          <a href="/privacy.js" style={{ color: '#999', textDecoration: 'none' }}>Privacy</a>
        </div>
      </footer>
    </>
  )
}

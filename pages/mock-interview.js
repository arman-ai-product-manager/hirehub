import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'

const ROLES = ['Software Engineer','Product Manager','Data Scientist','Sales Executive','Marketing Manager','HR Executive','Finance Analyst','UI/UX Designer','DevOps Engineer','Business Analyst']
const EXP   = ['Fresher (0-1 yr)','Junior (1-3 yrs)','Mid-level (3-6 yrs)','Senior (6-10 yrs)','Lead / Manager (10+ yrs)']

const CAT_COLORS = {
  'Behavioral':   { bg:'#dbeafe', color:'#1d4ed8' },
  'Technical':    { bg:'#dcfce7', color:'#166534' },
  'Situational':  { bg:'#fef9c3', color:'#854d0e' },
  'HR / Cultural':{ bg:'#f3e8ff', color:'#6d28d9' },
}

const DEMO_QUESTIONS = [
  { q:'Tell me about yourself and your background.', category:'HR / Cultural' },
  { q:'Describe a time you handled a difficult deadline. What did you do?', category:'Behavioral' },
  { q:'Where do you see yourself in 5 years?', category:'HR / Cultural' },
  { q:'Tell me about a project you are most proud of.', category:'Behavioral' },
  { q:'How do you prioritize tasks when everything seems urgent?', category:'Situational' },
]

function ScoreRing({ score }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444'
  return (
    <div style={{ position:'relative', width:80, height:80, flexShrink:0 }}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="7"/>
        <circle cx="40" cy="40" r="34" fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${2*Math.PI*34}`}
          strokeDashoffset={`${2*Math.PI*34*(1-score/100)}`}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          style={{ transition:'stroke-dashoffset .6s' }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:17, fontWeight:800, color }}>{score}</span>
      </div>
    </div>
  )
}

export default function MockInterview() {
  // Setup state
  const [step, setStep]       = useState('setup') // setup | loading-qs | interview | summary
  const [role, setRole]       = useState('')
  const [exp, setExp]         = useState(EXP[2])
  const [jd, setJd]           = useState('')
  const [customRole, setCustomRole] = useState('')

  // Interview state
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answer, setAnswer]   = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [results, setResults] = useState([]) // [{question, answer, ...evaluation}]
  const [showSample, setShowSample] = useState(false)
  const [timer, setTimer]     = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const timerRef              = useRef(null)
  const textRef               = useRef(null)

  // Load questions from interview-prep API
  const startInterview = async () => {
    const r = role || customRole
    if (!r) return
    setStep('loading-qs')
    try {
      const resp = await fetch('/api/interview/prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: r, experience: exp, jd }),
      })
      const data = await resp.json()
      if (!resp.ok || !data.ok) {
        // Fall back to demo questions
        setQuestions(DEMO_QUESTIONS)
      } else {
        const qs = (data.rounds || []).flatMap(rd => rd.questions || []).slice(0, 8)
        setQuestions(qs.length ? qs : DEMO_QUESTIONS)
      }
      setCurrent(0); setResults([]); setAnswer('')
      setStep('interview')
      setTimeout(() => textRef.current?.focus(), 100)
    } catch {
      setQuestions(DEMO_QUESTIONS)
      setCurrent(0); setResults([]); setAnswer('')
      setStep('interview')
    }
  }

  // Timer
  useEffect(() => {
    if (step !== 'interview') return
    setTimer(0)
    setTimerActive(true)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [current, step])

  const submitAnswer = async () => {
    if (!answer.trim() || evaluating) return
    setEvaluating(true)
    clearInterval(timerRef.current)
    setTimerActive(false)
    const q = questions[current]
    const r = role || customRole
    try {
      const resp = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q.q || q.question, answer, role: r, category: q.category, jd }),
      })
      const data = await resp.json()
      const evaluation = resp.ok && data.ok ? data : { score:50, grade:'C', verdict:'Could not evaluate — AI error.', strengths:[], improvements:[], missing:[], sample_answer:'', follow_up:'', coaching_tip:'' }
      setResults(prev => [...prev, { question: q.q || q.question, category: q.category, answer, timeTaken: timer, ...evaluation }])
      setShowSample(false)
    } catch {
      setResults(prev => [...prev, { question: q.q || q.question, category: q.category, answer, timeTaken: timer, score:50, grade:'C', verdict:'Network error.', strengths:[], improvements:[], missing:[], sample_answer:'', follow_up:'', coaching_tip:'' }])
    }
    setEvaluating(false)
  }

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      clearInterval(timerRef.current)
      setStep('summary')
    } else {
      setCurrent(c => c + 1)
      setAnswer('')
      setShowSample(false)
      setTimeout(() => textRef.current?.focus(), 80)
    }
  }

  const restart = () => {
    setStep('setup'); setRole(''); setJd(''); setCustomRole('')
    setQuestions([]); setCurrent(0); setResults([]); setAnswer('')
  }

  const currentResult = results[current]
  const avgScore      = results.length ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length) : 0
  const gradeColor    = s => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : s >= 40 ? '#f97316' : '#ef4444'

  const fmtTime = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  return (
    <>
      <Head>
        <title>AI Mock Interview — Practice & Get Instant Feedback | HireHub360</title>
        <meta name="description" content="Practice interviews with AI. Answer real questions, get scored instantly with strengths, gaps, and an ideal sample answer. Free AI mock interview tool." />
        <link rel="canonical" href="https://hirehub360.in/mock-interview" />
        <meta property="og:title" content="AI Mock Interview | HireHub360" />
        <meta property="og:description" content="Practice interviews with AI. Instant score, strengths, gaps & sample answers." />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=AI+Mock+Interview&s=Practice+%E2%86%92+Get+instant+AI+feedback" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, system-ui; background: #f5f5f7; }
        .input { width:100%; padding:11px 14px; border-radius:10px; border:1px solid #d1d5db; font-size:14px; font-family:inherit; outline:none; transition:border-color .15s; }
        .input:focus { border-color:#6d28d9; box-shadow:0 0 0 3px rgba(109,40,217,.1); }
        .chip { padding:8px 14px; border-radius:24px; border:1.5px solid #e5e7eb; background:#fff; font-size:13px; cursor:pointer; }
        .chip.on { background:#1d1d1f; color:#fff; border-color:#1d1d1f; }
        .role-chip { padding:7px 14px; border-radius:20px; border:1.5px solid #e5e7eb; background:#fff; font-size:13px; cursor:pointer; font-weight:500; }
        .role-chip.on { background:#6d28d9; color:#fff; border-color:#6d28d9; }
        @media(max-width:660px){ .setup-grid { grid-template-columns:1fr !important; } }
      `}</style>

      <nav style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 }}>
        <a href="/" style={{ textDecoration:'none', fontSize:18, fontWeight:800, color:'#1d1d1f' }}>HireHub<span style={{ color:'#ff6b00' }}>Hub</span><sup style={{ fontSize:10 }}>360</sup></a>
        <div style={{ display:'flex', gap:14 }}>
          <a href="/interview-prep" style={{ textDecoration:'none', fontSize:13, color:'#666' }}>Interview Prep</a>
          <a href="/cover-letter"   style={{ textDecoration:'none', fontSize:13, color:'#666' }}>Cover Letter</a>
          <a href="/post-job" style={{ background:'#ff6b00', color:'#fff', textDecoration:'none', padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:600 }}>Post Job</a>
        </div>
      </nav>

      {/* SETUP */}
      {step === 'setup' && (
        <>
          <div style={{ background:'linear-gradient(135deg, #1d1d1f 0%, #3b0764 100%)', padding:'50px 24px', textAlign:'center', color:'#fff' }}>
            <div style={{ display:'inline-block', background:'rgba(109,40,217,.35)', borderRadius:20, padding:'5px 16px', fontSize:13, fontWeight:600, marginBottom:14 }}>🎙 AI-Powered · Real-time Feedback · Free</div>
            <h1 style={{ margin:'0 0 12px', fontSize:36, fontWeight:800 }}>AI Mock Interview</h1>
            <p style={{ margin:0, fontSize:16, color:'rgba(255,255,255,.8)' }}>Answer real interview questions. Get instant scoring, strengths, gaps & ideal answers.</p>
          </div>

          <div style={{ maxWidth:700, margin:'0 auto', padding:'32px 20px 80px' }}>
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:28 }}>
              <div style={{ marginBottom:20 }}>
                <p style={{ margin:'0 0 10px', fontSize:12, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'.4px' }}>Pick a Role</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {ROLES.map(r => (
                    <button key={r} onClick={() => { setRole(r); setCustomRole('') }} className={`role-chip ${role === r ? 'on' : ''}`}>{r}</button>
                  ))}
                </div>
                <div style={{ display:'flex', gap:10, marginTop:10, alignItems:'center' }}>
                  <span style={{ fontSize:13, color:'#888', whiteSpace:'nowrap' }}>or type:</span>
                  <input className="input" value={customRole} onChange={e => { setCustomRole(e.target.value); setRole('') }} placeholder="e.g. Data Engineer, Growth Marketer…" style={{ flex:1 }}/>
                </div>
              </div>

              <div style={{ marginBottom:20 }}>
                <p style={{ margin:'0 0 10px', fontSize:12, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'.4px' }}>Experience Level</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {EXP.map(e => (
                    <button key={e} onClick={() => setExp(e)} className={`chip ${exp === e ? 'on' : ''}`}>{e}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:24 }}>
                <p style={{ margin:'0 0 6px', fontSize:12, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'.4px' }}>Paste Job Description (optional — makes questions more relevant)</p>
                <textarea className="input" value={jd} onChange={e => setJd(e.target.value)} rows={4}
                  placeholder="Paste the JD here for tailored questions…" style={{ resize:'vertical' }}/>
              </div>

              <button onClick={startInterview} disabled={!role && !customRole.trim()} style={{ width:'100%', background: (!role && !customRole.trim()) ? '#9ca3af' : 'linear-gradient(135deg, #1d1d1f, #3b0764)', color:'#fff', border:'none', padding:'15px', borderRadius:12, fontSize:16, fontWeight:700, cursor: (!role && !customRole.trim()) ? 'not-allowed' : 'pointer' }}>
                🎙 Start Mock Interview
              </button>
              <p style={{ margin:'12px 0 0', fontSize:12, color:'#888', textAlign:'center' }}>8 questions · ~15 minutes · instant AI feedback after each answer</p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:20 }}>
              {[{ icon:'🎯', title:'Real Questions', desc:'AI generates role-specific questions from your JD' },
                { icon:'⚡', title:'Instant Scoring', desc:'0-100 score + strengths + gaps + sample answer' },
                { icon:'📊', title:'Full Report', desc:'Session summary with average score and top tips' }].map((f,i) => (
                <div key={i} style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, padding:'14px 16px', textAlign:'center' }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>{f.icon}</div>
                  <p style={{ margin:'0 0 4px', fontSize:13, fontWeight:700 }}>{f.title}</p>
                  <p style={{ margin:0, fontSize:12, color:'#888', lineHeight:1.5 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* LOADING QUESTIONS */}
      {step === 'loading-qs' && (
        <div style={{ minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
          <div style={{ fontSize:48 }}>🧠</div>
          <p style={{ fontSize:18, fontWeight:700, color:'#1d1d1f', margin:0 }}>Preparing your interview…</p>
          <p style={{ fontSize:14, color:'#666', margin:0 }}>Generating tailored questions{role || customRole ? ` for ${role || customRole}` : ''}…</p>
          <div style={{ width:200, height:4, background:'#e5e7eb', borderRadius:4, overflow:'hidden' }}>
            <div style={{ height:'100%', background:'linear-gradient(90deg, #6d28d9, #a855f7)', borderRadius:4, animation:'prog 1.5s ease-in-out infinite' }}/>
          </div>
          <style>{`@keyframes prog { 0%{width:10%} 50%{width:80%} 100%{width:10%} }`}</style>
        </div>
      )}

      {/* INTERVIEW */}
      {step === 'interview' && questions.length > 0 && (
        <div style={{ maxWidth:820, margin:'0 auto', padding:'24px 20px 80px' }}>
          {/* Progress bar */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
            <span style={{ fontSize:13, fontWeight:600, color:'#888', whiteSpace:'nowrap' }}>Q {current+1}/{questions.length}</span>
            <div style={{ flex:1, height:6, background:'#e5e7eb', borderRadius:4 }}>
              <div style={{ height:'100%', background:'linear-gradient(90deg, #6d28d9, #a855f7)', borderRadius:4, width:`${((current + (currentResult?1:0))/questions.length)*100}%`, transition:'width .3s' }}/>
            </div>
            <span style={{ fontSize:13, fontWeight:600, color:'#888', whiteSpace:'nowrap', fontVariantNumeric:'tabular-nums' }}>{fmtTime(timer)}</span>
          </div>

          {/* Question card */}
          <div style={{ background:'linear-gradient(135deg, #1d1d1f, #3b0764)', borderRadius:14, padding:'28px 28px 24px', color:'#fff', marginBottom:16 }}>
            {questions[current]?.category && (() => {
              const c = CAT_COLORS[questions[current].category] || { bg:'#f3f4f6', color:'#374151' }
              return <span style={{ display:'inline-block', background:c.bg, color:c.color, padding:'3px 12px', borderRadius:20, fontSize:12, fontWeight:700, marginBottom:12 }}>{questions[current].category}</span>
            })()}
            <p style={{ margin:0, fontSize:19, fontWeight:700, lineHeight:1.5 }}>
              {questions[current]?.q || questions[current]?.question}
            </p>
            {!currentResult && questions[current]?.tip && (
              <p style={{ margin:'10px 0 0', fontSize:13, color:'rgba(255,255,255,.55)' }}>💡 {questions[current].tip}</p>
            )}
          </div>

          {/* Answer area — shown only if not yet evaluated */}
          {!currentResult && (
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:'20px', marginBottom:16 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#555', textTransform:'uppercase', marginBottom:8 }}>Your Answer</label>
              <textarea ref={textRef} value={answer} onChange={e => setAnswer(e.target.value)}
                rows={6} placeholder="Type your answer here… Take your time, speak naturally."
                style={{ width:'100%', padding:'12px 14px', borderRadius:10, border:'1px solid #d1d5db', fontSize:15, fontFamily:'inherit', outline:'none', resize:'vertical', lineHeight:1.7 }}
                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submitAnswer() }}
              />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
                <span style={{ fontSize:12, color:'#aaa' }}>Ctrl+Enter to submit · {answer.length} chars</span>
                <button onClick={submitAnswer} disabled={evaluating || answer.trim().length < 10}
                  style={{ background: evaluating ? '#9ca3af' : 'linear-gradient(135deg, #6d28d9, #a855f7)', color:'#fff', border:'none', padding:'11px 24px', borderRadius:10, fontSize:14, fontWeight:700, cursor: evaluating ? 'wait' : 'pointer' }}>
                  {evaluating ? '🧠 Evaluating…' : 'Submit Answer →'}
                </button>
              </div>
            </div>
          )}

          {/* Evaluation result */}
          {currentResult && (
            <div style={{ marginBottom:16 }}>
              {/* Score card */}
              <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:'20px 24px', marginBottom:12 }}>
                <div style={{ display:'flex', gap:18, alignItems:'flex-start', marginBottom:14 }}>
                  <ScoreRing score={currentResult.score}/>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:8, marginBottom:6, alignItems:'center' }}>
                      <span style={{ background: gradeColor(currentResult.score) + '20', color: gradeColor(currentResult.score), padding:'2px 12px', borderRadius:20, fontWeight:700, fontSize:14 }}>Grade {currentResult.grade}</span>
                      <span style={{ fontSize:13, color:'#888' }}>⏱ {fmtTime(currentResult.timeTaken)}</span>
                    </div>
                    <p style={{ margin:0, fontSize:15, fontWeight:600, color:'#1d1d1f', lineHeight:1.5 }}>{currentResult.verdict}</p>
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                  {currentResult.strengths?.length > 0 && (
                    <div style={{ background:'#f0fdf4', borderRadius:10, padding:'12px 14px' }}>
                      <p style={{ margin:'0 0 6px', fontSize:12, fontWeight:700, color:'#166534', textTransform:'uppercase' }}>✓ Strengths</p>
                      <ul style={{ margin:0, paddingLeft:16, fontSize:13, color:'#166534', lineHeight:1.7 }}>
                        {currentResult.strengths.map((s,i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {currentResult.improvements?.length > 0 && (
                    <div style={{ background:'#fff7ed', borderRadius:10, padding:'12px 14px' }}>
                      <p style={{ margin:'0 0 6px', fontSize:12, fontWeight:700, color:'#9a3412', textTransform:'uppercase' }}>↑ Improve</p>
                      <ul style={{ margin:0, paddingLeft:16, fontSize:13, color:'#9a3412', lineHeight:1.7 }}>
                        {currentResult.improvements.map((s,i) => <li key={i}>{s}</li>)}
                        {currentResult.missing?.map((s,i) => <li key={'m'+i}>Mention: {s}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                {currentResult.coaching_tip && (
                  <div style={{ background:'#f8f7ff', border:'1px solid #ddd6fe', borderRadius:10, padding:'10px 14px', marginBottom:14 }}>
                    <p style={{ margin:0, fontSize:13, color:'#4c1d95' }}>💡 <strong>Tip:</strong> {currentResult.coaching_tip}</p>
                  </div>
                )}

                {/* Sample answer toggle */}
                <div>
                  <button onClick={() => setShowSample(s => !s)} style={{ background:'none', border:'1px solid #d1d5db', borderRadius:8, padding:'8px 14px', fontSize:13, fontWeight:600, cursor:'pointer', color:'#555' }}>
                    {showSample ? '▲ Hide' : '▼ Show'} ideal answer
                  </button>
                  {showSample && currentResult.sample_answer && (
                    <div style={{ background:'#fafafa', borderRadius:10, padding:'14px', marginTop:10, fontSize:14, lineHeight:1.75, color:'#333', fontStyle:'italic' }}>
                      {currentResult.sample_answer}
                    </div>
                  )}
                </div>
              </div>

              {/* Follow-up teaser */}
              {currentResult.follow_up && current + 1 < questions.length && (
                <div style={{ background:'#fff', border:'1px dashed #c4b5fd', borderRadius:10, padding:'12px 16px', marginBottom:12, display:'flex', gap:10, alignItems:'flex-start' }}>
                  <span style={{ fontSize:18 }}>🔮</span>
                  <div>
                    <p style={{ margin:'0 0 2px', fontSize:12, fontWeight:700, color:'#6d28d9', textTransform:'uppercase' }}>Likely follow-up</p>
                    <p style={{ margin:0, fontSize:14, color:'#1d1d1f' }}>{currentResult.follow_up}</p>
                  </div>
                </div>
              )}

              <button onClick={nextQuestion} style={{ width:'100%', background:'linear-gradient(135deg, #1d1d1f, #3b0764)', color:'#fff', border:'none', padding:'14px', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer' }}>
                {current + 1 >= questions.length ? '🏁 See Final Report →' : `Next Question →`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUMMARY */}
      {step === 'summary' && (
        <div style={{ maxWidth:760, margin:'0 auto', padding:'32px 20px 80px' }}>
          {/* Overall score */}
          <div style={{ background:'linear-gradient(135deg, #1d1d1f, #3b0764)', borderRadius:14, padding:'32px 28px', color:'#fff', textAlign:'center', marginBottom:20 }}>
            <p style={{ margin:'0 0 4px', fontSize:14, color:'rgba(255,255,255,.7)', textTransform:'uppercase', fontWeight:600 }}>Your Score</p>
            <p style={{ margin:'0 0 8px', fontSize:56, fontWeight:800, lineHeight:1, color: avgScore >= 80 ? '#34d399' : avgScore >= 60 ? '#fbbf24' : '#fb923c' }}>{avgScore}</p>
            <p style={{ margin:'0 0 16px', fontSize:17, color:'rgba(255,255,255,.85)' }}>
              {avgScore >= 80 ? '🏆 Excellent performance!' : avgScore >= 65 ? '🎯 Good — a few areas to polish' : avgScore >= 50 ? '📈 Decent — keep practicing' : '💪 Room to grow — review the tips below'}
            </p>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={restart} style={{ background:'rgba(255,255,255,.15)', color:'#fff', border:'1px solid rgba(255,255,255,.3)', padding:'10px 20px', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>🔄 Practice Again</button>
              <a href="/" style={{ background:'#ff6b00', color:'#fff', textDecoration:'none', padding:'10px 20px', borderRadius:10, fontSize:14, fontWeight:700 }}>Browse Jobs →</a>
            </div>
          </div>

          {/* Question-by-question review */}
          <h2 style={{ margin:'0 0 14px', fontSize:18, fontWeight:800 }}>Question-by-question review</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {results.map((r, i) => (
              <div key={i} style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'18px 20px' }}>
                <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                  <ScoreRing score={r.score}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                      <span style={{ fontWeight:700, fontSize:12, color:'#888' }}>Q{i+1}</span>
                      {r.category && <span style={{ fontSize:11, background: (CAT_COLORS[r.category]||{}).bg||'#f3f4f6', color: (CAT_COLORS[r.category]||{}).color||'#555', padding:'2px 8px', borderRadius:10, fontWeight:600 }}>{r.category}</span>}
                      <span style={{ fontSize:11, color:'#aaa' }}>⏱ {fmtTime(r.timeTaken)}</span>
                    </div>
                    <p style={{ margin:'0 0 6px', fontSize:14, fontWeight:600, color:'#1d1d1f', lineHeight:1.45 }}>{r.question}</p>
                    <p style={{ margin:'0 0 6px', fontSize:13, color:'#555', lineHeight:1.5 }}>{r.verdict}</p>
                    {r.coaching_tip && <p style={{ margin:0, fontSize:12, color:'#6d28d9', fontStyle:'italic' }}>💡 {r.coaching_tip}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background:'linear-gradient(135deg, #fff7ed, #fff)', border:'1px solid #fed7aa', borderRadius:14, padding:24, marginTop:24, textAlign:'center' }}>
            <p style={{ margin:'0 0 6px', fontSize:16, fontWeight:700 }}>Ready to ace the real thing? 🚀</p>
            <p style={{ margin:'0 0 16px', fontSize:14, color:'#666' }}>Use our full toolkit to prepare end-to-end.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <a href="/interview-prep" style={{ background:'#1d1d1f', color:'#fff', textDecoration:'none', padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:700 }}>🎯 Deep Interview Prep</a>
              <a href="/cover-letter"   style={{ background:'#4f46e5', color:'#fff', textDecoration:'none', padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:700 }}>✍️ AI Cover Letter</a>
              <a href="/"             style={{ background:'#ff6b00', color:'#fff', textDecoration:'none', padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:700 }}>Browse Jobs</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

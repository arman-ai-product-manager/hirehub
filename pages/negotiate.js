import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'

export default function NegotiationCoach() {
  const [step, setStep]       = useState('setup') // 'setup' | 'chat'
  const [role, setRole]       = useState('')
  const [offer, setOffer]     = useState('')
  const [target, setTarget]   = useState('')
  const [company, setCompany] = useState('')
  const [years, setYears]     = useState('')
  const [scenario, setScenario] = useState('offer')

  const [messages, setMessages] = useState([]) // {role, content, coaching, score, phase}
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [turns, setTurns]     = useState(0)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const PHASE_COLOR = {
    Opening: '#3b82f6', Anchoring: '#8b5cf6', Counter: '#ff6b00',
    Closing: '#f59e0b', Won: '#22c55e', Lost: '#ef4444'
  }

  async function startChat() {
    if (!role.trim() || !offer || !target) return
    setStep('chat')
    // Send opening message from AI (simulate HR opening)
    setLoading(true)
    const res = await fetch('/api/negotiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role, offer: Number(offer), target: Number(target),
        company, years: Number(years), scenario,
        history: [],
        message: scenario === 'raise'
          ? `Hi, I wanted to discuss my compensation. I've been here for ${years} years and I believe I deserve a raise.`
          : `Hello, I received your offer of ₹${offer} LPA for the ${role} position. I'm excited about the opportunity but wanted to discuss the compensation package.`
      })
    })
    setLoading(false)
    if (!res.ok) return
    const data = await res.json()
    setMessages([{ role: 'assistant', content: data.dialogue, coaching: data.coaching, score: data.score, phase: data.phase }])
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    const history = newMessages.slice(-12).map(m => ({ role: m.role, content: m.content }))
    const res = await fetch('/api/negotiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role, offer: Number(offer), target: Number(target),
        company, years: Number(years), scenario,
        history: history.slice(0, -1),
        message: userMsg
      })
    })
    setLoading(false)
    if (!res.ok) { setMessages(m => [...m, { role: 'assistant', content: 'Connection error. Please try again.', coaching: '', score: 0, phase: 'Counter' }]); return }
    const data = await res.json()
    setMessages(m => [...m, { role: 'assistant', content: data.dialogue, coaching: data.coaching, score: data.score, phase: data.phase }])
    setTotalScore(s => s + data.score)
    setTurns(t => t + 1)
  }

  function reset() {
    setStep('setup'); setMessages([]); setInput(''); setTotalScore(0); setTurns(0)
    setRole(''); setOffer(''); setTarget(''); setCompany(''); setYears(''); setScenario('offer')
  }

  const avgScore = turns > 0 ? Math.round(totalScore / turns) : 0

  return (
    <>
      <Head>
        <title>AI Salary Negotiation Coach — HireHub360</title>
        <meta name="description" content="Practice salary negotiation with an AI HR manager. Get real-time coaching, scoring, and tips to negotiate a higher offer." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#0f0f0f;color:#f0f0f0}
        a{text-decoration:none;color:inherit}
        .nav{background:rgba(15,15,15,.97);backdrop-filter:blur(12px);border-bottom:1px solid #222;padding:0 5vw;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200}
        .logo{font-weight:900;font-size:22px;letter-spacing:-.04em}
        .logo span{color:#ff6b00}
        .back-link{display:flex;align-items:center;gap:6px;font-size:13px;color:#888;padding:7px 12px;border-radius:8px;border:1px solid #333;transition:all .15s}
        .back-link:hover{color:#ff6b00;border-color:#ff6b00}
        /* SETUP */
        .setup-wrap{max-width:620px;margin:0 auto;padding:48px 5vw 80px}
        .setup-wrap h1{font-size:clamp(26px,5vw,44px);font-weight:900;letter-spacing:-.05em;margin-bottom:8px}
        .setup-wrap h1 span{color:#ff6b00}
        .setup-wrap p{color:#888;font-size:15px;line-height:1.6;margin-bottom:32px}
        .setup-card{background:#111;border:1px solid #222;border-radius:20px;padding:28px}
        .form-row{margin-bottom:16px}
        .form-row label{display:block;font-size:11px;font-weight:800;color:#888;text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px}
        .form-row input,.form-row select{width:100%;padding:11px 14px;background:#0f0f0f;border:1.5px solid #2a2a2a;border-radius:10px;font-size:14px;color:#f0f0f0;outline:none;transition:border-color .15s;font-family:inherit}
        .form-row input:focus,.form-row select:focus{border-color:#ff6b00}
        .form-row select option{background:#0f0f0f}
        .scenario-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px}
        .scenario-opt{padding:12px;border-radius:12px;border:2px solid #2a2a2a;text-align:center;cursor:pointer;transition:all .15s}
        .scenario-opt.on{border-color:#ff6b00;background:rgba(255,107,0,.08)}
        .scenario-opt .s-icon{font-size:22px;margin-bottom:4px}
        .scenario-opt .s-label{font-size:12px;font-weight:700;color:#ccc}
        .scenario-opt.on .s-label{color:#ff6b00}
        .start-btn{width:100%;background:#ff6b00;color:#fff;border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .15s;font-family:inherit;margin-top:6px}
        .start-btn:hover{opacity:.88}
        .start-btn:disabled{opacity:.45;cursor:not-allowed}
        .tips-row{display:flex;gap:10px;margin-top:24px;flex-wrap:wrap}
        .tip{background:#111;border:1px solid #222;border-radius:10px;padding:10px 14px;font-size:12px;color:#888;flex:1;min-width:160px}
        .tip strong{color:#ff6b00;display:block;margin-bottom:3px}
        /* CHAT */
        .chat-layout{display:grid;grid-template-columns:1fr 320px;height:calc(100vh - 60px);overflow:hidden}
        @media(max-width:800px){.chat-layout{grid-template-columns:1fr}.side-panel{display:none}}
        .chat-main{display:flex;flex-direction:column;height:100%;overflow:hidden}
        .chat-header{padding:16px 20px;border-bottom:1px solid #1a1a1a;display:flex;align-items:center;gap:14px;background:#0a0a0a;flex-shrink:0}
        .chat-header-info{flex:1}
        .chat-header-info h2{font-size:15px;font-weight:800;letter-spacing:-.02em}
        .chat-header-info p{font-size:12px;color:#888;margin-top:2px}
        .phase-badge{padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.04em}
        .reset-btn{background:#1a1a1a;border:1px solid #333;color:#888;padding:6px 12px;border-radius:8px;font-size:12px;cursor:pointer;font-family:inherit;transition:all .15s}
        .reset-btn:hover{color:#ff6b00;border-color:#ff6b00}
        .messages{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px}
        .msg{max-width:78%;display:flex;flex-direction:column;gap:6px}
        .msg.user{align-self:flex-end;align-items:flex-end}
        .msg.assistant{align-self:flex-start}
        .bubble{padding:12px 16px;border-radius:16px;font-size:14px;line-height:1.65}
        .msg.user .bubble{background:#ff6b00;color:#fff;border-radius:16px 16px 4px 16px}
        .msg.assistant .bubble{background:#111;border:1px solid #222;color:#e8e8e8;border-radius:16px 16px 16px 4px}
        .coaching-note{background:rgba(255,107,0,.08);border:1px solid rgba(255,107,0,.2);border-radius:10px;padding:10px 12px;font-size:12px;color:#ffa96b;max-width:340px}
        .coaching-note strong{color:#ff6b00}
        .score-row{display:flex;align-items:center;gap:8px}
        .score-pill{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:999px;padding:2px 10px;font-size:11px;font-weight:700}
        .typing{display:flex;gap:5px;padding:14px 16px;background:#111;border:1px solid #222;border-radius:16px 16px 16px 4px;align-self:flex-start;width:fit-content}
        .dot{width:6px;height:6px;background:#888;border-radius:50%;animation:bounce .8s infinite}
        .dot:nth-child(2){animation-delay:.15s}
        .dot:nth-child(3){animation-delay:.3s}
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        .chat-input-wrap{padding:14px 16px;border-top:1px solid #1a1a1a;display:flex;gap:10px;background:#0a0a0a;flex-shrink:0}
        .chat-input{flex:1;background:#111;border:1.5px solid #2a2a2a;border-radius:12px;padding:11px 14px;font-size:14px;color:#f0f0f0;outline:none;font-family:inherit;transition:border-color .15s;resize:none}
        .chat-input:focus{border-color:#ff6b00}
        .send-btn{background:#ff6b00;color:#fff;border:none;border-radius:10px;padding:11px 18px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;transition:opacity .15s;font-family:inherit}
        .send-btn:hover{opacity:.88}
        .send-btn:disabled{opacity:.45;cursor:not-allowed}
        /* Side panel */
        .side-panel{background:#0a0a0a;border-left:1px solid #1a1a1a;padding:20px;overflow-y:auto}
        .side-panel h3{font-size:13px;font-weight:800;color:#888;text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px}
        .stat-card{background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:14px;margin-bottom:10px}
        .stat-card .val{font-size:28px;font-weight:900;letter-spacing:-.04em}
        .stat-card .lbl{font-size:11px;color:#666;margin-top:2px}
        .score-bar{height:6px;background:#1a1a1a;border-radius:999px;margin-top:8px;overflow:hidden}
        .score-fill{height:100%;background:#ff6b00;border-radius:999px;transition:width .4s}
        .tip-card{background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:14px;margin-bottom:8px;font-size:12px;color:#888;line-height:1.6}
        .tip-card strong{color:#ff6b00;display:block;margin-bottom:4px;font-size:11px;text-transform:uppercase;letter-spacing:.04em}
        .suggestion-btns{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
        .sugg-btn{background:#111;border:1px solid #222;border-radius:8px;padding:9px 12px;font-size:12px;color:#ccc;cursor:pointer;text-align:left;transition:all .15s;font-family:inherit}
        .sugg-btn:hover{border-color:#ff6b00;color:#ff6b00}
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">Hire<span>Hub</span><span style={{color:'#ff6b00',fontSize:'0.7em',fontWeight:900,verticalAlign:'super',marginLeft:1}}>360</span></a>
        <a href="/" className="back-link">← Back to Jobs</a>
      </nav>

      {step === 'setup' ? (
        <div className="setup-wrap">
          <h1>AI Salary <span>Negotiation</span> Coach</h1>
          <p>Practice negotiating your salary with a tough-but-fair AI HR manager. Get real-time coaching, a negotiation score, and tips after every exchange.</p>

          <div className="setup-card">
            <div style={{marginBottom:20}}>
              <div className="form-row" style={{marginBottom:8}}><label>Scenario</label></div>
              <div className="scenario-row">
                {[
                  {id:'offer', icon:'🤝', label:'New Offer'},
                  {id:'counter', icon:'💬', label:'Counter Offer'},
                  {id:'raise', icon:'📈', label:'Ask for Raise'},
                ].map(s => (
                  <div key={s.id} className={`scenario-opt ${scenario===s.id?'on':''}`} onClick={() => setScenario(s.id)}>
                    <div className="s-icon">{s.icon}</div>
                    <div className="s-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="form-row">
                <label>Role / Position</label>
                <input placeholder="e.g. Senior Software Engineer" value={role} onChange={e => setRole(e.target.value)} />
              </div>
              <div className="form-row">
                <label>Company (optional)</label>
                <input placeholder="e.g. Razorpay, Google" value={company} onChange={e => setCompany(e.target.value)} />
              </div>
              <div className="form-row">
                <label>{scenario==='raise' ? 'Current Salary (LPA)' : 'Offer Given (LPA)'}</label>
                <input type="number" placeholder="e.g. 18" value={offer} onChange={e => setOffer(e.target.value)} />
              </div>
              <div className="form-row">
                <label>Your Target (LPA)</label>
                <input type="number" placeholder="e.g. 25" value={target} onChange={e => setTarget(e.target.value)} />
              </div>
              <div className="form-row">
                <label>Years of Experience</label>
                <input type="number" placeholder="e.g. 4" value={years} onChange={e => setYears(e.target.value)} />
              </div>
            </div>

            <button className="start-btn" disabled={!role.trim() || !offer || !target} onClick={startChat}>
              Start Negotiation Practice →
            </button>
          </div>

          <div className="tips-row">
            <div className="tip"><strong>💡 Anchoring</strong>State your target first with confidence to set the frame.</div>
            <div className="tip"><strong>📊 Data Wins</strong>Back asks with market data, not personal need.</div>
            <div className="tip"><strong>🤫 Silence</strong>After making a counteroffer, wait — don't fill the silence.</div>
          </div>
        </div>
      ) : (
        <div className="chat-layout">
          {/* Main chat */}
          <div className="chat-main">
            <div className="chat-header">
              <div className="chat-header-info">
                <h2>{role} @ {company || 'Tech Company'}</h2>
                <p>₹{offer} LPA offered → Target: ₹{target} LPA · {years}yr exp</p>
              </div>
              {messages.length > 0 && messages[messages.length-1].phase && (
                <span className="phase-badge" style={{background: PHASE_COLOR[messages[messages.length-1].phase] + '22', color: PHASE_COLOR[messages[messages.length-1].phase]}}>
                  {messages[messages.length-1].phase}
                </span>
              )}
              <button className="reset-btn" onClick={reset}>↺ New</button>
            </div>

            <div className="messages">
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role}`}>
                  {m.role === 'assistant' && m.content && (
                    <div style={{fontSize:11,color:'#555',marginBottom:2,paddingLeft:4}}>HR Manager</div>
                  )}
                  {m.content && <div className="bubble">{m.content}</div>}
                  {m.role === 'assistant' && m.coaching && (
                    <div className="coaching-note">
                      <strong>Coach</strong>{m.coaching}
                    </div>
                  )}
                  {m.role === 'assistant' && m.score > 0 && (
                    <div className="score-row">
                      <span className="score-pill" style={{color: m.score>=70?'#22c55e':m.score>=40?'#f59e0b':'#ef4444'}}>
                        Score: {m.score}/100
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="typing">
                  <div className="dot"/><div className="dot"/><div className="dot"/>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="chat-input-wrap">
              <textarea
                className="chat-input"
                rows={2}
                placeholder="Type your response to the HR manager…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              />
              <button className="send-btn" disabled={!input.trim() || loading} onClick={sendMessage}>Send →</button>
            </div>
          </div>

          {/* Side panel */}
          <div className="side-panel">
            <h3>Your Performance</h3>
            <div className="stat-card">
              <div className="val" style={{color: avgScore>=70?'#22c55e':avgScore>=40?'#f59e0b':'#ff6b00'}}>{avgScore}<span style={{fontSize:16,color:'#555'}}>/100</span></div>
              <div className="lbl">Avg negotiation score</div>
              <div className="score-bar"><div className="score-fill" style={{width:avgScore+'%'}}/></div>
            </div>
            <div className="stat-card">
              <div className="val">{turns}</div>
              <div className="lbl">Exchanges completed</div>
            </div>
            <div className="stat-card">
              <div className="val" style={{color:'#ff6b00'}}>₹{offer}→₹{target}</div>
              <div className="lbl">Gap: ₹{Math.max(0, Number(target)-Number(offer))} LPA</div>
            </div>

            <div style={{margin:'20px 0 10px'}}><h3>Quick Responses</h3></div>
            <div className="suggestion-btns">
              {[
                'I have a competing offer at a higher figure.',
                'Based on market data, this role pays ₹' + target + ' LPA on average.',
                'I\'m willing to consider other forms of compensation — equity, bonus, or joining bonus.',
                'Can we revisit this in 3 months after I demonstrate value?',
                'What\'s the top of your band for this role?',
              ].map((s, i) => (
                <button key={i} className="sugg-btn" onClick={() => setInput(s)}>{s}</button>
              ))}
            </div>

            <h3>Negotiation Tips</h3>
            <div className="tip-card"><strong>Anchoring First</strong>Whoever names a number first anchors the conversation. Don't let HR anchor you — counter with your target.</div>
            <div className="tip-card"><strong>Never Accept Immediately</strong>Say "I'll need 24 hours to review." Creates perceived value.</div>
            <div className="tip-card"><strong>Bundle Asks</strong>Salary + bonus + equity + WFH. Giving one makes saying yes to others easier.</div>
          </div>
        </div>
      )}
    </>
  )
}

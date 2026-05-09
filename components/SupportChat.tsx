import { useState } from 'react'

const FAQS = [
  { q: 'Job post kaise karu?', a: 'App open karo → "Post Job" button dabao → form fill karo → Submit. Job 2 min me live ho jati hai.' },
  { q: 'Career page kaam nahi kar raha', a: 'App me Brand Kit → "Save Brand Settings" click karo → naya link copy karo. Link ab chhota hoga aur jobs dikhenge.' },
  { q: 'Apply kaise karu?', a: 'Kisi bhi job pe "Apply Now" dabao → phone number dalo → OTP verify karo. WhatsApp apply ke liye green button use karo.' },
  { q: 'Mera account kaise banaye?', a: 'hirehub360.in/hirehub.html kholo → apna phone/email daalo → OTP enter karo. Account automatically ban jata hai.' },
  { q: 'Resume kaise banaye?', a: 'hirehub360.in/resume-builder pe jao → apni details bharo → AI resume generate karega → PDF download karo.' },
  { q: 'Pricing plans kya hain?', a: 'hirehub360.in/pricing pe full details hain. Free plan me unlimited job apply, paid plans me job post + CV unlock milta hai.' },
]

const WA_NUMBER = process.env.NEXT_PUBLIC_SUPPORT_WA || '919999999999'

export default function SupportChat() {
  const [open, setOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [msg, setMsg] = useState('')

  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg ? `Hi HireHub360 Support, mujhe help chahiye: ${msg}` : 'Hi HireHub360 Support, mujhe help chahiye.')}`

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: open ? '#1d1d1f' : '#ff6b00',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
          fontSize: 22,
        }}
        aria-label="Support Chat"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 92, right: 24, zIndex: 9998,
          width: 340, maxHeight: '80vh',
          background: '#fff', borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', fontFamily: '-apple-system,BlinkMacSystemFont,sans-serif',
        }}>
          {/* Header */}
          <div style={{ background: '#ff6b00', padding: '16px 20px' }}>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>HireHub360 Support</div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 }}>
              🟢 Online · Usually replies in 5 min
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {/* Greeting */}
            <div style={{
              background: '#f5f5f7', borderRadius: '12px 12px 12px 0',
              padding: '10px 14px', fontSize: 13, color: '#1d1d1f',
              lineHeight: 1.5, marginBottom: 14,
            }}>
              Namaste! 👋 Main HireHub360 Support hu. Kaise help karun?
            </div>

            {/* FAQs */}
            <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Common Questions
            </div>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left', background: activeFaq === i ? '#fff3e8' : '#f5f5f7',
                    border: activeFaq === i ? '1px solid #ff6b00' : '1px solid #e5e5ea',
                    borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
                    fontSize: 12, fontWeight: 600, color: '#1d1d1f', lineHeight: 1.4,
                  }}
                >
                  {activeFaq === i ? '▼ ' : '▶ '}{faq.q}
                </button>
                {activeFaq === i && (
                  <div style={{
                    background: '#fff8f4', border: '1px solid #ffe0c8',
                    borderTop: 'none', borderRadius: '0 0 10px 10px',
                    padding: '10px 12px', fontSize: 12, color: '#444', lineHeight: 1.6,
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}

            {/* Message input */}
            <div style={{ marginTop: 16, fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Kuch aur poochna hai?
            </div>
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder="Apna sawaal likho..."
              rows={2}
              style={{
                width: '100%', border: '1px solid #e5e5ea', borderRadius: 10,
                padding: '8px 12px', fontSize: 16, resize: 'none',
                fontFamily: 'inherit', color: '#1d1d1f', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Footer */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#25D366', color: '#fff', padding: '10px 16px',
                borderRadius: 10, textDecoration: 'none', fontWeight: 700,
                fontSize: 13, textAlign: 'center', display: 'block',
              }}
            >
              💬 WhatsApp pe Chat Karo
            </a>
            <a
              href="mailto:support@hirehub360.in"
              style={{
                color: '#ff6b00', fontSize: 12, textAlign: 'center',
                textDecoration: 'none', fontWeight: 600,
              }}
            >
              ✉️ Email: support@hirehub360.in
            </a>
          </div>
        </div>
      )}
    </>
  )
}

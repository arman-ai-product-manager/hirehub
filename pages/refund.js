import Head from 'next/head'
import Link from 'next/link'

const NAV = () => (
  <nav style={{background:'#fff',borderBottom:'1px solid #eee',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:56,position:'sticky',top:0,zIndex:100}}>
    <Link href="/" style={{fontWeight:800,fontSize:20,color:'#111',textDecoration:'none'}}>Hire<span style={{color:'#ff6b00'}}>Hub</span><span style={{color:'#ff6b00',fontSize:'0.7em',verticalAlign:'super'}}>360</span></Link>
    <div style={{display:'flex',gap:24}}>
      <Link href="/terms" style={{color:'#444',textDecoration:'none',fontSize:14}}>Terms</Link>
      <Link href="/contact" style={{color:'#444',textDecoration:'none',fontSize:14}}>Contact</Link>
    </div>
  </nav>
)

const S = ({title,children}) => (
  <div style={{marginBottom:40}}>
    <h2 style={{fontSize:20,fontWeight:800,color:'#111',marginBottom:12}}>{title}</h2>
    <div style={{color:'#444',fontSize:16,lineHeight:1.8}}>{children}</div>
  </div>
)

export default function Refund() {
  return (
    <>
      <Head>
        <title>Refund Policy | HireHub360</title>
        <meta name="description" content="HireHub360 Refund Policy — learn about our cancellation and refund process for subscriptions and CV credits." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://hirehub360.in/refund" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <NAV />

      <main style={{maxWidth:780,margin:'0 auto',padding:'56px 24px'}}>
        <div style={{marginBottom:40}}>
          <h1 style={{fontSize:'clamp(28px,5vw,40px)',fontWeight:900,color:'#111',letterSpacing:'-0.03em',marginBottom:8}}>Refund Policy</h1>
          <p style={{color:'#888',fontSize:14}}>Last updated: April 2026</p>
        </div>

        <div style={{background:'#fff8f4',border:'1.5px solid #ffe0c8',borderRadius:14,padding:'16px 20px',marginBottom:40,fontSize:14,color:'#444',lineHeight:1.7}}>
          We want you to be 100% satisfied with HireHub360. If something goes wrong, we'll do our best to make it right. Email us at <a href="mailto:support@hirehub360.in" style={{color:'#ff6b00'}}>support@hirehub360.in</a> within 7 days.
        </div>

        {/* Quick Table */}
        <div style={{background:'#fff',border:'1.5px solid #eee',borderRadius:16,overflow:'hidden',marginBottom:48}}>
          <div style={{background:'#f9f9fb',padding:'14px 20px',fontWeight:800,fontSize:14,color:'#111',borderBottom:'1px solid #eee'}}>Quick Reference</div>
          {[
            ['Subscription Plans','Cancel anytime, no refund for current period','7 days from payment'],
            ['CV Credit Packs','Refundable if unused','7 days from payment'],
            ['Venue Bookings','Case by case basis','48 hours before booking date'],
            ['Technical Issues','Full refund','Anytime'],
          ].map(([t,p,d])=>(
            <div key={t} style={{display:'grid',gridTemplateColumns:'1fr 2fr 1fr',padding:'14px 20px',borderBottom:'1px solid #f0f0f5',fontSize:14}}>
              <div style={{fontWeight:700,color:'#111'}}>{t}</div>
              <div style={{color:'#444'}}>{p}</div>
              <div style={{color:'#888',fontSize:13}}>{d}</div>
            </div>
          ))}
        </div>

        <S title="1. Subscription Plans (Monthly / Annual)">
          <p style={{marginBottom:10}}>You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period — you retain access until then.</p>
          <p style={{marginBottom:10}}><strong>Refunds for subscription plans are not provided</strong> for the current billing period unless there is a technical issue on our side that prevented you from using the service.</p>
          <p>Exception: If you are charged accidentally due to a system error, we will issue a full refund within 5–7 business days.</p>
        </S>

        <S title="2. CV Credit Packs">
          <p style={{marginBottom:10}}>CV Credits are non-expiring and tied to your company account.</p>
          <p style={{marginBottom:10}}>If you purchased a credit pack and have not used any credits, you may request a full refund within 7 days of purchase.</p>
          <p><strong>Partially used packs</strong> are refunded on a pro-rata basis for remaining unused credits, at our discretion.</p>
        </S>

        <S title="3. Venue Bookings">
          <p style={{marginBottom:10}}>Venue booking fees are handled case by case, depending on the venue partner's cancellation policy.</p>
          <ul style={{paddingLeft:20}}>
            <li style={{marginBottom:8}}><strong>More than 48 hours before the booking date:</strong> Full refund</li>
            <li style={{marginBottom:8}}><strong>24–48 hours before:</strong> 50% refund</li>
            <li style={{marginBottom:8}}><strong>Less than 24 hours:</strong> No refund</li>
          </ul>
        </S>

        <S title="4. Technical Issues">
          If you experience a technical issue that prevented you from using the service you paid for (e.g., platform downtime, broken feature, double charge), you are eligible for a full refund regardless of the time elapsed. Please provide evidence of the issue.
        </S>

        <S title="5. How to Request a Refund">
          <p style={{marginBottom:10}}>Email us at <a href="mailto:support@hirehub360.in" style={{color:'#ff6b00'}}>support@hirehub360.in</a> with:</p>
          <ul style={{paddingLeft:20}}>
            <li style={{marginBottom:8}}>Your registered email address</li>
            <li style={{marginBottom:8}}>Order/payment ID (from Cashfree)</li>
            <li style={{marginBottom:8}}>Reason for the refund request</li>
          </ul>
          <p style={{marginTop:10}}>We process all valid refund requests within <strong>5–7 business days</strong>. Refunds are credited to your original payment method.</p>
        </S>

        <S title="6. Contact">
          For refund queries, email <a href="mailto:support@hirehub360.in" style={{color:'#ff6b00'}}>support@hirehub360.in</a> or WhatsApp us at +91 98200 00000.
        </S>

      </main>

      <footer style={{background:'#111',color:'#555',padding:'24px',textAlign:'center',fontSize:12}}>
        © 2026 HireHub360 ·{' '}
        <Link href="/privacy" style={{color:'#aaa',textDecoration:'none'}}>Privacy Policy</Link> ·{' '}
        <Link href="/terms" style={{color:'#aaa',textDecoration:'none'}}>Terms of Service</Link> ·{' '}
        <Link href="/contact" style={{color:'#aaa',textDecoration:'none'}}>Contact</Link>
      </footer>
    </>
  )
}

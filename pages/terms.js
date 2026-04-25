import Head from 'next/head'
import Link from 'next/link'

const NAV = () => (
  <nav style={{background:'#fff',borderBottom:'1px solid #eee',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:56,position:'sticky',top:0,zIndex:100}}>
    <Link href="/" style={{fontWeight:800,fontSize:20,color:'#111',textDecoration:'none'}}>Hire<span style={{color:'#ff6b00'}}>Hub</span><span style={{color:'#ff6b00',fontSize:'0.7em',verticalAlign:'super'}}>360</span></Link>
    <div style={{display:'flex',gap:24}}>
      <Link href="/privacy" style={{color:'#444',textDecoration:'none',fontSize:14}}>Privacy</Link>
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

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service | HireHub360</title>
        <meta name="description" content="HireHub360 Terms of Service — rules and guidelines for using India's AI-powered job portal." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://hirehub360.in/terms" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <NAV />

      <main style={{maxWidth:780,margin:'0 auto',padding:'56px 24px'}}>
        <div style={{marginBottom:40}}>
          <h1 style={{fontSize:'clamp(28px,5vw,40px)',fontWeight:900,color:'#111',letterSpacing:'-0.03em',marginBottom:8}}>Terms of Service</h1>
          <p style={{color:'#888',fontSize:14}}>Last updated: April 2026 · Governed by Indian law</p>
        </div>

        <div style={{background:'#fff8f4',border:'1.5px solid #ffe0c8',borderRadius:14,padding:'16px 20px',marginBottom:40,fontSize:14,color:'#444',lineHeight:1.7}}>
          By using HireHub360, you agree to these terms. Please read them carefully. If you do not agree, do not use the platform.
        </div>

        <S title="1. Acceptance of Terms">
          These Terms of Service ("Terms") govern your use of HireHub360 ("Platform"), operated by HireHub360 (India). By creating an account or using any part of the platform, you agree to be bound by these Terms and our Privacy Policy.
        </S>

        <S title="2. Eligibility">
          You must be at least 18 years old to use HireHub360. By using the platform, you confirm you are of legal age and have the legal capacity to enter into a binding agreement.
        </S>

        <S title="3. User Accounts">
          <p style={{marginBottom:10}}>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information when creating your account.</p>
          <p>We reserve the right to suspend or terminate accounts that violate these Terms, contain false information, or are used for fraudulent purposes.</p>
        </S>

        <S title="4. For Job Seekers (Candidates)">
          <ul style={{paddingLeft:20}}>
            {['You may apply to jobs posted on the platform','You must not create fake profiles or misrepresent your qualifications','You must not use automated tools or bots to apply to jobs','Free accounts have daily application limits (10 per day)','We are not responsible for hiring decisions made by employers'].map(i=>(
              <li key={i} style={{marginBottom:8}}>{i}</li>
            ))}
          </ul>
        </S>

        <S title="5. For Employers (Companies)">
          <ul style={{paddingLeft:20}}>
            {['All job postings must be for genuine, legal job openings','You must not post discriminatory, misleading, or fraudulent job listings','You are responsible for all communications with candidates','Job posts that violate Indian labour law will be removed','We reserve the right to verify company identity before publishing jobs'].map(i=>(
              <li key={i} style={{marginBottom:8}}>{i}</li>
            ))}
          </ul>
        </S>

        <S title="6. Prohibited Activities">
          You must not:
          <ul style={{paddingLeft:20,marginTop:10}}>
            {['Post fake jobs or fraudulent listings','Scrape, harvest, or collect data from the platform','Use the platform to send spam or unsolicited messages','Attempt to hack, overload, or disrupt our services','Impersonate any person or organisation','Use the platform for any illegal purpose under Indian law'].map(i=>(
              <li key={i} style={{marginBottom:8}}>{i}</li>
            ))}
          </ul>
        </S>

        <S title="7. Payments and Subscriptions">
          <p style={{marginBottom:10}}>Paid plans are processed through Cashfree, a RBI-regulated payment gateway. All prices are inclusive of 18% GST.</p>
          <p style={{marginBottom:10}}>Subscriptions renew automatically unless cancelled. You can cancel anytime from your account settings.</p>
          <p>For refunds, see our <Link href="/refund" style={{color:'#ff6b00'}}>Refund Policy</Link>.</p>
        </S>

        <S title="8. Intellectual Property">
          All content on HireHub360, including the platform design, AI algorithms, logos, and text, is owned by HireHub360. You may not copy, reproduce, or distribute any part of the platform without written permission.
        </S>

        <S title="9. Disclaimer of Warranties">
          HireHub360 is provided "as is" without warranties of any kind. We do not guarantee employment outcomes, hiring success, or uninterrupted service. AI fit scores are indicative only and not a guarantee of candidate quality.
        </S>

        <S title="10. Limitation of Liability">
          To the maximum extent permitted by Indian law, HireHub360 shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid us in the last 3 months.
        </S>

        <S title="11. Governing Law">
          These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.
        </S>

        <S title="12. Changes to Terms">
          We may update these Terms at any time. Continued use of the platform after changes means you accept the revised Terms. We will notify registered users via email for significant changes.
        </S>

        <S title="13. Contact">
          For any questions about these Terms, email us at <a href="mailto:support@hirehub360.in" style={{color:'#ff6b00'}}>support@hirehub360.in</a>.
        </S>

      </main>

      <footer style={{background:'#111',color:'#555',padding:'24px',textAlign:'center',fontSize:12}}>
        © 2026 HireHub360 ·{' '}
        <Link href="/privacy" style={{color:'#aaa',textDecoration:'none'}}>Privacy Policy</Link> ·{' '}
        <Link href="/refund" style={{color:'#aaa',textDecoration:'none'}}>Refund Policy</Link> ·{' '}
        <Link href="/contact" style={{color:'#aaa',textDecoration:'none'}}>Contact</Link>
      </footer>
    </>
  )
}

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

const Section = ({title,children}) => (
  <div style={{marginBottom:40}}>
    <h2 style={{fontSize:20,fontWeight:800,color:'#111',marginBottom:12}}>{title}</h2>
    <div style={{color:'#444',fontSize:16,lineHeight:1.8}}>{children}</div>
  </div>
)

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | HireHub360</title>
        <meta name="description" content="HireHub360 Privacy Policy — how we collect, use, and protect your personal data in compliance with India's DPDP Act 2023." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://hirehub360.in/privacy" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <NAV />

      <main style={{maxWidth:780,margin:'0 auto',padding:'56px 24px'}}>
        <div style={{marginBottom:40}}>
          <h1 style={{fontSize:'clamp(28px,5vw,40px)',fontWeight:900,color:'#111',letterSpacing:'-0.03em',marginBottom:8}}>Privacy Policy</h1>
          <p style={{color:'#888',fontSize:14}}>Last updated: April 2026 · Effective immediately</p>
        </div>

        <div style={{background:'#fff8f4',border:'1.5px solid #ffe0c8',borderRadius:14,padding:'16px 20px',marginBottom:40,fontSize:14,color:'#444',lineHeight:1.7}}>
          <strong>Summary:</strong> We collect only what's needed to run HireHub360. We never sell your data. You can delete your account anytime. We comply with India's <strong>DPDP Act 2023</strong>.
        </div>

        <Section title="1. Who We Are">
          HireHub360 ("we", "us", "our") is an AI-powered job portal operated by HireHub360 (India). We are reachable at <a href="mailto:support@hirehub360.in" style={{color:'#ff6b00'}}>support@hirehub360.in</a> for any privacy-related queries.
        </Section>

        <Section title="2. Information We Collect">
          <p style={{marginBottom:10}}><strong>Account Information:</strong> When you register, we collect your name, email address, and role (candidate or company). If you sign up with Google, we receive your name and email from Google.</p>
          <p style={{marginBottom:10}}><strong>Profile Information:</strong> Candidates may provide resume details, skills, experience, salary expectations, and location. Companies may provide company name, GST number, city, and sector.</p>
          <p style={{marginBottom:10}}><strong>Usage Data:</strong> We collect standard server logs including IP addresses, browser type, pages visited, and time of access to improve our service.</p>
          <p><strong>Payment Information:</strong> Payments are processed by Cashfree. We do not store your card or bank details.</p>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul style={{paddingLeft:20}}>
            {['To provide and improve the HireHub360 platform','To match candidates with relevant job opportunities','To send booking confirmations and transactional emails','To send service updates (you can unsubscribe anytime)','To prevent fraud, spam, and abuse','To comply with legal obligations under Indian law'].map(i=>(
              <li key={i} style={{marginBottom:8}}>{i}</li>
            ))}
          </ul>
        </Section>

        <Section title="4. Data Sharing">
          <p style={{marginBottom:10}}>We <strong>do not sell</strong> your personal data to any third party.</p>
          <p style={{marginBottom:10}}>We share data with:</p>
          <ul style={{paddingLeft:20}}>
            <li style={{marginBottom:8}}><strong>Supabase</strong> — our database provider (servers in Singapore)</li>
            <li style={{marginBottom:8}}><strong>Cashfree</strong> — payment processing</li>
            <li style={{marginBottom:8}}><strong>Resend</strong> — transactional emails</li>
            <li style={{marginBottom:8}}><strong>Vercel</strong> — website hosting</li>
            <li style={{marginBottom:8}}><strong>Law enforcement</strong> — only when legally required</li>
          </ul>
        </Section>

        <Section title="5. Cookies">
          We use minimal cookies for authentication (session management) and preference storage (e.g., dark mode). We do not use advertising or tracking cookies. You can clear cookies at any time from your browser settings.
        </Section>

        <Section title="6. Data Retention">
          We retain your account data for as long as your account is active. Job applications are kept for 2 years. You may request deletion at any time by emailing <a href="mailto:support@hirehub360.in" style={{color:'#ff6b00'}}>support@hirehub360.in</a>.
        </Section>

        <Section title="7. Your Rights (DPDP Act 2023)">
          Under India's Digital Personal Data Protection Act 2023, you have the right to:
          <ul style={{paddingLeft:20,marginTop:10}}>
            {['Access the personal data we hold about you','Correct inaccurate personal data','Erase your personal data ("right to be forgotten")','Withdraw consent at any time','Nominate someone to exercise rights on your behalf','Lodge a complaint with the Data Protection Board of India'].map(i=>(
              <li key={i} style={{marginBottom:8}}>{i}</li>
            ))}
          </ul>
          <p style={{marginTop:10}}>To exercise any right, email us at <a href="mailto:support@hirehub360.in" style={{color:'#ff6b00'}}>support@hirehub360.in</a>. We respond within 7 business days.</p>
        </Section>

        <Section title="8. Security">
          We implement industry-standard security measures including encrypted connections (HTTPS), Row Level Security (RLS) in our database, and access controls. However, no internet transmission is 100% secure.
        </Section>

        <Section title="9. Children's Privacy">
          HireHub360 is not intended for anyone under 18 years of age. We do not knowingly collect data from minors.
        </Section>

        <Section title="10. Changes to This Policy">
          We may update this policy from time to time. We will notify registered users via email for material changes. Continued use of the platform after changes constitutes acceptance.
        </Section>

        <Section title="11. Contact">
          For any privacy concerns, contact our Data Protection Officer at:<br/>
          📧 <a href="mailto:support@hirehub360.in" style={{color:'#ff6b00'}}>support@hirehub360.in</a><br/>
          📍 HireHub360, Mumbai, Maharashtra, India
        </Section>

      </main>

      <footer style={{background:'#111',color:'#555',padding:'24px',textAlign:'center',fontSize:12}}>
        © 2026 HireHub360 ·{' '}
        <Link href="/terms" style={{color:'#aaa',textDecoration:'none'}}>Terms</Link> ·{' '}
        <Link href="/refund" style={{color:'#aaa',textDecoration:'none'}}>Refund Policy</Link> ·{' '}
        <Link href="/contact" style={{color:'#aaa',textDecoration:'none'}}>Contact</Link>
      </footer>
    </>
  )
}

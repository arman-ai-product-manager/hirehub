import Head from 'next/head'
import { supabaseService } from '../../lib/supabase'

export default function CareerPage({ company, jobs }) {
  if (!company.name) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'system-ui,sans-serif',background:'#f5f5f7'}}>
        <div style={{textAlign:'center',padding:40}}>
          <div style={{fontSize:48,marginBottom:16}}>🔍</div>
          <h2 style={{fontWeight:800,fontSize:22,marginBottom:8}}>Career Page Not Found</h2>
          <p style={{color:'#6e6e73',marginBottom:24}}>This company hasn't set up their career page yet.</p>
          <a href="https://hirehub360.in" style={{background:'#ff6b00',color:'#fff',padding:'12px 24px',borderRadius:999,fontWeight:700,textDecoration:'none',fontSize:14}}>Find Jobs on HireHub360 →</a>
        </div>
      </div>
    )
  }

  const c = company.color || '#ff6b00'
  const name = company.name
  const tagline = company.tagline || 'We are hiring great people!'
  const cta = company.cta || 'Apply Now'
  const logo = company.logo || null

  return (
    <>
      <Head>
        <title>{name} Careers | Powered by HireHub360</title>
        <meta name="description" content={`${name} is hiring! ${jobs.length} open position${jobs.length!==1?'s':''}. ${tagline}`} />
        <meta property="og:title" content={`${name} — We're Hiring!`} />
        <meta property="og:description" content={`${jobs.length} open positions at ${name}. ${tagline}`} />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f7;color:#1d1d1f}
          .apply-btn{display:inline-block;padding:10px 22px;border-radius:999px;font-weight:700;font-size:13px;cursor:pointer;border:none;text-decoration:none;transition:opacity .15s}
          .apply-btn:hover{opacity:.85}
          .job-card{background:#fff;border-radius:16px;border:1px solid #e5e5ea;padding:20px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap}
        `}</style>
      </Head>

      {/* Hero */}
      <div style={{background:c,padding:'36px 24px 28px'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20,flexWrap:'wrap'}}>
            {logo
              ? <img src={logo} alt={name} style={{width:56,height:56,borderRadius:12,objectFit:'contain',background:'#fff',padding:6,flexShrink:0}}/>
              : <div style={{width:56,height:56,borderRadius:12,background:'rgba(255,255,255,.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,fontWeight:800,color:'#fff',flexShrink:0}}>{name.charAt(0)}</div>
            }
            <div>
              <div style={{fontWeight:800,fontSize:24,color:'#fff',letterSpacing:'-.03em'}}>{name}</div>
              <div style={{fontSize:14,color:'rgba(255,255,255,.78)',marginTop:2}}>{tagline}</div>
            </div>
          </div>
          <div style={{background:'rgba(255,255,255,.15)',borderRadius:12,padding:'14px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
            <div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.65)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4}}>Open Positions</div>
              <div style={{fontWeight:800,fontSize:26,color:'#fff',letterSpacing:'-.04em'}}>{jobs.length} Job{jobs.length!==1?'s':''}</div>
            </div>
            <a href="#jobs" style={{background:'#fff',borderRadius:999,padding:'10px 24px',fontWeight:700,fontSize:14,color:c,textDecoration:'none'}}>{cta} →</a>
          </div>
        </div>
      </div>

      {/* Jobs */}
      <div id="jobs" style={{maxWidth:700,margin:'0 auto',padding:'28px 16px'}}>
        {jobs.length === 0 ? (
          <div style={{background:'#fff',borderRadius:16,border:'1px solid #e5e5ea',padding:'40px 20px',textAlign:'center'}}>
            <div style={{fontSize:36,marginBottom:12}}>📋</div>
            <p style={{color:'#6e6e73',fontSize:14}}>No open positions right now. Check back soon!</p>
          </div>
        ) : (
          <>
            <h2 style={{fontWeight:800,fontSize:18,marginBottom:16,letterSpacing:'-.03em'}}>Open Positions</h2>
            {jobs.map((job,i) => (
              <div key={i} className="job-card">
                <div style={{flex:1,minWidth:200}}>
                  <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{job.title}</div>
                  <div style={{fontSize:13,color:'#6e6e73',marginBottom:8}}>
                    {[job.location, job.salary_label, job.job_type].filter(Boolean).join(' · ')}
                  </div>
                  {job.skills && job.skills.length > 0 && (
                    <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                      {(Array.isArray(job.skills)?job.skills:String(job.skills).split(',')).slice(0,4).map((s,si)=>(
                        <span key={si} style={{background:'#f5f5f7',color:'#3d3d3f',fontSize:11,fontWeight:600,padding:'3px 8px',borderRadius:6}}>{String(s).trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
                <a href={`https://hirehub360.in/hirehub.html`} target="_blank" rel="noopener"
                  className="apply-btn" style={{background:c,color:'#fff',flexShrink:0}}>{cta}</a>
              </div>
            ))}
          </>
        )}

        <div style={{textAlign:'center',marginTop:32,paddingTop:20,borderTop:'1px solid #e5e5ea'}}>
          <a href="https://hirehub360.in" style={{fontSize:12,color:'#aaa',textDecoration:'none'}}>
            Powered by <strong style={{color:'#ff6b00'}}>HireHub360</strong> · India's AI Hiring Platform
          </a>
        </div>
      </div>
    </>
  )
}

function slugToName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ')
}

export async function getServerSideProps({ params, query }) {
  const slug = params.slug

  // Brand data from URL query params (set by saveBrand in app)
  const company = {
    name:    decodeURIComponent(query.n || slugToName(slug)),
    color:   decodeURIComponent(query.c || '#ff6b00'),
    tagline: decodeURIComponent(query.t || 'We are hiring great people!'),
    cta:     decodeURIComponent(query.cta || 'Apply Now'),
    logo:    query.logo ? decodeURIComponent(query.logo) : null,
  }

  // Jobs from Supabase — match company_name to slug (flexible)
  let jobs = []
  try {
    const searchName = slug.replace(/-/g, ' ')
    const { data } = await supabaseService
      .from('jobs')
      .select('id,title,location,salary_label,job_type,skills,company_name')
      .eq('status', 'active')
      .or(`company_name.ilike.%${searchName}%,company_name.ilike.%${slug}%`)
      .order('created_at', { ascending: false })
      .limit(50)
    jobs = data || []
  } catch(e) {}

  // If no brand name in query and no jobs found, show 404
  if (!query.n && jobs.length === 0) {
    return { props: { company: { name: null }, jobs: [] } }
  }

  return { props: { company, jobs } }
}

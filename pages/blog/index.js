import Head from 'next/head'
import Link from 'next/link'
const { supabaseService } = require('../../lib/supabase')

export default function BlogIndex({ posts }) {
  return (
    <>
      <Head>
        <title>Blog | HireHub360 — Career Tips, Job Search Advice & Hiring Insights</title>
        <meta name="description" content="Career tips, job search strategies, resume writing advice, hiring insights and more from HireHub360 — India's AI-powered job platform." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://hirehub360.in/blog" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <nav style={{background:'#fff',borderBottom:'1px solid #eee',padding:'0 24px',display:'flex',alignItems:'center',gap:32,height:56,position:'sticky',top:0,zIndex:100}}>
        <Link href="/" style={{fontWeight:800,fontSize:20,color:'#111',textDecoration:'none'}}>Hire<span style={{color:'#ff6b00'}}>Hub</span><span style={{color:'#ff6b00',fontSize:'0.7em',verticalAlign:'super'}}>360</span></Link>
        <Link href="/" style={{color:'#444',textDecoration:'none',fontSize:15}}>Browse Jobs</Link>
        <Link href="/blog" style={{color:'#ff6b00',textDecoration:'none',fontSize:15,fontWeight:600}}>Blog</Link>
      </nav>

      <main style={{maxWidth:900,margin:'0 auto',padding:'48px 24px'}}>
        <h1 style={{fontSize:36,fontWeight:800,marginBottom:8,color:'#111'}}>Career Advice & Hiring Insights</h1>
        <p style={{color:'#666',fontSize:17,marginBottom:48}}>Tips, guides and strategies to grow your career or hire the best talent in India.</p>

        {posts.length === 0 && (
          <div style={{textAlign:'center',padding:'80px 0',color:'#999'}}>
            <div style={{fontSize:48,marginBottom:16}}>✍️</div>
            <p>Blog posts coming soon!</p>
          </div>
        )}

        <div style={{display:'grid',gap:32}}>
          {posts.map(post => (
            <article key={post.id} style={{borderBottom:'1px solid #eee',paddingBottom:32}}>
              {post.cover_image && (
                <img src={post.cover_image} alt={post.title}
                  style={{width:'100%',height:220,objectFit:'cover',borderRadius:12,marginBottom:20}} />
              )}
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
                {(post.tags||[]).map(tag => (
                  <span key={tag} style={{background:'#fff3e8',color:'#ff6b00',padding:'2px 10px',borderRadius:20,fontSize:13,fontWeight:600}}>{tag}</span>
                ))}
              </div>
              <h2 style={{fontSize:24,fontWeight:700,margin:'0 0 10px',lineHeight:1.3}}>
                <Link href={`/blog/${post.slug}`} style={{color:'#111',textDecoration:'none'}}>
                  {post.title}
                </Link>
              </h2>
              {post.excerpt && <p style={{color:'#555',fontSize:16,lineHeight:1.6,margin:'0 0 16px'}}>{post.excerpt}</p>}
              <div style={{display:'flex',alignItems:'center',gap:16,fontSize:14,color:'#888'}}>
                <span>✍️ {post.author}</span>
                <span>📅 {new Date(post.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>
              </div>
              <Link href={`/blog/${post.slug}`}
                style={{display:'inline-block',marginTop:16,color:'#ff6b00',fontWeight:600,textDecoration:'none',fontSize:15}}>
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </main>

      <footer style={{background:'#111',color:'#aaa',textAlign:'center',padding:'32px 24px',marginTop:80,fontSize:14}}>
        <p>© 2026 HireHub360 | <Link href="/" style={{color:'#ff6b00',textDecoration:'none'}}>Find Jobs</Link> | <Link href="/blog" style={{color:'#ff6b00',textDecoration:'none'}}>Blog</Link></p>
      </footer>
    </>
  )
}

export async function getStaticProps() {
  const { data: posts } = await supabaseService
    .from('blogs')
    .select('id,title,slug,excerpt,cover_image,author,tags,created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  return { props: { posts: posts || [] }, revalidate: 300 }
}

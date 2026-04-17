import Head from 'next/head'
import Link from 'next/link'
import { marked } from 'marked'
const { supabaseService } = require('../../lib/supabase')

export default function BlogPost({ post }) {
  if (!post) return (
    <div style={{padding:'80px 24px',textAlign:'center',fontFamily:'sans-serif'}}>
      <div style={{fontSize:48,marginBottom:16}}>📄</div>
      <h2>Post not found</h2>
      <Link href="/blog" style={{color:'#ff6b00'}}>← Back to Blog</Link>
    </div>
  )

  const html = marked(post.content || '')

  return (
    <>
      <Head>
        <title>{post.title} | HireHub360 Blog</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={`https://hirehub360.in/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:type" content="article" />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context':'https://schema.org','@type':'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: post.cover_image,
          author: {'@type':'Organization', name: post.author || 'HireHub360 Team'},
          publisher: {'@type':'Organization', name:'HireHub360', url:'https://hirehub360.in'},
          datePublished: post.created_at,
          dateModified: post.updated_at,
          mainEntityOfPage: `https://hirehub360.in/blog/${post.slug}`
        })}} />
      </Head>

      <nav style={{background:'#fff',borderBottom:'1px solid #eee',padding:'0 24px',display:'flex',alignItems:'center',gap:32,height:56,position:'sticky',top:0,zIndex:100}}>
        <Link href="/" style={{fontWeight:800,fontSize:20,color:'#111',textDecoration:'none'}}>Hire<span style={{color:'#ff6b00'}}>Hub</span><span style={{color:'#ff6b00',fontSize:'0.7em',verticalAlign:'super'}}>360</span></Link>
        <Link href="/" style={{color:'#444',textDecoration:'none',fontSize:15}}>Browse Jobs</Link>
        <Link href="/blog" style={{color:'#ff6b00',textDecoration:'none',fontSize:15,fontWeight:600}}>Blog</Link>
      </nav>

      <main style={{maxWidth:780,margin:'0 auto',padding:'48px 24px'}}>
        <Link href="/blog" style={{color:'#ff6b00',textDecoration:'none',fontSize:14,fontWeight:600}}>← Back to Blog</Link>

        <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'20px 0 16px'}}>
          {(post.tags||[]).map(tag => (
            <span key={tag} style={{background:'#fff3e8',color:'#ff6b00',padding:'2px 10px',borderRadius:20,fontSize:13,fontWeight:600}}>{tag}</span>
          ))}
        </div>

        <h1 style={{fontSize:36,fontWeight:800,lineHeight:1.25,color:'#111',margin:'0 0 16px'}}>{post.title}</h1>

        <div style={{display:'flex',gap:20,fontSize:14,color:'#888',marginBottom:32,paddingBottom:24,borderBottom:'1px solid #eee'}}>
          <span>✍️ {post.author || 'HireHub360 Team'}</span>
          <span>📅 {new Date(post.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>
        </div>

        {post.cover_image && (
          <img src={post.cover_image} alt={post.title}
            style={{width:'100%',maxHeight:400,objectFit:'cover',borderRadius:12,marginBottom:36}} />
        )}

        <div style={{fontSize:17,lineHeight:1.8,color:'#333'}}
          dangerouslySetInnerHTML={{ __html: html }} />

        <div style={{marginTop:60,padding:'32px',background:'#fff8f4',borderRadius:16,textAlign:'center',border:'1px solid #ffe0c8'}}>
          <h3 style={{margin:'0 0 8px',color:'#111'}}>Looking for a job?</h3>
          <p style={{color:'#555',margin:'0 0 20px'}}>Browse 12,000+ jobs across India. Apply in 30 seconds.</p>
          <Link href="/" style={{background:'#ff6b00',color:'#fff',padding:'12px 28px',borderRadius:8,textDecoration:'none',fontWeight:700,fontSize:16}}>
            Browse Jobs →
          </Link>
        </div>
      </main>

      <footer style={{background:'#111',color:'#aaa',textAlign:'center',padding:'32px 24px',marginTop:80,fontSize:14}}>
        <p>© 2026 HireHub360 | <Link href="/" style={{color:'#ff6b00',textDecoration:'none'}}>Find Jobs</Link> | <Link href="/blog" style={{color:'#ff6b00',textDecoration:'none'}}>Blog</Link></p>
      </footer>

      <style>{`
        .blog-content h2{font-size:24px;font-weight:700;margin:36px 0 12px;color:#111}
        .blog-content h3{font-size:20px;font-weight:600;margin:28px 0 10px;color:#111}
        .blog-content p{margin:0 0 20px}
        .blog-content ul,ol{margin:0 0 20px;padding-left:24px}
        .blog-content li{margin-bottom:8px}
        .blog-content strong{color:#111}
        .blog-content a{color:#ff6b00}
        .blog-content blockquote{border-left:4px solid #ff6b00;margin:24px 0;padding:12px 20px;background:#fff8f4;border-radius:0 8px 8px 0;font-style:italic}
        .blog-content code{background:#f5f5f5;padding:2px 6px;border-radius:4px;font-size:14px}
        .blog-content img{max-width:100%;border-radius:8px;margin:16px 0}
      `}</style>
    </>
  )
}

export async function getStaticPaths() {
  const { data: posts } = await supabaseService
    .from('blogs').select('slug').eq('published', true).limit(200)
  const paths = (posts || []).map(p => ({ params: { slug: p.slug } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { data: post } = await supabaseService
    .from('blogs')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!post) return { notFound: true }
  return { props: { post }, revalidate: 3600 }
}

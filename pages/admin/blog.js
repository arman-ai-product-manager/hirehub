import { useState, useEffect } from 'react'
import Head from 'next/head'
import { marked } from 'marked'
const { supabaseService } = require('../../lib/supabase')


// ── Slug generator ──────────────────────────────────────────────
function mkSlug(s) {
  return (s || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function AdminBlog({ initialPosts, authorized: serverAuth }) {
  const [authed, setAuthed]     = useState(serverAuth || false)
  const [passInput, setPass]    = useState('')
  const [posts, setPosts]       = useState(initialPosts || [])
  const [view, setView]         = useState('list') // 'list' | 'edit'
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState('')
  const [preview, setPreview]   = useState(false)

  const BLANK = { id: null, title: '', slug: '', excerpt: '', content: '', cover_image: '', author: 'Hire Hub Team', tags: '', published: false }
  const [form, setForm] = useState(BLANK)

  function notify(m) { setMsg(m); setTimeout(() => setMsg(''), 3500) }

  // ── Auth ───────────────────────────────────────────────────────
  async function doLogin() {
    const r = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passInput })
    })
    const d = await r.json()
    if (d.ok) { setAuthed(true) }
    else { notify('❌ Wrong password') }
  }

  // ── Load posts ─────────────────────────────────────────────────
  async function loadPosts() {
    const r = await fetch('/api/admin/blogs')
    const d = await r.json()
    if (d.posts) setPosts(d.posts)
  }

  // ── Save (create or update) ────────────────────────────────────
  async function savePost() {
    if (!form.title.trim()) { notify('⚠️ Title is required'); return }
    if (!form.slug.trim())  { notify('⚠️ Slug is required'); return }
    setSaving(true)
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    }
    const r = await fetch('/api/admin/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const d = await r.json()
    setSaving(false)
    if (d.error) { notify('❌ ' + d.error); return }
    notify(form.id ? '✅ Post updated!' : '✅ Post created!')
    await loadPosts()
    setView('list')
    setForm(BLANK)
  }

  // ── Toggle publish ─────────────────────────────────────────────
  async function togglePublish(post) {
    await fetch('/api/admin/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, tags: (post.tags || []).join(', '), published: !post.published })
    })
    await loadPosts()
  }

  // ── Delete ─────────────────────────────────────────────────────
  async function deletePost(id) {
    if (!confirm('Delete this post permanently?')) return
    await fetch('/api/admin/blogs?id=' + id, { method: 'DELETE' })
    await loadPosts()
    notify('🗑️ Post deleted')
  }

  // ── Edit ───────────────────────────────────────────────────────
  function editPost(post) {
    setForm({ ...post, tags: (post.tags || []).join(', ') })
    setView('edit')
    setPreview(false)
  }

  function newPost() {
    setForm(BLANK)
    setView('edit')
    setPreview(false)
  }

  // ── Auto-slug from title ───────────────────────────────────────
  function onTitleChange(val) {
    setForm(f => ({ ...f, title: val, slug: f.id ? f.slug : mkSlug(val) }))
  }

  // ── Login screen ───────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <Head><title>Admin Login | Hire Hub</title><meta name="robots" content="noindex" /></Head>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,.1)', width: '340px' }}>
        <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 8 }}>🎯</div>
        <h2 style={{ margin: '0 0 24px', textAlign: 'center', color: '#111' }}>Blog Admin</h2>
        {msg && <div style={{ background: '#fff3e8', color: '#c00', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{msg}</div>}
        <input type="password" placeholder="Admin password" value={passInput}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doLogin()}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 15, marginBottom: 12, boxSizing: 'border-box' }} />
        <button onClick={doLogin}
          style={{ width: '100%', background: '#ff6b00', color: '#fff', border: 'none', borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          Sign In
        </button>
      </div>
    </div>
  )

  // ── Edit form ──────────────────────────────────────────────────
  if (view === 'edit') return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f7f7f7' }}>
      <Head><title>{form.id ? 'Edit Post' : 'New Post'} | Blog Admin</title><meta name="robots" content="noindex" /></Head>

      <nav style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, height: 56 }}>
        <span style={{ fontWeight: 800, fontSize: 18, color: '#ff6b00' }}>🎯 Blog Admin</span>
        <button onClick={() => { setView('list'); setForm(BLANK) }}
          style={{ background: 'none', border: 'none', color: '#ff6b00', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>← Back to posts</button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <button onClick={() => setPreview(!preview)}
            style={{ padding: '7px 18px', borderRadius: 8, border: '1.5px solid #ddd', background: preview ? '#ff6b00' : '#fff', color: preview ? '#fff' : '#444', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button onClick={savePost} disabled={saving}
            style={{ padding: '7px 22px', borderRadius: 8, border: 'none', background: '#ff6b00', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 14, opacity: saving ? .6 : 1 }}>
            {saving ? 'Saving…' : (form.id ? 'Update Post' : 'Create Post')}
          </button>
        </div>
      </nav>

      {msg && <div style={{ background: '#fff3e8', color: '#c00', padding: '10px 24px', fontSize: 14, borderBottom: '1px solid #ffd0b0' }}>{msg}</div>}

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {preview ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111', marginBottom: 8 }}>{form.title || 'Untitled'}</h1>
            {form.cover_image && <img src={form.cover_image} alt="" style={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 12, marginBottom: 24 }} />}
            <div style={{ fontSize: 16, lineHeight: 1.8, color: '#333' }} dangerouslySetInnerHTML={{ __html: marked(form.content || '') }} />
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={lbl}>Title *</label>
              <input style={inp} value={form.title} onChange={e => onTitleChange(e.target.value)} placeholder="Your blog post title" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={lbl}>Slug (URL) *</label>
                <input style={inp} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="your-post-slug" />
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>hirehub360.in/blog/{form.slug || 'your-slug'}</div>
              </div>
              <div>
                <label style={lbl}>Author</label>
                <input style={inp} value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder="Hire Hub Team" />
              </div>
            </div>
            <div>
              <label style={lbl}>Excerpt (shown on blog listing)</label>
              <textarea style={{ ...inp, height: 72, resize: 'vertical' }} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Short description of this post..." />
            </div>
            <div>
              <label style={lbl}>Cover Image URL</label>
              <input style={inp} value={form.cover_image} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))} placeholder="https://..." />
            </div>
            <div>
              <label style={lbl}>Tags (comma separated)</label>
              <input style={inp} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="career tips, resume, interview" />
            </div>
            <div>
              <label style={lbl}>Content (Markdown supported) *</label>
              <textarea style={{ ...inp, height: 400, fontFamily: 'monospace', fontSize: 14, resize: 'vertical' }}
                value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder={`## Introduction\n\nWrite your blog post here using **Markdown**.\n\n- Bullet points work\n- **Bold text**\n- [Links](https://hirehub360.in)\n\n## Section 2\n\nMore content...`} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="pub" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} style={{ width: 18, height: 18, cursor: 'pointer' }} />
              <label htmlFor="pub" style={{ fontSize: 15, color: '#333', cursor: 'pointer', fontWeight: 600 }}>Publish immediately (visible on /blog)</label>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // ── List view ──────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f7f7f7' }}>
      <Head><title>Blog Admin | Hire Hub</title><meta name="robots" content="noindex" /></Head>

      <nav style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, height: 56 }}>
        <span style={{ fontWeight: 800, fontSize: 18, color: '#ff6b00' }}>🎯 Blog Admin</span>
        <a href="/" style={{ color: '#666', textDecoration: 'none', fontSize: 14 }}>← Back to site</a>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={newPost}
            style={{ padding: '8px 22px', borderRadius: 8, border: 'none', background: '#ff6b00', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            + New Post
          </button>
        </div>
      </nav>

      {msg && <div style={{ background: '#e8fff0', color: '#1a7a3c', padding: '10px 24px', fontSize: 14, borderBottom: '1px solid #b0f0c8' }}>{msg}</div>}

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24, color: '#111' }}>Blog Posts <span style={{ fontSize: 15, color: '#888', fontWeight: 400 }}>({posts.length})</span></h1>

        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
            <p style={{ marginBottom: 20 }}>No posts yet. Create your first blog post!</p>
            <button onClick={newPost} style={{ padding: '12px 28px', background: '#ff6b00', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>+ Write First Post</button>
          </div>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          {posts.map(post => (
            <div key={post.id} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 4px rgba(0,0,0,.06)', border: '1px solid #eee' }}>
              {post.cover_image && <img src={post.cover_image} alt="" style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#111', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                <div style={{ fontSize: 13, color: '#888' }}>
                  /blog/{post.slug} · {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {(post.tags || []).length > 0 && <span> · {post.tags.join(', ')}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: post.published ? '#e8fff0' : '#fff3e8', color: post.published ? '#1a7a3c' : '#cc6600' }}>
                  {post.published ? '● Live' : '○ Draft'}
                </span>
                <button onClick={() => togglePublish(post)}
                  style={{ padding: '5px 14px', borderRadius: 7, border: '1.5px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#444' }}>
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => editPost(post)}
                  style={{ padding: '5px 14px', borderRadius: 7, border: '1.5px solid #ff6b00', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#ff6b00' }}>
                  Edit
                </button>
                {post.published && (
                  <a href={'/blog/' + post.slug} target="_blank" rel="noreferrer"
                    style={{ padding: '5px 14px', borderRadius: 7, border: '1.5px solid #ddd', background: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600, color: '#444' }}>
                    View ↗
                  </a>
                )}
                <button onClick={() => deletePost(post.id)}
                  style={{ padding: '5px 10px', borderRadius: 7, border: '1.5px solid #fdd', background: '#fff8f8', cursor: 'pointer', fontSize: 13, color: '#c00' }}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }
const inp = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 15, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }

export async function getServerSideProps({ req }) {
  const { data: posts } = await supabaseService
    .from('blogs')
    .select('id,title,slug,excerpt,cover_image,author,tags,published,created_at')
    .order('created_at', { ascending: false })

  return { props: { initialPosts: posts || [] } }
}

const { createSession, destroySession, setCookie } = require('../../../lib/adminSession')

export default function handler(req, res) {
  // Login
  if (req.method === 'POST') {
    const { password } = req.body || {}
    const correct = process.env.ADMIN_PASSWORD || 'hirehub@admin2026'
    if (password !== correct) return res.status(401).json({ ok: false })
    const token = createSession()
    setCookie(res, token)
    return res.json({ ok: true })
  }

  // Logout
  if (req.method === 'DELETE') {
    destroySession(req, res)
    return res.json({ ok: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}

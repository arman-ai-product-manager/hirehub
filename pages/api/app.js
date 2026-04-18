const fs = require('fs')
const path = require('path')

// Serve hirehub.html as a dynamic API response — bypasses Vercel CDN edge cache
// so users ALWAYS get the latest version on every request
export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'public', 'hirehub.html')
  const html = fs.readFileSync(filePath, 'utf8')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.status(200).send(html)
}

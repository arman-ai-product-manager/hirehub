// Auto-submit URLs to IndexNow (Bing, Yandex, instant) + ping Google sitemap
const INDEXNOW_KEY = 'hirehub2026'
const SITE = 'https://hirehub360.in'

async function autoIndex(urls) {
  if (!urls || urls.length === 0) return
  const list = Array.isArray(urls) ? urls : [urls]

  // 1. IndexNow — submits to Bing, Yandex, Seznam instantly (free, no auth)
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'hirehub360.in',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
        urlList: list
      })
    })
  } catch (e) {}

  // 2. Ping Google with updated sitemap
  try {
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(SITE + '/sitemap.xml')}`)
  } catch (e) {}

  // 3. Ping Bing with updated sitemap
  try {
    await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(SITE + '/sitemap.xml')}`)
  } catch (e) {}
}

module.exports = { autoIndex, SITE }

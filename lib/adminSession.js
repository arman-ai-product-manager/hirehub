/**
 * adminSession.js — Stateless HMAC-signed admin session cookie
 * Works across all Vercel serverless instances (no in-memory state).
 * Token format: "<timestamp>.<hmac-sha256>" — 24h TTL enforced by timestamp check.
 */
const crypto = require('crypto')

const COOKIE_NAME = 'hh_admin_sess'
const TTL_MS      = 24 * 60 * 60 * 1000

function _secret() {
  return process.env.ADMIN_PASSWORD || 'hirehub@admin2026'
}

function _sign(payload) {
  return crypto.createHmac('sha256', _secret()).update(payload).digest('hex')
}

function createSession() {
  const ts    = Date.now().toString()
  const sig   = _sign(ts)
  const token = ts + '.' + sig
  return Buffer.from(token).toString('base64url')
}

function validateSession(req) {
  const cookie = req.headers.cookie || ''
  const match  = cookie.match(new RegExp(COOKIE_NAME + '=([A-Za-z0-9_-]+)'))
  if (!match) return false
  try {
    const token  = Buffer.from(match[1], 'base64url').toString()
    const dot    = token.lastIndexOf('.')
    if (dot < 0) return false
    const ts     = token.slice(0, dot)
    const sig    = token.slice(dot + 1)
    const expSig = _sign(ts)
    // Constant-time comparison
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expSig))) return false
    if (Date.now() - parseInt(ts, 10) > TTL_MS) return false
    return true
  } catch (_) {
    return false
  }
}

function destroySession(req, res) {
  res.setHeader('Set-Cookie',
    `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`)
}

function setCookie(res, token) {
  res.setHeader('Set-Cookie',
    `${COOKIE_NAME}=${token}; Max-Age=86400; Path=/; HttpOnly; Secure; SameSite=Strict`)
}

module.exports = { createSession, validateSession, destroySession, setCookie }

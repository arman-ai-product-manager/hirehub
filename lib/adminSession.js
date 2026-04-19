/**
 * adminSession.js — Lightweight server-side session management for Super Admin
 * Uses in-memory Map with 24h TTL. No Redis required.
 * On Vercel serverless, sessions survive warm invocations; cold starts require re-login.
 */
const crypto = require('crypto')

const SESSIONS = new Map()       // token → expiry timestamp
const TTL_MS   = 24 * 60 * 60 * 1000  // 24 hours

const COOKIE_NAME = 'hh_admin_sess'
const COOKIE_OPTS = 'Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400'

function _purge() {
  const now = Date.now()
  for (const [token, expiry] of SESSIONS) {
    if (now > expiry) SESSIONS.delete(token)
  }
}

function createSession() {
  _purge()
  const token = crypto.randomBytes(32).toString('hex')
  SESSIONS.set(token, Date.now() + TTL_MS)
  return token
}

function validateSession(req) {
  const cookie = req.headers.cookie || ''
  const match  = cookie.match(new RegExp(COOKIE_NAME + '=([a-f0-9]{64})'))
  if (!match) return false
  const expiry = SESSIONS.get(match[1])
  if (!expiry) return false
  if (Date.now() > expiry) { SESSIONS.delete(match[1]); return false }
  return true
}

function destroySession(req, res) {
  const cookie = req.headers.cookie || ''
  const match  = cookie.match(new RegExp(COOKIE_NAME + '=([a-f0-9]{64})'))
  if (match) SESSIONS.delete(match[1])
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`)
}

function setCookie(res, token) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; ${COOKIE_OPTS}`)
}

module.exports = { createSession, validateSession, destroySession, setCookie }

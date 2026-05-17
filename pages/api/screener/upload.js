import { IncomingForm } from 'formidable'
import fs from 'fs'
const pdfParse = require('pdf-parse')
const { supabaseService } = require('../../../lib/supabase')

export const config = {
  api: { bodyParser: false },
  maxDuration: 60, // PDF parsing + storage uploads can take >10s for large batches
}

async function auth(req) {
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return null
  const { data: { user }, error } = await supabaseService.auth.getUser(jwt)
  return error ? null : user
}

function parseForm(req) {
  return new Promise((resolve, reject) => {
    // 4 MB per file — Vercel's infrastructure enforces a 4.5 MB total request body limit
    const form = new IncomingForm({ multiples: true, maxFileSize: 4 * 1024 * 1024 })
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

// Extract candidate name/email from text heuristics
function extractMeta(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.]{2,}/)
  const phoneMatch = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}|(?:\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/)
  let name = ''
  for (const line of lines.slice(0, 8)) {
    if (/^[A-Z][a-z]+(?: [A-Z][a-z]+){1,3}$/.test(line) && line.length < 60) {
      name = line; break
    }
  }
  return {
    candidate_name:  name || lines[0]?.slice(0, 60) || '',
    candidate_email: emailMatch?.[0] || '',
    candidate_phone: phoneMatch?.[0] || '',
  }
}

async function processOne(file, jobId, userId) {
  const fileName = file.originalFilename || file.newFilename || 'resume.pdf'
  let rawText = ''
  let meta = { candidate_name: '', candidate_email: '', candidate_phone: '' }
  let fileUrl = null

  try {
    const buf = await fs.promises.readFile(file.filepath)
    const parsed = await pdfParse(buf)
    rawText = parsed.text || ''
    meta = extractMeta(rawText)

    const storagePath = `screener/${userId}/${jobId}/${Date.now()}_${fileName}`
    const { data: storageData } = await supabaseService.storage
      .from('resumes')
      .upload(storagePath, buf, { contentType: 'application/pdf', upsert: false })
    if (storageData?.path) {
      const { data: urlData } = supabaseService.storage.from('resumes').getPublicUrl(storageData.path)
      fileUrl = urlData?.publicUrl || null
    }
  } catch (e) {
    console.error('PDF parse error:', fileName, e.message)
  } finally {
    await fs.promises.unlink(file.filepath).catch(() => {})
  }

  const scanned = !rawText.trim()

  const { data: resumeRow, error: insertErr } = await supabaseService
    .from('screener_resumes')
    .insert({
      job_id:     jobId,
      company_id: userId,
      file_name:  fileName,
      file_url:   fileUrl,
      raw_text:   rawText.slice(0, 12000),
      status:     rawText ? 'pending' : 'error',
      error_msg:  rawText ? null : 'Could not extract text from PDF — file may be scanned or image-only',
      ...meta,
    })
    .select()
    .single()

  if (insertErr) {
    return { file: fileName, ok: false, error: insertErr.message }
  }
  return { file: fileName, ok: true, id: resumeRow.id, name: meta.candidate_name, scanned }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await auth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  let fields, files
  try {
    ;({ fields, files } = await parseForm(req))
  } catch (e) {
    return res.status(400).json({ error: 'Upload parse error: ' + e.message })
  }

  const jobId = Array.isArray(fields.job_id) ? fields.job_id[0] : fields.job_id
  if (!jobId) return res.status(400).json({ error: 'job_id required' })

  // Verify job ownership
  const { data: job } = await supabaseService
    .from('screener_jobs').select('id').eq('id', jobId).eq('company_id', user.id).single()
  if (!job) return res.status(403).json({ error: 'Job not found' })

  const uploaded = Array.isArray(files.resumes) ? files.resumes : files.resumes ? [files.resumes] : []
  if (uploaded.length === 0) return res.status(400).json({ error: 'No files uploaded' })
  if (uploaded.length > 500) return res.status(400).json({ error: 'Max 500 files per batch' })

  // Process all files in parallel within this request
  const results = await Promise.all(uploaded.map(f => processOne(f, jobId, user.id)))

  return res.json({ ok: true, uploaded: results.length, results })
}

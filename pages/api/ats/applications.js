const { supabaseService } = require('../../../lib/supabase')

const DEMO_APPS = [
  { id: 'd1', job_title: 'Senior Developer', candidate_name: 'Rahul Sharma', status: 'applied', fit_score: 82, applied_at: '2026-05-06T10:00:00Z', source: 'App', candidate_email: 'rahul@example.com', notes: '' },
  { id: 'd2', job_title: 'Senior Developer', candidate_name: 'Priya Nair', status: 'screening', fit_score: 91, applied_at: '2026-05-05T09:00:00Z', source: 'WhatsApp', candidate_email: 'priya@example.com', notes: '' },
  { id: 'd3', job_title: 'Marketing Manager', candidate_name: 'Amit Patel', status: 'interview', fit_score: 74, applied_at: '2026-05-04T11:00:00Z', source: 'Indeed', candidate_email: 'amit@example.com', notes: '' },
  { id: 'd4', job_title: 'Sales Executive', candidate_name: 'Sneha Gupta', status: 'final', fit_score: 88, applied_at: '2026-05-03T14:00:00Z', source: 'App', candidate_email: 'sneha@example.com', notes: '' },
  { id: 'd5', job_title: 'HR Executive', candidate_name: 'Vikram Singh', status: 'offer', fit_score: 79, applied_at: '2026-05-02T08:00:00Z', source: 'LinkedIn', candidate_email: 'vikram@example.com', notes: '' },
  { id: 'd6', job_title: 'Marketing Manager', candidate_name: 'Kavitha Reddy', status: 'hired', fit_score: 95, applied_at: '2026-05-01T12:00:00Z', source: 'App', candidate_email: 'kavitha@example.com', notes: '' },
  { id: 'd7', job_title: 'Sales Executive', candidate_name: 'Rohit Kumar', status: 'rejected', fit_score: 42, applied_at: '2026-05-01T15:00:00Z', source: 'Indeed', candidate_email: 'rohit@example.com', notes: '' },
  { id: 'd8', job_title: 'Senior Developer', candidate_name: 'Anjali Menon', status: 'applied', fit_score: null, applied_at: '2026-05-07T09:30:00Z', source: 'WhatsApp', candidate_email: 'anjali@example.com', notes: '' },
]

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { company_id } = req.query
    if (!company_id) {
      return res.status(200).json({ demo: true, applications: DEMO_APPS })
    }
    try {
      const { data, error } = await supabaseService
        .from('applications')
        .select('id, job_id, job_title, company_id, candidate_name, candidate_email, candidate_phone, status, fit_score, applied_at, notes, source')
        .eq('company_id', company_id)
        .order('applied_at', { ascending: false })
      if (error) throw error
      if (!data || data.length === 0) {
        return res.status(200).json({ demo: true, applications: DEMO_APPS })
      }
      return res.status(200).json({ demo: false, applications: data })
    } catch (err) {
      return res.status(200).json({ demo: true, applications: DEMO_APPS })
    }
  }

  if (req.method === 'POST') {
    const { id, status, notes } = req.body || {}
    if (!id) return res.status(400).json({ error: 'id required' })
    try {
      const updates = {}
      if (status !== undefined) updates.status = status
      if (notes !== undefined) updates.notes = notes
      updates.updated_at = new Date().toISOString()
      const { error } = await supabaseService
        .from('applications')
        .update(updates)
        .eq('id', id)
      if (error) throw error
      return res.status(200).json({ ok: true })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

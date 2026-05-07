const { validateSession }  = require('../../../lib/adminSession')
const { supabaseService }  = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (!validateSession(req)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'GET')  return res.status(405).json({ error: 'Method not allowed' })

  try {
    const [
      candidatesRes,
      companiesRes,
      activeJobsRes,
      applicationsRes,
      venueRes,
      hrRes,
      auditRes,
    ] = await Promise.all([
      supabaseService.from('candidates').select('id', { count: 'exact', head: true }),
      supabaseService.from('companies').select('id', { count: 'exact', head: true }),
      supabaseService.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabaseService.from('applications').select('id', { count: 'exact', head: true }),
      supabaseService.from('venue_bookings').select('id', { count: 'exact', head: true }),
      supabaseService.from('hr_users').select('id', { count: 'exact', head: true }),
      supabaseService.from('audit_log')
        .select('id,actor_id,actor_role,action,target_type,target_id,metadata,created_at')
        .order('created_at', { ascending: false })
        .limit(50),
    ])

    return res.json({
      stats: {
        totalUsers:        candidatesRes.count   || 0,
        totalCompanies:    companiesRes.count     || 0,
        totalActiveJobs:   activeJobsRes.count    || 0,
        totalApplications: applicationsRes.count  || 0,
        totalVenueBookings:venueRes.count          || 0,
        totalHR:           hrRes.count             || 0,
      },
      recentAudit: auditRes.data || [],
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

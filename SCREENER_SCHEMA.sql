-- AI Resume Screener — run once in Supabase SQL editor (fresh install)
-- Tables are prefixed 'screener_' to avoid collision with existing tables
-- If you already ran an earlier version, run SCREENER_MIGRATION_V2.sql instead

CREATE TABLE IF NOT EXISTS screener_jobs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL,             -- auth.users id
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  skills      TEXT[] DEFAULT '{}',
  status      TEXT DEFAULT 'active' CHECK (status IN ('active','closed')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS screener_resumes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id           UUID NOT NULL REFERENCES screener_jobs(id) ON DELETE CASCADE,
  company_id       UUID NOT NULL,
  file_name        TEXT NOT NULL,
  file_url         TEXT,
  candidate_name   TEXT,
  candidate_email  TEXT,
  candidate_phone  TEXT,
  score            INT CHECK (score BETWEEN 0 AND 100),
  -- SHORTLIST = strong fit (score >= 70)
  -- MAYBE     = borderline  (score 45-69)
  -- REJECT    = poor fit    (score < 45)
  recommendation   TEXT CHECK (recommendation IN ('SHORTLIST','MAYBE','REJECT')),
  experience_years INT DEFAULT 0,
  summary          TEXT,
  strengths        TEXT[],   -- matched skills
  gaps             TEXT[],   -- missing skills
  raw_text         TEXT,
  status           TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','done','error')),
  error_msg        TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  processed_at     TIMESTAMPTZ
);

-- Row-level security: each company sees only their data
ALTER TABLE screener_jobs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE screener_resumes ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (our API routes use service role)
-- These policies protect direct client-side queries
CREATE POLICY "company own jobs"    ON screener_jobs
  FOR ALL USING (company_id = auth.uid());
CREATE POLICY "company own resumes" ON screener_resumes
  FOR ALL USING (company_id = auth.uid());

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_screener_jobs_company      ON screener_jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_screener_resumes_job       ON screener_resumes(job_id);
CREATE INDEX IF NOT EXISTS idx_screener_resumes_company   ON screener_resumes(company_id);
CREATE INDEX IF NOT EXISTS idx_screener_resumes_score     ON screener_resumes(job_id, score DESC NULLS LAST);

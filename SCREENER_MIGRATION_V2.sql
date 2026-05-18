-- AI Resume Screener — Migration V2
-- Run this if you already ran SCREENER_SCHEMA.sql (the original version).
-- Safe to run multiple times (uses IF NOT EXISTS / IF EXISTS guards).

-- 1. Add experience_years column (new in V2)
ALTER TABLE screener_resumes
  ADD COLUMN IF NOT EXISTS experience_years INT DEFAULT 0;

-- 2. Migrate recommendation values: hire→SHORTLIST, consider→MAYBE, reject→REJECT
UPDATE screener_resumes SET recommendation = 'SHORTLIST' WHERE recommendation = 'hire';
UPDATE screener_resumes SET recommendation = 'MAYBE'     WHERE recommendation = 'consider';
UPDATE screener_resumes SET recommendation = 'REJECT'    WHERE recommendation = 'reject';

-- 3. Drop old constraint and add new one
ALTER TABLE screener_resumes
  DROP CONSTRAINT IF EXISTS screener_resumes_recommendation_check;

ALTER TABLE screener_resumes
  ADD CONSTRAINT screener_resumes_recommendation_check
  CHECK (recommendation IN ('SHORTLIST','MAYBE','REJECT'));

-- 4. Add score index for fast ranked queries (if missing)
CREATE INDEX IF NOT EXISTS idx_screener_resumes_score
  ON screener_resumes(job_id, score DESC NULLS LAST);

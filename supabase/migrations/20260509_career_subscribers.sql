-- Career page email subscribers
-- Captures emails when a visitor wants to be notified about new openings
-- at a specific company's career page (when company has 0 active jobs).

CREATE TABLE IF NOT EXISTS career_subscribers (
  id           BIGSERIAL PRIMARY KEY,
  email        TEXT NOT NULL,
  company_name TEXT,
  company_slug TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (email, company_slug)
);

CREATE INDEX IF NOT EXISTS career_subscribers_slug_idx
  ON career_subscribers (company_slug);

-- Lock down: only service role can read/write. Public API
-- (/api/careers/subscribe) uses service role under the hood.
ALTER TABLE career_subscribers ENABLE ROW LEVEL SECURITY;

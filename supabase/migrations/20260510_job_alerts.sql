-- Captures job alert subscriptions from /job-alerts page.
-- Used by /api/alerts/subscribe.

CREATE TABLE IF NOT EXISTS job_alerts (
  id           BIGSERIAL PRIMARY KEY,
  contact      TEXT NOT NULL,
  contact_kind TEXT CHECK (contact_kind IN ('email', 'phone')),
  keywords     TEXT,
  city         TEXT,
  frequency    TEXT CHECK (frequency IN ('daily', 'weekly')) DEFAULT 'weekly',
  active       BOOLEAN DEFAULT TRUE,
  last_sent_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (contact, keywords, city)
);

CREATE INDEX IF NOT EXISTS job_alerts_contact_idx ON job_alerts (contact);
CREATE INDEX IF NOT EXISTS job_alerts_active_idx  ON job_alerts (active) WHERE active = TRUE;

ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;

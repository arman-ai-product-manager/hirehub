-- ============================================================
-- HireHub360 Screener — Company Settings & Invites
-- Run once in Supabase SQL editor (after SCREENER_SUBSCRIPTION_MIGRATION.sql)
-- ============================================================

-- Company profile (name, logo)
CREATE TABLE IF NOT EXISTS screener_companies (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   UUID        NOT NULL UNIQUE,
  name         TEXT        NOT NULL DEFAULT '',
  logo_url     TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE screener_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_manages_own_profile"
  ON screener_companies FOR ALL
  USING (company_id = auth.uid());

CREATE TRIGGER screener_companies_updated_at
  BEFORE UPDATE ON screener_companies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Team invites
CREATE TABLE IF NOT EXISTS screener_invites (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id     UUID        NOT NULL,
  invited_email  TEXT        NOT NULL,
  status         TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  invited_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (company_id, invited_email)
);

ALTER TABLE screener_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_reads_own_invites"
  ON screener_invites FOR SELECT
  USING (company_id = auth.uid());

-- ============================================================
-- Storage bucket for company logos (run once in Supabase SQL editor):
--
--   INSERT INTO storage.buckets (id, name, public)
--   VALUES ('screener-logos', 'screener-logos', true)
--   ON CONFLICT DO NOTHING;
--
--   CREATE POLICY "auth_users_upload_logo"
--     ON storage.objects FOR INSERT
--     WITH CHECK (
--       bucket_id = 'screener-logos'
--       AND auth.uid()::text = (storage.foldername(name))[1]
--     );
--
--   CREATE POLICY "public_read_logos"
--     ON storage.objects FOR SELECT
--     USING (bucket_id = 'screener-logos');
--
-- Additional environment variables:
--   RESEND_API_KEY  = re_xxx   (get from resend.com)
--   NEXT_PUBLIC_APP_URL = https://hirehub360.in
-- ============================================================

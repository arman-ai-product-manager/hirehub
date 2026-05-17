-- ============================================================
-- HireHub360 Screener — Subscription Table
-- Run once in Supabase SQL editor
-- ============================================================

CREATE TABLE IF NOT EXISTS screener_subscriptions (
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id                UUID        NOT NULL UNIQUE,
  plan                      TEXT        NOT NULL CHECK (plan IN ('starter', 'pro', 'agency')),
  status                    TEXT        NOT NULL DEFAULT 'pending'
                                        CHECK (status IN ('pending', 'active', 'paused', 'cancelled', 'expired')),
  resume_limit              INTEGER     NOT NULL DEFAULT 100,  -- -1 = unlimited (Agency)
  cashfree_subscription_id  TEXT        UNIQUE,
  current_period_start      TIMESTAMPTZ,
  current_period_end        TIMESTAMPTZ,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-level security: companies only see their own subscription
ALTER TABLE screener_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_reads_own_subscription"
  ON screener_subscriptions FOR SELECT
  USING (company_id = auth.uid());

-- Auto-update updated_at on every write
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER screener_subscriptions_updated_at
  BEFORE UPDATE ON screener_subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Index for fast monthly usage queries
CREATE INDEX IF NOT EXISTS screener_resumes_company_created
  ON screener_resumes (company_id, created_at);

-- ============================================================
-- If the table already existed with razorpay_subscription_id,
-- run this ALTER to rename the column:
--
--   ALTER TABLE screener_subscriptions
--     RENAME COLUMN razorpay_subscription_id TO cashfree_subscription_id;
--
-- ============================================================
-- Environment variables to set in Vercel / .env.local:
--
--   CASHFREE_APP_ID          = CF_live_xxx          (Cashfree App ID)
--   CASHFREE_SECRET_KEY      = secret_xxx           (Cashfree Secret Key)
--   CASHFREE_PLAN_STARTER    = plan_starter_xxx     (create in Cashfree dashboard → Subscriptions → Plans)
--   CASHFREE_PLAN_PRO        = plan_pro_xxx
--   CASHFREE_PLAN_AGENCY     = plan_agency_xxx
--   NEXT_PUBLIC_APP_URL      = https://hirehub360.in
--
-- Cashfree plan setup (do once in Cashfree dashboard → Subscriptions → Plans):
--   Starter : ₹2,999 / month, interval=1, interval_type=MONTH
--   Pro     : ₹5,999 / month, interval=1, interval_type=MONTH
--   Agency  : ₹12,999 / month, interval=1, interval_type=MONTH
--
-- Webhook URL to add in Cashfree dashboard → Webhooks:
--   https://hirehub360.in/api/screener/webhook
--   Events to subscribe: SUBSCRIPTION_AUTHORIZED, SUBSCRIPTION_CHARGED,
--                        SUBSCRIPTION_CANCELLED, SUBSCRIPTION_EXPIRED,
--                        SUBSCRIPTION_PENDING, SUBSCRIPTION_ON_HOLD
-- ============================================================

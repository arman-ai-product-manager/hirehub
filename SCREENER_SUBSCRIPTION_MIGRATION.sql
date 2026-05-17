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
  razorpay_subscription_id  TEXT        UNIQUE,
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
-- Environment variables to set in Vercel / .env.local:
--
--   RAZORPAY_KEY_ID          = rzp_live_xxx
--   RAZORPAY_KEY_SECRET      = secret_xxx
--   RAZORPAY_WEBHOOK_SECRET  = whsec_xxx   (from Razorpay dashboard → Webhooks)
--   RAZORPAY_PLAN_STARTER    = plan_xxx    (create in Razorpay → Subscriptions → Plans)
--   RAZORPAY_PLAN_PRO        = plan_xxx
--   RAZORPAY_PLAN_AGENCY     = plan_xxx
--   NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_xxx  (same as KEY_ID, exposed to browser)
--
-- Razorpay plan setup (do once in Razorpay dashboard):
--   Starter : ₹2,999 / month, interval=monthly
--   Pro     : ₹5,999 / month, interval=monthly
--   Agency  : ₹12,999 / month, interval=monthly
--
-- Webhook URL to add in Razorpay dashboard:
--   https://hirehub360.in/api/screener/webhook
--   Events: subscription.activated, subscription.charged,
--           subscription.cancelled, subscription.completed,
--           subscription.pending, subscription.halted
-- ============================================================

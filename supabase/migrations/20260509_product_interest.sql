-- Captures interest signups from "coming soon" product pages.
-- Used by /api/interest endpoint and the InterestForm component.

CREATE TABLE IF NOT EXISTS product_interest (
  id           BIGSERIAL PRIMARY KEY,
  product      TEXT NOT NULL,
  name         TEXT,
  contact      TEXT NOT NULL,
  contact_kind TEXT CHECK (contact_kind IN ('email', 'phone')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (product, contact)
);

CREATE INDEX IF NOT EXISTS product_interest_product_idx
  ON product_interest (product);

CREATE INDEX IF NOT EXISTS product_interest_created_at_idx
  ON product_interest (created_at DESC);

-- Lock down: only service role can read/write.
ALTER TABLE product_interest ENABLE ROW LEVEL SECURITY;

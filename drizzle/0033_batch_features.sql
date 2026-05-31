-- Batch round: Payouts 4B (tax forms + 1099s), Payouts 4C (disputes +
-- reserves), A/B thumbnail auto-promote, audience admin foundations.
-- Idempotent — IF NOT EXISTS throughout.

-- payouts.held_until — used by the reserve / dispute hold flow.
ALTER TABLE "payouts"
	ADD COLUMN IF NOT EXISTS "held_until" timestamp;

-- payout_disputes — Stripe + Paystack disputes/chargebacks.
CREATE TABLE IF NOT EXISTS "payout_disputes" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"processor" varchar(20) NOT NULL,
	"processor_dispute_id" text NOT NULL UNIQUE,
	"payout_id" text REFERENCES "payouts"("id"),
	"ppv_purchase_id" text,
	"amount_cents" bigint NOT NULL,
	"currency" varchar(3) NOT NULL,
	"reason" varchar(60),
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"evidence_due_at" timestamp,
	"raw_payload" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"closed_at" timestamp
);
CREATE INDEX IF NOT EXISTS "payout_disputes_status_idx" ON "payout_disputes" ("status");
CREATE INDEX IF NOT EXISTS "payout_disputes_payout_idx" ON "payout_disputes" ("payout_id");

-- tax_forms — W-9 / W-8BEN / W-8BEN-E.
CREATE TABLE IF NOT EXISTS "tax_forms" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" text NOT NULL REFERENCES "creators"("id") ON DELETE CASCADE,
	"form_kind" varchar(20) NOT NULL,
	"tax_year" integer NOT NULL,
	"form_data" jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'submitted' NOT NULL,
	"verified_by" text REFERENCES "user"("id"),
	"verified_at" timestamp,
	"rejection_reason" text,
	"pdf_url" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "tax_forms_creator_idx" ON "tax_forms" ("creator_id", "tax_year");
CREATE INDEX IF NOT EXISTS "tax_forms_status_idx" ON "tax_forms" ("status");

-- tax_1099_forms — annual 1099 generation.
CREATE TABLE IF NOT EXISTS "tax_1099_forms" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" text NOT NULL REFERENCES "creators"("id") ON DELETE CASCADE,
	"tax_year" integer NOT NULL,
	"total_paid_cents" bigint NOT NULL,
	"pdf_url" text,
	"emailed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "tax_1099_forms_creator_idx" ON "tax_1099_forms" ("creator_id", "tax_year");

-- content_thumbnail_variants.promoted_at — auto-promote stamp.
ALTER TABLE "content_thumbnail_variants"
	ADD COLUMN IF NOT EXISTS "promoted_at" timestamp;

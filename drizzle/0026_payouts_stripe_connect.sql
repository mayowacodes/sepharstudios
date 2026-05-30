-- Operations round migration 2/2: Stripe Connect foundations + payouts table.
-- Adds Stripe-specific columns to creators, plus a new payouts table that
-- supersedes the loose `transactions` rows with `type='creator_payout'`.
-- Idempotent — IF NOT EXISTS throughout.

-- creators: Stripe Connect account + payout processor routing.
ALTER TABLE "creators"
	ADD COLUMN IF NOT EXISTS "stripe_account_id" text UNIQUE;
ALTER TABLE "creators"
	ADD COLUMN IF NOT EXISTS "stripe_account_status" varchar(20);
ALTER TABLE "creators"
	ADD COLUMN IF NOT EXISTS "stripe_payouts_enabled" boolean DEFAULT false;
ALTER TABLE "creators"
	ADD COLUMN IF NOT EXISTS "stripe_charges_enabled" boolean DEFAULT false;
ALTER TABLE "creators"
	ADD COLUMN IF NOT EXISTS "stripe_country" varchar(2);
ALTER TABLE "creators"
	ADD COLUMN IF NOT EXISTS "payout_processor" varchar(20) DEFAULT 'paystack' NOT NULL;
ALTER TABLE "creators"
	ADD COLUMN IF NOT EXISTS "preferred_payout_currency" varchar(3);

-- payouts: one row per creator payout (any processor). Status lifecycle:
-- pending → approved → in_transit → paid (or failed / reversed / on_hold).
CREATE TABLE IF NOT EXISTS "payouts" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" text NOT NULL REFERENCES "creators"("id"),
	"processor" varchar(20) NOT NULL,
	"processor_payout_id" text,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"gross_cents" bigint NOT NULL,
	"platform_fee_cents" bigint NOT NULL,
	"net_cents" bigint NOT NULL,
	"currency" varchar(3) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"failure_reason" text,
	"approved_by" text REFERENCES "user"("id"),
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"paid_at" timestamp
);
CREATE INDEX IF NOT EXISTS "payouts_creator_idx" ON "payouts" ("creator_id");
CREATE INDEX IF NOT EXISTS "payouts_status_idx" ON "payouts" ("status");

-- Payment system hardening + new plan model.
-- See docs/payment-system.md for architecture.
-- All statements are idempotent (IF NOT EXISTS) so this is safe to re-run.

-- ─────────────────────────────────────────────────────────────────────────────
-- paystack_events — webhook dedup. Insert before processing; unique violation
-- = retry, ack without re-processing.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "paystack_events" (
	"event_id" text PRIMARY KEY NOT NULL,
	"event_type" varchar(80) NOT NULL,
	"received_at" timestamp NOT NULL DEFAULT now(),
	"payload" jsonb
);

CREATE INDEX IF NOT EXISTS "paystack_events_received_idx"
	ON "paystack_events" ("received_at" DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- payment_intents — server-side record of what the user agreed to pay BEFORE
-- redirecting to Paystack. The verify endpoint validates the Paystack response
-- against this row instead of trusting client-controlled metadata blindly.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "payment_intents" (
	"id" text PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	"reference" varchar(100) NOT NULL UNIQUE,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"kind" varchar(30) NOT NULL,
	"plan" varchar(20),
	"amount_cents" integer NOT NULL,
	"currency" varchar(10) NOT NULL DEFAULT 'usd',
	"add_family" boolean NOT NULL DEFAULT false,
	"is_trial" boolean NOT NULL DEFAULT false,
	"content_id" text,
	"status" varchar(20) NOT NULL DEFAULT 'pending',
	"consumed_at" timestamp,
	"created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "payment_intents_user_idx"
	ON "payment_intents" ("user_id", "created_at" DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- paystackSubscriptions: add per-plan capability columns
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "paystack_subscriptions"
	ADD COLUMN IF NOT EXISTS "max_profiles" integer NOT NULL DEFAULT 1;

ALTER TABLE "paystack_subscriptions"
	ADD COLUMN IF NOT EXISTS "kids_allowed" boolean NOT NULL DEFAULT false;

-- next_charge_at: when the renewal worker should attempt the next charge.
-- For freemium (one-shot $1) this is NULL → never charged again.
ALTER TABLE "paystack_subscriptions"
	ADD COLUMN IF NOT EXISTS "next_charge_at" timestamp;

-- failed_attempts: dunning counter. Bumped on each failed renewal.
ALTER TABLE "paystack_subscriptions"
	ADD COLUMN IF NOT EXISTS "failed_attempts" integer NOT NULL DEFAULT 0;

-- last_charge_attempt_at: rate-limit retries.
ALTER TABLE "paystack_subscriptions"
	ADD COLUMN IF NOT EXISTS "last_charge_attempt_at" timestamp;

-- ─────────────────────────────────────────────────────────────────────────────
-- Unique constraints to prevent split-billing / duplicate processing
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'paystack_subscriptions_paystack_subscription_code_unique'
	) THEN
		ALTER TABLE "paystack_subscriptions"
			ADD CONSTRAINT "paystack_subscriptions_paystack_subscription_code_unique"
			UNIQUE ("paystack_subscription_code");
	END IF;
END $$;

DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'trial_blacklist_card_signature_unique'
	) THEN
		ALTER TABLE "trial_blacklist"
			ADD CONSTRAINT "trial_blacklist_card_signature_unique"
			UNIQUE ("card_signature");
	END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- refunds — audit log for admin-issued refunds
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "refunds" (
	"id" text PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"reference" varchar(100) NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" varchar(10) NOT NULL DEFAULT 'usd',
	"reason" text,
	"issued_by" text NOT NULL REFERENCES "user"("id"),
	"paystack_response" jsonb,
	"status" varchar(20) NOT NULL DEFAULT 'pending',
	"created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "refunds_user_idx"
	ON "refunds" ("user_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "refunds_reference_idx"
	ON "refunds" ("reference");

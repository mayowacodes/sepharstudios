-- 0045 — AI cost ledger (Xepho §21, adapted)
--
-- Roughly fifteen features call a paid model; before this, cost tracking
-- existed in exactly one endpoint. On a platform whose entry tier is free,
-- unbounded variable AI spend with no attribution is the risk the Xepho
-- cost-governor section exists to address.
--
-- Idempotent throughout. No backfill — historic spend was never recorded and
-- cannot be reconstructed.

CREATE TABLE IF NOT EXISTS ai_cost_ledger (
	id                  text PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id             text REFERENCES "user"(id)      ON DELETE SET NULL,
	creator_id          text,
	content_id          text REFERENCES media_library(id) ON DELETE SET NULL,
	category            varchar(20) NOT NULL,
	operation           varchar(80) NOT NULL,
	provider            varchar(40) NOT NULL,
	model               varchar(120) NOT NULL,
	input_units         integer NOT NULL DEFAULT 0,
	output_units        integer NOT NULL DEFAULT 0,
	-- Micro-dollars (1e-6 USD) as integers. Per-call costs are fractions of a
	-- cent and float accumulation across millions of rows drifts.
	estimated_micro_usd bigint  NOT NULL DEFAULT 0,
	actual_micro_usd    bigint,
	status              varchar(16) NOT NULL DEFAULT 'reserved',
	retry_number        integer NOT NULL DEFAULT 0,
	error_message       text,
	created_at          timestamp NOT NULL DEFAULT now(),
	settled_at          timestamp
);

CREATE INDEX IF NOT EXISTS ai_cost_user_period_idx    ON ai_cost_ledger (user_id, created_at);
CREATE INDEX IF NOT EXISTS ai_cost_creator_period_idx ON ai_cost_ledger (creator_id, created_at);
CREATE INDEX IF NOT EXISTS ai_cost_category_idx       ON ai_cost_ledger (category, created_at);

DO $$ BEGIN
	ALTER TABLE ai_cost_ledger ADD CONSTRAINT ai_cost_status_ck
		CHECK (status IN ('reserved', 'settled', 'failed', 'refused'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
	ALTER TABLE ai_cost_ledger ADD CONSTRAINT ai_cost_category_ck
		CHECK (category IN ('planning', 'speech', 'qc', 'compute', 'delivery'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Rolling spend per scope per period, so a budget check is one indexed read
-- rather than an aggregate over the whole ledger.
CREATE TABLE IF NOT EXISTS ai_budget_periods (
	scope            varchar(12) NOT NULL,
	scope_id         text        NOT NULL,
	period_start     date        NOT NULL,
	spent_micro_usd  bigint      NOT NULL DEFAULT 0,
	-- NULL means "no ceiling" — an explicit absence, not zero. Zero would mean
	-- "cannot spend anything", a very different policy.
	limit_micro_usd  bigint,
	updated_at       timestamp   NOT NULL DEFAULT now(),
	PRIMARY KEY (scope, scope_id, period_start)
);

DO $$ BEGIN
	ALTER TABLE ai_budget_periods ADD CONSTRAINT ai_budget_scope_ck
		CHECK (scope IN ('user', 'creator', 'platform'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Platform-wide emergency cap for the current month: $250. Deliberately seeded
-- rather than left NULL — an uncapped platform is precisely the state this
-- table exists to prevent, and a ceiling nobody sets is a ceiling that does not
-- exist. Raise it in the admin panel as real usage data arrives.
INSERT INTO ai_budget_periods (scope, scope_id, period_start, limit_micro_usd)
VALUES ('platform', 'platform', date_trunc('month', now())::date, 250000000)
ON CONFLICT (scope, scope_id, period_start) DO NOTHING;

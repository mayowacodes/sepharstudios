-- R+2: AI Layer 1 call audit. One row per inline-AI call so admins can
-- answer "the AI did what?" and so the per-user monthly budget is
-- enforceable. Idempotent — IF NOT EXISTS throughout.

CREATE TABLE IF NOT EXISTS "ai_call_log" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text REFERENCES "user"("id") ON DELETE SET NULL,
	"surface" varchar(60) NOT NULL,
	"model" varchar(80),
	"provider" varchar(20),
	"tokens_in" integer DEFAULT 0 NOT NULL,
	"tokens_out" integer DEFAULT 0 NOT NULL,
	"cost_cents" integer DEFAULT 0 NOT NULL,
	"latency_ms" integer DEFAULT 0 NOT NULL,
	"ok" boolean DEFAULT true NOT NULL,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "ai_call_log_user_idx" ON "ai_call_log" ("user_id", "created_at");
CREATE INDEX IF NOT EXISTS "ai_call_log_surface_idx" ON "ai_call_log" ("surface");

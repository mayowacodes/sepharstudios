-- Replica-safe replacements for the in-memory stores in lib/server/otp.ts
-- and lib/server/rate-limit.ts. Both tables are small, low-write, and
-- TTL-cleaned by a nightly DELETE.

CREATE TABLE IF NOT EXISTS "phone_otps" (
	"phone_hash" text PRIMARY KEY NOT NULL,
	"otp" varchar(12) NOT NULL,
	"expires_at" timestamp NOT NULL
);

CREATE INDEX IF NOT EXISTS "phone_otps_expires_at_idx" ON "phone_otps" ("expires_at");

CREATE TABLE IF NOT EXISTS "rate_limit_buckets" (
	"key" text PRIMARY KEY NOT NULL,
	"tokens" double precision NOT NULL,
	"last_refill" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "rate_limit_buckets_last_refill_idx" ON "rate_limit_buckets" ("last_refill");

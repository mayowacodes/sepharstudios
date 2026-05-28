-- The phone_otps and rate_limit_buckets tables were created by migration 0011
-- as a Postgres-backed implementation of OTP storage + rate limiting. The
-- Redis migration in the next round superseded them and they have been
-- unreferenced in code since. Dropping them frees ~150 rows of standby data
-- and removes a confusing "what are these for?" question for future readers.
--
-- Idempotent: IF EXISTS guards make this safe to re-run.

DROP INDEX IF EXISTS "phone_otps_expires_at_idx";
DROP TABLE IF EXISTS "phone_otps";

DROP INDEX IF EXISTS "rate_limit_buckets_last_refill_idx";
DROP TABLE IF EXISTS "rate_limit_buckets";

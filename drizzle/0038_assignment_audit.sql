-- Track WHO performed the assignment, not just who the assignee is.
-- Lets the audit log distinguish "self-claimed" from "reassigned by
-- another admin" without joining against a separate event log.
-- Idempotent — safe to re-run.

ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "assigned_by" text REFERENCES "user"("id") ON DELETE SET NULL;

-- Add the missing FK from notifications.user_id -> user.id with cascade delete.
-- Migration 0012 created the table without the FK; this backfills it.
-- Idempotent: DO block checks pg_constraint before adding.

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'notifications_user_id_user_id_fk'
	) THEN
		ALTER TABLE "notifications"
			ADD CONSTRAINT "notifications_user_id_user_id_fk"
			FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
	END IF;
END $$;

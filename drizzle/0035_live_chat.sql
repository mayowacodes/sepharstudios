-- Live chat messages. AI-moderated per-stream chat with creator
-- pin/delete + admin purge. Idempotent — IF NOT EXISTS throughout.

CREATE TABLE IF NOT EXISTS "live_chat_messages" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stream_id" text NOT NULL REFERENCES "live_streams"("id") ON DELETE CASCADE,
	"author_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"body" text NOT NULL,
	"status" varchar(20) DEFAULT 'published' NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "live_chat_messages_stream_idx"
	ON "live_chat_messages" ("stream_id", "created_at");

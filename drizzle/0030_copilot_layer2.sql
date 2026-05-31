-- R+3: AI Layer 2 — Copilot conversations + messages + tool-call audit.
-- Idempotent — IF NOT EXISTS throughout.

CREATE TABLE IF NOT EXISTS "copilot_conversations" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"variant" varchar(10) NOT NULL,
	"title" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "copilot_conversations_user_idx"
	ON "copilot_conversations" ("user_id", "updated_at");

CREATE TABLE IF NOT EXISTS "copilot_messages" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" text NOT NULL REFERENCES "copilot_conversations"("id") ON DELETE CASCADE,
	"role" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"tool_name" varchar(60),
	"tool_input" jsonb,
	"tool_output" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "copilot_messages_convo_idx"
	ON "copilot_messages" ("conversation_id", "created_at");

CREATE TABLE IF NOT EXISTS "ai_action_log" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"conversation_id" text,
	"tool" varchar(60) NOT NULL,
	"input" jsonb,
	"output" jsonb,
	"approved" boolean DEFAULT false NOT NULL,
	"executed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "ai_action_log_user_idx"
	ON "ai_action_log" ("user_id", "created_at");
CREATE INDEX IF NOT EXISTS "ai_action_log_tool_idx"
	ON "ai_action_log" ("tool");

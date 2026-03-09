CREATE TABLE "governance_proposals" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"type" varchar(40) NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" text NOT NULL,
	"created_by_name" varchar(255) NOT NULL,
	"status" varchar(30) DEFAULT 'submitted' NOT NULL,
	"risk_level" varchar(10) DEFAULT 'low' NOT NULL,
	"guardrail_warnings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"required_approvals" integer DEFAULT 4 NOT NULL,
	"eta" timestamp,
	"executed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "governance_proposal_approvals" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"proposal_id" text NOT NULL,
	"actor_id" text NOT NULL,
	"actor_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "governance_pause_events" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reason" text NOT NULL,
	"triggered_by" text NOT NULL,
	"triggered_by_name" varchar(255) NOT NULL,
	"triggered_at" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"resolved_at" timestamp
);

CREATE TABLE "governance_audit_entries" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"proposal_id" text,
	"action" varchar(40) NOT NULL,
	"actor_id" text NOT NULL,
	"actor_name" varchar(255) NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "governance_memberships" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"label" varchar(100) DEFAULT 'governance_admin' NOT NULL,
	"permissions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "governance_memberships_user_id_unique" UNIQUE("user_id")
);

ALTER TABLE "governance_proposals" ADD CONSTRAINT "governance_proposals_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "governance_proposal_approvals" ADD CONSTRAINT "governance_proposal_approvals_proposal_id_governance_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."governance_proposals"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "governance_proposal_approvals" ADD CONSTRAINT "governance_proposal_approvals_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "governance_pause_events" ADD CONSTRAINT "governance_pause_events_triggered_by_user_id_fk" FOREIGN KEY ("triggered_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "governance_audit_entries" ADD CONSTRAINT "governance_audit_entries_proposal_id_governance_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."governance_proposals"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "governance_audit_entries" ADD CONSTRAINT "governance_audit_entries_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "governance_memberships" ADD CONSTRAINT "governance_memberships_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

CREATE UNIQUE INDEX "governance_proposal_approvals_unique" ON "governance_proposal_approvals" USING btree ("proposal_id","actor_id");
CREATE INDEX "governance_proposals_status_idx" ON "governance_proposals" USING btree ("status");
CREATE INDEX "governance_proposals_created_at_idx" ON "governance_proposals" USING btree ("created_at");
CREATE INDEX "governance_audit_entries_created_at_idx" ON "governance_audit_entries" USING btree ("created_at");

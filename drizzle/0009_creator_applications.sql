CREATE TABLE IF NOT EXISTS "creator_applications" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
	"creator_type" varchar(20) DEFAULT 'individual' NOT NULL,
	"display_name" varchar(255),
	"legal_name" varchar(255),
	"organization_name" varchar(255),
	"organization_type" varchar(100),
	"organization_website" text,
	"organization_address" text,
	"tax_id" varchar(100),
	"contact_email" text,
	"contact_phone" text,
	"bio" text,
	"portfolio_url" text,
	"social_links" jsonb,
	"documents" jsonb,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"review_notes" text,
	"rejection_reason" text,
	"reviewed_at" timestamp,
	"reviewed_by" text REFERENCES "user"(id),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "creator_applications_user_id_idx" ON "creator_applications" ("user_id");

ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "creator_type" varchar(20) DEFAULT 'individual';
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "legal_name" varchar(255);
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "organization_name" varchar(255);
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "organization_type" varchar(100);
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "organization_website" text;
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "organization_address" text;
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "tax_id" varchar(100);
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "contact_email" text;
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "contact_phone" text;
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "denomination" varchar(100);
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "years_in_ministry" integer;
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "ministry_description" text;
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "ministry_address" text;
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "verification_documents" jsonb;
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "social_links" jsonb;
ALTER TABLE "creators" ADD COLUMN IF NOT EXISTS "preferences" jsonb;

ALTER TABLE "media_library" ADD COLUMN "creator_id" text;
ALTER TABLE "media_library" ADD COLUMN "status" varchar(30) DEFAULT 'submitted' NOT NULL;
ALTER TABLE "media_library" ADD COLUMN "review_notes" text;
ALTER TABLE "media_library" ADD COLUMN "rejection_reason" text;
ALTER TABLE "media_library" ADD COLUMN "reviewed_at" timestamp;
ALTER TABLE "media_library" ADD COLUMN "reviewed_by" text;

ALTER TABLE "media_library" ADD CONSTRAINT "media_library_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "media_library" ADD CONSTRAINT "media_library_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;

UPDATE "media_library"
SET "status" = CASE WHEN "is_active" THEN 'published' ELSE 'submitted' END;

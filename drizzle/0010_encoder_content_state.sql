ALTER TABLE "media_library" ADD COLUMN "encoder_job_id" text;
ALTER TABLE "media_library" ADD COLUMN "processing_status" varchar(30) DEFAULT 'not_started' NOT NULL;
ALTER TABLE "media_library" ADD COLUMN "processing_error" text;
ALTER TABLE "media_library" ADD COLUMN "processed_at" timestamp;


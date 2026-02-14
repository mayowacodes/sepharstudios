CREATE TABLE "files" (
	"id" text PRIMARY KEY NOT NULL,
	"remote_id" text NOT NULL,
	"url" text NOT NULL,
	"bucket" text NOT NULL,
	"size" integer,
	"type" text,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "video_file_id" text;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "thumbnail_file_id" text;--> statement-breakpoint
ALTER TABLE "media_library" ADD COLUMN "video_file_id" text;--> statement-breakpoint
ALTER TABLE "media_library" ADD COLUMN "thumbnail_file_id" text;--> statement-breakpoint
ALTER TABLE "media_library" ADD COLUMN "backdrop_file_id" text;--> statement-breakpoint
ALTER TABLE "media_library" ADD COLUMN "poster_file_id" text;--> statement-breakpoint
ALTER TABLE "media_library" ADD COLUMN "trailer_file_id" text;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "video_file_id" text;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "thumbnail_file_id" text;--> statement-breakpoint
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_video_file_id_files_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_thumbnail_file_id_files_id_fk" FOREIGN KEY ("thumbnail_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_library" ADD CONSTRAINT "media_library_video_file_id_files_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_library" ADD CONSTRAINT "media_library_thumbnail_file_id_files_id_fk" FOREIGN KEY ("thumbnail_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_library" ADD CONSTRAINT "media_library_backdrop_file_id_files_id_fk" FOREIGN KEY ("backdrop_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_library" ADD CONSTRAINT "media_library_poster_file_id_files_id_fk" FOREIGN KEY ("poster_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_library" ADD CONSTRAINT "media_library_trailer_file_id_files_id_fk" FOREIGN KEY ("trailer_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_video_file_id_files_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_thumbnail_file_id_files_id_fk" FOREIGN KEY ("thumbnail_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
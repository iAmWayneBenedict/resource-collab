DROP TABLE "resource_access" CASCADE;--> statement-breakpoint
ALTER TABLE "resource_short_urls" ADD COLUMN "access_level" "access_level" DEFAULT 'private' NOT NULL;
ALTER TABLE "users" ADD COLUMN "profession" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "custom_profession" text DEFAULT '';
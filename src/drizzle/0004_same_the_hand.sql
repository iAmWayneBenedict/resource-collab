ALTER TABLE "user_subscriptions" ALTER COLUMN "limit_counts" SET DEFAULT '{"collections":0,"shared_users":0,"ai_searches_per_day":0}'::jsonb;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD COLUMN "billing_type" varchar DEFAULT 'monthly' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "affiliation" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "news_letter" boolean DEFAULT false NOT NULL;
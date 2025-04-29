ALTER TABLE "subscriptions" ALTER COLUMN "monthly_price" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "monthly_price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "yearly_price" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "yearly_price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "monthly_price_local" numeric;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "yearly_price_local" numeric;
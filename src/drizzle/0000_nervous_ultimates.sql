CREATE TYPE "public"."access_level" AS ENUM('public', 'private', 'shared');--> statement-breakpoint
CREATE TYPE "public"."subscription_enum" AS ENUM('early access', 'free', 'premium', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."users_enum" AS ENUM('user', 'admin', 'guest');--> statement-breakpoint
CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" varchar NOT NULL,
	"provider_id" varchar NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" varchar,
	"id_token" text,
	"password" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "admins" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "collection_folders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"access_level" "access_level" DEFAULT 'private' NOT NULL,
	"shared_to" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "collection_folders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "collection_short_urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"short_code" varchar(10) NOT NULL,
	"collection_folder_id" serial NOT NULL,
	"user_id" text,
	"expired_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "collection_short_urls_short_code_unique" UNIQUE("short_code")
);
--> statement-breakpoint
ALTER TABLE "collection_short_urls" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "email_verification_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"code" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "email_verification_codes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "external_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" text NOT NULL,
	"link" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "external_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "like_resources" (
	"user_id" varchar NOT NULL,
	"resource_id" integer NOT NULL,
	"liked_at" timestamp DEFAULT now(),
	CONSTRAINT "like_resources_pk" PRIMARY KEY("user_id","resource_id")
);
--> statement-breakpoint
ALTER TABLE "like_resources" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "oauth_account" (
	"provider_id" text NOT NULL,
	"provider_user_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "oauth_account_pk" PRIMARY KEY("provider_id","provider_user_id")
);
--> statement-breakpoint
ALTER TABLE "oauth_account" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "portfolio_collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"collection_folder_id" serial NOT NULL,
	"portfolio_id" integer
);
--> statement-breakpoint
ALTER TABLE "portfolio_collections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "portfolio_skills" (
	"portfolio_id" serial NOT NULL,
	"skill_id" serial NOT NULL,
	CONSTRAINT "portfolio_skills_pk" PRIMARY KEY("portfolio_id","skill_id")
);
--> statement-breakpoint
ALTER TABLE "portfolio_skills" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "portfolio_tags" (
	"portfolio_id" serial NOT NULL,
	"tag_id" serial NOT NULL,
	CONSTRAINT "portfolio_tags_pk" PRIMARY KEY("tag_id","portfolio_id")
);
--> statement-breakpoint
ALTER TABLE "portfolio_tags" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"category_id" serial NOT NULL,
	"name" varchar NOT NULL,
	"icon" text NOT NULL,
	"thumbnail" text NOT NULL,
	"description" text,
	"level" text NOT NULL,
	"is_looking_for_job" boolean DEFAULT false NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "portfolios" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "resource_access" (
	"id" serial PRIMARY KEY NOT NULL,
	"resource_short_url_id" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "resource_access" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "resource_collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"collection_folder_id" serial NOT NULL,
	"resource_id" integer
);
--> statement-breakpoint
ALTER TABLE "resource_collections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "resource_short_urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_path" text NOT NULL,
	"short_code" varchar(10) NOT NULL,
	"resource_id" serial NOT NULL,
	"user_id" text,
	"emails" text[] DEFAULT ARRAY[]::text[],
	"expired_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "resource_short_urls_short_code_unique" UNIQUE("short_code")
);
--> statement-breakpoint
ALTER TABLE "resource_short_urls" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "resource_tags" (
	"resource_id" serial NOT NULL,
	"tag_id" serial NOT NULL,
	CONSTRAINT "resource_tags_pk" PRIMARY KEY("tag_id","resource_id")
);
--> statement-breakpoint
ALTER TABLE "resource_tags" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" serial NOT NULL,
	"owner_id" text,
	"name" varchar,
	"icon" text,
	"thumbnail" text,
	"description" text,
	"url" text NOT NULL,
	"view_count" serial NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "resources" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "skills" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "subscription_enum" DEFAULT 'early access' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" serial NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tags" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_resources" (
	"user_id" varchar NOT NULL,
	"resource_id" serial NOT NULL,
	CONSTRAINT "user_resources_pk" PRIMARY KEY("user_id","resource_id")
);
--> statement-breakpoint
ALTER TABLE "user_resources" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"subscription_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"image" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"role" "users_enum" DEFAULT 'user' NOT NULL,
	"status" "users_status_enum" DEFAULT 'active' NOT NULL,
	"password" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"identifier" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "collection_folders" ADD CONSTRAINT "collection_folders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "collection_short_urls" ADD CONSTRAINT "collection_short_urls_collection_folder_id_collection_folders_id_fk" FOREIGN KEY ("collection_folder_id") REFERENCES "public"."collection_folders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "collection_short_urls" ADD CONSTRAINT "collection_short_urls_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "email_verification_codes" ADD CONSTRAINT "email_verification_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "like_resources" ADD CONSTRAINT "like_resources_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "like_resources" ADD CONSTRAINT "like_resources_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "oauth_account" ADD CONSTRAINT "oauth_account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "portfolio_collections" ADD CONSTRAINT "portfolio_collections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "portfolio_collections" ADD CONSTRAINT "portfolio_collections_collection_folder_id_collection_folders_id_fk" FOREIGN KEY ("collection_folder_id") REFERENCES "public"."collection_folders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "portfolio_collections" ADD CONSTRAINT "portfolio_collections_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "portfolio_skills" ADD CONSTRAINT "portfolio_skills_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "portfolio_skills" ADD CONSTRAINT "portfolio_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "portfolio_tags" ADD CONSTRAINT "portfolio_tags_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "portfolio_tags" ADD CONSTRAINT "portfolio_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "resource_access" ADD CONSTRAINT "resource_access_resource_short_url_id_resource_short_urls_id_fk" FOREIGN KEY ("resource_short_url_id") REFERENCES "public"."resource_short_urls"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "resource_collections" ADD CONSTRAINT "resource_collections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "resource_collections" ADD CONSTRAINT "resource_collections_collection_folder_id_collection_folders_id_fk" FOREIGN KEY ("collection_folder_id") REFERENCES "public"."collection_folders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "resource_collections" ADD CONSTRAINT "resource_collections_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "resource_short_urls" ADD CONSTRAINT "resource_short_urls_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "resource_short_urls" ADD CONSTRAINT "resource_short_urls_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "resource_tags" ADD CONSTRAINT "resource_tags_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "resource_tags" ADD CONSTRAINT "resource_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_messages" ADD CONSTRAINT "user_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_resources" ADD CONSTRAINT "user_resources_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_resources" ADD CONSTRAINT "user_resources_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE cascade;
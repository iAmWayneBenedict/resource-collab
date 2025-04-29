import { relations } from "drizzle-orm";
import {
	boolean,
	jsonb,
	pgTable,
	serial,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { subscriptions } from "./subscriptions";

export const userSubscriptions = pgTable("user_subscriptions", {
	id: serial("id").primaryKey(),
	user_id: varchar("user_id")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	subscription_id: serial("subscription_id")
		.notNull()
		.references(() => subscriptions.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	started_at: timestamp("started_at", { mode: "date" }).defaultNow(),
	expired_at: timestamp("expired_at", { mode: "date" }).defaultNow(),
	billing_type: varchar("billing_type").notNull().default("monthly"),
	is_trial: boolean("is_trial").notNull().default(false),
	is_lifetime: boolean("is_lifetime").notNull().default(false),
	limit_counts: jsonb("limit_counts").notNull().default({
		collections: 0,
		shared_users: 0,
		ai_searches_per_day: 0,
		ai_searches: 0,
	}),
}).enableRLS();

export const userSubscriptionRelations = relations(
	userSubscriptions,
	({ one }) => ({
		user: one(users, {
			fields: [userSubscriptions.user_id],
			references: [users.id],
		}),
		subscription: one(subscriptions, {
			fields: [userSubscriptions.subscription_id],
			references: [subscriptions.id],
		}),
	}),
);

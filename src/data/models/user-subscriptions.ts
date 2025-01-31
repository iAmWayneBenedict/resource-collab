import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { subscriptions } from "./subscriptions";

export const userSubscription = pgTable("user_subscriptions", {
	id: serial("id").primaryKey(),
	user_id: varchar("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
		.notNull(),
	subscription_id: serial("subscription_id")
		.notNull()
		.references(() => subscriptions.id, { onDelete: "cascade", onUpdate: "cascade" })
		.notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const userSubscriptionRelations = relations(userSubscription, ({ one }) => ({
	user: one(users, {
		fields: [userSubscription.user_id],
		references: [users.id],
	}),
	subscription: one(subscriptions, {
		fields: [userSubscription.subscription_id],
		references: [subscriptions.id],
	}),
}));

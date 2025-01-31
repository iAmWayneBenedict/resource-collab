import { relations } from "drizzle-orm";
import { pgEnum, pgTable, serial } from "drizzle-orm/pg-core";
import { userSubscription } from "./user-subscriptions";

export const subscriptionEnum = pgEnum("subscription_enum", [
	"early access",
	"free",
	"premium",
	"enterprise",
]);

//  TODO: add subscription type and details as well
/**
 * Subscription
 * * early access - those users who have subscribed to early access
 * * free - those users who have subscribed to free plan
 * * premium - those users who have subscribed to premium plan (early access + free)
 * * enterprise - those users who have subscribed to enterprise plan (early access + free + premium)
 */

export const subscriptions = pgTable("subscriptions", {
	id: serial("id").primaryKey(),
	type: subscriptionEnum("type").notNull().default("early access"),
});

export const subscriptionsRelations = relations(subscriptions, ({ many }) => ({
	userSubscriptions: many(userSubscription),
}));

import { relations } from "drizzle-orm";
import {
	boolean,
	decimal,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	smallint,
	text,
} from "drizzle-orm/pg-core";
import { userSubscriptions } from "./user-subscriptions";

export const subscriptionEnum = pgEnum("subscription_enum", [
	"early access",
	"free",
	"premium",
	"ultimate",
]);

//  TODO: add subscription type and details as well
/**
 * Subscription
 * * early access - those users who have subscribed to early access
 * * free - those users who have subscribed to free plan
 * * premium - those users who have subscribed to premium plan (early access + free)
 * * ultimate - those users who have subscribed to ultimate plan (early access + free + premium)
 */

export const subscriptions = pgTable("subscriptions", {
	id: serial("id").primaryKey(),
	type: subscriptionEnum("type").notNull().default("early access"),
	monthly_price_local: decimal("monthly_price_local"),
	yearly_price_local: decimal("yearly_price_local"),
	monthly_price: decimal("monthly_price"),
	yearly_price: decimal("yearly_price"),
	description: text("description").notNull(),
	features: text("features").array().notNull(),
	is_active: boolean("is_active").notNull().default(true),
	tier: smallint("tier").notNull().default(1),
	limits: jsonb("limits").notNull().default({}),
}).enableRLS();

export const subscriptionsRelations = relations(subscriptions, ({ many }) => ({
	userSubscriptions: many(userSubscriptions),
}));

import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { resources } from "./resources";
import { users } from "./users";

export const resourceShortUrls = pgTable("resource_short_urls", {
	id: serial("id").primaryKey(),
	full_path: text().notNull(),
	short_code: varchar("short_code", { length: 10 }).notNull().unique(),
	resource_id: serial("resource_id").references(() => resources.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
	user_id: text("user_id").references(() => users.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
	expired_at: timestamp("expired_at", {
		mode: "date",
		withTimezone: true,
	}).defaultNow(),
}).enableRLS();

export const resourceShortUrlRelations = relations(
	resourceShortUrls,
	({ one }) => ({
		resource: one(resources, {
			fields: [resourceShortUrls.resource_id],
			references: [resources.id],
		}),
		user: one(users, {
			fields: [resourceShortUrls.user_id],
			references: [users.id],
		}),
	}),
);

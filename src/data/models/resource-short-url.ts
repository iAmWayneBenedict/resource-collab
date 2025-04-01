import { relations, sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { resources } from "./resources";
import { users } from "./users";
import { accessLevel } from "./collection-folders";

export const resourceShortUrlAccess = pgTable("resource_short_urls", {
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
	emails: text("emails")
		.array()
		.default(sql`ARRAY[]::text[]`),
	access_level: accessLevel("access_level").notNull().default("private"),
	expired_at: timestamp("expired_at", {
		mode: "date",
		withTimezone: true,
	}).defaultNow(),
}).enableRLS();

export const resourceShortUrlAccessRelations = relations(
	resourceShortUrlAccess,
	({ one }) => ({
		resource: one(resources, {
			fields: [resourceShortUrlAccess.resource_id],
			references: [resources.id],
		}),
		user: one(users, {
			fields: [resourceShortUrlAccess.user_id],
			references: [users.id],
		}),
	}),
);

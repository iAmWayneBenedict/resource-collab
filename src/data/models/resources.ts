import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userResources } from "./user-resources";
import { categories } from "./categories";
import { bookmarks } from "./bookmarks";
import { resourceTags } from "./resource-tags";
import { users } from "./users";

export const resources = pgTable("resources", {
	id: serial("id").primaryKey(),
	category_id: serial("category_id").references(() => categories.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
	owner_id: text("owner_id").references(() => users.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
	name: varchar("name"),
	icon: text("icon"),
	thumbnail: text("thumbnail"),
	description: text("description"),
	url: text("url").notNull(),
	view_count: serial("view_count").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const resourceRelations = relations(resources, ({ many, one }) => ({
	userResources: many(userResources),
	category: one(categories, {
		fields: [resources.category_id],
		references: [categories.id],
	}),
	bookmarks: many(bookmarks),
	resourceTags: many(resourceTags),
	owner: one(users, {
		fields: [resources.owner_id],
		references: [users.id],
	}),
}));

export type ResourcesSelectType = typeof resources.$inferSelect;
export type ResourcesInsertType = typeof resources.$inferInsert;
export type ResourcesType = typeof resources;

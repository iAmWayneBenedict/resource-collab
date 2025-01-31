import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { userResources } from "./user-resources";
import { categories } from "./categories";
import { bookmarks } from "./bookmarks";
import { resourceTags } from "./resource-tags";

const resourcesObject = z.object({
	id: z.number(),
	category_id: z.number(),
	name: z.string(),
	icon: z.string(),
	thumbnail: z.string(),
	view_count: z.number(),
	description: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});
export type TResources = z.infer<typeof resourcesObject>;

export const resources = pgTable("resources", {
	id: serial("id").primaryKey(),
	category_id: serial("category_id").references(() => categories.id),
	name: varchar("name"),
	icon: text("icon"),
	thumbnail: text("thumbnail"),
	description: text("description"),
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
}));

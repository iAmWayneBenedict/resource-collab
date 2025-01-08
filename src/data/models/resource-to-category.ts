import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import { resources } from "./resource";
import { relations } from "drizzle-orm";
import { resourceCategories } from "./resource-categories";

const resourceToCategoriesObject = z.object({
	id: z.number(),
	resource_id: z.number(),
	category_id: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
});

export type TResourceToCategories = z.infer<typeof resourceToCategoriesObject>;

export const resourceToCategories = pgTable("resource_to_categories", {
	id: serial("id").primaryKey(),
	resource_id: serial("resource_id")
		.references(() => resources.id)
		.notNull(),
	category_id: serial("category_id")
		.references(() => resourceCategories.id)
		.notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const resourceToCategoriesRelations = relations(resourceToCategories, ({ one }) => ({
	resource: one(resources, {
		fields: [resourceToCategories.resource_id],
		references: [resources.id],
	}),
	category: one(resourceCategories, {
		fields: [resourceToCategories.category_id],
		references: [resourceCategories.id],
	}),
}));

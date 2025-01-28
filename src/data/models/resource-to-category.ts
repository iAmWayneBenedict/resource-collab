import { pgTable, primaryKey, serial, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import { resources } from "./resource";
import { relations } from "drizzle-orm";
import { resourceCategories } from "./resource-categories";

const resourceToCategoriesObject = z.object({
	resource_id: z.number(),
	category_id: z.number(),
});

export type TResourceToCategories = z.infer<typeof resourceToCategoriesObject>;

export const resourceToCategories = pgTable(
	"resource_to_categories",
	{
		resource_id: serial("resource_id")
			.references(() => resources.id, { onDelete: "cascade", onUpdate: "cascade" })
			.notNull(),
		category_id: serial("category_id")
			.references(() => resourceCategories.id, { onDelete: "cascade", onUpdate: "cascade" })
			.notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.resource_id, table.category_id] }),
		pkWithCustomName: primaryKey({
			name: "resource_to_categories_pk",
			columns: [table.resource_id, table.category_id],
		}),
	})
);

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

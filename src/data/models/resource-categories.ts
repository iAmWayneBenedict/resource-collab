import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { resources } from "./resource";

const resourceCategoriesObject = z.object({
	id: z.number(),
	category: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

export type TResourceCategories = z.infer<typeof resourceCategoriesObject>;

export const resourceCategories = pgTable("resource_categories", {
	id: serial("id").primaryKey(),
	category: varchar("category").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const resourceCategoryRelations = relations(resourceCategories, ({ many }) => ({
	resources: many(resources),
}));

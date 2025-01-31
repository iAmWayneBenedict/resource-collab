import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { portfolios } from "./portfolios";
import { resources } from "./resources";

const categoriesObject = z.object({
	id: z.number(),
	name: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

export type TCategories = z.infer<typeof categoriesObject>;

export const categories = pgTable("categories", {
	id: serial("id").primaryKey(),
	name: varchar("name").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const categoryRelations = relations(categories, ({ many }) => ({
	resources: many(resources),
	portfolios: many(portfolios),
}));

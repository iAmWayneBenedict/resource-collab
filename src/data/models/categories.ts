import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { portfolios } from "./portfolios";
import { resources } from "./resources";

export const categories = pgTable("categories", {
	id: serial("id").primaryKey(),
	name: varchar("name").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export type CategoryType = typeof categories;

export const categoryRelations = relations(categories, ({ many }) => ({
	resources: many(resources),
	portfolios: many(portfolios),
}));

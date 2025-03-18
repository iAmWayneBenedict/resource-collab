import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { portfolios } from "./portfolios";
import { resources } from "./resources";
import { tags } from "./tags";

export const categories = pgTable("categories", {
	id: serial("id").primaryKey(),
	name: varchar("name").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
}).enableRLS();

export type CategoryType = typeof categories;
export type CategorySelectType = typeof categories.$inferSelect;

export const categoryRelations = relations(categories, ({ many }) => ({
	resources: many(resources),
	portfolios: many(portfolios),
	tags: many(tags),
}));

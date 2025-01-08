import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const portfolioCategories = pgTable("portfolio_categories", {
	id: serial("id").primaryKey(),
	category: varchar("category").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

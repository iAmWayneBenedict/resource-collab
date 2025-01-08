import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { portfolios } from "./portfolio";
import { relations } from "drizzle-orm";

export const portfolioBookmarkCounts = pgTable("portfolio_bookmark_counts", {
	id: serial("id").primaryKey(),
	portfolio_id: serial("portfolio_id")
		.references(() => portfolios.id)
		.notNull(),
	count: integer("count").default(0),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const portfolioBookmarkCountsRelations = relations(portfolioBookmarkCounts, ({ one }) => ({
	portfolio: one(portfolios, {
		fields: [portfolioBookmarkCounts.portfolio_id],
		references: [portfolios.id],
	}),
}));

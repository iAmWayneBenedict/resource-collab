import { relations } from "drizzle-orm";
import { pgTable, primaryKey, serial } from "drizzle-orm/pg-core";
import { tags } from "./tags";
import { portfolios } from "./portfolios";

export const portfolioTags = pgTable(
	"portfolio_tags",
	{
		portfolio_id: serial("portfolio_id")
			.notNull()
			.references(() => portfolios.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		tag_id: serial("tag_id")
			.notNull()
			.references(() => tags.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.portfolio_id, table.tag_id] }),
		pkWithCustomName: primaryKey({
			name: "portfolio_tags_pk",
			columns: [table.portfolio_id, table.tag_id],
		}),
	})
);

export const portfolioTagsRelations = relations(portfolioTags, ({ one }) => ({
	portfolio: one(portfolios, {
		fields: [portfolioTags.portfolio_id],
		references: [portfolios.id],
	}),
	tag: one(tags, {
		fields: [portfolioTags.tag_id],
		references: [tags.id],
	}),
}));

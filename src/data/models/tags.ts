import { relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { resourceTags } from "./resource-tags";
import { categories } from "./categories";
import { portfolioTags } from "./portfolio-tags";

export const tags = pgTable("tags", {
	id: serial("id").primaryKey(),
	category_id: serial("category_id")
		.references(() => categories.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	name: varchar("name").notNull(),
});

export type TagType = typeof tags;
export type TagSelectType = typeof tags.$inferSelect;
export type TagInsertType = typeof tags.$inferInsert;

export const tagsRelations = relations(tags, ({ many, one }) => ({
	resourceTags: many(resourceTags),
	portfolioTags: many(portfolioTags),
	category: one(categories, {
		fields: [tags.category_id],
		references: [categories.id],
	}),
}));

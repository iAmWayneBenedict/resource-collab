import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { resources } from "./resource";
import { relations } from "drizzle-orm";

export const resourceBookmarkCounts = pgTable("resource_bookmark_counts", {
	id: serial("id").primaryKey(),
	resource_id: serial("resource_id")
		.references(() => resources.id)
		.notNull(),
	count: integer("count").default(0),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const resourceBookmarkCountsRelations = relations(resourceBookmarkCounts, ({ one }) => ({
	resource: one(resources, {
		fields: [resourceBookmarkCounts.resource_id],
		references: [resources.id],
	}),
}));

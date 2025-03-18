import { relations } from "drizzle-orm";
import { pgTable, primaryKey, serial } from "drizzle-orm/pg-core";
import { resources } from "./resources";
import { tags } from "./tags";

export const resourceTags = pgTable(
	"resource_tags",
	{
		resource_id: serial("resource_id")
			.notNull()
			.references(() => resources.id, {
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
	(table) => [
		primaryKey({
			name: "resource_tags_pk",
			columns: [table.tag_id, table.resource_id],
		}),
	],
).enableRLS();

export const resourceTagsRelations = relations(resourceTags, ({ one }) => ({
	resource: one(resources, {
		fields: [resourceTags.resource_id],
		references: [resources.id],
	}),
	tag: one(tags, {
		fields: [resourceTags.tag_id],
		references: [tags.id],
	}),
}));

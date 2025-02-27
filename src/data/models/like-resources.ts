import { relations } from "drizzle-orm";
import { pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { resources } from "./resources";

export const likeResources = pgTable(
	"like_resources",
	{
		user_id: varchar("user_id")
			.references(() => users.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),
		resource_id: varchar("resource_id")
			.references(() => resources.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),
		liked_at: timestamp("liked_at", { mode: "date" }).defaultNow(),
	},
	(table) => [
		primaryKey({
			name: "like_resources_pk",
			columns: [table.user_id, table.resource_id],
		}),
	],
);

export const likeResourcesRelations = relations(likeResources, ({ one }) => ({
	user: one(users, {
		fields: [likeResources.user_id],
		references: [users.id],
	}),
	resource: one(resources, {
		fields: [likeResources.resource_id],
		references: [resources.id],
	}),
}));

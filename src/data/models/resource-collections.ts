import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { resources } from "./resources";
import { collectionFolders } from "./collection-folders";

export const resourceCollections = pgTable("resource_collections", {
	id: serial("id").primaryKey(),
	user_id: varchar("user_id")
		.references(() => users.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	collection_folder_id: serial("collection_folder_id")
		.references(() => collectionFolders.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	resource_id: integer("resource_id").references(() => resources.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
}).enableRLS();

export const resourceCollectionsRelations = relations(
	resourceCollections,
	({ one }) => ({
		user: one(users, {
			fields: [resourceCollections.user_id],
			references: [users.id],
		}),
		collectionFolder: one(collectionFolders, {
			fields: [resourceCollections.collection_folder_id],
			references: [collectionFolders.id],
		}),
		resource: one(resources, {
			fields: [resourceCollections.resource_id],
			references: [resources.id],
		}),
	}),
);

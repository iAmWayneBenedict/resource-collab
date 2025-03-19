import { relations, sql } from "drizzle-orm";
import { boolean, jsonb, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { collectionFolders } from "./collection-folders";

export const folderAccess = pgTable("folder_access", {
	id: serial("id").primaryKey(),
	collection_folder_id: serial("collection_folder_id")
		.references(() => collectionFolders.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	emails: jsonb("emails")
		.default(sql`'[]'::jsonb`)
		.notNull(),
}).enableRLS();

export const folderAccessRelations = relations(folderAccess, ({ one }) => ({
	collectionFolder: one(collectionFolders, {
		fields: [folderAccess.collection_folder_id],
		references: [collectionFolders.id],
	}),
}));

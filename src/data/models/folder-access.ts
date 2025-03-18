import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { collectionFolders } from "./collection-folders";

export const folderAccess = pgTable("folder_access", {
	id: serial("id").primaryKey(),
	collection_folder_id: serial("collection_folder_id")
		.references(() => collectionFolders.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	email: varchar("email").notNull(),
	is_viewed: boolean("is_viewed").notNull().default(false),
}).enableRLS();

export const folderAccessRelations = relations(folderAccess, ({ one }) => ({
	collectionFolder: one(collectionFolders, {
		fields: [folderAccess.collection_folder_id],
		references: [collectionFolders.id],
	}),
}));

import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { bookmarkFolders } from "./bookmark-folders";

export const folderAccess = pgTable("folder_access", {
	id: serial("id").primaryKey(),
	bookmark_folder_id: serial("bookmark_folder_id")
		.references(() => bookmarkFolders.id, { onDelete: "cascade", onUpdate: "cascade" })
		.notNull(),
	email: varchar("email").notNull(),
	is_viewed: boolean("is_viewed").notNull().default(false),
});

export const folderAccessRelations = relations(folderAccess, ({ one }) => ({
	bookmarkFolder: one(bookmarkFolders, {
		fields: [folderAccess.bookmark_folder_id],
		references: [bookmarkFolders.id],
	}),
}));

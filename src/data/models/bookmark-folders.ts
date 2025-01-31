import { relations } from "drizzle-orm";
import { pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { bookmarks } from "./bookmarks";
import { folderAccess } from "./folder-access";

export const bookmarkFoldersVisibility = pgEnum("bookmark_folders_visibility", [
	"public",
	"private",
	"shared",
]);

export const bookmarkFolders = pgTable("bookmark_folders", {
	id: serial("id").primaryKey(),
	user_id: varchar("user_id")
		.references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
		.notNull(),
	name: varchar("name").notNull(),
	visibility: bookmarkFoldersVisibility("visibility").notNull().default("private"),
});

export const bookmarkFoldersRelations = relations(bookmarkFolders, ({ one, many }) => ({
	user: one(users, {
		fields: [bookmarkFolders.user_id],
		references: [users.id],
	}),
	bookmarks: many(bookmarks),
	folderAccess: many(folderAccess),
}));

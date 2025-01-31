import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { resources } from "./resources";
import { portfolios } from "./portfolios";
import { bookmarkFolders } from "./bookmark-folders";

export const bookmarks = pgTable("bookmarks", {
	id: serial("id").primaryKey(),
	user_id: varchar("user_id")
		.references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
		.notNull(),
	bookmark_folder_id: serial("bookmark_folder_id")
		.references(() => bookmarkFolders.id, { onDelete: "cascade", onUpdate: "cascade" })
		.notNull(),
	resource_id: integer("resource_id").references(() => resources.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
	portfolio_id: serial("portfolio_id").references(() => portfolios.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
});

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
	user: one(users, {
		fields: [bookmarks.user_id],
		references: [users.id],
	}),
	bookmarkFolder: one(bookmarkFolders, {
		fields: [bookmarks.bookmark_folder_id],
		references: [bookmarkFolders.id],
	}),
	resource: one(resources, {
		fields: [bookmarks.resource_id],
		references: [resources.id],
	}),
	portfolio: one(portfolios, {
		fields: [bookmarks.portfolio_id],
		references: [portfolios.id],
	}),
}));

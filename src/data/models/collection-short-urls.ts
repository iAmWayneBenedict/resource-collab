import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { collectionFolders } from "./collection-folders";

export const collectionShortUrls = pgTable("collection_short_urls", {
	id: serial("id").primaryKey(),
	short_code: varchar("short_code", { length: 10 }).notNull().unique(),
	collection_folder_id: serial("collection_folder_id").references(
		() => collectionFolders.id,
		{
			onDelete: "cascade",
			onUpdate: "cascade",
		},
	),
	user_id: text("user_id").references(() => users.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
	expired_at: timestamp("expired_at", {
		mode: "date",
		withTimezone: true,
	}).defaultNow(),
}).enableRLS();

export const collectionShortUrlRelations = relations(
	collectionShortUrls,
	({ one }) => ({
		user: one(users, {
			fields: [collectionShortUrls.user_id],
			references: [users.id],
		}),
		collectionFolder: one(collectionFolders, {
			fields: [collectionShortUrls.collection_folder_id],
			references: [collectionFolders.id],
		}),
	}),
);

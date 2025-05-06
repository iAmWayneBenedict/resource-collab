import { pgTable, serial, text, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { collectionFolders } from "./collection-folders";
import { relations } from "drizzle-orm";

export const pinned = pgTable("pinned", {
	id: serial("id").primaryKey(),
	collection_id: uuid("collection_id").references(
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
}).enableRLS();

export const pinnedRelations = relations(pinned, ({ one }) => ({
	collectionFolders: one(collectionFolders, {
		fields: [pinned.collection_id],
		references: [collectionFolders.id],
	}),
	user: one(users, {
		fields: [pinned.user_id],
		references: [users.id],
	}),
}));

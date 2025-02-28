import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { portfolios } from "./portfolios";
import { collectionFolders } from "./collection-folders";

export const portfolioCollections = pgTable("portfolio_collections", {
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
	portfolio_id: integer("portfolio_id").references(() => portfolios.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
});

export const portfolioCollectionsRelations = relations(
	portfolioCollections,
	({ one }) => ({
		user: one(users, {
			fields: [portfolioCollections.user_id],
			references: [users.id],
		}),
		collectionFolder: one(collectionFolders, {
			fields: [portfolioCollections.collection_folder_id],
			references: [collectionFolders.id],
		}),
		portfolio: one(portfolios, {
			fields: [portfolioCollections.portfolio_id],
			references: [portfolios.id],
		}),
	}),
);

import { relations, sql } from "drizzle-orm";
import {
	jsonb,
	pgEnum,
	pgTable,
	serial,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { resourceCollections } from "./resource-collections";
import { portfolioCollections } from "./portfolio-collections";

export const accessLevel = pgEnum("access_level", [
	"public",
	"private",
	"shared",
]);

// export const permissionLevel = pgEnum("permission_level", ["view", "edit"]);

export const collectionFolders = pgTable("collection_folders", {
	id: uuid("id").primaryKey().defaultRandom(),
	user_id: varchar("user_id")
		.references(() => users.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	name: varchar("name").notNull(),
	access_level: accessLevel("access_level").notNull().default("private"),
	shared_to: jsonb("shared_to")
		.default(sql`'[]'::jsonb`)
		.notNull(),
	// permission_level: permissionLevel("permission_level")
	// 	.notNull()
	// 	.default("view"),
}).enableRLS();

export const collectionFoldersRelations = relations(
	collectionFolders,
	({ one, many }) => ({
		user: one(users, {
			fields: [collectionFolders.user_id],
			references: [users.id],
		}),
		resourceCollections: many(resourceCollections),
		portfolioCollections: many(portfolioCollections),
	}),
);

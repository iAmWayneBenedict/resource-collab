import { relations } from "drizzle-orm";
import { pgTable, primaryKey, serial, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { users } from "./users";
import { resources } from "./resources";

const userCategoriesObject = z.object({
	user_id: z.number(),
	resource_id: z.number(),
});

export type TUserResources = z.infer<typeof userCategoriesObject>;

export const userResources = pgTable(
	"user_resources",
	{
		user_id: varchar("user_id")
			.references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
			.notNull(),
		resource_id: serial("resource_id")
			.references(() => resources.id, { onDelete: "cascade", onUpdate: "cascade" })
			.notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.user_id, table.resource_id] }),
		pkWithCustomName: primaryKey({
			name: "user_resources_pk",
			columns: [table.user_id, table.resource_id],
		}),
	})
);

export const userResourcesRelations = relations(userResources, ({ one }) => ({
	user: one(users, {
		fields: [userResources.user_id],
		references: [users.id],
	}),
	resource: one(resources, {
		fields: [userResources.resource_id],
		references: [resources.id],
	}),
}));

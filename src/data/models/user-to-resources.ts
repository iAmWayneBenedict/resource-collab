import { relations } from "drizzle-orm";
import { pgTable, primaryKey, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { users } from "./user";
import { resources } from "./resource";

const userToCategoriesObject = z.object({
	user_id: z.number(),
	resource_id: z.number(),
});

export type TUserToResources = z.infer<typeof userToCategoriesObject>;

export const userToResources = pgTable(
	"user_to_resources",
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
			name: "user_to_resources_pk",
			columns: [table.user_id, table.resource_id],
		}),
	})
);

export const userToResourcesRelations = relations(userToResources, ({ one }) => ({
	user: one(users, {
		fields: [userToResources.user_id],
		references: [users.id],
	}),
	resource: one(resources, {
		fields: [userToResources.resource_id],
		references: [resources.id],
	}),
}));

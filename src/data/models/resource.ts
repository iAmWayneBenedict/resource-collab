import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { users } from "./user";
import { relations } from "drizzle-orm";
import { resourceToCategories } from "./resource-to-category";

const resourcesObject = z.object({
	id: z.number(),
	user_id: z.string(),
	name: z.string(),
	icon: z.string(),
	description: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});
export type TResources = z.infer<typeof resourcesObject>;

export const resources = pgTable("resources", {
	id: serial("id").primaryKey(),
	user_id: text("user_id")
		.references(() => users.id)
		.notNull(),
	name: varchar("name").notNull(),
	icon: text("icon").notNull(),
	description: text("description"),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const resourceUserRelations = relations(resources, ({ one }) => ({
	user: one(users, {
		fields: [resources.user_id],
		references: [users.id],
	}),
}));

export const resourceToCategoryRelations = relations(resources, ({ many }) => ({
	resourceToCategory: many(resourceToCategories),
}));

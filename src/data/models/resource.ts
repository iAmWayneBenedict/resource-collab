import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { resourceToCategories } from "./resource-to-category";
import { userToResources } from "./user-to-resources";

const resourcesObject = z.object({
	id: z.number(),
	name: z.string(),
	icon: z.string(),
	description: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});
export type TResources = z.infer<typeof resourcesObject>;

export const resources = pgTable("resources", {
	id: serial("id").primaryKey(),
	name: varchar("name").notNull(),
	icon: text("icon").notNull(),
	description: text("description"),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const resourceRelations = relations(resources, ({ many }) => ({
	resourceToCategory: many(resourceToCategories),
	userToResources: many(userToResources),
}));

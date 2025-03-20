import { relations, sql } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { resourceShortUrlAccess } from "./resource-short-url";

export const resourceAccess = pgTable("resource_access", {
	id: serial("id").primaryKey(),
	resource_short_url_id: serial("resource_short_url_id").references(
		() => resourceShortUrlAccess.id,
		{
			onDelete: "cascade",
			onUpdate: "cascade",
		},
	),
}).enableRLS();

export const resourceAccessRelations = relations(resourceAccess, ({ one }) => ({
	resourceShortUrl: one(resourceShortUrlAccess, {
		fields: [resourceAccess.resource_short_url_id],
		references: [resourceShortUrlAccess.id],
	}),
}));

import { relations, sql } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { resourceShortUrls } from "./resource-short-url";

export const resourceAccess = pgTable("resource_access", {
	id: serial("id").primaryKey(),
	resource_short_url_id: serial("resource_short_url_id").references(
		() => resourceShortUrls.id,
		{
			onDelete: "cascade",
			onUpdate: "cascade",
		},
	),
	emails: text("emails")
		.array()
		.default(sql`ARRAY[]::text[]`),
}).enableRLS();

export const resourceAccessRelations = relations(resourceAccess, ({ one }) => ({
	resourceShortUrl: one(resourceShortUrls, {
		fields: [resourceAccess.resource_short_url_id],
		references: [resourceShortUrls.id],
	}),
}));

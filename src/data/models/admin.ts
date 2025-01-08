import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";

export const admins = pgTable("admins", {
	id: serial("id").primaryKey(),
	user_id: text("user_id")
		.references(() => users.id)
		.notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const adminUserRelations = relations(admins, ({ one }) => ({
	user: one(users, {
		fields: [admins.user_id],
		references: [users.id],
	}),
}));

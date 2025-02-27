import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	user_id: text("user_id")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	token: text("token").notNull(),
	ip_address: text("ip_address"),
	user_agent: text("user_agent"),
	expires_at: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.user_id],
		references: [users.id],
	}),
}));

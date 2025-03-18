import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const emailVerificationCodes = pgTable("email_verification_codes", {
	id: serial("id").primaryKey(),
	user_id: text("user_id")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	code: text("code").notNull(),
	email: text("email").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	expires_at: timestamp("expires_at", { mode: "date" }).notNull(),
}).enableRLS();

export const emailVerificationCodesRelations = relations(
	emailVerificationCodes,
	({ one }) => ({
		user: one(users, {
			fields: [emailVerificationCodes.user_id],
			references: [users.id],
		}),
	}),
);

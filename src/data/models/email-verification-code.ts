import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";

export const emailVerificationCodes = pgTable("email_verification_codes", {
	id: serial("id").primaryKey(),
	user_id: text("user_id")
		.notNull()
		.references(() => users.id),
	code: text("code").notNull(),
	email: text("email").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	expires_at: timestamp("expires_at", { mode: "date" }).notNull(),
});

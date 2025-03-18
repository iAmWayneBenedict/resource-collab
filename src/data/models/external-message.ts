import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const externalMessages = pgTable("external_messages", {
	id: serial("id").primaryKey(),
	name: varchar("name").notNull(),
	email: text("email").notNull(),
	link: text("link").notNull(),
	message: text("message").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
}).enableRLS();

import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { sessionTable } from "./session";
import { portfolios } from "./portfolio";
import { admins } from "./admin";
import { userMessages } from "./user-message";
import { userToResources } from "./user-to-resources";

export const usersEnum = pgEnum("users_enum", ["user", "admin", "guest"]);

const usersObject = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	email_verified: z.boolean(),
	role: z.enum(["user", "admin", "guest"]),
	password: z.string(),
	created_at: z.date(),
	updated_at: z.date(),
});
export type TUsers = z.infer<typeof usersObject>;

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	name: varchar("name").notNull(),
	email: text("email").unique().notNull(),
	email_verified: boolean("email_verified").notNull().default(false),
	role: usersEnum("role").notNull().default("user"),
	password: text("password"),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const userRelations = relations(users, ({ many, one }) => ({
	session: one(sessionTable, {
		fields: [users.id],
		references: [sessionTable.userId],
	}),

	portfolio: one(portfolios, {
		fields: [users.id],
		references: [portfolios.user_id],
	}),

	resourcesToResources: many(userToResources),

	admin: one(admins, {
		fields: [users.id],
		references: [admins.user_id],
	}),

	messages: many(userMessages),
}));

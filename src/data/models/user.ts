import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { sessionTable } from "./session";
import { portfolios } from "./portfolio";
import { resources } from "./resource";
import { admins } from "./admin";
import { userMessages } from "./user-message";

export const usersEnum = pgEnum("users_enum", ["users", "admins", "super_admins", "guests"]);

const usersObject = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	role: z.enum(["users", "admins", "super_admins", "guests"]),
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
	role: usersEnum("role").notNull().default("users"),
	password: text("password"),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const userSessionRelations = relations(users, ({ one }) => ({
	session: one(sessionTable, {
		fields: [users.id],
		references: [sessionTable.userId],
	}),
}));

export const userPortfolioRelations = relations(users, ({ one }) => ({
	portfolio: one(portfolios, {
		fields: [users.id],
		references: [portfolios.user_id],
	}),
}));

export const userResourceRelations = relations(users, ({ many }) => ({
	resource: many(resources),
}));

export const userAdminRelations = relations(users, ({ one }) => ({
	admin: one(admins, {
		fields: [users.id],
		references: [admins.user_id],
	}),
}));

export const userMessagesRelations = relations(users, ({ many }) => ({
	message: many(userMessages),
}));

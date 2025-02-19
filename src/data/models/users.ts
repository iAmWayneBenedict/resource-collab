import { relations } from "drizzle-orm";
import {
	boolean,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { portfolios } from "./portfolios";
import { userMessages } from "./user-message";
import { userResources } from "./user-resources";
import { admins } from "./admins";
import { bookmarks } from "./bookmarks";
import { userSubscription } from "./user-subscriptions";
import { sessions } from "./sessions";
import { resources } from "./resources";

export const usersEnum = pgEnum("users_enum", ["user", "admin", "guest"]);
export const usersStatusEnum = pgEnum("users_status_enum", [
	"active",
	"inactive",
	"archived",
]);

const usersObject = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	email_verified: z.boolean(),
	role: z.enum(["user", "admin", "guest"]),
	status: z.enum(["active", "inactive", "archived"]),
	password: z.string(),
	created_at: z.date(),
	updated_at: z.date(),
});
export type TUsers = z.infer<typeof usersObject>;

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	name: varchar("name").notNull(),
	image: text("image"),
	email: text("email").unique().notNull(),
	email_verified: boolean("email_verified").notNull().default(false),
	role: usersEnum("role").notNull().default("user"),
	status: usersStatusEnum("status").notNull().default("active"),
	password: text("password"),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const userRelations = relations(users, ({ many, one }) => ({
	session: one(sessions, {
		fields: [users.id],
		references: [sessions.user_id],
	}),

	portfolio: one(portfolios, {
		fields: [users.id],
		references: [portfolios.user_id],
	}),

	userResources: many(userResources),

	admin: one(admins, {
		fields: [users.id],
		references: [admins.user_id],
	}),

	messages: many(userMessages),
	bookmarks: many(bookmarks),
	userSubscriptions: many(userSubscription),
	ownedResources: many(resources),
}));

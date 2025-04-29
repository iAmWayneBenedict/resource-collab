import { relations } from "drizzle-orm";
import {
	boolean,
	jsonb,
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
import { userSubscriptions } from "./user-subscriptions";
import { sessions } from "./sessions";
import { resources } from "./resources";
import { resourceCollections } from "./resource-collections";
import { portfolioCollections } from "./portfolio-collections";
import { collectionFolders } from "./collection-folders";
import { pinned } from "@/data/models/pinned";

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
	profession: jsonb("profession").default([]),
	custom_profession: text("custom_profession").default(""),
	affiliation: text("affiliation").default(""),
	news_letter: boolean("news_letter").notNull().default(false),
	status: usersStatusEnum("status").notNull().default("active"),
	password: text("password"),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
}).enableRLS();

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
	pinned: many(pinned),
	collectionFolders: many(collectionFolders),
	messages: many(userMessages),
	resourceCollections: many(resourceCollections),
	portfolioCollections: many(portfolioCollections),
	userSubscriptions: many(userSubscriptions),
	ownedResources: many(resources),
}));

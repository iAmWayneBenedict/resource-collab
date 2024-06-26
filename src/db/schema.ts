import { relations } from "drizzle-orm";
import {
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
	boolean,
	pgEnum,
	integer,
	primaryKey,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email().min(5).max(255),
	password: z.string().min(8).max(255),
});

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

export const userAdminRelations = relations(users, ({ one }) => ({
	admin: one(admins, {
		fields: [users.id],
		references: [admins.user_id],
	}),
}));

export const userSessionRelations = relations(users, ({ one }) => ({
	session: one(sessionTable, {
		fields: [users.id],
		references: [sessionTable.userId],
	}),
}));

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

const oauthAccountsObject = z.object({
	provider_id: z.string(),
	provider_user_id: z.string(),
	user_id: z.string(),
});

export type TOauthAccounts = z.infer<typeof oauthAccountsObject>;
export const oauthAccounts = pgTable(
	"oauth_account",
	{
		provider_id: text("provider_id").notNull(),
		provider_user_id: text("provider_user_id").notNull(),
		user_id: text("user_id")
			.notNull()
			.references(() => users.id),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.provider_id, table.provider_user_id] }),
			pkWithCustomName: primaryKey({
				name: "oauth_constraint",
				columns: [table.provider_id, table.provider_user_id],
			}),
		};
	}
);

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

export const userPortfolioRelations = relations(users, ({ one }) => ({
	portfolio: one(portfolios, {
		fields: [users.id],
		references: [portfolios.user_id],
	}),
}));

export const userResourceRelations = relations(users, ({ many }) => ({
	resource: many(resources),
}));

export const resources = pgTable("resources", {
	id: serial("id").primaryKey(),
	user_id: text("user_id")
		.references(() => users.id)
		.notNull(),
	name: varchar("name").notNull(),
	icon: text("icon").notNull(),
	description: text("description"),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const resourceRelations = relations(resources, ({ one }) => ({
	user: one(users, {
		fields: [resources.user_id],
		references: [users.id],
	}),
}));

export const portfolios = pgTable("portfolios", {
	id: serial("id").primaryKey(),
	user_id: text("user_id")
		.references(() => users.id)
		.notNull(),
	name: varchar("name").notNull(),
	icon: text("icon").notNull(),
	description: text("description"),
	level: text("level").notNull(),
	is_looking_for_job: boolean("is_looking_for_job").notNull().default(false),
	is_public: boolean("is_public").notNull().default(false),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const portfolioRelations = relations(portfolios, ({ one, many }) => ({
	user: one(users, {
		fields: [portfolios.user_id],
		references: [users.id],
	}),
	skills: many(portfolioToSkills),
}));

export const portfolioToSkills = pgTable("portfolio_to_skills", {
	id: serial("id").primaryKey(),
	portfolio_id: serial("portfolio_id")
		.references(() => portfolios.id)
		.notNull(),
	skill_id: serial("skill_id")
		.references(() => skills.id)
		.notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const portfolioToSkillsRelations = relations(portfolioToSkills, ({ one }) => ({
	portfolio: one(portfolios, {
		fields: [portfolioToSkills.portfolio_id],
		references: [portfolios.id],
	}),
	skill: one(skills, {
		fields: [portfolioToSkills.skill_id],
		references: [skills.id],
	}),
}));

export const skills = pgTable("skills", {
	id: serial("id").primaryKey(),
	skill: varchar("skill").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const skillRelations = relations(skills, ({ many }) => ({
	portfolios: many(portfolios),
}));

export const bookmarks = pgTable("bookmarks", {
	id: serial("id").primaryKey(),
	user_id: text("user_id")
		.references(() => users.id)
		.notNull(),
	resource_id: serial("resource_id")
		.references(() => resources.id)
		.notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const bookmarkRelations = relations(bookmarks, ({ one }) => ({
	user: one(users, {
		fields: [bookmarks.user_id],
		references: [users.id],
	}),
	resource: one(resources, {
		fields: [bookmarks.resource_id],
		references: [resources.id],
	}),
}));

export const admins = pgTable("admins", {
	id: serial("id").primaryKey(),
	user_id: text("user_id")
		.references(() => users.id)
		.notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const adminRelations = relations(admins, ({ one }) => ({
	user: one(users, {
		fields: [admins.user_id],
		references: [users.id],
	}),
}));

export const externalMessages = pgTable("external_messages", {
	id: serial("id").primaryKey(),
	name: varchar("name").notNull(),
	email: text("email").notNull(),
	link: text("link").notNull(),
	message: text("message").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const userMessages = pgTable("user_messages", {
	id: serial("id").primaryKey(),
	user_id: text("user_id")
		.references(() => users.id)
		.notNull(),
	message: text("message").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const userMessagesRelations = relations(userMessages, ({ many }) => ({
	user: many(users),
}));

export const resourceCategories = pgTable("resource_categories", {
	id: serial("id").primaryKey(),
	category: varchar("category").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const portfolioCategories = pgTable("portfolio_categories", {
	id: serial("id").primaryKey(),
	category: varchar("category").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const resourceBookmarkCounts = pgTable("resource_bookmark_counts", {
	id: serial("id").primaryKey(),
	resource_id: serial("resource_id")
		.references(() => resources.id)
		.notNull(),
	count: integer("count").default(0),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const resourceBookmarkCountsRelations = relations(resourceBookmarkCounts, ({ one }) => ({
	resource: one(resources, {
		fields: [resourceBookmarkCounts.resource_id],
		references: [resources.id],
	}),
}));

export const portfolioBookmarkCounts = pgTable("portfolio_bookmark_counts", {
	id: serial("id").primaryKey(),
	portfolio_id: serial("portfolio_id")
		.references(() => portfolios.id)
		.notNull(),
	count: integer("count").default(0),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const portfolioBookmarkCountsRelations = relations(portfolioBookmarkCounts, ({ one }) => ({
	portfolio: one(portfolios, {
		fields: [portfolioBookmarkCounts.portfolio_id],
		references: [portfolios.id],
	}),
}));

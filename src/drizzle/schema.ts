import { pgTable, pgEnum, serial, varchar, text, timestamp, unique, boolean, foreignKey, integer, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
export const factorType = pgEnum("factor_type", ['totp', 'webauthn', 'phone'])
export const oneTimeTokenType = pgEnum("one_time_token_type", ['confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token'])
export const usersEnum = pgEnum("users_enum", ['users', 'admins', 'super_admins', 'guests'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const equalityOp = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])


export const externalMessages = pgTable("external_messages", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name").notNull(),
	email: text("email").notNull(),
	link: text("link").notNull(),
	message: text("message").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const portfolioCategories = pgTable("portfolio_categories", {
	id: serial("id").primaryKey().notNull(),
	category: varchar("category").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: text("id").primaryKey().notNull(),
	name: varchar("name").notNull(),
	email: text("email").notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	role: usersEnum("role"),
	password: text("password"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});

export const admins = pgTable("admins", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => users.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => users.id),
	resourceId: serial("resource_id").notNull().references(() => resources.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const resources = pgTable("resources", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => users.id),
	name: varchar("name").notNull(),
	icon: text("icon").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const emailVerificationCodes = pgTable("email_verification_codes", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => users.id),
	code: text("code").notNull(),
	email: text("email").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
});

export const portfolios = pgTable("portfolios", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => users.id),
	name: varchar("name").notNull(),
	icon: text("icon").notNull(),
	description: text("description"),
	level: text("level").notNull(),
	isLookingForJob: boolean("is_looking_for_job").default(false).notNull(),
	isPublic: boolean("is_public").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const portfolioBookmarkCounts = pgTable("portfolio_bookmark_counts", {
	id: serial("id").primaryKey().notNull(),
	portfolioId: serial("portfolio_id").notNull().references(() => portfolios.id),
	count: integer("count").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const portfolioToSkills = pgTable("portfolio_to_skills", {
	id: serial("id").primaryKey().notNull(),
	portfolioId: serial("portfolio_id").notNull().references(() => portfolios.id),
	skillId: serial("skill_id").notNull().references(() => skills.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const skills = pgTable("skills", {
	id: serial("id").primaryKey().notNull(),
	skill: varchar("skill").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const resourceBookmarkCounts = pgTable("resource_bookmark_counts", {
	id: serial("id").primaryKey().notNull(),
	resourceId: serial("resource_id").notNull().references(() => resources.id),
	count: integer("count").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const resourceToCategories = pgTable("resource_to_categories", {
	id: serial("id").primaryKey().notNull(),
	resourceId: serial("resource_id").notNull().references(() => resources.id),
	categoryId: serial("category_id").notNull().references(() => resourceCategories.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const resourceCategories = pgTable("resource_categories", {
	id: serial("id").primaryKey().notNull(),
	category: varchar("category").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => users.id),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
});

export const userMessages = pgTable("user_messages", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => users.id),
	message: text("message").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const oauthAccount = pgTable("oauth_account", {
	providerId: text("provider_id").notNull(),
	providerUserId: text("provider_user_id").notNull(),
	userId: text("user_id").notNull().references(() => users.id),
},
(table) => {
	return {
		oauthAccountProviderIdProviderUserIdPk: primaryKey({ columns: [table.providerId, table.providerUserId], name: "oauth_account_provider_id_provider_user_id_pk"})
	}
});
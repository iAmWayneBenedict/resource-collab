import { pgTable, serial, varchar, text, timestamp, unique, boolean, foreignKey, integer, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const collectionFoldersVisibility = pgEnum("collection_folders_visibility", ['public', 'private', 'shared'])
export const subscriptionEnum = pgEnum("subscription_enum", ['early access', 'free', 'premium', 'enterprise'])
export const usersEnum = pgEnum("users_enum", ['user', 'admin', 'guest'])
export const usersStatusEnum = pgEnum("users_status_enum", ['active', 'inactive', 'archived'])


export const externalMessages = pgTable("external_messages", {
	id: serial().primaryKey().notNull(),
	name: varchar().notNull(),
	email: text().notNull(),
	link: text().notNull(),
	message: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const verifications = pgTable("verifications", {
	id: text().primaryKey().notNull(),
	value: text().notNull(),
	identifier: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
});

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: varchar().notNull(),
	image: text(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	role: usersEnum().default('user').notNull(),
	status: usersStatusEnum().default('active').notNull(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const accounts = pgTable("accounts", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	accountId: varchar("account_id").notNull(),
	providerId: varchar("provider_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: varchar(),
	idToken: text("id_token"),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const admins = pgTable("admins", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "admins_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const collectionFolders = pgTable("collection_folders", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	name: varchar().notNull(),
	visibility: collectionFoldersVisibility().default('private').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "collection_folders_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const collections = pgTable("collections", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	collectionFolderId: serial("collection_folder_id").notNull(),
	resourceId: integer("resource_id"),
	portfolioId: serial("portfolio_id"),
}, (table) => [
	foreignKey({
			columns: [table.collectionFolderId],
			foreignColumns: [collectionFolders.id],
			name: "collections_collection_folder_id_collection_folders_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.portfolioId],
			foreignColumns: [portfolios.id],
			name: "collections_portfolio_id_portfolios_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.resourceId],
			foreignColumns: [resources.id],
			name: "collections_resource_id_resources_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "collections_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const resources = pgTable("resources", {
	id: serial().primaryKey().notNull(),
	categoryId: serial("category_id").notNull(),
	ownerId: text("owner_id"),
	name: varchar(),
	icon: text(),
	thumbnail: text(),
	description: text(),
	url: text().notNull(),
	viewCount: serial("view_count").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "resources_category_id_categories_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [users.id],
			name: "resources_owner_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const portfolios = pgTable("portfolios", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	categoryId: serial("category_id").notNull(),
	name: varchar().notNull(),
	icon: text().notNull(),
	thumbnail: text().notNull(),
	description: text(),
	level: text().notNull(),
	isLookingForJob: boolean("is_looking_for_job").default(false).notNull(),
	isPublic: boolean("is_public").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "portfolios_category_id_categories_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "portfolios_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const emailVerificationCodes = pgTable("email_verification_codes", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	code: text().notNull(),
	email: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "email_verification_codes_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const folderAccess = pgTable("folder_access", {
	id: serial().primaryKey().notNull(),
	collectionFolderId: serial("collection_folder_id").notNull(),
	email: varchar().notNull(),
	isViewed: boolean("is_viewed").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.collectionFolderId],
			foreignColumns: [collectionFolders.id],
			name: "folder_access_collection_folder_id_collection_folders_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const skills = pgTable("skills", {
	id: serial().primaryKey().notNull(),
	name: varchar().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const tags = pgTable("tags", {
	id: serial().primaryKey().notNull(),
	categoryId: serial("category_id").notNull(),
	name: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "tags_category_id_categories_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const categories = pgTable("categories", {
	id: serial().primaryKey().notNull(),
	name: varchar().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	token: text().notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const userSubscriptions = pgTable("user_subscriptions", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	subscriptionId: serial("subscription_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.subscriptionId],
			foreignColumns: [subscriptions.id],
			name: "user_subscriptions_subscription_id_subscriptions_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_subscriptions_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const subscriptions = pgTable("subscriptions", {
	id: serial().primaryKey().notNull(),
	type: subscriptionEnum().default('early access').notNull(),
});

export const portfolioSkills = pgTable("portfolio_skills", {
	portfolioId: serial("portfolio_id").notNull(),
	skillId: serial("skill_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.portfolioId],
			foreignColumns: [portfolios.id],
			name: "portfolio_skills_portfolio_id_portfolios_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.skillId],
			foreignColumns: [skills.id],
			name: "portfolio_skills_skill_id_skills_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.portfolioId, table.skillId], name: "portfolio_skills_pk"}),
]);

export const portfolioTags = pgTable("portfolio_tags", {
	portfolioId: serial("portfolio_id").notNull(),
	tagId: serial("tag_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.portfolioId],
			foreignColumns: [portfolios.id],
			name: "portfolio_tags_portfolio_id_portfolios_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tags.id],
			name: "portfolio_tags_tag_id_tags_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.portfolioId, table.tagId], name: "portfolio_tags_pk"}),
]);

export const resourceTags = pgTable("resource_tags", {
	resourceId: serial("resource_id").notNull(),
	tagId: serial("tag_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.resourceId],
			foreignColumns: [resources.id],
			name: "resource_tags_resource_id_resources_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tags.id],
			name: "resource_tags_tag_id_tags_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.resourceId, table.tagId], name: "resource_tags_pk"}),
]);

export const userResources = pgTable("user_resources", {
	userId: varchar("user_id").notNull(),
	resourceId: serial("resource_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.resourceId],
			foreignColumns: [resources.id],
			name: "user_resources_resource_id_resources_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_resources_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.resourceId], name: "user_resources_pk"}),
]);

export const likeResources = pgTable("like_resources", {
	userId: varchar("user_id").notNull(),
	resourceId: integer("resource_id").notNull(),
	likedAt: timestamp("liked_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.resourceId],
			foreignColumns: [resources.id],
			name: "like_resources_resource_id_resources_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "like_resources_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.resourceId], name: "like_resources_pk"}),
]);

export const oauthAccount = pgTable("oauth_account", {
	providerId: text("provider_id").notNull(),
	providerUserId: text("provider_user_id").notNull(),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "oauth_account_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.providerId, table.providerUserId], name: "oauth_account_pk"}),
]);

import { relations } from "drizzle-orm/relations";
import { users, accounts, admins, collectionFolders, collections, portfolios, resources, categories, emailVerificationCodes, folderAccess, tags, sessions, subscriptions, userSubscriptions, portfolioSkills, skills, portfolioTags, resourceTags, userResources, likeResources, oauthAccount } from "./schema";

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	accounts: many(accounts),
	admins: many(admins),
	collectionFolders: many(collectionFolders),
	collections: many(collections),
	resources: many(resources),
	portfolios: many(portfolios),
	emailVerificationCodes: many(emailVerificationCodes),
	sessions: many(sessions),
	userSubscriptions: many(userSubscriptions),
	userResources: many(userResources),
	likeResources: many(likeResources),
	oauthAccounts: many(oauthAccount),
}));

export const adminsRelations = relations(admins, ({one}) => ({
	user: one(users, {
		fields: [admins.userId],
		references: [users.id]
	}),
}));

export const collectionFoldersRelations = relations(collectionFolders, ({one, many}) => ({
	user: one(users, {
		fields: [collectionFolders.userId],
		references: [users.id]
	}),
	collections: many(collections),
	folderAccesses: many(folderAccess),
}));

export const collectionsRelations = relations(collections, ({one}) => ({
	collectionFolder: one(collectionFolders, {
		fields: [collections.collectionFolderId],
		references: [collectionFolders.id]
	}),
	portfolio: one(portfolios, {
		fields: [collections.portfolioId],
		references: [portfolios.id]
	}),
	resource: one(resources, {
		fields: [collections.resourceId],
		references: [resources.id]
	}),
	user: one(users, {
		fields: [collections.userId],
		references: [users.id]
	}),
}));

export const portfoliosRelations = relations(portfolios, ({one, many}) => ({
	collections: many(collections),
	category: one(categories, {
		fields: [portfolios.categoryId],
		references: [categories.id]
	}),
	user: one(users, {
		fields: [portfolios.userId],
		references: [users.id]
	}),
	portfolioSkills: many(portfolioSkills),
	portfolioTags: many(portfolioTags),
}));

export const resourcesRelations = relations(resources, ({one, many}) => ({
	collections: many(collections),
	category: one(categories, {
		fields: [resources.categoryId],
		references: [categories.id]
	}),
	user: one(users, {
		fields: [resources.ownerId],
		references: [users.id]
	}),
	resourceTags: many(resourceTags),
	userResources: many(userResources),
	likeResources: many(likeResources),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	resources: many(resources),
	portfolios: many(portfolios),
	tags: many(tags),
}));

export const emailVerificationCodesRelations = relations(emailVerificationCodes, ({one}) => ({
	user: one(users, {
		fields: [emailVerificationCodes.userId],
		references: [users.id]
	}),
}));

export const folderAccessRelations = relations(folderAccess, ({one}) => ({
	collectionFolder: one(collectionFolders, {
		fields: [folderAccess.collectionFolderId],
		references: [collectionFolders.id]
	}),
}));

export const tagsRelations = relations(tags, ({one, many}) => ({
	category: one(categories, {
		fields: [tags.categoryId],
		references: [categories.id]
	}),
	portfolioTags: many(portfolioTags),
	resourceTags: many(resourceTags),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const userSubscriptionsRelations = relations(userSubscriptions, ({one}) => ({
	subscription: one(subscriptions, {
		fields: [userSubscriptions.subscriptionId],
		references: [subscriptions.id]
	}),
	user: one(users, {
		fields: [userSubscriptions.userId],
		references: [users.id]
	}),
}));

export const subscriptionsRelations = relations(subscriptions, ({many}) => ({
	userSubscriptions: many(userSubscriptions),
}));

export const portfolioSkillsRelations = relations(portfolioSkills, ({one}) => ({
	portfolio: one(portfolios, {
		fields: [portfolioSkills.portfolioId],
		references: [portfolios.id]
	}),
	skill: one(skills, {
		fields: [portfolioSkills.skillId],
		references: [skills.id]
	}),
}));

export const skillsRelations = relations(skills, ({many}) => ({
	portfolioSkills: many(portfolioSkills),
}));

export const portfolioTagsRelations = relations(portfolioTags, ({one}) => ({
	portfolio: one(portfolios, {
		fields: [portfolioTags.portfolioId],
		references: [portfolios.id]
	}),
	tag: one(tags, {
		fields: [portfolioTags.tagId],
		references: [tags.id]
	}),
}));

export const resourceTagsRelations = relations(resourceTags, ({one}) => ({
	resource: one(resources, {
		fields: [resourceTags.resourceId],
		references: [resources.id]
	}),
	tag: one(tags, {
		fields: [resourceTags.tagId],
		references: [tags.id]
	}),
}));

export const userResourcesRelations = relations(userResources, ({one}) => ({
	resource: one(resources, {
		fields: [userResources.resourceId],
		references: [resources.id]
	}),
	user: one(users, {
		fields: [userResources.userId],
		references: [users.id]
	}),
}));

export const likeResourcesRelations = relations(likeResources, ({one}) => ({
	resource: one(resources, {
		fields: [likeResources.resourceId],
		references: [resources.id]
	}),
	user: one(users, {
		fields: [likeResources.userId],
		references: [users.id]
	}),
}));

export const oauthAccountRelations = relations(oauthAccount, ({one}) => ({
	user: one(users, {
		fields: [oauthAccount.userId],
		references: [users.id]
	}),
}));
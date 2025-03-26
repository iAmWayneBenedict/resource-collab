import { z } from "zod";
import {
	usersEnum,
	TUsers,
	users,
	usersStatusEnum,
	userRelations,
} from "./models/users";
import { sessions, sessionsRelations } from "./models/sessions";
import { oauthAccounts, TOauthAccounts } from "./models/oauth-account";
import { emailVerificationCodes } from "./models/email-verification-codes";
import { resources, resourceRelations } from "./models/resources";
import { portfolios, portfolioRelations } from "./models/portfolios";
import {
	portfolioSkills,
	portfolioSkillsRelations,
} from "./models/portfolio-skills";
import { skills, skillRelations } from "./models/skills";
import { admins, adminUserRelations } from "./models/admins";
import { externalMessages } from "./models/external-message";
import { categories, categoryRelations } from "./models/categories";
import { userResources, userResourcesRelations } from "./models/user-resources";
import {
	collectionFolders,
	collectionFoldersRelations,
} from "./models/collection-folders";
import { folderAccess, folderAccessRelations } from "./models/folder-access";
import { likeResourcesRelations, likeResources } from "./models/like-resources";
import { tags, tagsRelations } from "./models/tags";
import { resourceTags, resourceTagsRelations } from "./models/resource-tags";
import { portfolioTags, portfolioTagsRelations } from "./models/portfolio-tags";
import {
	subscriptions,
	subscriptionsRelations,
	subscriptionEnum,
} from "./models/subscriptions";
import {
	userSubscription,
	userSubscriptionRelations,
} from "./models/user-subscriptions";
import { accountRelations, accounts } from "./models/accounts";
import { verifications } from "./models/verifications";
import { userMessages } from "./models/user-message";
import { accessLevel } from "./models/collection-folders";
import {
	resourceAccess,
	resourceAccessRelations,
} from "./models/resource-access";
import {
	resourceShortUrlAccess,
	resourceShortUrlAccessRelations,
} from "./models/resource-short-url";
import {
	portfolioCollections,
	portfolioCollectionsRelations,
} from "./models/portfolio-collections";
import {
	resourceCollections,
	resourceCollectionsRelations,
} from "./models/resource-collections";

export const loginSchema = z.object({
	email: z.string().email().min(5).max(255),
	password: z.string().min(8).max(255),
});

export {
	// users and auth (base tables first)
	users,
	userRelations,
	accounts,
	accountRelations,
	sessions,
	sessionsRelations,
	verifications,
	oauthAccounts,
	emailVerificationCodes,
	// categories and tags (independent tables)
	categories,
	categoryRelations,
	tags,
	tagsRelations,
	// subscription related
	subscriptions,
	subscriptionsRelations,
	subscriptionEnum,
	userSubscription,
	userSubscriptionRelations,
	// resources and portfolios
	resources,
	resourceRelations,
	portfolios,
	portfolioRelations,
	// skills
	skills,
	skillRelations,
	portfolioSkills,
	portfolioSkillsRelations,
	// collections and folders
	collectionFolders,
	collectionFoldersRelations,
	accessLevel,
	portfolioCollections,
	portfolioCollectionsRelations,
	resourceCollections,
	resourceCollectionsRelations,
	folderAccess,
	folderAccessRelations,
	resourceAccess,
	resourceAccessRelations,
	// short urls
	resourceShortUrlAccess,
	resourceShortUrlAccessRelations,

	// relationships and tags
	userResources,
	userResourcesRelations,
	likeResources,
	likeResourcesRelations,
	resourceTags,
	resourceTagsRelations,
	portfolioTags,
	portfolioTagsRelations,
	// admin and messages
	admins,
	adminUserRelations,
	externalMessages,
	// enums
	usersEnum,
	usersStatusEnum,
	userMessages,
};
export type { TUsers, TOauthAccounts };

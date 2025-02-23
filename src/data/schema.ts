import { z } from "zod";
import { usersEnum, TUsers, users, usersStatusEnum } from "./models/users";
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
import { userRelations } from "./models/users";
import { userResources, userResourcesRelations } from "./models/user-resources";
import { bookmarks, bookmarksRelations } from "./models/bookmarks";
import {
	bookmarkFolders,
	bookmarkFoldersRelations,
	bookmarkFoldersVisibility,
} from "./models/bookmark-folders";
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

export const loginSchema = z.object({
	email: z.string().email().min(5).max(255),
	password: z.string().min(8).max(255),
});

export {
	// users
	usersEnum,
	usersStatusEnum,
	users,
	userRelations,

	// accounts
	accounts,
	accountRelations,

	// subscriptions
	subscriptions,
	subscriptionsRelations,
	subscriptionEnum,

	// user subscription
	userSubscription,
	userSubscriptionRelations,

	// session
	sessions,
	sessionsRelations,

	// verification
	verifications,

	// oauth
	oauthAccounts,

	// email verification
	emailVerificationCodes,

	// user to resources
	userResources,
	userResourcesRelations,

	// resources
	resources,
	resourceRelations,

	// resource categories
	categories,
	categoryRelations,

	// portfolio
	portfolios,
	portfolioRelations,

	// portfolio to skills
	portfolioSkills,
	portfolioSkillsRelations,

	// bookmarks
	bookmarks,
	bookmarksRelations,

	// bookmark folders
	bookmarkFolders,
	bookmarkFoldersRelations,
	bookmarkFoldersVisibility,

	// folder access
	folderAccess,
	folderAccessRelations,

	// like resources
	likeResources,
	likeResourcesRelations,

	// tags
	tags,
	tagsRelations,
	resourceTags,
	resourceTagsRelations,
	portfolioTags,
	portfolioTagsRelations,

	// skills
	skills,
	skillRelations,

	// admins
	admins,
	adminUserRelations,

	// external message
	externalMessages,
};

export type { TUsers, TOauthAccounts };

import { z } from "zod";
import {
	usersEnum,
	TUsers,
	users,
	userSessionRelations,
	userPortfolioRelations,
	userResourceRelations,
} from "./models/user";
import { sessionTable } from "./models/session";
import { oauthAccounts, TOauthAccounts } from "./models/oauth-account";
import { emailVerificationCodes } from "./models/email-verification-code";
import { resources, TResources, resourceRelations } from "./models/resource";
import { resourceToCategories, resourceToCategoriesRelations } from "./models/resource-to-category";
import { portfolios, portfolioRelations } from "./models/portfolio";
import { portfolioToSkills, portfolioToSkillsRelations } from "./models/portfolio-to-skills";
import { skills, skillRelations } from "./models/skills";
import { admins, adminUserRelations } from "./models/admin";
import { externalMessages } from "./models/external-message";
import { portfolioCategories } from "./models/portfolio-categories";
import { resourceCategories, TResourceCategories } from "./models/resource-categories";
import {
	resourceBookmarkCounts,
	resourceBookmarkCountsRelations,
} from "./models/resource-bookmark-count";
import {
	portfolioBookmarkCounts,
	portfolioBookmarkCountsRelations,
} from "./models/portfolio-bookmark-count";

export const loginSchema = z.object({
	email: z.string().email().min(5).max(255),
	password: z.string().min(8).max(255),
});

export {
	// users
	usersEnum,
	users,
	userSessionRelations,
	userPortfolioRelations,
	userResourceRelations,

	// session
	sessionTable,

	// oauth
	oauthAccounts,

	// email verification
	emailVerificationCodes,

	// resources
	resources,
	resourceRelations,

	// resource categories
	resourceCategories,

	// resource to category junction
	resourceToCategories,
	resourceToCategoriesRelations,

	// portfolio
	portfolios,
	portfolioRelations,

	// portfolio to skills
	portfolioToSkills,
	portfolioToSkillsRelations,

	// skills
	skills,
	skillRelations,

	// admins
	admins,
	adminUserRelations,

	// external message
	externalMessages,

	// portfolio categories
	portfolioCategories,

	// resource bookmark count
	resourceBookmarkCounts,
	resourceBookmarkCountsRelations,

	// portfolio bookmark count
	portfolioBookmarkCounts,
	portfolioBookmarkCountsRelations,
};

export type { TUsers, TOauthAccounts, TResources, TResourceCategories };

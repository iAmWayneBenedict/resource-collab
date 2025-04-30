import config from "@/config";
import { db } from "@/data/connection";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import {
	createAuthMiddleware,
	customSession,
	emailOTP,
	multiSession,
	openAPI,
} from "better-auth/plugins";
import { EmailService } from "@/services/email";
import { users, userSubscriptions } from "@/data/schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
	// init database
	database: drizzleAdapter(db, { provider: "pg" }),
	basePath: `/api/${config.SERVER_API_VERSION}/${config.SERVER_API_TYPE}/auth`,

	trustedOrigins: [
		"chrome-extension://cohdpjcmhkpngpbejapjnbopkbebjbjh",
		"http://localhost:5173/",
		"http://localhost:8080/",
		"https://resource-collab.vercel.app/",
		// config.BASE_URL!,
	],

	// auth providers
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		requireEmailVerification: true,
	},

	emailVerification: {
		autoSignInAfterVerification: true,
	},

	socialProviders: {
		github: {
			clientId: config.GITHUB_CLIENT_ID ?? "",
			clientSecret: config.GITHUB_CLIENT_SECRET ?? "",
			mapProfileToUser: () => ({ emailVerified: true }), // ! BUG: better-auth is not verifying email through github. needs manual verifying
		},
		google: {
			clientId: config.GOOGLE_CLIENT_ID ?? "",
			clientSecret: config.GOOGLE_CLIENT_SECRET ?? "",
		},
	},

	plugins: [
		customSession(async ({ user, session }) => {
			const [userData, subscription] = await db.transaction(
				async (tx) => {
					const [userDetails] = await tx
						.select()
						.from(users)
						.where(eq(users.id, user.id));

					const [subscription] = await tx
						.select()
						.from(userSubscriptions)
						.where(eq(userSubscriptions.user_id, user?.id));

					return [userDetails, subscription];
				},
			);

			return {
				user: {
					...user,
					image: userData?.image,
					role: userData?.role,
					status: userData?.status,
					subscription,
				},
				session,
			};
		}),
		multiSession(),
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				try {
					await EmailService.nodeMailer.sendEmailVerification({
						emails: [email],
						otp,
					});
				} catch (error) {
					console.error(error);
				}
			},
		}),
		openAPI(),
		nextCookies(), // make sure that this will always be the last plugin
	],

	// hooks: {
	// 	after: createAuthMiddleware(async (ctx) => {
	// 		const isSocial = ctx.path.includes("/callback/:id");
	// 		const isVerify = ctx.path.includes("/email-otp/verify-email");
	// 		console.log(ctx.headers);
	// 		if (isSocial || isVerify) {
	// 		}
	// 	}),
	// },

	// custom schema
	user: {
		modelName: "users",
		fields: {
			emailVerified: "email_verified",
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	},

	session: {
		modelName: "sessions",
		fields: {
			userId: "user_id",
			userAgent: "user_agent",
			expiresAt: "expires_at",
			ipAddress: "ip_address",
			createdAt: "created_at",
			updatedAt: "updated_at",
		},

		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // 5 minutes
		},

		expiresIn: 60 * 60 * 24, // 1 day
		updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
	},
	account: {
		modelName: "accounts",
		fields: {
			userId: "user_id",
			accountId: "account_id",
			providerId: "provider_id",
			accessToken: "access_token",
			refreshToken: "refresh_token",
			accessTokenExpiresAt: "access_token_expires_at",
			refreshTokenExpiresAt: "refresh_token_expires_at",
			idToken: "id_token",
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	},
	verification: {
		modelName: "verifications",
		fields: {
			expiresAt: "expires_at",
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	},

	// rate limiter
	rateLimit: {
		window: 10, // seconds
		max: 8, // max requests per window/seconds

		// TODO: add more custom rules
		customRules: {
			"/sign-up/email": {
				window: 10,
				max: 8,
			},
			"/sign-in/email": {
				window: 10,
				max: 8,
			},
			"/email-otp": {
				window: 30,
				max: 10,
			},
		},
	},

	advanced: {
		ipAddress: {
			ipAddressHeaders: [
				"x-forwarded-for",
				"x-real-ip",
				"x-client-ip",
				"x-forwarded",
				"x-cluster-client-ip",
				"forwarded-for",
				"forwarded",
				"via",
				"connect-src",
			],
		},
	},
});

export const getSession = async (requestHeaders: Headers | null = null) => {
	if (!requestHeaders) requestHeaders = await headers();

	return await auth.api.getSession({
		headers: requestHeaders,
	});
};

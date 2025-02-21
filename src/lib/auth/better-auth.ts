import config from "@/config";
import { db } from "@/data/connection";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { customSession, emailOTP, openAPI } from "better-auth/plugins";
import { EmailService } from "@/services/email";
import { users } from "@/data/schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
	// init database
	database: drizzleAdapter(db, { provider: "pg" }),

	// auth providers
	emailAndPassword: {
		enabled: true,
	},

	socialProviders: {
		github: {
			clientId: config.GITHUB_CLIENT_ID ?? "",
			clientSecret: config.GITHUB_CLIENT_SECRET ?? "",
		},
		google: {
			clientId: config.GOOGLE_CLIENT_ID ?? "",
			clientSecret: config.GOOGLE_CLIENT_SECRET ?? "",
		},
	},

	plugins: [
		customSession(async ({ user, session }) => {
			const [userData] = await db
				.select()
				.from(users)
				.where(eq(users.id, user.id));
			return {
				user: {
					...user,
					role: userData?.role,
					status: userData?.status,
				},
				session,
			};
		}),
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
});

export const getSession = async (requestHeaders: Headers | null = null) => {
	if (!requestHeaders) requestHeaders = await headers();

	return await auth.api.getSession({
		headers: requestHeaders,
	});
};

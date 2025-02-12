import config from "@/config";
import { db } from "@/data/connection";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { emailOTP } from "better-auth/plugins";
import { EmailService } from "@/services/email";

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
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				try {
					// await sendVerificationRequest({
					// 	identifier: email,
					// 	code: otp,
					// });
					await EmailService.nodeMailer.sendEmailVerification({
						emails: [email],
						otp,
					});
				} catch (error) {
					console.error(error);
				}
			},
		}),
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
});

export const getSession = async () =>
	await auth.api.getSession({ headers: await headers() });

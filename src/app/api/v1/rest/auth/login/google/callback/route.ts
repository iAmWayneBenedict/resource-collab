import { createSession } from "@/app/api/v1/rest/utils";
import { google } from "@/config/auth/auth.config";
import { db } from "@/data/connection";
import { oauthAccounts, TUsers, users } from "@/data/schema";
import { userRepository } from "@/repositories";
import { OAuth2RequestError } from "arctic";
import { eq, or } from "drizzle-orm";
import { NextRequest } from "next/server";
import { alphabet, generateRandomString } from "oslo/crypto";

export const GET = async (request: NextRequest) => {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	if (!code || !state) {
		return new Response(null, {
			status: 400,
		});
	}

	const storedCodeVerifier = request.cookies.get("google_oauth_code_verifier")?.value ?? null;
	const storedState = request.cookies.get("google_oauth_state")?.value ?? null;

	if (!storedCodeVerifier || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	try {
		const { accessToken, refreshToken, idToken, accessTokenExpiresAt } =
			await google.validateAuthorizationCode(code, storedCodeVerifier);
		const googleUserResponse = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			method: "GET",
		});
		const googleUser: GoogleUser = await googleUserResponse.json();
		const existingOAuthUser = await db
			.select()
			.from(oauthAccounts)
			.innerJoin(
				users,
				or(
					eq(oauthAccounts.provider_user_id, googleUser.id),
					eq(users.email, googleUser.email)
				)
			);

		if (existingOAuthUser.length > 0) {
			const user = existingOAuthUser[0].users as TUsers;
			await createSession(user.id);
			// user already exists
			return new Response(null, {
				status: 302,
				headers: {
					Location: "/",
				},
			});
		}

		const existingUser = await userRepository.findUserBy("email", googleUser.email);

		if (existingUser.length > 0) {
			const user = existingUser[0] as TUsers;
			await createSession(user.id);
			await userRepository.update(user.id, {
				role: user.role,
				email_verified: googleUser.email_verified || true,
			});

			await db.insert(oauthAccounts).values({
				provider_id: "google",
				provider_user_id: googleUser.id,
				user_id: user.id,
			});

			return new Response(null, {
				status: 302,
				headers: {
					Location: "/",
				},
			});
		}

		const userId = generateRandomString(15, alphabet("a-z", "A-Z", "0-9"));
		await db.insert(users).values({
			id: userId,
			name: googleUser.name || googleUser.given_name,
			email: googleUser.email,
			email_verified: googleUser.email_verified || true, // Google emails are verified | OAuth providers verifies email
		});

		await db.insert(oauthAccounts).values({
			provider_id: "google",
			provider_user_id: googleUser.id,
			user_id: userId,
		});

		await createSession(userId);

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/",
			},
		});
	} catch (error) {
		console.log(error);
		// the specific error message depends on the provider
		if (error instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400,
			});
		}
		return new Response(null, {
			status: 500,
		});
	}
};

interface GoogleUser {
	id: string;
	email: string;
	email_verified: boolean;
	name: string;
	given_name: string;
	picture: string;
}

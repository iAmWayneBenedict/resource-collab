import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { github } from "@/config/auth/auth.config";
import { lucia } from "@/config/auth/auth";
import { db } from "@/db/connection";
import { oauthAccounts, TOauthAccounts, TUsers, users } from "@/db/schema";
import { generateRandomString, alphabet } from "oslo/crypto";
import { and, eq } from "drizzle-orm";
import { createSession } from "@/app/api/utils";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies().get("github_oauth_state")?.value ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		});
		const githubUser: GitHubUser = await githubUserResponse.json();

		const existingUser = await db
			.select()
			.from(oauthAccounts)
			.where(
				and(
					eq(oauthAccounts.provider_id, "github"),
					eq(oauthAccounts.provider_user_id, githubUser.id)
				)
			);

		if (existingUser.length > 0) {
			const user = existingUser[0] as TOauthAccounts;
			await createSession(user.user_id);
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
			name: githubUser.name ?? githubUser.login,
			email: githubUser.email,
			email_verified: true, // GitHub emails are verified | OAuth providers verifies email
		});
		await db.insert(oauthAccounts).values({
			provider_id: "github",
			provider_user_id: githubUser.id,
			user_id: userId,
		});

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/",
			},
		});
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400,
			});
		}
		return new Response(null, {
			status: 500,
		});
	}
}

interface GitHubUser {
	id: string;
	login: string;
	email: string;
	name: string;
}

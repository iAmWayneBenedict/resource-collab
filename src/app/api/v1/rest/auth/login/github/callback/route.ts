import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { github } from "@/config/auth/auth.config";
import { db } from "@/data/connection";
import { oauthAccounts, TUsers, users } from "@/data/schema";
import { generateRandomString, alphabet } from "oslo/crypto";
import { eq, or } from "drizzle-orm";
import { createSession } from "@/app/api/v1/rest/utils";
import { getUserBy, updateUser } from "@/repositories/user";

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

		const existingOAuthUser = await db
			.select()
			.from(oauthAccounts)
			.innerJoin(
				users,
				or(
					eq(oauthAccounts.provider_user_id, githubUser.id),
					eq(users.email, githubUser.email)
				)
			);

		if (existingOAuthUser.length > 0) {
			const user = existingOAuthUser[0].users as TUsers;
			await createSession(user.id);
			return new Response(null, {
				status: 302,
				headers: {
					Location: "/",
				},
			});
		}

		const existingUser = await getUserBy("email", githubUser.email);

		if (existingUser.length > 0) {
			const user = existingUser[0] as TUsers;

			await updateUser(user.id, { email_verified: true });

			await db.insert(oauthAccounts).values({
				provider_id: "google",
				provider_user_id: githubUser.id,
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

import { github } from "@/config/auth/auth.config";
import { generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
	const state = generateState();
	const url = await github.createAuthorizationURL(state);

	cookies().set("github_oauth_state", state, {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax", // lax is the default value or you can use "strict" or "none"
	});

	return Response.redirect(url);
}

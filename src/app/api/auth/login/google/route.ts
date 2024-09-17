import { google } from "@/config/auth/auth.config";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ["email", "profile"],
	});

	cookies().set("google_oauth_code_verifier", codeVerifier, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});

	cookies().set("google_oauth_state", state, {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax", // lax is the default value or you can use "strict" or "none"
	});

	return Response.redirect(url);
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, protectedRoutes } from "./routes";
import { auth } from "./lib/auth";
import { getApiHeaders } from "./lib/utils";
import { headers } from "next/headers";

// Define allowed hosts
const allowedHosts = [
	process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, ""),
	"localhost:3000", // For local development
];

export async function middleware(request: NextRequest): Promise<NextResponse> {
	const session = await auth.api.getSession({ headers: await headers() });
	console.log(session);
	const targetPath = request.nextUrl.pathname;
	const user = session?.user;

	// validate request from allowed origin and referer
	const refererHeader = request.headers.get("referer");
	const extensionOriginHeader =
		request.headers.get("Extension-Origin") ||
		request.headers.get("Origin");
	let refererUrl;
	try {
		refererUrl = refererHeader ? new URL(refererHeader).hostname : null;
	} catch (error) {
		console.error("Invalid Referer URL", error);
		return NextResponse.json(
			{ error: "Unauthorized" },
			{
				status: 401,
				headers: getApiHeaders([
					"OPTIONS",
					"POST",
					"GET",
					"PUT",
					"DELETE",
					"PATCH",
				]),
			},
		);
	}
	const allowedReferer =
		refererUrl &&
		allowedHosts.some(
			(host) => refererUrl === host || refererUrl === `www.${host}`,
		);

	const allowedExtensionOrigin =
		extensionOriginHeader === process.env.EXTENSION_ORIGIN;

	// if (!allowedReferer && !allowedExtensionOrigin && !user?.emailVerified) {
	// 	return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	// }

	// Check if the request is for an auth route, if so redirect to home if user is logged in
	const hasMatchAuthRoute = authRoutes.some((route) =>
		targetPath.startsWith(route),
	);
	if (user?.emailVerified && hasMatchAuthRoute) {
		return NextResponse.redirect(new URL("/", request.url), {
			status: 307,
		});
	}

	// Check if the request is for a protected route, if so check for session, if no session redirect to login
	const hasMatchProtectedRoute = protectedRoutes.some((route) =>
		targetPath.startsWith(route),
	);

	// if the user doesn't have any subscription and is logged, they should finish the onboard
	if (
		user &&
		!user?.subscription &&
		!targetPath.includes("/auth/onboard") &&
		!targetPath.includes("/api/v1/rest")
	)
		return NextResponse.redirect(new URL("/auth/onboard", request.url), {
			status: 307,
		});
	// if the user has subscription and is on onboard, redirect to dashboard with resources tab
	if (user && user?.subscription && targetPath.includes("/auth/onboard"))
		return NextResponse.redirect(
			new URL("/dashboard?page=resources", request.url),
			{ status: 307 },
		);

	if (!user && hasMatchProtectedRoute) {
		if (
			["chrome-extension", "localhost:5173"].some((host) =>
				refererUrl?.includes(host),
			)
		) {
			return NextResponse.json(
				{},
				{
					status: 200,
					headers: getApiHeaders([
						"OPTIONS",
						"POST",
						"GET",
						"PUT",
						"DELETE",
						"PATCH",
					]),
				},
			);
		}

		return NextResponse.redirect(new URL("/auth/login", request.url), {
			status: 307,
		});
	}

	// Add CORS headers for all /v1/rest/auth paths to expose the auth api
	if (targetPath.startsWith("/api/v1/rest/auth")) {
		const response = NextResponse.next();
		response.headers.set(
			"Access-Control-Allow-Origin",
			// process.env.EXTENSION_ORIGIN!,
			"http://localhost:5173",
		);
		response.headers.set("Access-Control-Allow-Credentials", "true");
		response.headers.set("Access-Control-Allow-Methods", "GET, POST");
		response.headers.set(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization",
		);

		// Handle preflight requests
		if (request.method === "OPTIONS") {
			return new NextResponse(null, {
				status: 204,
				headers: response.headers,
			});
		}

		return response;
	}
	return NextResponse.next();
}

// See "Matching Paths" below to learn more
// https://nextjs.org/docs/middleware

// apply middleware to protected and auth routes
// Protected routes are routes that are only accessible to authenticated users.
// Auth routes are routes that are only accessible to unauthenticated users.
export const config = {
	// ! IMPORTANT: This is required for the middleware to run node runtime. PLEASE UPDATE WHEN THE STABLE RELEASE IS OUT.
	// ! currently on canary version
	runtime: "nodejs",
	matcher: [
		"/",
		"/auth/:path*",
		"/admin/:path*",
		"/api/:path*",
		"/dashboard",
	], //! BUG on matcher if we put resource/file routes "/_next" and others
};

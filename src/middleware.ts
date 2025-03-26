import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, protectedRoutes } from "./routes";
import { headers } from "next/headers";
import { auth } from "./lib/auth";

// Define allowed hosts
const allowedHosts = [
	process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, ""),
	"localhost:3000", // For local development
];

export async function middleware(request: NextRequest): Promise<NextResponse> {
	const session = await auth.api.getSession({ headers: await headers() });
	const targetPath = request.nextUrl.pathname;
	const user = session?.user;

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
	if (!user && hasMatchProtectedRoute) {
		return NextResponse.redirect(new URL("/auth/login", request.url), {
			status: 307,
		});
	}

	// Allow requests from localhost in development
	if (process.env.NODE_ENVIRONMENT === "development") {
		return NextResponse.next();
	}

	const originHeader = request.headers.get("Origin");
	const hostHeader =
		request.headers.get("X-Forwarded-Host") || request.headers.get("Host");

	// Validate host header
	if (!hostHeader) {
		return NextResponse.json(
			{ error: "Missing host header" },
			{ status: 400 },
		);
	}

	// Check if the host is in the allowed hosts list
	const isAllowedHost = allowedHosts.some(
		(host) => host && hostHeader.includes(host),
	);
	if (!isAllowedHost) {
		return NextResponse.json({ error: "Invalid host" }, { status: 403 });
	}

	// Validate origin for CORS if present
	if (originHeader) {
		const origin = new URL(originHeader).host;
		const isAllowedOrigin = allowedHosts.some(
			(host) => host && origin.includes(host),
		);

		if (!isAllowedOrigin) {
			return NextResponse.json(
				{ error: "Invalid origin" },
				{ status: 403 },
			);
		}
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
	// matcher: protectedRoutes.concat(authRoutes),
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, protectedRoutes } from "./routes";
import { getSessionCookie } from "better-auth";

// Define allowed hosts
const allowedHosts = [
	process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, ""),
	"localhost:3000", // For local development
];

export async function middleware(request: NextRequest): Promise<NextResponse> {
	const sessionCookie = getSessionCookie(request);
	const targetPath = request.nextUrl.pathname;

	// Check if the request is for an auth route, if so redirect to home
	const hasMatchAuthRoute = authRoutes.some((route) =>
		targetPath.startsWith(route),
	);
	// if (sessionCookie && hasMatchAuthRoute) {
	// 	return NextResponse.redirect(new URL("/", request.url), {
	// 		status: 307,
	// 	});
	// }

	// Check if the request is for a protected route, if so check for session, if no session return 403
	const hasMatchProtectedRoute = protectedRoutes.some((route) =>
		targetPath.startsWith(route),
	);
	// if (!sessionCookie && hasMatchProtectedRoute) {
	// 	return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	// }

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
// export const config = {
// 	matcher: [...protectedRoutes, ...authRoutes],
// };

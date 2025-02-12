import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, protectedRoutes } from "./routes";
import { getSessionCookie } from "better-auth";

export async function middleware(request: NextRequest): Promise<NextResponse> {
	const sessionCookie = getSessionCookie(request);
	const targetUrl = request.url;
	const targetPath = request.nextUrl.pathname;

	// Allow requests from localhost in development
	if (process.env.NODE_ENVIRONMENT === "development") {
		return NextResponse.next();
	}

	// Check if the request is for an auth route, if so redirect to home
	const hasMatchAuthRoute = authRoutes.some((route) =>
		targetPath.startsWith(route),
	);
	if (sessionCookie && hasMatchAuthRoute) {
		return NextResponse.redirect(new URL("/", request.url), {
			status: 307,
		});
	}

	// Check if the request is for a protected route, if so check for session, if no session return 403
	const hasMatchProtectedRoute = protectedRoutes.some((route) =>
		targetPath.startsWith(route),
	);
	if (!sessionCookie && hasMatchProtectedRoute) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	// catch callback from social auth
	if (targetUrl === process.env.NEXT_PUBLIC_BASE_URL + "/api/auth") {
		return NextResponse.redirect(new URL("/", request.url), {
			status: 307,
		});
	}

	const originHeader = request.headers.get("Origin");
	const hostHeader =
		request.headers.get("X-Forwarded-Host") || request.headers.get("Host");
	if (!originHeader || !hostHeader) {
		return NextResponse.json({ error: "Missing headers" }, { status: 400 });
	}

	return NextResponse.next();
}

// See "Matching Paths" below to learn more
// https://nextjs.org/docs/middleware

// apply middleware to protected and auth routes
// Protected routes are routes that are only accessible to authenticated users.
// Auth routes are routes that are only accessible to unauthenticated users.
export const config = {
	matcher: [...protectedRoutes, ...authRoutes],
};

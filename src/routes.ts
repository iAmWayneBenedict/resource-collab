import config from "./config";

/**
 * Public routes are routes that are accessible to everyone, even if they are not authenticated.
 *
 * @type {string[]}
 */
export const publicRoutes: string[] = [
	"/",
	"/resources",
	"/portfolios",
	"/about",
	"/contact",
];

/**
 * Auth routes are routes that are only accessible to authenticated users.
 *
 * @type {string[]}
 */
export const authRoutes: string[] = ["/auth/login", "/auth/signup"];

/**
 * Prefix for authentication API routes.
 * - This is used to separate the authentication routes from the rest of the API routes.
 * - example: /api/auth/login
 * @type {string}
 */
export const apiAuthPrefix: string = `/api/${config.SERVER_API_VERSION}/${config.SERVER_API_TYPE}/auth`;

/**
 * Admin routes are routes that are only accessible to authenticated users.
 *
 * @type {string[]}
 */
export const protectedRoutes: string[] = [
	apiAuthPrefix + "/admin",
	apiAuthPrefix + "/admin/users",
	apiAuthPrefix + "/admin/resources",
	apiAuthPrefix + "/admin/portfolios",
	apiAuthPrefix + "/auth/logout",
];

/**
 * Default login redirect path.
 *
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/";

import config from "./config";

/**
 * Public routes are routes that are accessible to everyone, even if they are not authenticated.
 * These routes do not require any authentication to access.
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
 * Auth routes are routes related to authentication processes.
 * These routes handle user login, registration, and verification.
 *
 * @type {string[]}
 */
export const authRoutes: string[] = [
	"/auth/login",
	"/auth/signup",
	"/auth/verification",
];

/**
 * User dashboard routes are routes accessible to authenticated regular users.
 * These routes provide access to user-specific dashboard features.
 *
 * @type {string[]}
 */
export const userDashboardRoutes: string[] = ["/dashboard"];

/**
 * Admin dashboard routes are routes accessible only to administrators.
 * These routes provide access to administrative features and controls.
 *
 * @type {string[]}
 */
export const adminDashboardRoutes: string[] = ["/dashboard/admin"];

/**
 * API prefix for all API routes.
 * Constructs the base path for API endpoints using configuration values.
 * - This is used to separate the API routes from the frontend routes.
 * - Example: /api/v1/auth/login
 *
 * @type {string}
 */
export const apiPrefix: string = `/api/${config.SERVER_API_VERSION}/${config.SERVER_API_TYPE}`;

/**
 * Protected routes are routes that require authentication to access.
 * These routes are only accessible to authenticated users and include API endpoints
 * and dashboard routes for both regular users and administrators.
 *
 * @type {string[]}
 */
export const protectedRoutes: string[] = [
	apiPrefix + "/ai",
	apiPrefix + "/likes",
	apiPrefix + "/resource-collections",
	apiPrefix + "/users",
	apiPrefix + "/users",
	...userDashboardRoutes,
	...adminDashboardRoutes,
];

/**
 * Default redirect path after successful login.
 * Users will be redirected to this path after they successfully authenticate.
 *
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/";

export const ALLOWED_ORIGINS = [
	config.BASE_URL,
	config.EXTENSION_ORIGIN,
	"http://localhost:5173",
];

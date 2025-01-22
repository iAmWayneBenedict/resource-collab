const ENDPOINTS = {
	/**
	 * * AUTH (start) --------------
	 *
	 */
	LOGIN: () => "/auth/login",
	LOGOUT: () => "/auth/logout",
	REGISTER: () => "/auth/register",
	VERIFY_LOGGED_USER: () => "/auth/validate",

	// zod validator
	IS_EMAIL_EXISTS: (params: string) => `/auth/validate/is-email-exist${params || ""}`,
	VERIFY_EMAIL: () => "/auth/validate/email",
	VERIFY_EXPIRED_CODE: () => "/auth/validate/is-code-expired",

	// web-scraper
	SCRAPER: (params: string) => `/scrape${params}`,

	/**
	 * * AUTH (end) -----------
	 *
	 */

	/**
	 * * USERS (start) --------------
	 *
	 */

	USERS: (params: string) => "/users" + params,
	USER: (id: string) => `/users/${id}`,

	/**
	 * * USERS (end) -----------
	 *
	 */

	// API
	API: (query: string) => `/api${query || ""}`,
};

export default ENDPOINTS;

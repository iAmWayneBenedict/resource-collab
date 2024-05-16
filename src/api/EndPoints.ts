const ENDPOINTS = {
	/**
	 * * AUTH (start) --------------
	 *
	 */
	LOGIN: () => "/auth/login",
	LOGOUT: () => "/logout",
	REGISTER: () => "/auth/register",

	// zod validator
	IS_EMAIL_EXISTS: (params: string) => `/auth/validate/is-email-exist${params || ""}`,
	VERIFY_EMAIL: () => "/auth/validate",

	// zod validator
	VERIFY_EXPIRED_CODE: () => "/auth/validate/is-code-expired",

	/**
	 * * AUTH (end) -----------
	 *
	 */

	// API
	API: (query: string) => `/api${query || ""}`,
};

export default ENDPOINTS;

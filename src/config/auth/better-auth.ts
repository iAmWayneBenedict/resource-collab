import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import config from "../index";
export const authClient = createAuthClient({
	baseURL: config.BASE_URL, // the base url of your auth server

	plugins: [emailOTPClient()],
});

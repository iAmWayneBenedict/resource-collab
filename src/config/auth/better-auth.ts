import { createAuthClient } from "better-auth/react";
import {
	customSessionClient,
	emailOTPClient,
} from "better-auth/client/plugins";
import config from "../index";
import { auth } from "@/lib/auth";
export const authClient = createAuthClient({
	baseURL: config.BASE_URL, // the base url of your auth server

	plugins: [emailOTPClient(), customSessionClient<typeof auth>()],

	fetchOptions: {
		onError: async (context) => {
			const { response } = context;
			if (response.status === 429) {
				console.error(
					`Rate limit exceeded, retrying after ${response.headers.get("Retry-After")} seconds`,
				);
			}
		},
	},
});

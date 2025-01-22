import { GitHub, Google } from "arctic";
import config from "@/config";

export const github = new GitHub(process.env.GITHUB_CLIENT_ID!, process.env.GITHUB_CLIENT_SECRET!);

export const google = new Google(
	process.env.GOOGLE_CLIENT_ID!,
	process.env.GOOGLE_CLIENT_SECRET!,
	config.BASE_URL! +
		`/api/${config.SERVER_API_VERSION}/${config.SERVER_API_TYPE}/auth/login/google/callback`
);

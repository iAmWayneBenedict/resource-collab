import { defineConfig } from "drizzle-kit";
export default defineConfig({
	schema: "./src/data/schema.ts",
	out: "./src/drizzle",
	// driver: "pg",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_CONNECTION_URL ?? "",
	},
	verbose: true,
	strict: true,
});

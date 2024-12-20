import { defineConfig } from "drizzle-kit";
export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./src/drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: process.env.DATABASE_CONNECTION_URL ?? "",
	},
	verbose: true,
	strict: true,
});

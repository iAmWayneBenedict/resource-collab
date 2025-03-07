import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { config } from "dotenv";
config();

const client = postgres(process.env.DATABASE_CONNECTION_URL ?? "", {
	prepare: false,
});
/**
 * Database connection
 * @see  * @see URL_ADDRESS.drizzle.team/docs/postgres-js
 * ! NOTE: logger: true is only for development
 */
const db = drizzle(client, { schema, logger: false });

export { db };

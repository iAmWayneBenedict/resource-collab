import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { config } from "dotenv";
config();

const client = postgres(process.env.DATABASE_CONNECTION_URL ?? "", { prepare: false });
const db = drizzle(client, { schema });

export { db };

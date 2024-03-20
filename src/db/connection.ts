import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
require("dotenv").config();
const client = postgres(process.env.DB_CONNECTION_STRING || "", { prepare: false });
const db = drizzle(client, { schema });

export { db };

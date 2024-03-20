// import { migrate } from "drizzle-orm/postgres-js/migrator";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./connection";

/**
 * Description: This function is used to migrate the database
 * @date 3/20/2024 - 1:09:13 PM
 *
 * @async
 * @returns {Promise<void>} Description: returns a promise of void
 */
const migrateDb = async () => {
	console.log("Migrating database");
	await migrate(db, { migrationsFolder: "src/drizzle" });
	console.log("Database migrated");
	process.exit(0);
};

migrateDb();

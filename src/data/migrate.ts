// import { migrate } from "drizzle-orm/postgres-js/migrator";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./connection";

/**
 * Description: This function is used to migrate the database
 *
 * The function uses the migrate function from drizzle-orm to migrate the database.
 * The migrationsFolder parameter is set to "src/drizzle" which is the folder where
 * the migrations files are located.
 *
 * @async
 * @returns {Promise<void>} Description: returns a promise of void
 *
 * @date 3/20/2024 - 1:09:13 PM
 */
const migrateDb = async (): Promise<void> => {
	console.log("Migrating database");
	await migrate(db, { migrationsFolder: "src/drizzle" });
	console.log("Database migrated");
	process.exit(0);
};

migrateDb().then();

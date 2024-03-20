// import { migrate } from "drizzle-orm/postgres-js/migrator";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./connection";

const migrateDb = async () => {
	console.log("Migrating database");
	await migrate(db, { migrationsFolder: "src/drizzle" });
	console.log("Database migrated");
	process.exit(0);
};

migrateDb();

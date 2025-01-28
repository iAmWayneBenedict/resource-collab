import { boolean, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm";
import { skills } from "./skills";
import { portfolioToSkills } from "./portfolio-to-skills";

export const portfolios = pgTable("portfolios", {
	id: serial("id").primaryKey(),
	user_id: text("user_id")
		.references(() => users.id)
		.notNull(),
	name: varchar("name").notNull(),
	icon: text("icon").notNull(),
	description: text("description"),
	level: text("level").notNull(),
	is_looking_for_job: boolean("is_looking_for_job").notNull().default(false),
	is_public: boolean("is_public").notNull().default(false),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const portfolioRelations = relations(portfolios, ({ one, many }) => ({
	user: one(users, {
		fields: [portfolios.user_id],
		references: [users.id],
	}),
	skills: many(portfolioToSkills),
}));

import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { portfolioSkills } from "./portfolio-skills";

export const skills = pgTable("skills", {
	id: serial("id").primaryKey(),
	name: varchar("name").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
}).enableRLS();

export const skillRelations = relations(skills, ({ many }) => ({
	portfolios: many(portfolioSkills),
}));

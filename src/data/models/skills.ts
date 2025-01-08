import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { portfolios } from "./portfolio";

export const skills = pgTable("skills", {
	id: serial("id").primaryKey(),
	skill: varchar("skill").notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const skillRelations = relations(skills, ({ many }) => ({
	portfolios: many(portfolios),
}));

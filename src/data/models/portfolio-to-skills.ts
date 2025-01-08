import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { portfolios } from "./portfolio";
import { relations } from "drizzle-orm";
import { skills } from "./skills";

export const portfolioToSkills = pgTable("portfolio_to_skills", {
	id: serial("id").primaryKey(),
	portfolio_id: serial("portfolio_id")
		.references(() => portfolios.id)
		.notNull(),
	skill_id: serial("skill_id")
		.references(() => skills.id)
		.notNull(),
	created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const portfolioToSkillsRelations = relations(portfolioToSkills, ({ one }) => ({
	portfolio: one(portfolios, {
		fields: [portfolioToSkills.portfolio_id],
		references: [portfolios.id],
	}),
	skill: one(skills, {
		fields: [portfolioToSkills.skill_id],
		references: [skills.id],
	}),
}));

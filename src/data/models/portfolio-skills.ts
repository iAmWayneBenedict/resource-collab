import { pgTable, primaryKey, serial, timestamp } from "drizzle-orm/pg-core";
import { portfolios } from "./portfolios";
import { relations } from "drizzle-orm";
import { skills } from "./skills";

export const portfolioSkills = pgTable(
	"portfolio_skills",
	{
		portfolio_id: serial("portfolio_id")
			.references(() => portfolios.id)
			.notNull(),
		skill_id: serial("skill_id")
			.references(() => skills.id)
			.notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.portfolio_id, table.skill_id] }),
		pkWithCustomName: primaryKey({
			name: "portfolio_skills_pk",
			columns: [table.portfolio_id, table.skill_id],
		}),
	})
);

export const portfolioSkillsRelations = relations(portfolioSkills, ({ one }) => ({
	portfolio: one(portfolios, {
		fields: [portfolioSkills.portfolio_id],
		references: [portfolios.id],
	}),
	skill: one(skills, {
		fields: [portfolioSkills.skill_id],
		references: [skills.id],
	}),
}));

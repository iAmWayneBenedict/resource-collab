import {
	boolean,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { categories } from "./categories";
import { portfolioSkills } from "./portfolio-skills";
import { bookmarks } from "./bookmarks";

export const portfolios = pgTable("portfolios", {
	id: serial("id").primaryKey(),
	user_id: text("user_id")
		.references(() => users.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	category_id: serial("category_id")
		.references(() => categories.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
	name: varchar("name").notNull(),
	icon: text("icon").notNull(),
	thumbnail: text("thumbnail").notNull(),
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
	category: one(categories, {
		fields: [portfolios.category_id],
		references: [categories.id],
	}),
	skills: many(portfolioSkills),
	bookmarks: many(bookmarks),
}));

import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .references(() => users.id)
    .notNull(),
  account_id: varchar("account_id").notNull(),
  provider_id: varchar("provider_id").notNull(),
  access_token: text("access_token"),
  refresh_token: text("refresh_token"),
  access_token_expires_at: timestamp("access_token_expires_at", {
    mode: "date",
  }),
  refresh_token_expires_at: timestamp("refresh_token_expires_at", {
    mode: "date",
  }),
  scope: varchar("scope"),
  id_token: text("id_token"),
  password: text("password"),
  created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.user_id],
    references: [users.id],
  }),
}));

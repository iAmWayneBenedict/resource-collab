import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  value: text("value").notNull(),
  identifier: text("identifier").notNull(),
  created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
  expires_at: timestamp("expires_at", { mode: "date" }).notNull(),
});

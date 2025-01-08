import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { z } from "zod";
import { users } from "./user";

const oauthAccountsObject = z.object({
	provider_id: z.string(),
	provider_user_id: z.string(),
	user_id: z.string(),
});

export type TOauthAccounts = z.infer<typeof oauthAccountsObject>;
export const oauthAccounts = pgTable(
	"oauth_account",
	{
		provider_id: text("provider_id").notNull(),
		provider_user_id: text("provider_user_id").notNull(),
		user_id: text("user_id")
			.notNull()
			.references(() => users.id),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.provider_id, table.provider_user_id] }),
			pkWithCustomName: primaryKey({
				name: "oauth_constraint",
				columns: [table.provider_id, table.provider_user_id],
			}),
		};
	}
);
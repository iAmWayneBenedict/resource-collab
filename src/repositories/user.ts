import { asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../data/connection";
import { TUsers, users } from "../data/schema";
import { arrToObjSchema } from "./utils";
import { usersEnum } from "../data/models/user";

/**
 * Adds a new user to the database.
 * @param values The user data to insert, adhering to the TUsers type.
 * @param returning Optional parameter specifying which fields to return after insertion.
 * @returns A promise that resolves to the inserted user data if `returning` is specified, otherwise resolves to nothing.
 */

export const save = async (values: TUsers) => {
	return await db.insert(users).values(values).returning();
};

/**
 * Updates a user by id.
 * @param id The id of the user to update.
 * @param values The values to update the user with.
 * @returns A promise that resolves to the number of affected rows.
 */
export const update = async (id: string, values: Partial<TUsers>) => {
	return await db.update(users).set(values).where(eq(users.id, id)).returning({ id: users.id });
};

/**
 * Deletes a user by id.
 * @param id The id of the user to delete.
 * @returns A promise that resolves to the number of affected rows.
 */
export const remove = async (id: string) => {
	return await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
};

/**
 * Retrieves a user from the database based on a specified field and value.
 *
 * @param by The field name to query the user by.
 * @param value The value of the field to match.
 * @param selectFields Optional parameter specifying which fields to return.
 * @returns A promise that resolves to the user data, with the fields specified by `selectFields` if provided.
 */
export const findUserBy = async <K extends keyof TUsers>(
	by: K,
	value: TUsers[K],
	selectFields?: (keyof TUsers)[]
) => {
	// Create an object from the selectFields array
	const selectedFields = arrToObjSchema(selectFields ?? [], users);

	const query = selectFields ? db.select(selectedFields).from(users) : db.select().from(users);

	return await query.where(eq(users[by], value));
};

type TGetAllUsersProps = {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	sortType?: string;
	filter?: string;
};

/**
 * Retrieves a list of users from the database, with optional pagination, search, sorting, and filtering.
 *
 * @param page Optional. The page number for pagination.
 * @param limit Optional. The number of users to display per page.
 * @param search Optional. A search term to filter users by name.
 * @param sortBy Optional. The field by which to sort the users.
 * @param sortType Optional. The order of sorting, either "asc" or "desc".
 * @param filter Optional. A filter to apply based on user role.
 * @returns A promise that resolves to an array of user data.
 */

export const findAllUsers = async ({
	page,
	limit,
	search,
	sortBy,
	sortType,
	filter,
}: TGetAllUsersProps) => {
	const query = db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			role: users.role,
			email_verified: users.email_verified,
			created_at: users.created_at,
			updated_at: users.updated_at,
		})
		.from(users);
	if (page && limit) {
		query.limit(limit).offset((page - 1) * limit);
	}
	if (search) {
		query.where(ilike(users.name, `%${search}%`));
	}
	if (sortBy && sortType) {
		const sortFn = sortType === "ascending" ? asc : desc;
		query.orderBy(sortFn(users[sortBy as keyof TUsers]));
	}
	if (filter) {
		query.where(eq(users.role, filter as (typeof usersEnum.enumValues)[number]));
	}

	const countData = await db.select({ userCount: count() }).from(users);

	return { rows: await query, count: countData[0].userCount };
};

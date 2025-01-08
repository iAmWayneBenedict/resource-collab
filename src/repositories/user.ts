import { eq } from "drizzle-orm";
import { db } from "../data/connection";
import { TUsers, users } from "../data/schema";
import { arrToObjSchema } from "./utils";

/**
 * Adds a new user to the database.
 * @param values The user data to insert, adhering to the TUsers type.
 * @param returning Optional parameter specifying which fields to return after insertion.
 * @returns A promise that resolves to the inserted user data if `returning` is specified, otherwise resolves to nothing.
 */

export const addUser = async (values: TUsers, returning?: (keyof TUsers)[]) => {
	if (returning) {
		const returnedField = arrToObjSchema(returning, users);

		return await db.insert(users).values(values).returning(returnedField);
	} else {
		return await db.insert(users).values(values);
	}
};

/**
 * Updates a user by id.
 * @param id The id of the user to update.
 * @param values The values to update the user with.
 * @returns A promise that resolves to the number of affected rows.
 */
export const updateUser = async (id: string, values: Partial<TUsers>) => {
	return await db.update(users).set(values).where(eq(users.id, id));
};

/**
 * Deletes a user by id.
 * @param id The id of the user to delete.
 * @returns A promise that resolves to the number of affected rows.
 */
export const deleteUser = async (id: string) => {
	return await db.delete(users).where(eq(users.id, id));
};

/**
 * Retrieves a user from the database based on a specified field and value.
 *
 * @param by The field name to query the user by.
 * @param value The value of the field to match.
 * @param selectFields Optional parameter specifying which fields to return.
 * @returns A promise that resolves to the user data, with the fields specified by `selectFields` if provided.
 */
export const getUserBy = async <K extends keyof TUsers>(
	by: K,
	value: TUsers[K],
	selectFields?: (keyof TUsers)[]
) => {
	// Create an object from the selectFields array
	const selectedFields = arrToObjSchema(selectFields ?? [], users);

	const query = selectFields ? db.select(selectedFields).from(users) : db.select().from(users);

	return await query.where(eq(users[by], value));
};

/**
 * Retrieves all users from the database.
 *
 * @returns A promise that resolves to an array of user data.
 */

export const getAllUsers = async () => {
	return await db.select().from(users);
};

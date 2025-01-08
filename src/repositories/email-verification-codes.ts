import { eq, SQLWrapper } from "drizzle-orm";
import { db } from "../data/connection";
import { emailVerificationCodes } from "../data/schema";

/**
 * Adds a new verification code to the database.
 * @param values The values to insert, adhering to the emailVerificationCodes schema.
 * @param returning Optional parameter specifying which fields to return after insertion.
 * @returns A promise that resolves to the inserted verification code data if `returning` is specified, otherwise resolves to nothing.
 */
export const addVerificationCode = async (values: any, returning?: any) => {
	if (returning) {
		return await db.insert(emailVerificationCodes).values(values).returning(returning);
	} else {
		return await db.insert(emailVerificationCodes).values(values);
	}
};

/**
 * Updates an existing verification code in the database.
 *
 * @param id The id of the verification code to update, or a SQLWrapper for complex conditions.
 * @param values The values to update the verification code with, as a partial object.
 * @returns A promise that resolves to the number of affected rows.
 */

export const updateVerificationCode = async (id: number | SQLWrapper, values: Partial<any>) => {
	return await db
		.update(emailVerificationCodes)
		.set(values)
		.where(eq(emailVerificationCodes.id, id));
};

/**
 * Deletes a verification code from the database.
 * @param user_id The id of the user associated with the verification code.
 * @returns A promise that resolves to the number of affected rows.
 */
export const deleteVerificationCode = async (user_id: string) => {
	return await db
		.delete(emailVerificationCodes)
		.where(eq(emailVerificationCodes.user_id, user_id));
};

/**
 * Retrieves a verification code from the database.
 * @param email The email address associated with the verification code.
 * @returns A promise that resolves to the verification code data if found, otherwise resolves to an empty array.
 */
export const getVerificationCode = async (email: string) => {
	return await db
		.select()
		.from(emailVerificationCodes)
		.where(eq(emailVerificationCodes.email, email));
};

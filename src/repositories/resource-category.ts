import { eq, SQLWrapper } from "drizzle-orm";
import { db } from "../data/connection";
import { arrToObjSchema } from "./utils";
import { resourceCategories, TResourceCategories } from "@/data/models/resource-categories";

/**
 * Adds a new resource category to the database.
 *
 * @param values The resource category data to insert, adhering to the TResourceCategories type.
 * @param returning Optional parameter specifying which fields to return after insertion.
 *
 * @returns A promise that resolves to the inserted resource category data if `returning` is specified, otherwise resolves to nothing.
 */
export const save = async (values: any, returning?: (keyof TResourceCategories)[]) => {
	if (returning) {
		const returnedFields = arrToObjSchema(returning, resourceCategories);

		return await db.insert(resourceCategories).values(values).returning(returnedFields);
	} else {
		return await db.insert(resourceCategories).values(values);
	}
};

/**
 * Updates an existing resource category in the database.
 *
 * @param id The id of the resource category to update, or a SQLWrapper for complex conditions.
 * @param values The values to update the resource category with, as a partial object.
 *
 * @returns A promise that resolves to the number of affected rows.
 */
export const update = async (id: number | SQLWrapper, values: Partial<any>) => {
	return await db.update(resourceCategories).set(values).where(eq(resourceCategories.id, id));
};

/**
 * Deletes a resource category from the database.
 *
 * @param id The id of the resource category to delete, or a SQLWrapper for complex conditions.
 *
 * @returns A promise that resolves to the number of affected rows.
 */
export const remove = async (id: number | SQLWrapper) => {
	return await db.delete(resourceCategories).where(eq(resourceCategories.id, id));
};

/**
 * Retrieves a resource category from the database based on a specified field and value.
 *
 * @param by The field name to query the resource category by.
 * @param value The value of the field to match.
 * @param selectFields Optional parameter specifying which fields to return.
 * @returns A promise that resolves to the resource category data, with the fields specified by `selectFields` if provided.
 */

export const findBy = async <K extends keyof TResourceCategories>(
	by: K,
	value: TResourceCategories[K],
	selectFields?: (keyof TResourceCategories)[]
) => {
	const selectedFields = arrToObjSchema(selectFields ?? [], resourceCategories);

	const query = selectFields
		? db.select(selectedFields).from(resourceCategories)
		: db.select().from(resourceCategories);

	return await query.where(eq(resourceCategories[by], value));
};

/**
 * Retrieves all resource categories from the database.
 *
 * @returns A promise that resolves to an array of resource category data.
 */
export const findAll = async () => {
	return await db.select().from(resourceCategories);
};

import { eq, and, SQLWrapper } from "drizzle-orm";
import { db } from "../data/connection";
import { arrToObjSchema } from "./utils";
import { resourceToCategories, TResourceToCategories } from "@/data/models/resource-to-category";

/**
 * Adds a new resource-to-category mapping to the database.
 *
 * @param values The resource-to-category mapping data to insert, adhering to the TResourceToCategories type.
 * @param returning Optional parameter specifying which fields to return after insertion.
 *
 * @returns A promise that resolves to the inserted resource-to-category mapping data if `returning` is specified, otherwise resolves to nothing.
 */
export const addResourceToCategory = async (
	values: any,
	returning?: (keyof TResourceToCategories)[]
) => {
	if (returning) {
		const returnedFields = arrToObjSchema(returning, resourceToCategories);

		return await db.insert(resourceToCategories).values(values).returning(returnedFields);
	} else {
		return await db.insert(resourceToCategories).values(values);
	}
};

/**
 * Updates a resource-to-category mapping in the database.
 *
 * @param id The id of the resource-to-category mapping to update, or a SQLWrapper for complex conditions.
 * @param values The values to update the resource-to-category mapping with, as a partial object.
 * @returns A promise that resolves to the number of affected rows.
 */
export const updateResourceToCategory = async (id: number | SQLWrapper, values: Partial<any>) => {
	return await db.update(resourceToCategories).set(values).where(eq(resourceToCategories.id, id));
};

/**
 * Deletes a resource-to-category mapping by id.
 * @param id The id of the resource-to-category mapping to delete.
 * @returns A promise that resolves to the number of affected rows.
 */
export const deleteResourceToCategory = async (id: number | SQLWrapper) => {
	return await db.delete(resourceToCategories).where(eq(resourceToCategories.id, id));
};

/**
 * Retrieves a resource-to-category mapping from the database based on a specified field and value.
 *
 * @param by The field name to query the resource-to-category mapping by.
 * @param value The value of the field to match.
 * @param selectFields Optional parameter specifying which fields to return.
 * @param where Optional parameter to apply additional conditions to the query.
 * @returns A promise that resolves to the resource-to-category mapping data,
 *          with the fields specified by `selectFields` if provided.
 */
export const getResourceToCategoryBy = async <K extends keyof TResourceToCategories>(
	by: K | null,
	value: TResourceToCategories[K] | null,
	selectFields?: (keyof TResourceToCategories)[] | null,
	where?: (query: typeof resourceToCategories) => any
) => {
	const selectedFields = arrToObjSchema(selectFields ?? [], resourceToCategories);

	const query = selectFields
		? db.select(selectedFields).from(resourceToCategories)
		: db.select().from(resourceToCategories);

	if (where) {
		return query.where(where(resourceToCategories));
	} else if (by) {
		return query.where(eq(resourceToCategories[by], value as number));
	}

	return query;
};

type TWithColumns = ("category" | "resource")[];
/**
 * Retrieves a resource-to-category mapping from the database based on a specified
 * relational query. Useful for retrieving a resource-to-category mapping with
 * associated data from the categories and resources tables.
 *
 * @param withColumns An array of strings specifying which columns to include in the
 *                    relational query. Valid values are "category" and "resource".
 * @param where A function that takes the schema and helper object as parameters and
 *              returns a relational query object. The helper object provides functions
 *              that can be used to build the relational query, such as "and" and "eq".
 * @returns A promise that resolves to the resource-to-category mapping data, with the
 *          fields specified in withColumns if provided.
 */
export const getResourceToCategoryByRelationalQuery = async (
	withColumns: TWithColumns,
	where: (schema: typeof resourceToCategories, helper: Record<string, Function>) => any
) => {
	// make the withColumns object with default true value
	const withSelectedFields = Object.fromEntries(withColumns.map((key) => [key, true]) || []);

	return await db.query.resourceToCategories.findFirst({
		with: withSelectedFields,
		where: where(resourceToCategories, { and, eq }), // add helper functions if needed e.g. (gt, lt)
	});
};

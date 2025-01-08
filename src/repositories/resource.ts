import { eq, SQLWrapper } from "drizzle-orm";
import { db } from "../data/connection";
import { resources, TResources } from "../data/schema";
import { arrToObjSchema } from "./utils";

/**
 * Adds a new resource to the database.
 *
 * @param values - The resource data to insert, adhering to the TResources type.
 * @param returning - Optional parameter specifying which fields to return after insertion.
 *
 * @returns A promise that resolves to the inserted resource data if `returning` is specified, otherwise resolves to nothing.
 */

export const addResource = async (values: any, returning?: (keyof TResources)[]) => {
	if (returning) {
		const returnedFields = arrToObjSchema(returning, resources);

		return await db.insert(resources).values(values).returning(returnedFields);
	} else {
		return await db.insert(resources).values(values);
	}
};

/**
 * Retrieves all resources from the database.
 *
 * @returns A promise that resolves to an array of resource data.
 */
export const getAllResources = async () => {
	return await db.select().from(resources);
};

/**
 * Updates an existing resource in the database.
 *
 * @param id The id of the resource to update, or a SQLWrapper for complex conditions.
 * @param values The values to update the resource with, as a partial object.
 * @returns A promise that resolves to the number of affected rows.
 */

export const updateResource = async (id: number | SQLWrapper, values: Partial<any>) => {
	return await db.update(resources).set(values).where(eq(resources.id, id));
};

/**
 * Deletes a resource from the database by id.
 * @param id The id of the resource to delete, or a SQLWrapper for complex conditions.
 * @returns A promise that resolves to the number of affected rows.
 */

export const deleteResource = async (id: number | SQLWrapper) => {
	return await db.delete(resources).where(eq(resources.id, id));
};

/**
 * Retrieves a single resource from the database based on a specified field and value.
 *
 * @param by The field name to query the resource by.
 * @param value The value of the field to match.
 * @param selectFields Optional parameter specifying which fields to return.
 * @returns A promise that resolves to the resource data, with the fields specified by `selectFields` if provided.
 */

export const getResourceBy = async <K extends keyof TResources>(
	by: K | null,
	value: TResources[K] | null,
	selectFields?: (keyof TResources)[] | null,
	where?: (query: typeof resources) => any
) => {
	const selectedFields = arrToObjSchema(selectFields ?? [], resources);

	const query = selectFields
		? db.select(selectedFields).from(resources)
		: db.select().from(resources);

	if (where) {
		return query.where(where(resources));
	} else if (by) {
		// Apply the primary condition (equality check)
		return query.where(eq(resources[by], value as number));
	}

	return query;
};

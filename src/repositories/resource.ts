import { and, asc, count, desc, eq, SQLWrapper } from "drizzle-orm";
import { db } from "../data/connection";
import { resources, TResources } from "../data/schema";
import { arrToObjSchema } from "./utils";

/**
 * Adds a new resource to the database.
 *
 * @param values - The resource data to insert, adhering to the TResources type.
 *
 * @returns A promise that resolves to the inserted resource data if `returning` is specified, otherwise resolves to nothing.
 */

export const save = async (values: any) => {
	return await db.insert(resources).values(values).returning();
};

/**
 * Retrieves all resources from the database.
 *
 * @returns A promise that resolves to an array of resource data.
 */
export const findAll = async () => {
	return await db.select().from(resources);
};

/**
 * Updates an existing resource in the database.
 *
 * @param id The id of the resource to update, or a SQLWrapper for complex conditions.
 * @param values The values to update the resource with, as a partial object.
 * @returns A promise that resolves to the number of affected rows.
 */

export const update = async (id: number | SQLWrapper, values: Partial<any>) => {
	return await db.update(resources).set(values).where(eq(resources.id, id)).returning();
};

/**
 * Deletes a resource from the database by id.
 * @param id The id of the resource to delete, or a SQLWrapper for complex conditions.
 * @returns A promise that resolves to the number of affected rows.
 */

export const remove = async (id: number | SQLWrapper) => {
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

export const findBy = async <K extends keyof TResources>(
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

/**
 * Retrieves a list of resources from the database based on a specified relational query,
 * with options for pagination, sorting, and filtering. Useful for retrieving resources
 * with associated data from related tables.
 *
 * @param withColumns An object specifying which columns to include in the relational query.
 *                    The keys should be valid fields of the TResources type, with all values set to true.
 *                    For example, `{ id: true, name: true, user: { with: { id: true, name: true } } }`
 *                    would return the resource's id, name, and associated user's id and name.
 * @param where Optional. A function that takes the schema and helper object as parameters and returns a relational query object.
 *              The helper object provides functions that can be used to build the relational query, such as "and" and "eq".
 * @param page Optional. The page number for pagination. Defaults to 0.
 * @param limit Optional. The number of resources to return per page. Defaults to 0.
 * @param sortType Optional. The order of sorting, either "ascending" or "descending". Defaults to "ascending".
 * @param sortBy Optional. The field by which to sort the resources. Defaults to "id".
 * @param filterBy Optional. The field to filter resources by.
 * @param filterValue Optional. The value to filter resources by.
 * @returns A promise that resolves to an array of resource data, with the fields specified in withColumns if provided.
 */
export const findByWith = async <K extends keyof TResources, V extends TResources[K]>({
	withColumns,
	where = () => {},
	page = 0,
	limit = 0,
	sortType = "ascending" as const,
	sortBy = "id" as K,
	filterBy,
	filterValue,
}: {
	withColumns: Record<string, true | { with: Record<string, true> }>;
	where?: (schema: typeof resources, helper: Record<string, Function>) => any;
	page?: number;
	limit?: number;
	sortType?: "ascending" | "descending";
	sortBy?: K;
	filterBy?: K;
	filterValue?: V;
}) => {
	const countData = await db.select({ resourceCount: count() }).from(resources);

	const query = await db.query.resources.findMany({
		with: withColumns,
		where:
			filterBy && filterValue
				? [eq(resources[filterBy], filterValue)]
				: where(resources, { and, eq }),
		offset: (page - 1) * limit,
		limit,
		orderBy: [
			sortBy ? (sortType === "ascending" ? asc : desc)(resources[sortBy]) : asc(resources.id),
		],
	});

	return { rows: query, count: countData[0].resourceCount };
};

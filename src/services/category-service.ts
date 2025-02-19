import { db } from "@/data/connection";
import { CategoryType } from "@/data/models/categories";
import { categories } from "@/data/schema";
import { eq, InferSelectModel, SQL } from "drizzle-orm";

type FindCategoryParams = {
	value: string | number | SQL;
	identifier: "name" | "id" | "custom";
};

/**
 * Finds categories in the database based on the specified identifier and value.
 *
 * @param {FindCategoryParams} params - The parameters for finding categories.
 * @param {string | number | SQL} params.value - The value to search for. This can be a string, number, or SQL condition.
 * @param {"name" | "id" | "custom"} params.identifier - The type of identifier to search by.
 *   - "name": Searches categories by name matching the specified value.
 *   - "id": Searches categories by ID matching the specified value.
 *   - "custom": Uses a custom SQL condition to search for categories.
 *
 * @returns {Promise<InferSelectModel<CategoryType>[]>} A promise that resolves to an array of categories that match the search criteria.
 */
export const findCategory = ({
	value,
	identifier,
}: FindCategoryParams): Promise<InferSelectModel<CategoryType>[]> => {
	try {
		if (identifier === "name") {
			return db.query.categories.findMany({
				where: eq(categories.name, value as string),
			});
		} else if (identifier === "id") {
			return db.query.categories.findMany({
				where: eq(categories.id, value as number),
			});
		}

		// custom
		return db.query.categories.findMany({
			where: value as SQL,
		});
	} catch (error) {
		return Promise.reject(error);
	}
};

type CreateCategoryParams = { names: { name: string }[] };
/**
 * Creates categories in the database.
 *
 * @param {CreateCategoryParams} params - The parameters for creating categories.
 * @param {{name: string}[]} params.names - An array of objects containing the name of each category to create.
 *
 * @returns {Promise<InferSelectModel<CategoryType>[]>} A promise that resolves to an array of created categories.
 */
export const createCategory = ({
	names,
}: CreateCategoryParams): Promise<InferSelectModel<CategoryType>[]> => {
	try {
		return db.insert(categories).values(names).returning();
	} catch (error) {
		return Promise.reject(error);
	}
};

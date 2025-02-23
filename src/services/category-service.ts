import { db } from "@/data/connection";
import { CategorySelectType, CategoryType } from "@/data/models/categories";
import { TagType } from "@/data/models/tags";
import { categories } from "@/data/schema";
import {
	and,
	asc,
	count,
	desc,
	eq,
	ilike,
	InferSelectModel,
	sql,
	SQL,
} from "drizzle-orm";

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
		return Promise.reject(error as Error);
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
		return Promise.reject(error as Error);
	}
};

type FindAllCategoryParams = {
	type: "all" | "with";
	filters?: { [key: string]: string | number | SQL };
	with?: { [key: string]: boolean };
};
type FindAllCategoryRowsType =
	| InferSelectModel<CategoryType & { tags: TagType[] }>[]
	| InferSelectModel<CategoryType>[];
type FindAllCategoryReturnType = {
	rows: FindAllCategoryRowsType;
	count: number;
};
export const findAllCategory = async ({
	type = "all",
	filters = {},
	with: withRelations = undefined,
}: FindAllCategoryParams): Promise<FindAllCategoryReturnType> => {
	try {
		const [{ totalCount }] = await db
			.select({ totalCount: count() })
			.from(categories);

		if (type === "all" && !withRelations) {
			return {
				rows: await db.query.categories.findMany(),
				count: totalCount,
			};
		}

		if (type === "all" && !Object.keys(filters).length) {
			return {
				rows: await db.query.categories.findMany({
					with: withRelations,
				}),
				count: totalCount,
			};
		}

		const { page, limit, search, sortBy, sortType, filterBy, filterValue } =
			filters;

		const filtersValue = [];
		if (search)
			filtersValue.push(
				ilike(categories.name, sql.placeholder("search")),
			);

		if (filterBy && filterValue) {
			filtersValue.push(
				eq(
					categories[filterBy as keyof CategorySelectType],
					sql.placeholder("filterValue"),
				),
			);
		}

		let sortValue;
		if (sortBy) {
			sortValue = (sortType === "ascending" ? asc : desc)(
				categories[sortBy as keyof CategorySelectType],
			);
		} else {
			sortValue = asc(categories.id);
		}

		const query = db.query.categories
			.findMany({
				with: withRelations,
				where:
					filtersValue.length > 0 ? and(...filtersValue) : undefined,
				offset: sql.placeholder("offset"),
				limit: sql.placeholder("limit"),
				orderBy: [sortValue],
			})
			.prepare("all_categories");

		const rows = await query.execute({
			search: `%${search as string}%`,
			offset: (Number(page) as -1) * Number(limit),
			limit: Number(limit),
			filterBy,
			filterValue,
		});

		return {
			rows,
			count: totalCount,
		};
	} catch (error) {
		return Promise.reject(error as Error);
	}
};

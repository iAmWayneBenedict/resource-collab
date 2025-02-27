import { db } from "@/data/connection";
import { ResourcesSelectType, ResourcesType } from "@/data/models/resources";
import {
	categories as categoriesTable,
	resources,
	resourceTags,
	tags,
	userResources,
} from "@/data/schema";
import {
	and,
	asc,
	count,
	desc,
	eq,
	exists,
	ilike,
	inArray,
	InferInsertModel,
	InferSelectModel,
	or,
	sql,
	SQL,
} from "drizzle-orm";

type ResourceParams = {
	name: string;
	url: string;
	icon: string;
	thumbnail: string;
	description: string;
	category: string | number;
	tags: string[] | number[];
};

type FindResourceParams = {
	value: string | number | SQL;
	identifier: "url" | "name" | "id" | "custom";
	sameDomain?: boolean;
};

/**
 * Finds resources in the database based on the specified identifier and value.
 *
 * @param {FindResourceParams} params - The parameters for finding resources.
 * @param {string | number | SQL} params.value - The value to search for. This can be a string, number, or SQL condition.
 * @param {"url" | "name" | "id" | "custom"} params.identifier - The type of identifier to search by.
 *   - "name": Searches resources by name matching the specified value.
 *   - "id": Searches resources by ID matching the specified value.
 *   - "url": Searches resources by URL matching the specified value or its domain.
 *   - "custom": Uses a custom SQL condition to search for resources.
 *
 * @returns {Promise<InferSelectModel<ResourcesType>[]>} A promise that resolves to an array of resources that match the search criteria.
 */

export const findResource = ({
	value,
	identifier,
	sameDomain = false,
}: FindResourceParams): Promise<InferSelectModel<ResourcesType>[]> => {
	if (identifier === "name") {
		return db.query.resources.findMany({
			where: eq(resources.name, value as string),
		});
	} else if (identifier === "id") {
		return db.query.resources.findMany({
			where: eq(resources.id, value as number),
		});
	} else if (identifier === "url") {
		const urlDomain = new URL(value as string).hostname;
		let filter;
		if (sameDomain) {
			filter = or(
				eq(resources.url, value as string),
				ilike(resources.url, `%${urlDomain}%`),
			);
		} else {
			filter = eq(resources.url, value as string);
		}
		return db.query.resources.findMany({
			where: filter,
		});
	}

	// custom
	return db.query.resources.findMany({
		where: value as SQL,
	});
};

/**
 * Creates new resources in the database.
 *
 * @param resourcesParams - An array of resources to be created, with each resource
 *   being an object with the shape of the TResources interface.
 *
 * @returns A promise that resolves to an array of newly created resources.
 *
 * The function takes care of formatting the dates for the created_at and updated_at
 * fields, so that they are in the correct format for the database.
 */
export const createResource = async (
	resourcesParams: Omit<InferInsertModel<ResourcesType>, "id">[],
): Promise<InferSelectModel<ResourcesType>[]> => {
	const formattedResourcesParams = resourcesParams.map((resource) => ({
		...resource,
		created_at: resource.created_at
			? new Date(resource.created_at)
			: undefined,
		updated_at: resource.updated_at
			? new Date(resource.updated_at)
			: undefined,
	}));
	return db
		.insert(resources)
		.values(formattedResourcesParams)
		.onConflictDoNothing()
		.returning();
};

/**
 * Associates a resource with a list of tags by creating junction records in the
 * resource_tags table.
 *
 * @param resourceId - The id of the resource to associate with the tags.
 * @param tagIds - An array of tag ids to associate with the resource.
 *
 * @returns A promise that resolves to the newly created junction records.
 */
export const associateResourceWithTags = async (
	resourceId: number,
	tagIds: number[],
) => {
	const junctionValues = tagIds.map((tagId) => ({
		resource_id: resourceId,
		tag_id: tagId,
	}));
	return db
		.insert(resourceTags)
		.values(junctionValues)
		.onConflictDoNothing()
		.returning();
};

type CreateResourceTransactionParams = ResourceParams & {
	userId: string;
};
/**
 * Creates a new resource in the database, creating a new category if the category
 * does not exist, and creating new tags if the tags do not exist. The function
 * also associates the resource with the tags.
 *
 * @param {CreateResourceTransactionParams} body - An object containing the
 *   resource to be created, with the following properties:
 *   - `userId`: The user ID of the user who is creating the resource.
 *   - `name`: The name of the resource.
 *   - `url`: The URL of the resource.
 *   - `icon`: The icon of the resource.
 *   - `thumbnail`: The thumbnail of the resource.
 *   - `category`: The category of the resource, which can be a string or a number.
 *     If the category is a string, then a new category is created with the name
 *     of the string. If the category is a number, then the category with the
 *     matching ID is used.
 *   - `tags`: An array of tags to associate with the resource. The tags can be
 *     strings or numbers. If the tags are strings, then new tags are created with
 *     the names of the strings. If the tags are numbers, then the tags with the
 *     matching IDs are used.
 *
 * @returns {Promise<InferSelectModel<ResourcesType>>} A promise that resolves to
 *   the newly created resource.
 */
export const createResourceTransaction = async (
	body: CreateResourceTransactionParams,
): Promise<InferSelectModel<ResourcesType>> => {
	return await db.transaction(async (tx) => {
		let categoryId: number | string = body.category;

		// create category
		console.log(
			`Starting transaction for creating resources: ${body.name}`,
		);
		const existCategory = await tx
			.select()
			.from(categoriesTable)
			.where(eq(categoriesTable.name, body.category as string));

		if (existCategory.length) {
			categoryId = existCategory[0].id;
			console.log(`Category already exists: ${existCategory[0].name}`);
		} else if (typeof body.category === "string") {
			console.log(`Creating new category: ${body.category}`);

			const [newCategory] = await tx
				.insert(categoriesTable)
				.values({ name: body.category })
				.returning();

			categoryId = newCategory.id;
			console.log(`New Category created with ID: ${newCategory.name}`);
		}
		// create tags
		const tagIds: number[] = [];
		if (typeof body.tags[0] === "string") {
			// assert name to string
			const tagValues = body.tags.map((tag) => ({ name: tag })) as {
				name: string;
			}[];

			// check if the tag exists in the database
			console.log(
				`Checking if tags exist in the database: ${tagValues.map((tag) => tag.name).join(", ")}`,
			);
			const exists = await tx
				.select()
				.from(tags)
				.where(
					inArray(
						tags.name,
						tagValues.map((tag) => tag.name),
					),
				);

			// map the name of the tags to an array
			const existNames = exists.map((tag) => tag.name);

			console.log(`Tags exist in the database: ${existNames.join(", ")}`);
			exists.forEach((tag) => tagIds.push(tag.id));

			// get the remaining tags
			const remainingTags = tagValues
				.filter((tag) => !existNames.includes(tag.name))
				.map((tag) => ({
					name: tag.name,
					category_id: categoryId as number,
				}));
			console.log(
				`Tags does not exist in the database: ${remainingTags.map((tag) => tag.name).join(", ")}`,
			);

			// if there are remaining tags, then create them
			if (remainingTags.length) {
				const tagRes = await tx
					.insert(tags)
					.values(remainingTags)
					.returning();

				tagRes.forEach((tag) => tagIds.push(tag.id));
				console.log(
					`Tags created: ${tagRes.map((tag) => tag.name).join(", ")}`,
				);
			}
		} else if (typeof body.tags[0] === "number") {
			// if the tag is number, then push the tag to the tagIds array
			tagIds.push(...(body.tags as number[]));
			console.log(`Tags exist in the database: ${tagIds.join(", ")}`);
		}

		// create resource
		console.log(`Creating new resource: ${body.name}`);
		const [newResource] = await tx
			.insert(resources)
			.values({
				name: body.name,
				category_id: categoryId as number,
				url: body.url,
				icon: body.icon ?? "",
				thumbnail: body.thumbnail ?? "",
				description: body.description ?? "",
				owner_id: body.userId,
				view_count: 0, // * default value
			})
			.returning();

		// associate resource with tags
		if (tagIds.length) {
			console.log(`Associating resource with tags: ${tagIds.join(", ")}`);
			await tx.insert(resourceTags).values(
				tagIds.map((tagId) => ({
					resource_id: newResource.id,
					tag_id: tagId,
				})),
			);
		}

		// associate resource with user
		console.log(`Associating resource with user: ${body.userId}`);
		await tx
			.insert(userResources)
			.values({
				user_id: body.userId,
				resource_id: newResource.id,
			})
			.returning();

		console.log(`Resource created: ${newResource.id}`);
		return newResource;
	});
};

type CategoryActions = {
	move_to: number;
};

type UpdateResourceTransactionParams = ResourceParams & {
	id: number;
	userId: string;
	tags: string[];
	category: CategoryActions;
};

export const updateResourceTransaction = async (
	body: UpdateResourceTransactionParams,
): Promise<InferSelectModel<ResourcesType>> => {
	return await db.transaction(async (tx) => {
		const { tags: tagNames, category, ...resource } = body;

		// update resource
		const [updatedResource] = await tx
			.update(resources)
			.set({
				...resource,
				category_id: category as number,
			})
			.where(eq(resources.id, resource.id))
			.returning();

		// determine if the tags are the same as the one stored in db
		const existingResourceTags = await tx.query.resourceTags.findMany({
			with: { tag: true },
			where: eq(resourceTags.resource_id, resource.id),
		});
		const isSameValues = existingResourceTags.every((resourceTag) =>
			tagNames.includes(resourceTag.tag.name),
		);
		// if the tags are the same, then return the updated resource and do not update the tags
		if (isSameValues) return updatedResource;

		// delete all tags associated with the resource
		await tx
			.delete(resourceTags)
			.where(eq(resourceTags.resource_id, resource.id));

		// then add the tags here from the request body
		if (tagNames.length) {
			const tagIds = await tx
				.select()
				.from(tags)
				.where(inArray(tags.name, tagNames));

			await tx.insert(resourceTags).values(
				tagIds.map((tag) => ({
					resource_id: resource.id,
					tag_id: tag.id,
				})),
			);
		}

		return updatedResource;
	});
};

type DeleteResourceTransactionParams = {
	userId: string;
	ids: number[];
	type: "soft" | "hard";
};
export const deleteResourceTransaction = async (
	body: DeleteResourceTransactionParams,
): Promise<number[]> => {
	return await db.transaction(async (tx) => {
		const { ids, type, userId } = body;

		if (type === "soft") {
			await tx
				.delete(userResources)
				.where(
					and(
						inArray(userResources.resource_id, ids),
						eq(userResources.user_id, userId),
					),
				)
				.returning();
		} else {
			await tx
				.delete(resources)
				.where(
					and(
						inArray(resources.id, ids),
						eq(resources.owner_id, userId),
					),
				)
				.returning();
		}

		return ids;
	});
};
type FindResourcesParams = {
	page: number;
	limit: number;
	search: string;
	sortBy: string;
	sortType: "ascending" | "descending" | null;
	category: string | null;
	tags: string[];
};
export const findResources = async (
	body: FindResourcesParams,
): Promise<{ rows: InferSelectModel<ResourcesType>[]; totalCount: number }> => {
	const {
		page = 1,
		limit = 10,
		search = "",
		sortBy = "created_at",
		sortType = "ascending",
		category: categoryParams = "",
		tags: tagsParams = [],
	} = body;

	console.log(`Finding resources with params:`, {
		page,
		limit,
		search,
		sortBy,
		sortType,
		category: categoryParams,
		tags: tagsParams,
	});

	return await db.transaction(async (tx) => {
		const [{ totalCount }] = await tx
			.select({ totalCount: count() })
			.from(resources);
		console.log(`Total resources count: ${totalCount}`);

		const filters: SQL[] = [];
		if (search) {
			filters.push(ilike(resources.name, sql.placeholder("search")));
			console.log(`Added search filter for: ${search}`);
		}

		if (categoryParams) {
			filters.push(
				eq(resources.category_id, sql.placeholder("categoryParams")),
			);
			console.log(`Added category filter for: ${categoryParams}`);
		}

		// get the id of the tags
		const tagIds = await db
			.select({ id: tags.id })
			.from(tags)
			.where(inArray(tags.name, tagsParams));
		console.log(
			`Found tag IDs:`,
			tagIds.map((t) => t.id),
		);

		// add the tag filters
		const baseFilters = filters.length ? filters : [];
		const tagFilter = tagsParams.length
			? [
					exists(
						tx
							.select()
							.from(resourceTags)
							.where(
								and(
									eq(resourceTags.resource_id, resources.id),
									inArray(
										resourceTags.tag_id,
										tagIds.map((tag) => tag.id),
									), // ! NOTE: array is not supported for prepared statements
								),
							),
					),
				]
			: [];

		if (tagsParams.length) {
			console.log(`Added tag filters for: ${tagsParams.join(", ")}`);
		}

		const sortValue = sortBy
			? (sortType === "ascending" ? asc : desc)(
					resources[sortBy as keyof ResourcesSelectType],
				)
			: asc(resources.id);
		console.log(`Sorting by ${sortBy} in ${sortType} order`);

		// prepare the query
		console.log("Preparing query with filters and sorting");
		const query = tx.query.resources
			.findMany({
				with: {
					category: { columns: { id: true, name: true } },
					resourceTags: {
						columns: { resource_id: false, tag_id: false },
						with: { tag: true },
					},
				},
				where: and(...baseFilters, ...tagFilter),
				offset: sql.placeholder("offset"),
				limit: sql.placeholder("limit"),
				orderBy: [sortValue],
			})
			.prepare("all_resources");

		// execute the prepared statement
		const rows = await query.execute({
			search: `%${search}%`,
			offset: (page - 1) * limit,
			limit: Number(limit),
			categoryParams,
		});
		console.log(`Found ${rows.length} resources for page ${page}`);

		return {
			rows,
			totalCount,
		};
	});
};

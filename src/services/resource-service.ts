import { db } from "@/data/connection";
import { ResourcesType } from "@/data/models/resources";
import {
	categories as categoriesTable,
	resources,
	resourceTags,
	tags,
	userResources,
} from "@/data/schema";
import {
	and,
	eq,
	ilike,
	inArray,
	InferInsertModel,
	InferSelectModel,
	or,
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

type FindResourcesParams = {
	value: string | number | SQL;
	identifier: "url" | "name" | "id" | "custom";
	sameDomain?: boolean;
};

/**
 * Finds resources in the database based on the specified identifier and value.
 *
 * @param {FindResourcesParams} params - The parameters for finding resources.
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
}: FindResourcesParams): Promise<InferSelectModel<ResourcesType>[]> => {
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

type TagActions = {
	add: string[];
	delete: number[];
};

type CategoryActions = {
	move_to: number;
};

type UpdateResourceTransactionParams = ResourceParams & {
	id: number;
	userId: string;
	tags: TagActions;
	category: CategoryActions;
};

export const updateResourceTransaction = async (
	body: UpdateResourceTransactionParams,
): Promise<InferSelectModel<ResourcesType>> => {
	return await db.transaction(async (tx) => {
		const { tags: tagActions, category, ...resource } = body;
		const { add, delete: deleteTags } = tagActions;
		const { move_to } = category;

		// update resource
		const [updatedResource] = await tx
			.update(resources)
			.set({
				...resource,
				category_id: move_to,
			})
			.where(eq(resources.id, resource.id))
			.returning();

		// delete tags
		if (deleteTags.length) {
			await tx
				.delete(resourceTags)
				.where(inArray(resourceTags.tag_id, deleteTags));
		}

		// add tags
		if (add.length) {
			const tagRes = await tx
				.insert(tags)
				.values(add.map((tag) => ({ name: tag })))
				.returning();

			await tx.insert(resourceTags).values(
				tagRes.map((tag) => ({
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

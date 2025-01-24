import { TResources } from "@/data/schema";
import { CustomError } from "@/lib/error";
import {
	resourceCategoryRepository,
	resourceRepository,
	resourceToCategoryRepository,
} from "@/repositories";

/**
 * Adds a new resource to the database, or throws an error if the resource
 * name already exists. If the resource has a category, it is also added to
 * the resource-to-category junction table. If the category does not already
 * exist, it will be created first.
 *
 * @param {object} resourceData - The resource data to add, containing
 *                                name, category, and user_id.
 *
 * @returns {Promise<array>} - A promise that resolves to an array containing
 *                             the inserted resource data, with the fields
 *                             specified in the returning parameter.
 *
 * @throws {CustomError} - If the resource with the given name already exists,
 *                         or if the category does not exist.
 */
export const createResource = async (resourceData: any): Promise<Array<any>> => {
	const { name, categories } = resourceData;

	const existingResource = await resourceRepository.findBy("name", name);
	let existingCategory = null;
	// get and check if exist, if not, then throw error
	for (const category of categories) {
		existingCategory = await resourceCategoryRepository.findBy("id", category);
		if (!existingCategory.length) throw new CustomError("Category does not exist!", null, 404);
	}

	let newResource = null;

	// check if exist then throw error
	if (existingResource.length) {
		const existingResourceToCategory =
			(await resourceToCategoryRepository.findByWith(
				["category", "resource"],
				(schema, { eq }) => eq(schema.resource_id, existingResource[0].id)
			)) || null;

		// check if the resource has existing category
		if (existingResourceToCategory.length)
			throw new CustomError("Resource already exist!", null, 400);
	} else {
		// add resource data and return the new resource if there are no category
		newResource = await resourceRepository.save(resourceData);
		if (!categories) return newResource;
	}

	// checking if any of the categories already exist in the resource
	const resourceId = newResource?.[0].id || existingResource[0].id;
	for (const category of categories) {
		// check if exist then throw error
		const existingResourceToCategory =
			(await resourceToCategoryRepository.findByWith(
				["category", "resource"],
				(schema, { and, eq }) =>
					and(eq(schema.category_id, category), eq(schema.resource_id, resourceId))
			)) || null;
		if (existingResourceToCategory.length)
			throw new CustomError("Resource already exist in category!", null, 400);
	}

	// add in the resource to category junction
	const junctionQueryValues = categories.map((category: number) => ({
		resource_id: resourceId,
		category_id: category,
	}));
	await resourceToCategoryRepository.save(junctionQueryValues);

	// return the new resource created
	return newResource || existingResource;
};

/**
 * Retrieves a single resource from the database by its id.
 *
 * @param id The resource id to retrieve.
 *
 * @returns A promise that resolves to the resource data, or throws a `CustomError`
 *          if the resource does not exist.
 */

export const showResource = async (id: number) => {
	if (!id) throw new CustomError("Resource ID is missing", null, 404);
	try {
		const resource = await resourceRepository.findByWith({
			withColumns: { resourceToCategory: { with: { category: true } } },
			where: (schema, { eq }) => eq(schema.id, id),
		});

		return resource;
	} catch (error) {
		throw new CustomError("Resource does not exist!", null, 400);
	}
};

/**
 * Delete multiple resources by their ids concurrently.
 * @param listIds - array of resource ids to be deleted
 * @returns true if all resources are deleted successfully
 * @throws CustomError - with 404 status if any of the resources in the list does not exist
 * @throws CustomError - with 500 status if any error occurs during the deletion process
 */
export const removeResources = async (listIds: number[]) => {
	try {
		// validate if resources exist concurrently
		await Promise.all(
			listIds.map(async (listId) => {
				const existingResource = await resourceRepository.findBy("id", listId);
				if (!existingResource.length)
					throw new CustomError("Resource does not exist!", null, 404);
			})
		);

		listIds.map(async (listId) => {
			const existingResourceToCategory = await resourceToCategoryRepository.findByWith(
				["category", "resource"],
				(schema, { eq }) => eq(schema.resource_id, listId)
			);
			if (existingResourceToCategory.length) {
				for (const item of existingResourceToCategory) {
					await resourceToCategoryRepository.remove(item.id);
				}
			}
			await resourceRepository.remove(listId);
		});

		return true;
	} catch (error) {
		throw new CustomError("Error deleting resources", null, 500);
	}
};

/**
 * Updates an existing resource in the database.
 *
 * @param id The id of the resource to update.
 * @param values The values to update the resource with, as a partial object.
 * The object should contain the resource data to update, and the `categories` property
 * should be an object with `add` and `delete` properties, where the values are arrays
 * of category ids to add or delete from the resource.
 *
 * @returns A promise that resolves to the updated resource data.
 *
 * @throws CustomError - with 400 status if the `categories` property is invalid.
 * @throws CustomError - with 500 status if any error occurs during the update process.
 */
export const updateResource = async (id: number, values: any) => {
	const { categories, ...resource } = values;

	if (!categories.delete || !categories.add)
		throw new CustomError(
			"Invalid category. It should have 'deleted' and 'add' properties",
			null,
			400
		);

	try {
		const existingResource = await resourceRepository.findBy("id", id);
		for (const id of categories.delete) {
			await resourceToCategoryRepository.remove(id);
		}

		const junctionQueryValues = categories.add.map((category: number) => ({
			resource_id: existingResource[0].id,
			category_id: category,
		}));

		if (categories.add.length) await resourceToCategoryRepository.save(junctionQueryValues);

		return await resourceRepository.update(id, resource);
	} catch (error: any) {
		console.error(error.message);
		throw new CustomError("Error updating resource", null, 500);
	}
};

/**
 * Retrieves a paginated list of resources from the database, with associated categories.
 *
 * @param filters An object with the following properties:
 *                - page: The page number to retrieve.
 *                - limit: The number of resources to return per page.
 *                - sortBy: The field to sort the resources by.
 *                - sortType: The order of the sort.
 *                - filterBy: The field to filter the resources by.
 *                - filterValue: The value to filter the resources by.
 *
 * @returns A promise that resolves to an array of resource data, with the fields
 *          specified by `withColumns` if provided.
 *
 * @throws CustomError - with 400 status if any error occurs during the retrieval process.
 */

export const showPaginatedResources = async (filters: TPaginatedProps) => {
	try {
		const resource = await resourceRepository.findByWith({
			withColumns: { resourceToCategory: { with: { category: true } } },
			page: filters?.page,
			limit: filters?.limit,
			sortBy: filters?.sortBy as keyof TResources,
			sortType: filters?.sortType,
			filterBy: filters?.filterBy as keyof TResources,
			filterValue: filters?.filterValue,
		});

		return resource;
	} catch (error) {
		throw new CustomError("Resource does not exist!", null, 400);
	}
};

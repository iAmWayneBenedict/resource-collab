import { CustomError } from "@/lib/error";
import { addResource, getResourceBy } from "@/repositories/resource";
import { getResourceCategoryBy } from "@/repositories/resource-category";
import {
	addResourceToCategory,
	getResourceToCategoryByRelationalQuery,
} from "@/repositories/resource-to-category";

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
	const { name, category, userId } = resourceData;

	const existingResource = await getResourceBy("name", name);

	if (existingResource.length) throw new CustomError("Resource already exist", null, 400);

	// add resource data and return the new resource if there are no category
	const newResource = await addResource({ ...resourceData, user_id: userId }, ["id", "name"]);
	if (!category) return newResource;

	// get and check if exist, if not, then throw error
	const existingCategory = await getResourceCategoryBy("category", category);
	if (!existingCategory.length) throw new CustomError("Category does not exist!", null, 404);

	const existingCategoryId = existingCategory[0].id;
	const newResourceId = newResource[0].id;

	// check if exist then throw error
	const existingResourceToCategory =
		(await getResourceToCategoryByRelationalQuery(
			["category", "resource"],
			(schema, { and, eq }) =>
				and(
					eq(schema.category_id, existingCategoryId),
					eq(schema.resource_id, newResourceId)
				)
		)) || null;
	if (existingResourceToCategory)
		throw new CustomError("Resource already exist in category!", null, 400);

	// add in the resource to category junction
	await addResourceToCategory({ resource_id: newResourceId, category_id: existingCategoryId });

	// return the new resource created
	return newResource;
};

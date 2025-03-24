import { db } from "@/data/connection";
import {
	resources,
	ResourcesSelectType,
	ResourcesType,
} from "@/data/models/resources";
import {
	likeResources,
	resourceCollections,
	resourceTags,
	tags,
} from "@/data/schema";
import { logMemoryUsage } from "@/lib/logger/memory";
import {
	and,
	asc,
	count,
	desc,
	eq,
	exists,
	ilike,
	inArray,
	InferSelectModel,
	or,
	sql,
	SQL,
} from "drizzle-orm";

type FindResourcesParams = {
	page: number;
	limit: number;
	search: string;
	sortBy: string;
	sortType: "ascending" | "descending" | null;
	category: string | null;
	tags: string[];
	userId: string;
	resourceIds?: number[];
};
export const findUserLikedResources = async (body: FindResourcesParams) => {
	const {
		page = 1,
		limit = 10,
		search = "",
		sortBy = "created_at",
		sortType = "descending",
		category: categoryParams = "",
		tags: tagsParams = [],
		userId,
		resourceIds = [],
	} = body;

	return await db.transaction(async (tx) => {
		const [{ totalCount }] = await tx
			.select({ totalCount: count() })
			.from(likeResources)
			.where(eq(likeResources.user_id, userId as string));

		const filters: SQL[] = [eq(resources.owner_id, userId as string)];

		if (search) {
			filters.push(
				or(
					ilike(resources.name, sql.placeholder("search")),
					ilike(resources.description, sql.placeholder("search")),
				) as SQL,
			);
		}

		if (resourceIds.length) {
			filters.push(inArray(resources.id, resourceIds));
		}

		if (categoryParams) {
			filters.push(
				eq(resources.category_id, sql.placeholder("categoryParams")),
			);
		}

		// get the id of the tags
		const tagIds = await db
			.select({ id: tags.id })
			.from(tags)
			.where(inArray(tags.name, tagsParams));

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

		const sortValue = sortBy
			? (sortType === "ascending" ? asc : desc)(
					resources[sortBy as keyof ResourcesSelectType],
				)
			: asc(resources.id);

		// prepare the query
		const query = tx.query.resources
			.findMany({
				columns: {
					owner_id: false,
					created_at: false,
					updated_at: false,
				},
				with: {
					category: { columns: { id: true, name: true } },
					resourceCollections: {
						with: { collectionFolder: true },
						columns: {
							id: true,
							resource_id: true,
							collection_folder_id: true,
						},
						where: eq(resourceCollections.user_id, userId),
					},
					resourceTags: {
						columns: { resource_id: false, tag_id: false },
						with: { tag: { columns: { name: true } } },
					},
					likes: {
						columns: { liked_at: true },
						where: eq(likeResources.user_id, userId as string),
					},
				},
				extras: {
					bookmarksCount:
						sql<number>`CAST((${tx.select({ count: count() }).from(resourceCollections).where(eq(resourceCollections.resource_id, resources.id))}) AS integer)`.as(
							"bookmarksCount",
						),

					likesCount:
						sql<number>`CAST((${tx.select({ count: count() }).from(likeResources).where(eq(likeResources.resource_id, resources.id))}) AS integer)`.as(
							"likesCount",
						),
				},
				where: and(...baseFilters, ...tagFilter),
				offset: sql.placeholder("offset"),
				...(limit !== -1 ? { limit: sql.placeholder("limit") } : {}),
				orderBy: [sortValue],
			})
			.prepare("all_resources");

		// execute the prepared statement
		const result = await query.execute({
			search: `%${search}%`,
			offset: (page - 1) * (limit === -1 ? 1 : limit), // when limit is -1, we still need a valid offset
			...(limit !== -1 ? { limit: Number(limit) } : {}),
			categoryParams,
		});

		// restructure
		const rows = result
			.map((resource) => ({
				...resource,
				category: resource.category.name,
				resourceCollections:
					resource?.resourceCollections?.map(
						(collection) => collection.collection_folder_id,
					) ?? [],
				resourceTags:
					resource?.resourceTags?.map((tag) => tag.tag.name) ?? [],
			}))
			.filter((resource: any) => resource.likes.length)
			// descending order
			.sort(
				(a, b) =>
					new Date(b.likes[0].liked_at as Date).getTime() -
					new Date(a.likes[0].liked_at as Date).getTime(),
			) as Partial<InferSelectModel<ResourcesType>>[];

		logMemoryUsage("Memory Usage");
		return {
			rows,
			totalCount,
		};
	});
};

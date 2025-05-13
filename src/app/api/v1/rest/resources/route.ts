import { NextRequest, NextResponse } from "next/server";
import {
	createResourceTransaction,
	deleteResourceTransaction,
	findResource,
	findResources,
} from "@/services/resource-service";
import { auth, getSession } from "@/lib/auth";
import { ListOfPrompt } from "@/services/ai/prompts";
import { ListOfSystemInstruction } from "@/services/ai/system-instructions";
import { ListOfSchema } from "@/services/ai/gemini";
import { AIService } from "@/services/ai";
import { findAllCategory } from "@/services/category-service";
import axios from "axios";
import config from "@/config";
import VectorService from "@/services/vector";
import { collectionFolders, resources } from "@/data/schema";
import { db } from "@/data/connection";
import { and, eq } from "drizzle-orm";
import { hasSubscriptionAccess } from "@/services/subscription-service";

type BodyParams = {
	collection_folder_id?: string;
	name: string;
	category: number | string;
	tags: number[] | string[];
	icon: string;
	thumbnail: string;
	description: string;
	url: string;
	is_global: boolean;
	resourceIds?: number[];
};
export async function POST(request: NextRequest): Promise<NextResponse> {
	const body: BodyParams = await request.json();

	// check if the user is authenticated
	const session = await getSession(request.headers);
	const user = session?.user;
	if (!user)
		return NextResponse.json(
			{ message: "Unauthorized", data: null },
			{ status: 403 },
		);

	try {
		let resourceData;

		// if the request body has name, then it is manually created
		if (body.name) {
			const validationResponse = validate(body);
			if (validationResponse) return validationResponse;

			resourceData = body;
		}

		// check if the resource already exists
		const existingResource = await db
			.select()
			.from(resources)
			.where(
				and(
					eq(resources.owner_id, user.id),
					eq(resources.url, body.url),
				),
			);

		if (existingResource.length > 0) {
			return NextResponse.json(
				{ message: "Resource already exists", data: null },
				{ status: 400 },
			);
		}

		if (!body.name) {
			let response;
			try {
				response = await axios.get(
					`${config.SERVER_API_URL}/scrape?url=${body.url}`,
				);
			} catch (error: any) {
				console.log(JSON.stringify(error));

				if (error.code === "ERR_BAD_REQUEST") {
					return NextResponse.json(
						{ message: "Invalid URL", data: { path: ["url"] } },
						{ status: 400 },
					);
				}

				if (error instanceof Error) {
					return NextResponse.json(
						{ message: error.message, data: { path: ["url"] } },
						{ status: 400 },
					);
				}

				return NextResponse.json(
					{
						message: "Error scraping the url",
						data: { path: ["alert"] },
					},
					{ status: 400 },
				);
			}

			resourceData = {
				...response.data?.data,
				collection_folder_id: body.collection_folder_id,
				category: body.category,
				thumbnail: response.data?.data.image,
				icon: response.data?.data.icon,
				name:
					response.data?.data.title ?? response.data?.data.site_name,
				tags: [],
			};
		}

		const isCloudflareProtected = resourceData.title
			.toLowerCase()
			.includes("cloudflare");
		if (isCloudflareProtected) {
			return NextResponse.json(
				{
					message: "Website protected with cloudflare!",
					data: { path: ["url"] },
				},
				{ status: 403 },
			);
		}

		if (!resourceData.description) {
			return NextResponse.json(
				{
					message: "No metadata found from the url",
					data: { path: ["url"] },
				},
				{ status: 404 },
			);
		}

		if (body?.collection_folder_id) {
			const exist = await db
				.select()
				.from(collectionFolders)
				.where(eq(collectionFolders.id, body?.collection_folder_id));

			if (!exist.length)
				return NextResponse.json(
					{
						message: "Collection folder not found",
						data: { path: ["url"] },
					},
					{ status: 404 },
				);
		}

		const hasUserSubscriptionAccess = await hasSubscriptionAccess({
			type: "ai_generated_categories_and_tags",
			user_id: user.id,
			dbContext: db,
		});

		if (!resourceData.category && hasUserSubscriptionAccess) {
			const categoriesWithTags = await findAllCategory({
				type: "all",
				with: { tags: true },
			});
			const structuredCategoriesWithTags = categoriesWithTags.rows.map(
				(category: any) => ({
					category: category.name,
					tags: category?.tags.map((tag: any) => tag.name),
				}),
			);

			const aiCategoryWithTagsResponse = await AIService.gemini.generate({
				prompt: ListOfPrompt.CATEGORY_AND_LIST_OF_TAGS({
					resource: JSON.stringify(resourceData),
					categoriesWithTags: JSON.stringify(
						structuredCategoriesWithTags,
					),
				}),
				systemInstruction:
					ListOfSystemInstruction.CATEGORY_AND_LIST_OF_TAGS_INSTRUCTION,
				config: ListOfSchema.CATEGORY_AND_LIST_OF_TAGS,
			});

			const categoryAndListOfTags = aiCategoryWithTagsResponse.response;
			// add the category and tags to the resource data
			resourceData = {
				...resourceData,
				...categoryAndListOfTags,
			};
		} else {
			resourceData = {
				...resourceData,
				category: resourceData.category ?? "",
				tags: resourceData.tags ?? [],
			};
		}

		const { tags: tagParams } = resourceData;

		// check if the tags are string then it is new tags
		if (!Array.isArray(tagParams))
			return NextResponse.json(
				{ message: "Tags must be an array", data: { path: ["tags"] } },
				{ status: 400 },
			);

		const newResource = await createResourceTransaction({
			...resourceData,
			userId: user.id,
		});

		if (user.role === "admin") {
			// upsert the resource to pinecone
			const newResourceWithTags = await findResources({
				page: 1,
				limit: 1,
				search: newResource.name ?? "",
				sortBy: "",
				sortType: null,
				category: null,
				tags: [],
				userId: undefined,
			});

			await VectorService.pinecone.upsertResource(
				newResourceWithTags.rows,
			);
		}

		return NextResponse.json(
			{ message: "Resource created", data: [newResource] },
			{ status: 201 },
		);
	} catch (error) {
		console.log("Error", error);

		return NextResponse.json(
			{ message: "Error creating resource", data: { path: ["alert"] } },
			{ status: 400 },
		);
	}
}

const validate = (body: BodyParams) => {
	const requiredFields = ["name", "icon", "category", "tags", "url"];
	const missingFields = requiredFields.filter(
		(field) => !body[field as keyof BodyParams],
	);

	if (missingFields.length > 0) {
		return NextResponse.json(
			{
				message: `Please fill in the ${missingFields.join(", ")} field(s)`,
				data: {
					path: missingFields,
				},
			},
			{ status: 400 },
		);
	}

	return null;
};

export const DELETE = async (request: NextRequest) => {
	const body = await request.json();
	const session = await auth.api.getSession({ headers: request.headers });
	const user = session?.user;

	if (!user)
		return NextResponse.json(
			{ message: "Unauthorized", data: null },
			{ status: 403 },
		);

	if (!body.ids || !Array.isArray(body.ids)) {
		return NextResponse.json(
			{ message: "Resource IDs parameter is missing", data: null },
			{ status: 404 },
		);
	}

	const { ids } = body;

	try {
		const deletedResources = await deleteResourceTransaction({
			ids: ids as number[],
			userId: user.id,
		});

		if (user.role === "admin")
			await VectorService.pinecone.deleteResource(
				deletedResources.map((n) => n + ""),
			);

		return NextResponse.json(
			{
				message: "Resource successfully retrieved",
				data: deletedResources,
			},
			{ status: 201 },
		);
	} catch (error: any) {
		console.log("Error", error.message);

		return NextResponse.json(
			{ message: "Error retrieving resource", data: null },
			{ status: 400 },
		);
	}
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
export const GET = async (req: NextRequest) => {
	const { searchParams } = req.nextUrl;

	const session = await getSession(req.headers);
	const user = session?.user;

	const page = Number(searchParams.get("page")) || DEFAULT_PAGE;
	const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;
	const search = searchParams.get("search") ?? "";
	const sortBy = searchParams.get("sort_by") ?? "";
	const sortType = searchParams.get("sort_type") as
		| "ascending"
		| "descending"
		| null;
	const resourceIds =
		searchParams
			.get("resource_ids")
			?.split(",")
			.filter((id) => id)
			.map((id) => Number(id)) ?? [];

	// filters
	const categoryParams = searchParams.get("category");
	const tagsParams =
		searchParams
			.get("tags")
			?.split(",")
			.filter((tag) => tag) ?? [];

	try {
		const { rows, totalCount } = await findResources({
			limit,
			page,
			search,
			sortBy,
			sortType,
			resourceIds,
			category: categoryParams,
			tags: tagsParams,
			userId: user?.id,
		});

		return NextResponse.json(
			{
				message: "Successfully retrieved resources",
				data: { rows, count: totalCount },
			},
			{ status: 200 },
		);
	} catch (error) {
		console.log("Error", error);
		return NextResponse.json(
			{ message: "Error retrieving resources", data: null },
			{ status: 500 },
		);
	}
};

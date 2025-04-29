import { db } from "@/data/connection";
import { getSession } from "@/lib/auth";
import { getApiHeaders } from "@/lib/utils";
import { AIService } from "@/services/ai";
import { ListOfSchema } from "@/services/ai/gemini";
import { ListOfPrompt } from "@/services/ai/prompts";
import { ListOfSystemInstruction } from "@/services/ai/system-instructions";
import {
	findAllUserResources,
	findResources,
} from "@/services/resource-service";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { resources } from "../../../../../../data/models/resources";

export const GET = async (req: NextRequest) => {
	const query = req.nextUrl.searchParams.get("query") || "";

	const session = await getSession(req.headers);
	const user = session?.user;

	if (!user)
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	if (!query)
		return NextResponse.json(
			{ message: "Search query is required", data: { path: ["search"] } },
			{ status: 400, headers: getApiHeaders(["GET"]) },
		);

	try {
		const userResources = await db.query.resources.findMany({
			columns: {
				created_at: false,
			},
			with: {
				category: { columns: { name: true } },
				likes: { columns: { liked_at: true } },
				tags: {
					columns: {
						resource_id: false,
						tag_id: false,
					},
					with: {
						tag: { columns: { name: true } },
					},
				},
			},
			where: eq(resources.owner_id, user.id),
		});
		const allResources =
			userResources.map((resource: any) => {
				const {
					category_id,
					owner_id,
					icon,
					thumbnail,
					url,
					likes,
					...rest
				} = resource;
				return {
					...rest,
					likesCount: likes.length,
					tags: resource.tags.map(
						({ tag }: Record<string, any>) => tag.name,
					),
				};
			}) || [];

		const {
			response: { message, resources: aiResources },
			usageMetaData,
		} = await AIService.gemini.generate({
			prompt: ListOfPrompt.SEARCH_RESOURCES({
				query,
				resources: allResources,
			}),
			config: ListOfSchema.SEARCHED_LIST_OF_RESOURCES,
			systemInstruction:
				ListOfSystemInstruction.SEARCH_USER_RESOURCES_INSTRUCTION,
		});

		let resourcesData = null;
		if (aiResources.length) {
			resourcesData = await findResources({
				page: 1,
				limit: aiResources.length || 10,
				resourceIds: aiResources,
				search: "",
				sortBy: "",
				sortType: null,
				category: null,
				tags: [],
				userId: user?.id ?? undefined,
			});
		}

		const rows = resourcesData?.rows ?? [];
		const totalCount = resourcesData?.totalCount ?? 0;

		// sort the rows by the order of the resources in the resources array
		const rowsSorted = rows?.sort((a, b) => {
			const indexA = aiResources.indexOf(a.id);
			const indexB = aiResources.indexOf(b.id);
			return indexA - indexB;
		});

		return NextResponse.json(
			{ data: { message, resources: rowsSorted } },
			{ status: 200, headers: getApiHeaders(["GET"]) },
		);
	} catch (err) {
		console.log(err);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
};

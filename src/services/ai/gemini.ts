import {
	GenerationConfig,
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
	SchemaType,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SAFETY_SETTINGS = [
	{
		category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	},
];

type GeminiProps = {
	prompt: string;
	model?: string;
	config?: GenerationConfig;
	systemInstruction?: string;
};
const Gemini = async ({
	prompt,
	model = "gemini-2.0-flash",
	config = undefined,
	systemInstruction = undefined,
}: GeminiProps) => {
	const hasConfig = !!config;

	// define configuration for the model
	const generationConfig = {
		responseMimeType: "application/json",
		responseSchema: config,
	} as GenerationConfig;

	try {
		const geminiModel = genAI.getGenerativeModel({
			model,
			generationConfig: hasConfig ? generationConfig : undefined,
			systemInstruction,
			safetySettings: SAFETY_SETTINGS,
		});
		const result = await geminiModel.generateContent(prompt);

		const text = result.response.text();

		return {
			response: JSON.parse(text),
			usageMetaData: result.response.usageMetadata,
		};
	} catch (err: any) {
		console.dir(err);
		console.log("Error: " + err.message);

		return {
			response: {
				error: err.message,
			},
			usageMetaData: undefined,
		};
	}
};

export default Gemini;

// CONFIGURATIONS FOR GEMINI

export const ListOfSchema = {
	LIST_OF_RESOURCES: {
		description: "List of website resources",
		type: SchemaType.OBJECT,
		properties: {
			summary: {
				type: SchemaType.STRING,
				description:
					"A summary of the response, including reasoning and additional suggestions",
			},
			knowledge_cutoff: {
				type: SchemaType.STRING,
				description: "Date of your knowledge cutoff as data model",
			},
			resources: {
				type: SchemaType.ARRAY,
				description: "Ranking of resources based on metrics provided",
				items: {
					type: SchemaType.INTEGER,
					description: "ID of the resources",
					// properties: {
					// 	title: {
					// 		type: SchemaType.STRING,
					// 		description:
					// 			"The title of the resource from og:title meta tag or title tag",
					// 	},
					// 	url: {
					// 		type: SchemaType.STRING,
					// 		description: "The URL of the website or resource",
					// 	},
					// 	icon: {
					// 		type: SchemaType.STRING,
					// 		description:
					// 			"The URL of the resource's icon from favicon meta tag",
					// 	},
					// 	thumbnail: {
					// 		type: SchemaType.STRING,
					// 		description:
					// 			"The URL of the resource's thumbnail from og:image meta tag",
					// 	},
					// 	description: {
					// 		type: SchemaType.STRING,
					// 		description: "A brief description of the resource",
					// 	},
					// 	category: {
					// 		type: SchemaType.STRING,
					// 		description: "The category of the resource",
					// 	},
					// 	view_count: {
					// 		type: SchemaType.INTEGER,
					// 		description:
					// 			"The number of times this resource has been viewed",
					// 	},
					// 	bookmarks_count: {
					// 		type: SchemaType.INTEGER,
					// 		description:
					// 			"The number of times this resource has been bookmarked",
					// 	},
					// 	likes_count: {
					// 		type: SchemaType.INTEGER,
					// 		description:
					// 			"The number of times this resource has been liked",
					// 	},
					// 	resource_tags: {
					// 		type: SchemaType.ARRAY,
					// 		description: "Tags associated with the resource",
					// 		items: {
					// 			type: SchemaType.STRING,
					// 		},
					// 	},
					// 	created_at: {
					// 		type: SchemaType.STRING,
					// 		description:
					// 			"The timestamp when the resource was created",
					// 	},
					// 	updated_at: {
					// 		type: SchemaType.STRING,
					// 		description:
					// 			"The timestamp when the resource was last updated",
					// 	},
					// 	likes: {
					// 		type: SchemaType.ARRAY,
					// 		description: "A list of likes on the resource",
					// 		items: {
					// 			type: SchemaType.OBJECT,
					// 			properties: {
					// 				liked_at: {
					// 					type: SchemaType.STRING,
					// 					description:
					// 						"Timestamp of when the resource was liked",
					// 				},
					// 			},
					// 		},
					// 	},
					// },
					// required: [
					// 	"title",
					// 	"url",
					// 	"icon",
					// 	"thumbnail",
					// 	"description",
					// 	"category",
					// 	"view_count",
					// 	"bookmarks_count",
					// 	"likes_count",
					// 	"resource_tags",
					// 	"created_at",
					// 	"updated_at",
					// 	"likes",
					// ],
				},
			},
		},
		required: ["summary", "knowledge_cutoff", "resources"],
	} as GenerationConfig,

	CATEGORY_AND_LIST_OF_TAGS: {
		description: "Category and list of tags",
		type: SchemaType.OBJECT,
		properties: {
			category: {
				type: SchemaType.STRING,
				description: "The category of the resource",
			},
			tags: {
				type: SchemaType.ARRAY,
				items: {
					type: SchemaType.STRING,
					description: "The tags of the resource",
				},
			},
		},
		required: ["category", "tags"],
	} as GenerationConfig,
};

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
					"A prioritized summary of resources, ordered by user interest and popularity",
			},
			knowledge_cutoff: {
				type: SchemaType.STRING,
				description: "Date of your knowledge cutoff as data model",
			},
			resources: {
				type: SchemaType.ARRAY,
				items: {
					type: SchemaType.OBJECT,
					properties: {
						title: {
							type: SchemaType.STRING,
							description:
								"The title of the resource from og:title meta tag or title tag",
						},
						url: {
							type: SchemaType.STRING,
							description: "The URL of the website or resource",
						},
						icon: {
							type: SchemaType.STRING,
							description:
								"The URL of the resource's icon from favicon meta tag. This can be also be the URL of the website's icon",
						},
						thumbnail: {
							type: SchemaType.STRING,
							description:
								"The URL of the resource's thumbnail from og:image meta tag. This can be also be the URL of the website's background image",
						},
						description: {
							type: SchemaType.STRING,
							description: "A brief description of the resource",
						},
					},
					required: [
						"title",
						"url",
						"icon",
						"thumbnail",
						"description",
					],
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

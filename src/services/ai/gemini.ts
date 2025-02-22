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
	model = "gemini-1.5-pro",
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

	// TODO: get the promptToken, candidateToken, and totalToken from usageMetaData for statistics
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
};

export const ListOfSystemInstruction = {
	LIST_OF_RESOURCES_SUMMARY: `You are a web scraping assistant that scrapes the website and returns a list of resources that you may find similarities with the prompt you will be given. 
        STRICTLY NO WEBSITES THAT ARE LISTING OTHER WEBSITES similar with these (Top UI library in react, Top AI models, Top 10, Top 5). 
        You should also STRICTLY adhere to the schema that you will be given.`,
};

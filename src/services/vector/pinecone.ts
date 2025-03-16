import config from "@/config";
import { Pinecone } from "@pinecone-database/pinecone";
import { config as envConfig } from "dotenv";
envConfig();

const pinecone = new Pinecone({
	apiKey: process.env.PINECONE_AI_SEARCH_API_KEY ?? "",
});

/**
 * Upserts resources into Pinecone vector database
 *
 * @param resources - Array of resource objects to be vectorized and stored
 * @returns Promise that resolves when the upsert operation completes
 */
export const upsertResource = async (resources: any[]) => {
	const resourceNamespace = pinecone
		.index(config.PINECONE_INDEX_NAME!)
		.namespace(config.PINECONE_NAMESPACE!);
	const model = config.PINECONE_INDEX_CONFIG!;

	// Format each resource into a text representation for embedding
	const textToEmbed = resources.map((resource: any) => ({
		text: `
			Name: ${resource.name}
			Description: ${resource.description}
			Category: ${resource.category || ""}
			Tags: ${resource.resourceTags?.join(", ") || ""}
			URL: ${resource.url}
		`.trim(),
	}));

	// Generate embeddings for all resources using Pinecone's inference API
	const embeddings = (await pinecone.inference.embed(
		model,
		textToEmbed.map((t) => t.text),
		{
			inputType: "passage", // Treat input as passages of text
			// truncate: "END",      // Truncate from the end if text is too long
		},
	)) as any;

	// Create vector objects with IDs, embedding values, and metadata
	const vectors = resources.map((resource: any, i: number) => ({
		id: resource.id + "",
		values: embeddings.data[i].values,
		metadata: {
			...resource,
		},
	}));

	// Upsert vectors to Pinecone in the specified namespace
	// This will create new vectors or update existing ones with the same ID
	await resourceNamespace.upsert(vectors);

	console.log(
		`Upserted ${vectors.length} resources to Pinecone vector database`,
	);
};

export const queryResources = async (query: string[]) => {
	const resourceNamespace = pinecone
		.index(config.PINECONE_INDEX_NAME!)
		.namespace(config.PINECONE_NAMESPACE!);
	const model = config.PINECONE_INDEX_CONFIG!;
	// Generate an embedding for the query text using Pinecone's inference API
	const embedding = (await pinecone.inference.embed(model, query, {
		inputType: "query", // Treat input as a query
	})) as any;

	// Perform a vector search in Pinecone for similar resources
	const results = await resourceNamespace.query({
		vector: embedding.data[0].values,
		topK: 10,
		includeMetadata: true,
	});

	return results;
};

export const updateResource = async (resource: any) => {
	const resourceNamespace = pinecone
		.index(config.PINECONE_INDEX_NAME!)
		.namespace(config.PINECONE_NAMESPACE!);
	const model = config.PINECONE_INDEX_CONFIG!;

	// Format each resource into a text representation for embedding
	const textToEmbed = {
		text: `
			Name: ${resource.name}
			Description: ${resource.description}
			Category: ${resource.category || ""}
			Tags: ${resource.resourceTags?.join(", ") || ""}
			URL: ${resource.url}
		`.trim(),
	};

	// Generate embeddings for all resources using Pinecone's inference API
	const embeddings = (await pinecone.inference.embed(
		model,
		[textToEmbed.text],
		{
			inputType: "passage", // Treat input as passages of text
			// truncate: "END",      // Truncate from the end if text is too long
		},
	)) as any;

	// Create vector objects with IDs, embedding values, and metadata
	const vector = {
		id: resource.id + "",
		values: embeddings.data[0].values,
		metadata: {
			...resource,
		},
	};

	await resourceNamespace.update(vector);

	console.log(`Updated resource ${resource.id} to Pinecone vector database`);
};

export const deleteResource = async (resourceIds: string[]) => {
	const resourceNamespace = pinecone
		.index(config.PINECONE_INDEX_NAME!)
		.namespace(config.PINECONE_NAMESPACE!);

	await resourceNamespace.deleteMany(resourceIds);

	console.log(
		`Deleted resources ${resourceIds} from Pinecone vector database`,
	);
};

export default pinecone;

import config from "@/config";
import pinecone from "./pinecone";

const createPineconeIndex = async () => {
	try {
		console.log("Creating Pinecone index...");
		await pinecone.createIndex({
			name: config.PINECONE_INDEX_NAME!,
			dimension: 1024, // Replace with your model dimensions
			metric: "cosine", // Replace with your model metric
			spec: {
				serverless: {
					cloud: "aws",
					region: "us-east-1",
				},
			},
		});
		console.log("Pinecone index created successfully!");
	} catch (e) {
		console.error("Error creating Pinecone index:", e);
	}
};

createPineconeIndex();

import pinecone, {
	deleteResource,
	queryResources,
	updateResource,
	upsertResource,
} from "./pinecone";

const VectorService = {
	pinecone: {
		pinecone,
		upsertResource,
		queryResources,
		deleteResource,
		updateResource,
	},
};

export default VectorService;

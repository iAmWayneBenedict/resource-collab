type CategoryAndListOfTagsProps = {
	resource: string;
	categoriesWithTags: string;
};
type ListOfResourcesProps = {
	query: string;
	resources: any[];
};
export const ListOfPrompt = {
	LIST_OF_RESOURCES: ({ query, resources }: ListOfResourcesProps) =>
		`List of resources: ${JSON.stringify(resources)}, 
		 query: "${query}"`,
	CATEGORY_AND_LIST_OF_TAGS: ({
		resource,
		categoriesWithTags,
	}: CategoryAndListOfTagsProps) =>
		`Resource: "${resource}", 
		 Categories with Tags: "${categoriesWithTags}"`,
};

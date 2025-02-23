type CategoryAndListOfTagsProps = {
	resource: string;
	categoriesWithTags: string;
};
export const ListOfPrompt = {
	CATEGORY_AND_LIST_OF_TAGS: ({
		resource,
		categoriesWithTags,
	}: CategoryAndListOfTagsProps) =>
		`Resource: "${resource}", 
		 Categories with Tags: "${categoriesWithTags}"`,
};

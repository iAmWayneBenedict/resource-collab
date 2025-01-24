type TPaginatedProps = {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	sortType?: "ascending" | "descending" | undefined;
	filterBy?: string;
	filterValue?: string;
};

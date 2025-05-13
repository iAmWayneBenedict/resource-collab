import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const useGetPaginationValues = (data: any[]) => {
	const searchParams = useSearchParams();
	const sortBySearchParams = searchParams.get("sortBy") || "";
	const search = searchParams.get("search") || "";
	const category = searchParams.get("category") || "";
	const tags = searchParams.get("tags");

	const tagsArray = useMemo(() => (tags ? tags.split(",") : []), [tags]);

	let sortValue = "";
	let sortBy = "";
	if (["Newest", "Oldest"].includes(sortBySearchParams)) {
		sortBy = "created_at";
		if (sortBySearchParams === "Newest") sortValue = "descending";
		else sortValue = "ascending";
	} else if (
		["Alphabetical", "Reverse Alphabetical"].includes(sortBySearchParams)
	) {
		sortBy = "name";
		if (sortBySearchParams === "Alphabetical") sortValue = "ascending";
		else sortValue = "descending";
	} else if (sortBySearchParams === "Most Viewed") {
		sortBy = "view_count";
		sortValue = "ascending";
	}

	const queryParams = {
		sortBy,
		sortValue,
		search,
		category,
		tags: tagsArray,
	};

	const searched = useMemo(() => {
		if (!data?.length) return [];
		if (!queryParams.search) return data;
		return data.filter(
			(row: any) =>
				row?.name
					?.toLowerCase()
					.includes(queryParams.search.toLowerCase()) ||
				row?.description
					?.toLowerCase()
					.includes(queryParams.search.toLowerCase()),
		);
	}, [queryParams]);

	const filtered = useMemo(() => {
		const { tags, category } = queryParams;
		if (!searched?.length) return [];
		let categoryResult = searched;
		if (category) {
			categoryResult = categoryResult.filter(
				(row: any) => row.category_id == category,
			);
		}
		return categoryResult?.filter((row: any) => {
			const rowTags = row.tags?.map(({ tag }: any) => tag.name);
			return tags.every((tag: any) => rowTags.includes(tag));
		});
	}, [searched, queryParams]);

	const sorted = useMemo(() => {
		const { sortBy, sortValue } = queryParams;
		if (!filtered?.length) return [];
		if (!sortBy || !sortValue) return filtered;
		return filtered.sort((a: any, b: any) => {
			if (sortBy === "created_at") {
				if (sortValue === "ascending") {
					return (
						new Date(a.created_at).getTime() -
						new Date(b.created_at).getTime()
					);
				} else {
					return (
						new Date(b.created_at).getTime() -
						new Date(a.created_at).getTime()
					);
				}
			} else if (sortBy === "view_count") {
				if (sortValue === "ascending") {
					return a.view_count - b.view_count;
				} else {
					return b.view_count - a.view_count;
				}
			} else {
				if (sortValue === "ascending") {
					return a.name.localeCompare(b.name);
				} else {
					return b.name.localeCompare(a.name);
				}
			}
		});
	}, [filtered, queryParams]);

	return sorted;
};

export default useGetPaginationValues;

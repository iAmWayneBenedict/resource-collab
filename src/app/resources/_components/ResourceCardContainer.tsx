"use client";

import ResourceCard from "@/components/layouts/cards/ResourceCard";
import { useGetCollectionsQuery } from "@/lib/queries/collections";
import { useGetPaginatedResourcesQuery } from "@/lib/queries/resources";
import { useAuthUser } from "@/store";
import { useCollections } from "@/store/useCollections";
import { Button } from "@heroui/react";
import { RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const ResourceCardContainer = () => {
	const searchParams = useSearchParams();
	const authUser = useAuthUser((state) => state.authUser);
	const setCollections = useCollections((state) => state.setCollections);

	const category = searchParams.get("category") ?? "";
	const sortBySearchParams = searchParams.get("sortBy") ?? "";
	const tagsSearchParams = searchParams.get("tags") ?? "";

	// sortBySearchParams can be "Newest", "Oldest", "Alphabetical", "Reverse Alphabetical", "Most Viewed"
	// so we need to convert it to the sortBy and sortValue
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

	const { data, isSuccess, isLoading, refetch } =
		useGetPaginatedResourcesQuery(
			{
				page: 1,
				limit: 20,
				category: !isNaN(Number(category)) ? category : "",
				tags: tagsSearchParams,
				sort_by: sortBy,
				sort_type: sortValue,
			},
			[category, sortValue, sortBy, tagsSearchParams],
		);

	const collections = useGetCollectionsQuery({
		enabled: !!authUser,
	});

	useEffect(() => {
		if (!collections.isSuccess) return;

		setCollections(collections.data?.data);
	}, [collections.isSuccess, collections.data]);

	if (isLoading) {
		return (
			<div className="mt-10 flex w-full justify-center">
				<h3 className="text-xl">Loading...</h3>
			</div>
		);
	}

	if (!isSuccess) {
		return (
			<div className="mt-32 flex w-full flex-col items-center">
				<h3 className="text-xl">Something went wrong</h3>
				<div>
					<Button
						className="mt-4 bg-violet text-white hover:opacity-90"
						startContent={<RotateCcw size={20} />}
						onPress={refetch}
					>
						Reload
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="mt-10 flex flex-wrap gap-6">
			{data?.data.rows.map((resource: any) => (
				<ResourceCard key={resource.id} data={resource} />
			))}
		</div>
	);
};

export default ResourceCardContainer;

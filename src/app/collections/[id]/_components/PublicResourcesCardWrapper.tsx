"use client";

import ResourceCard from "@/components/layouts/cards/ResourceCard";
import EmptyDisplay from "@/components/layouts/EmptyDisplay";
import { useGetAISearchQuery } from "@/lib/queries/AISearch";
import { useGetCollectionsQuery } from "@/lib/queries/collections";
import { useGetPaginatedResourcesQuery } from "@/lib/queries/resources";
import { useAuthUser } from "@/store";
import {
	ResourcePaginatedSearchParamsProvider,
	ResourcePaginatedSearchParamsState,
} from "@/store/context/providers/ResourcePaginatedSearchParams";
import useResourcePaginatedSearchParams from "@/store/context/useResourcePaginatedSearchParams";
import { useAISearchStore } from "@/store/useAIResult";
import { useCollections } from "@/store/useCollections";
import { useDashboardPage } from "@/store/useDashboardPage";
import { useSearchData } from "@/store/useSearchData";
import { Button, Skeleton } from "@heroui/react";
import { RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const ResourceCardWrapper = ({ resourcesData }: any) => {
	console.log(resourcesData);
	const searchParams = useSearchParams();
	const authUser = useAuthUser((state) => state.authUser);
	const setCollections = useCollections((state) => state.setCollections);
	const setSearchParams = useResourcePaginatedSearchParams(
		(state: ResourcePaginatedSearchParamsState) =>
			state.actions.setSearchParams,
	) as ResourcePaginatedSearchParamsState["actions"]["setSearchParams"];
	const setSearchData = useSearchData((state) => state.setSearchData);
	const setDashboardPage = useDashboardPage(
		(state) => state.setDashboardPage,
	);

	const category = searchParams.get("category") ?? "";
	const sortBySearchParams = searchParams.get("sortBy") ?? "";
	const tagsSearchParams = searchParams.get("tags") ?? "";
	const searchValue = searchParams.get("search") ?? "";

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

	useEffect(() => {
		setDashboardPage("public");
	}, []);

	const { data, isLoading, isSuccess, isError, refetch } = resourcesData;
	// used in optimistic updated to monitor the query keys for useQuery
	useEffect(() => {
		setSearchParams({
			queryKey: [
				"paginated-resources",
				category,
				sortBy,
				sortValue,
				tagsSearchParams,
				searchValue,
			],
		});
	}, [category, sortValue, sortBy, tagsSearchParams, searchValue]);

	// search data for search modal
	const searchFeedData = useMemo(
		() =>
			data?.data?.rows?.map((resource: any) => {
				return {
					name: resource.name,
					description: resource.description,
				};
			}) || [],
		[data?.data?.rows],
	);
	useEffect(() => {
		if (searchFeedData.length) setSearchData(searchFeedData);
	}, [searchFeedData]);

	const collections = useGetCollectionsQuery({
		enabled: !!authUser,
	});

	useEffect(() => {
		if (!collections.isSuccess) return;

		setCollections(collections.data?.data);
	}, [collections.isSuccess, collections.data]);

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				{Array.from({ length: 6 }).map((_, index) => (
					<div
						key={index}
						className="m-0 flex h-72 min-w-[19rem] flex-1 flex-col gap-3 rounded-2xl p-0 md:min-w-[22rem]"
					>
						<Skeleton className="h-48 w-full rounded-xl" />
						<Skeleton className="h-4 w-3/4 rounded-xl" />
						<Skeleton className="h-4 w-1/2 rounded-xl" />
					</div>
				))}
			</div>
		);
	}

	if (!isSuccess) {
		return (
			<EmptyDisplay
				code="404"
				title="Something went wrong"
				description="Please try again later"
				showButton={false}
			>
				<div>
					<Button
						className="mt-4 bg-violet text-white hover:opacity-90"
						startContent={<RotateCcw size={20} />}
						onPress={refetch}
					>
						Reload
					</Button>
				</div>
			</EmptyDisplay>
		);
	}

	if (data.data.rows.length === 0) {
		return (
			<EmptyDisplay
				code="0"
				title="No resources found"
				description="No resources has been added to this collection yet"
				showButton={false}
			>
				<div>
					<Button
						className="mt-4 bg-violet text-white hover:opacity-90"
						startContent={<RotateCcw size={20} />}
						onPress={refetch}
					>
						Reload
					</Button>
				</div>
			</EmptyDisplay>
		);
	}

	return (
		<div className="mt-10 flex flex-wrap gap-4">
			{data?.data.rows.map((resource: any) => (
				<ResourceCard key={resource.id} data={resource} />
			))}
		</div>
	);
};

const PublicResourceCardContainer = ({ resourcesData }: any) => {
	return (
		<ResourcePaginatedSearchParamsProvider initialSearchParams={[]}>
			<ResourceCardWrapper resourcesData={resourcesData} />
		</ResourcePaginatedSearchParamsProvider>
	);
};

export default PublicResourceCardContainer;

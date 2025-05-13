import ResourceCard from "@/components/layouts/cards/ResourceCard";
import { useGetCollectionsQuery } from "@/lib/queries/collections";
import { useGetUserResourcesQuery } from "@/lib/queries/user";
import { useAuthUser, useModal } from "@/store";
import {
	ResourcePaginatedSearchParamsProvider,
	ResourcePaginatedSearchParamsState,
} from "@/store/context/providers/ResourcePaginatedSearchParams";
import useResourcePaginatedSearchParams from "@/store/context/useResourcePaginatedSearchParams";
import { useCollections } from "@/store/useCollections";
import { useRequestStatus } from "@/store/useRequestStatus";
import { Button, Skeleton } from "@heroui/react";
import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import EmptyDisplay from "@/components/layouts/EmptyDisplay";
import {
	FilterModalTrigger,
	SearchModalTrigger,
} from "@/app/resources/_components/filter";
import useGetPaginationValues from "@/store/useGetPaginationValues";
import { useSearchData } from "@/store/useSearchData";
import { cn } from "@/lib/utils";

type Props = {
	type:
		| "resources"
		| "liked"
		| "collections"
		| "shared"
		| "collection-resources"
		| "collection-shared-resources"
		| "collection-portfolios";

	id?: number | string;
	callback?: (data: Record<string, any>) => void;
};
const ResourceWrapper = ({ type, id, callback }: Props) => {
	const { authUser } = useAuthUser();
	const setSearchParams = useResourcePaginatedSearchParams(
		(state: ResourcePaginatedSearchParamsState) =>
			state.actions.setSearchParams,
	) as ResourcePaginatedSearchParamsState["actions"]["setSearchParams"];
	const setCollections = useCollections((state) => state.setCollections);
	const setSearchData = useSearchData((state) => state.setSearchData);

	const setRequestStatus = useRequestStatus(
		(state) => state.setRequestStatus,
	);

	const { data, isSuccess, isLoading, isFetching, isError } =
		useGetUserResourcesQuery(
			{ tab: "resources" },
			{ user_id: authUser?.id, type, id, tab: "resources" },
		);

	const sortedResources = useGetPaginationValues(data?.data?.rows);

	useEffect(() => {
		setSearchParams({
			queryKey: [`user-${type}${id ? `-${id}` : ""}-resources`],
		});
	}, []);

	const collections = useGetCollectionsQuery({
		enabled: !!authUser,
	});

	const { onOpen: onOpenModal } = useModal();

	useEffect(() => {
		if (!collections.isSuccess) return;

		setCollections(collections.data?.data);
	}, [collections.isSuccess, collections.data]);

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

	const isCollectionResources =
		type === "collection-resources" ||
		type === "collection-shared-resources";

	useEffect(() => {
		let currentStatus = "idle";
		if (isCollectionResources) {
			if (isLoading) currentStatus = "loading";
			else if (isFetching) currentStatus = "fetching";
			else if (isSuccess) currentStatus = "success";
			else if (isError) currentStatus = "error";

			if (callback && isSuccess) callback(data?.data.collection);
		}
		setRequestStatus(currentStatus);
	}, [isLoading, isFetching, isSuccess, isError, isCollectionResources]);

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

	if (isError) {
		return (
			<EmptyDisplay
				code="404"
				title="Oops! Something went wrong"
				description={
					"We couldn't load your resources. Please try again later."
				}
				showButton={true}
				onPress={() => () => window.location.reload()}
				buttonText="Try Again"
			/>
		);
	}
	if (!sortedResources?.length) {
		return (
			<div className="relative flex flex-col gap-4">
				{(type === "resources" ||
					type === "liked" ||
					type === "shared" ||
					type === "collection-shared-resources") && (
					<div>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.25 }}
							className={cn(
								"fixed bottom-10 right-5 z-[10] hidden h-fit sm:absolute sm:-top-[3.25rem] sm:flex",
								type === "resources" && "sm:hidden",
							)}
						>
							<div className="flex justify-end gap-2">
								<SearchModalTrigger
									hideAiSearch={true}
									iconOnly={true}
								/>
								<FilterModalTrigger iconOnly={true} />
								{type !== "shared" && (
									<Button
										className="bg-violet text-white"
										radius="full"
										startContent={<Plus />}
										onPress={() =>
											onOpenModal("resourcesForm", {
												type: "url",
											})
										}
									>
										Add Resource
									</Button>
								)}
							</div>
						</motion.div>
						<div
							className={cn(
								"flex justify-end gap-2 sm:hidden",
								type === "resources" && "sm:flex",
							)}
						>
							<SearchModalTrigger
								hideAiSearch={true}
								iconOnly={true}
							/>
							<FilterModalTrigger iconOnly={true} />
							{type !== "shared" && (
								<Button
									className="bg-violet text-white"
									radius="full"
									startContent={<Plus />}
									onPress={() =>
										onOpenModal("resourcesForm", {
											type: "url",
										})
									}
								>
									Add Resource
								</Button>
							)}
						</div>
					</div>
				)}
				<EmptyDisplay
					code="0"
					title="No resources found"
					description={
						type.includes("collection")
							? "This collection doesn't have any resources yet."
							: "You don't have any resources in this category yet."
					}
					showButton={type !== "shared"}
					onPress={() =>
						onOpenModal("resourcesForm", { type: "url" })
					}
					buttonText="Start adding now"
				/>
			</div>
		);
	}

	return (
		<div className="relative flex w-full flex-col gap-4">
			{(type === "resources" || type === "liked") && (
				<div>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.25 }}
						className={cn(
							"fixed bottom-10 right-5 z-[10] hidden h-fit sm:absolute sm:-top-[3.25rem] sm:flex",
							type === "resources" && "sm:hidden",
						)}
					>
						<div className="flex justify-end gap-2">
							<SearchModalTrigger
								hideAiSearch={true}
								iconOnly={true}
							/>
							<FilterModalTrigger iconOnly={true} />
							<Button
								className="bg-violet text-white"
								radius="full"
								startContent={<Plus />}
								onPress={() =>
									onOpenModal("resourcesForm", {
										type: "url",
									})
								}
							>
								Add Resource
							</Button>
						</div>
					</motion.div>
					<div
						className={cn(
							"flex justify-end gap-2 sm:hidden",
							type === "resources" && "sm:flex",
						)}
					>
						<SearchModalTrigger
							hideAiSearch={true}
							iconOnly={true}
						/>
						<FilterModalTrigger iconOnly={true} />
						<Button
							className="bg-violet text-white"
							radius="full"
							startContent={<Plus />}
							onPress={() =>
								onOpenModal("resourcesForm", {
									type: "url",
								})
							}
						>
							Add Resource
						</Button>
					</div>
				</div>
			)}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				<AnimatePresence mode={"popLayout"}>
					{sortedResources.map((resource: any) => (
						<ResourceCard key={resource.name} data={resource} />
					))}
				</AnimatePresence>
			</div>
		</div>
	);
};

export const ResourceTab = ({ type, id, callback }: Props) => {
	return (
		<ResourcePaginatedSearchParamsProvider initialSearchParams={{}}>
			<ResourceWrapper type={type} id={id} callback={callback} />
		</ResourcePaginatedSearchParamsProvider>
	);
};

export default ResourceTab;

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
import { useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

type Props = {
	type:
		| "resources"
		| "liked"
		| "collections"
		| "shared"
		| "collection-resources"
		| "collection-portfolios";

	id?: number | string;
};
const ResourceWrapper = ({ type, id }: Props) => {
	const { authUser } = useAuthUser();
	const setSearchParams = useResourcePaginatedSearchParams(
		(state: ResourcePaginatedSearchParamsState) =>
			state.actions.setSearchParams,
	) as ResourcePaginatedSearchParamsState["actions"]["setSearchParams"];
	const setCollections = useCollections((state) => state.setCollections);
	const setRequestStatus = useRequestStatus(
		(state) => state.setRequestStatus,
	);

	const { data, isSuccess, isLoading, isFetching, isError } =
		useGetUserResourcesQuery(
			{ tab: "resources" },
			{ user_id: authUser?.id, type, id, tab: "resources" },
		);

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

	const isCollectionResources = type === "collection-resources";

	useEffect(() => {
		let currentStatus = "idle";
		if (isCollectionResources) {
			if (isLoading) currentStatus = "loading";
			else if (isFetching) currentStatus = "fetching";
			else if (isSuccess) currentStatus = "success";
			else if (isError) currentStatus = "error";
		}
		setRequestStatus(currentStatus);
	}, [isLoading, isFetching, isSuccess, isError, isCollectionResources]);

	let isLoadingOrFetching = false;

	if (isCollectionResources) isLoadingOrFetching = isLoading || isFetching;
	else isLoadingOrFetching = isLoading;

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
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<div className="mb-2 text-[8rem] font-bold leading-none text-gray-200 opacity-60">
					404
				</div>
				<div>
					<h3 className="mb-2 text-xl font-semibold">
						Oops! Something went wrong
					</h3>
					<p className="mb-4 text-gray-600">
						We couldn't load your resources. Please try again later.
					</p>
					<Button
						radius="full"
						onPress={() => window.location.reload()}
					>
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	if (!data?.data.rows?.length) {
		return (
			<div className="flex w-full flex-col items-center justify-center p-8 text-center">
				<div className="mb-2 text-[8rem] font-bold leading-none text-gray-200 opacity-60">
					0
				</div>
				<div>
					<h3 className="mb-2 text-xl font-semibold">
						No resources found
					</h3>
					<p className="mb-4 text-gray-600">
						{type.includes("collection")
							? "This collection doesn't have any resources yet."
							: "You don't have any resources in this category yet."}
					</p>
					{type === "resources" && (
						<Button
							radius="full"
							className="bg-violet text-white"
							onPress={() =>
								onOpenModal("resourcesForm", { type: "url" })
							}
						>
							Start adding now
						</Button>
					)}
				</div>
			</div>
		);
	}
	return (
		<div className="flex w-full flex-col gap-4">
			{type === "resources" && (
				<div className="flex justify-end">
					<Button
						className="bg-violet text-white"
						radius="full"
						startContent={<Plus />}
						onPress={() =>
							onOpenModal("resourcesForm", { type: "url" })
						}
					>
						Add Resource
					</Button>
				</div>
			)}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				<AnimatePresence mode={"popLayout"}>
					{data?.data.rows.map((resource: any) => (
						<ResourceCard key={resource.name} data={resource} />
					))}
				</AnimatePresence>
			</div>
		</div>
	);
};

export const ResourceTab = ({ type, id }: Props) => {
	return (
		<ResourcePaginatedSearchParamsProvider initialSearchParams={{}}>
			<ResourceWrapper type={type} id={id} />
		</ResourcePaginatedSearchParamsProvider>
	);
};

export default ResourceTab;

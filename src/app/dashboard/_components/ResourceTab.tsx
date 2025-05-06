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
import EmptyDisplay from "@/components/layouts/EmptyDisplay";

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

	if (!data?.data.rows?.length) {
		return (
			<EmptyDisplay
				code="0"
				title="No resources found"
				description={
					type.includes("collection")
						? "This collection doesn't have any resources yet."
						: "You don't have any resources in this category yet."
				}
				showButton={true}
				onPress={() => onOpenModal("resourcesForm", { type: "url" })}
				buttonText="Start adding now"
			/>
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

export const ResourceTab = ({ type, id, callback }: Props) => {
	return (
		<ResourcePaginatedSearchParamsProvider initialSearchParams={{}}>
			<ResourceWrapper type={type} id={id} callback={callback} />
		</ResourcePaginatedSearchParamsProvider>
	);
};

export default ResourceTab;

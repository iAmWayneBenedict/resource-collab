import ResourceCard from "@/components/layouts/cards/ResourceCard";
import { useGetCollectionsQuery } from "@/lib/queries/collections";
import { useGetUserResourcesQuery } from "@/lib/queries/user";
import { useAuthUser } from "@/store";
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
import { useRouter } from "next/navigation";
import { useLoading } from "@/store/useLoading";

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
	const router = useRouter();
	const { authUser } = useAuthUser();
	const setSearchParams = useResourcePaginatedSearchParams(
		(state: ResourcePaginatedSearchParamsState) =>
			state.actions.setSearchParams,
	) as ResourcePaginatedSearchParamsState["actions"]["setSearchParams"];
	const setCollections = useCollections((state) => state.setCollections);
	const setRequestStatus = useRequestStatus(
		(state) => state.setRequestStatus,
	);
	const { isLoading: isLoadingParent } = useLoading();

	const { data, isSuccess, isLoading, isFetching, error, isError } =
		useGetUserResourcesQuery({}, { user_id: authUser?.id, type, id });

	useEffect(() => {
		setSearchParams({ queryKey: [`user-${type}`] });
	}, []);

	const collections = useGetCollectionsQuery({
		enabled: !!authUser,
	});

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

	if (isCollectionResources) {
		isLoadingOrFetching = isLoading || isFetching;
	} else {
		isLoadingOrFetching = isLoading;
	}

	if (isLoadingOrFetching || isLoadingParent) {
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

	if (!data?.data.rows.length) {
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
					<Button
						radius="full"
						className="bg-violet text-white"
						onPress={() => router.push("/resources")}
					>
						Start adding now
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
			<AnimatePresence mode={"popLayout"}>
				{data?.data.rows.map((resource: any) => (
					<ResourceCard key={resource.name} data={resource} />
				))}
			</AnimatePresence>
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

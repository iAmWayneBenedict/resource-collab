import CollectionCard from "@/components/layouts/cards/CollectionCard";
import { useGetCollectionsQuery } from "@/lib/queries/collections";
import { useGetUserResourcesQuery } from "@/lib/queries/user";
import { useAuthUser } from "@/store";
import useResourcePaginatedSearchParams from "@/store/context/useResourcePaginatedSearchParams";
import { useCollections } from "@/store/useCollections";
import { Button, Skeleton } from "@heroui/react";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import CreateCollectionButton from "./CreateCollectionButton";
import { AnimatePresence } from "motion/react";

type Props = {
	type:
		| "resources"
		| "liked"
		| "collections"
		| "shared"
		| "collection-resources";
};
const ResourceCollectionTab = ({ type }: Props) => {
	const { authUser } = useAuthUser();
	const setCollections = useCollections((state) => state.setCollections);

	const { data, isSuccess, isLoading, isFetching } = useGetUserResourcesQuery(
		{},
		{ user_id: authUser?.id, type },
	);

	// useEffect(() => {
	// 	setSearchParams({ queryKey: [`user-${type}`] });
	// }, []);

	const collections = useGetCollectionsQuery({
		enabled: !!authUser,
	});

	useEffect(() => {
		if (!collections.isSuccess) return;

		setCollections(collections.data?.data);
	}, [collections.isSuccess, collections.data]);

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
				{/* <h3 className="text-xl">Loading...</h3> */}
				{Array.from({ length: 6 }).map((_, index) => (
					<Skeleton
						key={index}
						className="m-0 flex h-72 min-w-[19rem] flex-1 flex-col rounded-2xl p-0 md:min-w-[22rem]"
					>
						<div className="relative" />
					</Skeleton>
				))}
			</div>
		);
	}

	return (
		<div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
			<div className="absolute -top-[3.25rem] right-0 hidden sm:flex">
				<div className="flex flex-row gap-4">
					<CreateCollectionButton />
				</div>
			</div>
			<AnimatePresence mode="popLayout">
				{data?.data.rows.map((collection: CollectionResponse) => (
					<CollectionCard key={collection.name} data={collection} />
				))}
			</AnimatePresence>
		</div>
	);
};

export default ResourceCollectionTab;

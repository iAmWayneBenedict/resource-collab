import CollectionCard from "@/components/layouts/cards/CollectionCard";
import { useGetUserResourcesQuery } from "@/lib/queries/user";
import { useAuthUser } from "@/store";
import { Skeleton } from "@heroui/react";
import CreateCollectionButton from "./CreateCollectionButton";
import { AnimatePresence, motion } from "motion/react";
import { useLoading } from "@/store/useLoading";

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
	const { isLoading: isLoadingParent } = useLoading();

	const { data, isSuccess, isLoading, isFetching } = useGetUserResourcesQuery(
		{},
		{ user_id: authUser?.id, type },
	);

	if (isLoading || isLoadingParent) {
		return (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
				{/* <h3 className="text-xl">Loading...</h3> */}
				{Array.from({ length: 8 }).map((_, index) => (
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

	return (
		<div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.25 }}
				className="fixed bottom-10 right-5 z-[10] flex sm:absolute sm:-top-[3.25rem]"
			>
				<div className="flex flex-row gap-4">
					<CreateCollectionButton />
				</div>
			</motion.div>
			<AnimatePresence mode="popLayout">
				{data?.data.rows.map((collection: CollectionResponse) => (
					<CollectionCard key={collection.name} data={collection} />
				))}
			</AnimatePresence>
		</div>
	);
};

export default ResourceCollectionTab;

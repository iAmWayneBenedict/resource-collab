import CollectionCard from "@/components/layouts/cards/CollectionCard";
import { useGetUserResourcesQuery } from "@/lib/queries/user";
import { useAuthUser } from "@/store";
import { Button, Skeleton } from "@heroui/react";
import CreateCollectionButton from "./CreateCollectionButton";
import { AnimatePresence, motion } from "motion/react";
import EmptyDisplay from "@/components/layouts/EmptyDisplay";

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

	const { data, isLoading } = useGetUserResourcesQuery(
		{ tab: "collections" },
		{ user_id: authUser?.id, type, tab: "collections" },
	);
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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

	if (!data?.data.rows?.length) {
		return (
			<EmptyDisplay
				code="0"
				title="No collection found"
				description="You don't have any collection in this category yet."
				showButton={false}
			>
				{type === "collections" && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.25 }}
						className="z-[10] flex h-fit w-full justify-center"
					>
						<div className="flex h-fit flex-row gap-4">
							<CreateCollectionButton />
						</div>
					</motion.div>
				)}
			</EmptyDisplay>
		);
	}

	return (
		<div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
			{type === "collections" && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.25 }}
					className="fixed bottom-10 right-5 z-[10] flex h-fit sm:absolute sm:-top-[3.25rem]"
				>
					<div className="flex h-fit flex-row gap-4">
						<CreateCollectionButton />
					</div>
				</motion.div>
			)}
			<AnimatePresence mode="popLayout">
				{data?.data.rows.map((collection: CollectionResponse) => (
					<CollectionCard
						key={collection.name + collection.id}
						data={collection}
						type={type}
					/>
				))}
			</AnimatePresence>
		</div>
	);
};

export default ResourceCollectionTab;

import CollectionCard from "@/components/layouts/cards/CollectionCard";
import { useGetUserResourcesQuery } from "@/lib/queries/user";
import { useAuthUser, useModal } from "@/store";
import { Button, Skeleton } from "@heroui/react";
import CreateCollectionButton from "./CreateCollectionButton";
import { AnimatePresence, motion } from "motion/react";
import EmptyDisplay from "@/components/layouts/EmptyDisplay";
import {
	FilterModalTrigger,
	SearchModalTrigger,
} from "@/app/resources/_components/filter";
import { Plus } from "lucide-react";
import useGetPaginationValues from "@/store/useGetPaginationValues";

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

	const { onOpen: onOpenModal } = useModal();

	const sortedResources = useGetPaginationValues(data?.data?.rows);

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

	if (!sortedResources?.length) {
		return (
			<div className="relative">
				{(type === "collections" || type === "shared") && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.25 }}
						className="fixed bottom-10 right-5 z-[10] hidden h-fit sm:absolute sm:-top-[3.25rem] sm:flex"
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
										onOpenModal("create-collection", null)
									}
								>
									Add collection
								</Button>
							)}
						</div>
					</motion.div>
				)}
				<div className="flex justify-end gap-2 pb-3 sm:hidden">
					<SearchModalTrigger hideAiSearch={true} iconOnly={true} />
					<FilterModalTrigger iconOnly={true} />
					{type !== "shared" && (
						<Button
							className="bg-violet text-white"
							radius="full"
							startContent={<Plus />}
							onPress={() =>
								onOpenModal("create-collection", null)
							}
						>
							Add collection
						</Button>
					)}
				</div>
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
			</div>
		);
	}

	return (
		<div className="relative">
			{(type === "collections" || type === "shared") && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.25 }}
					className="fixed bottom-10 right-5 z-[10] hidden h-fit sm:absolute sm:-top-[3.25rem] sm:flex"
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
								onOpenModal("create-collection", null)
							}
						>
							Add collection
						</Button>
					</div>
				</motion.div>
			)}
			<div className="flex justify-end gap-2 pb-3 sm:hidden">
				<SearchModalTrigger hideAiSearch={true} iconOnly={true} />
				<FilterModalTrigger iconOnly={true} />
				<Button
					className="bg-violet text-white"
					radius="full"
					startContent={<Plus />}
					onPress={() =>
						onOpenModal("create-collection", null)
					}
				>
					Add collection
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
				<AnimatePresence mode="popLayout">
					{sortedResources?.map((collection: CollectionResponse) => (
						<CollectionCard
							key={collection.name + collection.id}
							data={collection}
							type={type}
						/>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default ResourceCollectionTab;

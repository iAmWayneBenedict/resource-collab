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
import { useRouter } from "next/navigation";
import { useLoading } from "@/store/useLoading";
import PortfolioModal from "@/components/modal/PortfolioModal";

type Props = {
	type: "portfolios";
};
const PortfolioTabs = ({ type }: Props) => {
	const { onOpen: onOpenModal } = useModal();

	// if (isLoadingOrFetching || isLoadingParent) {
	// 	return (
	// 		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
	// 			{/* <h3 className="text-xl">Loading...</h3> */}
	// 			{Array.from({ length: 6 }).map((_, index) => (
	// 				<div
	// 					key={index}
	// 					className="m-0 flex h-72 min-w-[19rem] flex-1 flex-col gap-3 rounded-2xl p-0 md:min-w-[22rem]"
	// 				>
	// 					<Skeleton className="h-48 w-full rounded-xl" />
	// 					<Skeleton className="h-4 w-3/4 rounded-xl" />
	// 					<Skeleton className="h-4 w-1/2 rounded-xl" />
	// 				</div>
	// 			))}
	// 		</div>
	// 	);
	// }

	// if (isError) {
	// 	return (
	// 		<div className="flex flex-col items-center justify-center p-8 text-center">
	// 			<div className="mb-2 text-[8rem] font-bold leading-none text-gray-200 opacity-60">
	// 				404
	// 			</div>
	// 			<div>
	// 				<h3 className="mb-2 text-xl font-semibold">
	// 					Oops! Something went wrong
	// 				</h3>
	// 				<p className="mb-4 text-gray-600">
	// 					We couldn't load your resources. Please try again later.
	// 				</p>
	// 				<Button
	// 					radius="full"
	// 					onPress={() => window.location.reload()}
	// 				>
	// 					Try Again
	// 				</Button>
	// 			</div>
	// 		</div>
	// 	);
	// }

	if (true) {
		return (
			<div className="flex w-full flex-col items-center justify-center p-8 text-center">
				<div className="mb-2 text-[8rem] font-bold leading-none text-gray-300 opacity-60 dark:text-gray-600">
					0
				</div>
				<div>
					<h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
						No portfolios found
					</h3>
					<p className="mb-4 text-gray-600 dark:text-gray-400">
						{type.includes("collection")
							? "This collection doesn't have any portfolios yet. Start showcasing your work and skills by adding one!"
							: "You don't have any portfolios in this category yet. Add one to highlight your skills and projects!"}
					</p>
					<Button
						radius="full"
						className="bg-violet text-white hover:bg-violet-600 dark:bg-violet-700 dark:hover:bg-violet-600"
						// Uncomment and update the route to navigate to the portfolio addition page
						onPress={() =>
							onOpenModal(
								"portfolio-modal",
								null,
								"create",
								"Add portfolio",
							)
						}
					>
						Add Your Portfolio
					</Button>
				</div>
				<PortfolioModal />
			</div>
		);
	}

	// return (
	// 	<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
	// 		<AnimatePresence mode={"popLayout"}>
	// 			{data?.data.rows.map((resource: any) => (
	// 				<ResourceCard key={resource.name} data={resource} />
	// 			))}
	// 		</AnimatePresence>
	// 	</div>
	// );
};

export default PortfolioTabs;

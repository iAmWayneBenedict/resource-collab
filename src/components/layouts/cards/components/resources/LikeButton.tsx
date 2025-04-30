import { Heart } from "lucide-react";
import React from "react";
import { formatNumber } from "../../utils";
import { useQueryClient } from "@tanstack/react-query";
import useResourcePaginatedSearchParams from "@/store/context/useResourcePaginatedSearchParams";
import { ResourcePaginatedSearchParamsState } from "@/store/context/providers/ResourcePaginatedSearchParams";
import { useAuthUser, useModal } from "@/store";
import { usePostLikeResourceMutation } from "@/lib/mutations/like";
import { addToast } from "@heroui/react";
import { useSelectedCollection } from "@/store/useSelectedCollection";
import { useSearchParams } from "next/navigation";
import { useDashboardPage } from "@/store/useDashboardPage";

// Define type for the previous resources data structure
type PreviousResourcesData = {
	data: {
		rows: ResourceData[];
	};
	[key: string]: any;
};

// Define type for the resource data
type ResourceData = {
	id: number;
	likesCount: number;
	likes: Array<{ id: number }>;
	[key: string]: any;
};

const LikeButton = ({
	id,
	likes = 0,
	isLiked = false,
}: {
	id: string | number;
	likes: number;
	isLiked: boolean;
}) => {
	const onOpenModal = useModal((state) => state.onOpen);
	const queryClient = useQueryClient();
	const searchParams = useResourcePaginatedSearchParams(
		(state: ResourcePaginatedSearchParamsState) => state.searchParams,
	) as ResourcePaginatedSearchParamsState["searchParams"];
	const { authUser } = useAuthUser();
	const getDashboardPage = useDashboardPage(
		(state) => state.getDashboardPage,
	);
	const isSharedPage = getDashboardPage() === "shared";

	// Create query key array for better reusability
	const getQueryKey = () => searchParams.queryKey;

	const mutation = usePostLikeResourceMutation({
		onMutate: async () => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({
				queryKey: getQueryKey(),
			});

			// Get current data from cache
			const previousResources = queryClient.getQueryData(
				getQueryKey(),
			) as PreviousResourcesData;

			if (previousResources) {
				queryClient.setQueryData(getQueryKey(), {
					...previousResources,
					data: {
						...previousResources.data,
						rows: previousResources.data.rows.map((resource) => {
							if (resource.id === id) {
								const likesCount = isLiked
									? resource.likesCount - 1
									: resource.likesCount + 1;
								const likes = isLiked
									? []
									: [...resource.likes, { id: id }];
								return {
									...resource,
									likesCount,
									likes,
								};
							}
							return resource;
						}),
					},
				});
			}

			// Return rollback function
			return () => {
				queryClient.setQueryData(getQueryKey(), previousResources);
			};
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["paginated-resources"],
			});
			queryClient.invalidateQueries({
				queryKey: searchParams.queryKey,
			});
		},
		onError: (_, __, rollback: any) => {
			if (rollback) rollback();

			addToast({
				title: "Error",
				description: "Something went wrong",
				color: "danger",
			});
		},
	});

	const onLike = () => {
		if (isSharedPage) return;

		if (!authUser) {
			onOpenModal("auth-modal", {});
			return;
		}

		mutation.mutate({
			id: id,
		});
	};
	return (
		<button
			onClick={onLike}
			disabled={isSharedPage}
			className={`flex items-center gap-1 p-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 ${isSharedPage ? "cursor-not-allowed opacity-70 hover:text-zinc-700 dark:hover:text-zinc-200" : ""}`}
		>
			<Heart
				fill={isLiked ? "#ef4444" : "none"}
				className={`${isLiked ? "h-5 w-5 text-red-500" : "h-4 w-4"} transition-all duration-300`}
			/>
			<span className="transition-all duration-300">
				{formatNumber(likes)} likes
			</span>
		</button>
	);
};

export default LikeButton;

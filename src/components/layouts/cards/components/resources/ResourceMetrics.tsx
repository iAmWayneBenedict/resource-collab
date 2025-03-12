import { usePostLikeResourceMutation } from "@/lib/mutations/like";
import { ResourcePaginatedSearchParamsState } from "@/store/context/providers/ResourcePaginatedSearchParams";
import useResourcePaginatedSearchParams from "@/store/context/useResourcePaginatedSearchParams";
import { addToast, Spinner } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ChartNoAxesColumn, Heart, Share2 } from "lucide-react";

type ResourceMetricsProps = {
	resource_id: number;
	views: number;
	shares: number;
	likes?: number;
	isLiked?: boolean;
};

// Move helper functions outside component
const formatNumber = (num: number): string => {
	if (num >= 1000) return (num / 1000).toFixed(1) + "k";
	return num.toString();
};

// Define type for the resource data
type ResourceData = {
	id: number;
	likesCount: number;
	likes: Array<{ id: number }>;
	[key: string]: any;
};

// Define type for the previous resources data structure
type PreviousResourcesData = {
	data: {
		rows: ResourceData[];
	};
	[key: string]: any;
};

export const ResourceMetrics = ({
	resource_id,
	views,
	shares,
	likes = 0,
	isLiked = false,
}: ResourceMetricsProps) => {
	const queryClient = useQueryClient();
	const searchParams = useResourcePaginatedSearchParams(
		(state: ResourcePaginatedSearchParamsState) => state.searchParams,
	) as ResourcePaginatedSearchParamsState["searchParams"];

	// Create query key array for better reusability
	const getQueryKey = () => [
		"paginated-resources",
		searchParams.category,
		searchParams.sortValue,
		searchParams.sortBy,
		searchParams.tags,
		searchParams.search,
	];

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
							if (resource.id === resource_id) {
								const likesCount = isLiked
									? resource.likesCount - 1
									: resource.likesCount + 1;
								const likes = isLiked
									? []
									: [...resource.likes, { id: resource_id }];
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
		mutation.mutate({
			resource_id: resource_id,
		});
	};

	return (
		<div className="flex items-center gap-4">
			<button
				onClick={onLike}
				className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
			>
				<Heart
					fill={isLiked ? "#ef4444" : "none"}
					className={`${isLiked ? "h-5 w-5 text-red-500" : "h-4 w-4"} transition-all duration-300`}
				/>
				<span className="transition-all duration-300">
					{formatNumber(likes)} likes
				</span>
			</button>
			<button className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
				<ChartNoAxesColumn className="h-4 w-4" />
				<span>{formatNumber(views)} views</span>
			</button>

			<button className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
				<Share2 className="h-4 w-4" />
				<span>Share</span>
			</button>
		</div>
	);
};

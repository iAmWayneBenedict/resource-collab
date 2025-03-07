import { usePostLikeResourceMutation } from "@/lib/mutations/like";
import { Spinner } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ChartNoAxesColumn, Heart, Share2 } from "lucide-react";

type ResourceMetricsProps = {
	resource_id: number;
	views: number;
	shares: number;
	likes?: number;
	isLiked?: boolean;
};

export const ResourceMetrics = ({
	resource_id,
	views,
	shares,
	likes = 0,
	isLiked = false,
}: ResourceMetricsProps) => {
	const formatNumber = (num: number): string => {
		if (num >= 1000) return (num / 1000).toFixed(1) + "k";
		return num.toString();
	};

	const queryClient = useQueryClient();

	const mutation = usePostLikeResourceMutation({
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["paginated-resources"],
			});
		},
		onError: () => {},
	});

	const onLike = () => {
		// TODO: add like functionality
		mutation.mutate({
			resource_id: resource_id,
		});
	};

	return (
		<div className="flex items-center gap-4">
			<button
				onClick={onLike}
				className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
			>
				{mutation.isPending ? (
					<Spinner size="sm" />
				) : (
					<Heart
						fill={isLiked ? "#ef4444" : "none"}
						className={`${isLiked ? "h-5 w-5 text-red-500" : "h-4 w-4"}`}
					/>
				)}
				<span>{formatNumber(likes)} likes</span>
			</button>
			<button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
				<ChartNoAxesColumn className="h-4 w-4" />
				<span>{formatNumber(views)} views</span>
			</button>

			<button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
				<Share2 className="h-4 w-4" />
				<span>Share</span>
			</button>
		</div>
	);
};

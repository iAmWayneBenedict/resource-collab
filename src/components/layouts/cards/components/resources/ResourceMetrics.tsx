import { Eye, Share2 } from "lucide-react";

type ResourceMetricsProps = {
	views: number;
	shares: number;
};

export const ResourceMetrics = ({ views, shares }: ResourceMetricsProps) => {
	const formatNumber = (num: number): string => {
		if (num >= 1000) return (num / 1000).toFixed(1) + "k";
		return num.toString();
	};

	return (
		<div className="flex items-center gap-4">
			<button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
				<Eye className="h-4 w-4" />
				<span>{formatNumber(views)} views</span>
			</button>
			<button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
				<Share2 className="h-4 w-4" />
				<span>
					{/* {formatNumber(shares)}  */}
					Share
				</span>
			</button>
		</div>
	);
};

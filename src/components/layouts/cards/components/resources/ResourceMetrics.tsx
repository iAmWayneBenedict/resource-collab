import { ChartNoAxesColumn } from "lucide-react";
import { formatNumber } from "../../utils";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import { useSelectedCollection } from "@/store/useSelectedCollection";
import { useSearchParams } from "next/navigation";

type ResourceMetricsProps = {
	id: number;
	url: string;
	name: string;
	views: number;
	shares: number;
	likes?: number;
	isLiked?: boolean;
};

export const ResourceMetrics = ({
	id,
	url,
	name,
	views,
	shares,
	likes = 0,
	isLiked = false,
}: ResourceMetricsProps) => {
	const searchParams = useSearchParams();
	const page = searchParams.get("page");
	return (
		<div className="flex items-center">
			<LikeButton id={id} isLiked={isLiked} likes={likes} />

			<button className="flex items-center gap-1 p-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
				<ChartNoAxesColumn className="h-4 w-4" />
				<span>{formatNumber(views)} views</span>
			</button>

			<ShareButton id={id} url={url} name={name} />
		</div>
	);
};

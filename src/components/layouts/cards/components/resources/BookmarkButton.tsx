import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

type BookmarkButtonProps = {
	count: number;
	isBookmarked: boolean;
	onBookmark: () => void;
	iconColors: { fill: string; stroke: string };
};

export const BookmarkButton = ({
	count,
	isBookmarked,
	onBookmark,
	iconColors,
}: BookmarkButtonProps) => {
	const formatNumber = (num: number): string => {
		if (num >= 1000) return (num / 1000).toFixed(1) + "k";
		return num.toString();
	};

	return (
		<Button
			onClick={onBookmark}
			variant="ghost"
			size="icon"
			className="h-8 w-8 rounded-full bg-none p-0 transition-none"
		>
			<div className="relative">
				<motion.div
					className="h-full w-full"
					whileTap={{ scale: 0.8 }}
					animate={{
						scale: isBookmarked ? 1.2 : 1,
					}}
					transition={{
						type: "spring",
						stiffness: 300,
						damping: 15,
					}}
				>
					<Bookmark
						className="h-full w-full"
						fill={iconColors.fill}
						stroke={iconColors.stroke}
					/>
				</motion.div>
				<span className="absolute -bottom-[1.2rem] left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full text-[12px] font-medium text-gray-800">
					{formatNumber(count)}
				</span>
			</div>
		</Button>
	);
};

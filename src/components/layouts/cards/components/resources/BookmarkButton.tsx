import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type BookmarkButtonProps = {
	count: number;
	isBookmarked: boolean;
};

const ICON_COLORS = {
	active: {
		fill: "#000000",
		stroke: "#000000",
	},
	inactive: {
		fill: "none",
		stroke: "#000000",
	},
};

export const BookmarkButton = ({
	count,
	isBookmarked,
	...props
}: BookmarkButtonProps) => {
	const [iconColors, setIconColors] = useState<{
		fill: string;
		stroke: string;
	}>(ICON_COLORS.inactive);

	useEffect(() => {
		if (isBookmarked) {
			setIconColors(ICON_COLORS.active);
		} else {
			setIconColors(ICON_COLORS.inactive);
		}
	}, [isBookmarked]);

	const formatNumber = (num: number): string => {
		if (num >= 1000) return (num / 1000).toFixed(1) + "k";
		return num.toString();
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			className="h-9 w-9 rounded-full bg-none p-0 transition-none"
			{...props}
		>
			<div className="relative">
				<motion.div
					className="h-full w-full"
					whileTap={{ scale: 0.8 }}
					animate={{ scale: isBookmarked ? 1.2 : 1 }}
					transition={{ type: "spring", stiffness: 300, damping: 15 }}
				>
					<Bookmark
						className="h-full w-full"
						fill={iconColors.fill}
						stroke={iconColors.stroke}
						size={28}
					/>
				</motion.div>
				<span className="absolute -bottom-[1.2rem] left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full text-[12px] font-medium text-gray-800">
					{formatNumber(count)}
				</span>
			</div>
		</Button>
	);
};

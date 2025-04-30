import { cn } from "@/lib/utils";
import { useDashboardPage } from "@/store/useDashboardPage";
import { Button } from "@heroui/react";
import { Bookmark } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type BookmarkButtonProps = {
	count: number;
	isBookmarked: boolean;
};

const ICON_COLORS = {
	active: {
		fill: "#8134f2",
		stroke: "#8134f2",
	},
	inactive: {
		fill: "none",
		stroke: "hsl(var(--foreground))",
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
	const getDashboardPage = useDashboardPage(
		(state) => state.getDashboardPage,
	);
	const isSharedPage = getDashboardPage() === "shared";

	useEffect(() => {
		const newIconColors = {
			bookmarked: ICON_COLORS.active,
			default: ICON_COLORS.inactive,
			hover: {
				...ICON_COLORS.inactive,
				stroke: "hsl(var(--muted-foreground))",
			},
			pressed: { ...ICON_COLORS.active, fill: "#6D2AE8" },
		}[isBookmarked ? "bookmarked" : "default"];

		setIconColors(newIconColors);
	}, [isBookmarked]);

	const formatNumber = (num: number): string => {
		if (num >= 1000) return (num / 1000).toFixed(1) + "k";
		return num.toString();
	};

	return (
		<div className="relative">
			<Button
				variant="light"
				// size="icon"
				isIconOnly
				disableRipple
				className={cn(
					"overflow-visible bg-transparent bg-none transition-none hover:bg-transparent",
					isSharedPage ? "cursor-not-allowed!" : "",
				)}
				{...props}
			>
				<motion.div
					className=""
					whileTap={{ scale: 0.8 }}
					animate={{ scale: isBookmarked ? 1.2 : 1 }}
					transition={{ type: "spring", stiffness: 300, damping: 15 }}
				>
					<Bookmark
						className=""
						fill={iconColors.fill}
						stroke={iconColors.stroke}
						size={28}
					/>
				</motion.div>
			</Button>
			<span className="absolute -bottom-[.8rem] left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full text-[12px] font-medium text-foreground">
				{formatNumber(count)}
			</span>
		</div>
	);
};

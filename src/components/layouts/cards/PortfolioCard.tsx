"use client";

import React, { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Briefcase } from "lucide-react";

const POSITION_TYPES = {
	"entry level":
		"bg-[#1A4DCF] dark:bg-[#3469F2] dark:hover:bg-[#3469F2] dark:text-white hover:bg-[#1A4DCF]",
	"junior level": "bg-[#F28F34] dark:bg-[#F28F34] dark:text-white hover:bg-[#F28F34]",
	"mid level": "bg-[#9747FF] dark:bg-[#9747FF] dark:text-white hover:bg-[#9747FF]",
	"senior level": "bg-[#E02828] dark:bg-[#E02828] dark:text-white hover:bg-[#E02828]",
	default: "bg-black dark:bg-white hover:bg-black",
};

const PortfolioCard = () => {
	const { theme } = useTheme(); // Get the current theme using useTheme hook

	// Function to determine icon colors based on theme
	const getIconColors = () => {
		if (theme === "light") {
			return { fill: "#000000", stroke: "#000000" }; // Light theme colors
		} else {
			return { fill: "#ffffff", stroke: "#ffffff" }; // Dark theme colors
		}
	};
	const [iconColors, setIconColors] = useState<{ fill: string; stroke: string }>({
		fill: "#000000",
		stroke: "#000000",
	});
	useEffect(() => {
		setIconColors(getIconColors());
	}, [theme]);
	const handleClickBookmark = () => {
		setIconColors({
			...iconColors,
			fill: iconColors.fill === "none" ? iconColors.stroke : "none",
		});
	};
	return (
		<div className="relative w-full h-fit bg-white dark:bg-black rounded-2xl p-7 shadow-md">
			<div className="absolute top-10 left-10 z-10">
				<Button
					onClick={handleClickBookmark}
					variant="ghost"
					size="icon"
					className="p-2 bg-neutral-200 hover:bg-neutral-400 dark:bg-neutral-500 dark:hover:bg-neutral-400 transition-none rounded-full"
				>
					<Bookmark
						className="h-full w-full"
						fill={iconColors.fill}
						stroke={iconColors.stroke}
					/>
				</Button>
			</div>
			<Link target="_blank" href={"https://www.iamwayne.tech/"}>
				<div className="relative flex max-h-[15rem] h-[15rem] rounded-lg w-full overflow-hidden outline outline-neutral-100">
					<Image
						src="https://www.iamwayne.tech/assets/ico/logo.png"
						alt="image"
						fill
						sizes="100%"
					/>
				</div>
				<div>
					<h2 className="text-2xl font-bold mt-8">Wayne Benedict Iraola</h2>
					<p className="truncate text-neutral-600 dark:text-neutral-400">
						Lorem ipsum dolor sit amet.
					</p>
				</div>

				<div className="mt-6 flex flex-row justify-between gap-3">
					<Badge
						className={cn(
							"px-6 py-2 text-base bg-black dark:bg-white hover:bg-black cursor-default",
							POSITION_TYPES["default"]
						)}
					>
						Entry Level
					</Badge>
					<div className="flex items-center gap-3">
						<Briefcase className="text-purple-500" />
						<span>Looking for job</span>
					</div>
				</div>
				<div className="mt-3 text-sm">
					<span className="text-green-600 dark:text-green-500 font-bold">Skills: </span>
					<span className="text-neutral-600 dark:text-neutral-400">
						{["Front-end", "Back-end", "Full-stack", "DevOps"].join(", ")}
					</span>
				</div>
			</Link>
		</div>
	);
};

export default PortfolioCard;

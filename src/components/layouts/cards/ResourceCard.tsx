"use client";

import React, { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ResourceCard = () => {
	const { theme } = useTheme(); // Get the current theme using useTheme hook

	// Function to determine icon colors based on theme
	const getIconColors = () => {
		if (theme === "light") {
			return { fill: "#000000", stroke: "#000000" }; // Light theme colors
		} else {
			return { fill: "#ffffff", stroke: "#ffffff" }; // Dark theme colors
		}
	};
	const [iconColors, setIconColors] = useState<{ fill: string; stroke: string }>(getIconColors());
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
		<div className="relative flex-1 min-w-[25rem] bg-white dark:bg-black rounded-2xl shadow-md">
			<div className="absolute top-7 left-7">
				<Button
					onClick={handleClickBookmark}
					variant="ghost"
					size="icon"
					className="w-7 h-7 hover:bg-none dark:hover:bg-none transition-none"
				>
					<Bookmark
						className="h-full w-full"
						fill={iconColors.fill}
						stroke={iconColors.stroke}
					/>
				</Button>
			</div>
			<Link target="_blank" href={"https://www.iamwayne.tech/"}>
				<div className="p-7">
					<div className="flex justify-end">
						<Image
							src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
							alt="image"
							width={48}
							height={48}
						/>
					</div>
					<div>
						<h2 className="text-2xl font-bold mt-5">Title</h2>
						<p className="mt-2 line-clamp-2">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
							tempor incididunt ut labore et dolore magna aliqua.
						</p>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default ResourceCard;

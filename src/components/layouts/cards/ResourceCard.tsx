"use client";

import React, { useLayoutEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ResourceTags } from "./components/resources/ResourceTags";
import { ResourceMetrics } from "./components/resources/ResourceMetrics";
import { BookmarkButton } from "./components/resources/BookmarkButton";

type ResourceCardProps = {
	data: any;
};

const ResourceCard = ({ data }: ResourceCardProps) => {
	const { theme } = useTheme(); // Get the current theme using useTheme hook

	// Function to determine icon colors based on theme
	const getIconColors = useMemo(() => {
		if (theme === "light") {
			return { fill: "#000000", stroke: "#000000" }; // Light theme colors
		} else {
			return { fill: "#ffffff", stroke: "#ffffff" }; // Dark theme colors
		}
	}, [theme]);
	const [iconColors, setIconColors] = useState<{
		fill: string;
		stroke: string;
	}>({
		fill: "none",
		stroke: "none",
	});
	useLayoutEffect(() => {
		setIconColors(getIconColors);
	}, [getIconColors]);
	const handleClickBookmark = () => {
		setIconColors({
			...iconColors,
			fill: iconColors.fill === "none" ? iconColors.stroke : "none",
		});
	};
	return (
		<div className="relative flex min-w-[19rem] flex-1 flex-col rounded-2xl bg-white shadow-md dark:bg-black md:min-w-[22rem]">
			<div className="absolute right-7 top-7">
				<BookmarkButton
					count={data.bookmarks || 0}
					isBookmarked={iconColors.fill !== "none"}
					onBookmark={handleClickBookmark}
					iconColors={iconColors}
				/>
			</div>
			<div className="h-full">
				<div className="flex h-full flex-col p-7">
					<div className="flex justify-start">
						<Image
							src={data.icon}
							alt="image"
							width={45}
							height={45}
						/>
					</div>
					<div>
						<h2 className="mt-5 line-clamp-1 font-bold ~text-lg/2xl">
							{data.name}
						</h2>
						<p className="mt-2 line-clamp-2 ~text-sm/base lg:line-clamp-3">
							{data.description}
						</p>
					</div>
					<div
						style={{ flex: 1 }}
						className="mt-4 flex flex-col justify-end"
					>
						<ResourceTags tags={data.resourceTags} />
						<div className="mt-4">
							<ResourceMetrics
								views={data.views || 0}
								shares={data.shares || 0}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResourceCard;

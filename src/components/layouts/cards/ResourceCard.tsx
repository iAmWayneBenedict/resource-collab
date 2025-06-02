"use client";
import { ResourceTags } from "./components/resources/ResourceTags";
import { ResourceMetrics } from "./components/resources/ResourceMetrics";
import { motion } from "motion/react";
import SaveResourcePopOver from "./components/resources/SaveResourcePopOver";
import { usePutViewResourceMutation } from "@/lib/mutations/resources";
import { SaveResourceDrawer } from "./components/resources/SaveResourceDrawer";
import React, { useState } from "react";
import { Avatar, Image, PressEvent } from "@heroui/react";
import { useMediaQuery } from "react-responsive";
import { useDashboardPage } from "@/store/useDashboardPage";
import Options from "./components/resources/Options";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type ResourceCardProps = {
	data: any;
};

const ResourceCard = ({ data }: ResourceCardProps) => {
	const pathname = usePathname();
	const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
	const [icon, setIcon] = useState(
		data?.icon || "https://placehold.co/200x200",
	);
	const [isHovered, setIsHovered] = useState(false);

	const isSmallDevices = useMediaQuery({
		query: "(max-width: 64rem)",
	});
	const getDashboardPage = useDashboardPage(
		(state) => state.getDashboardPage,
	);

	const mutation = usePutViewResourceMutation({
		params: data.id,
		onSuccess: () => {
			// console.log("success");
		},
		onError: (err) => {
			console.log(err);
		},
	});

	const onCardClickHandler = (e: React.MouseEvent) => {
		if (isOpenDrawer) return;
		// Check if the click is on an interactive element
		const target = e.target as HTMLElement;
		const isInteractiveElement =
			target.closest("button") ||
			target.closest('[role="button"]') ||
			target.closest("a") ||
			target.closest("[role='dialog']");

		// Only redirect if not clicking on an interactive element
		if (!isInteractiveElement && data.url) {
			mutation.mutate({ view_count: data.view_count + 1 });

			window.open(data.url, "_blank", "noopener,noreferrer");
			return;
		}
	};
	const collectionList = data?.resourceCollections.map(
		(id: number) => id + "",
	);

	const handleMoreOptions = (e: PressEvent) => {
		// Handle more options menu click
		console.log("More options clicked");
	};

	return (
		<motion.div
			key={data.id}
			layout
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
			transition={{ ease: "easeInOut", duration: 0.2 }}
			className="relative flex min-w-[19rem] flex-1 cursor-pointer flex-col rounded-2xl bg-content1 shadow-md dark:border-small dark:border-default-200 md:min-w-[22rem]"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div
				className={cn(
					"absolute right-7 top-12 flex items-center",
					pathname === "/resources" && "right-0",
				)}
			>
				<div
					className={`absolute right-7 ${getDashboardPage() === "shared" || getDashboardPage() === "public" ? "cursor-not-allowed" : ""}`}
				>
					{isSmallDevices ? (
						<SaveResourceDrawer
							bookmarkCount={data.bookmarksCount}
							isBookmarked={!!data?.resourceCollections?.length}
							collectionList={collectionList}
							id={data.id}
						/>
					) : (
						<SaveResourcePopOver
							bookmarkCount={data.bookmarksCount}
							isBookmarked={!!data?.resourceCollections?.length}
							collectionList={collectionList}
							id={data.id}
						/>
					)}
				</div>
				{pathname !== "/resources" && (
					<div className="absolute right-0">
						<Options data={data} />
					</div>
				)}
			</div>
			<div
				className="h-full"
				onClick={isOpenDrawer ? () => {} : onCardClickHandler}
			>
				<div className="flex h-full flex-col p-5 xl:p-7">
					<div className="flex justify-start">
						<Image
							src={icon}
							alt="image"
							className="z-1"
							width={45}
							height={45}
							onError={() =>
								setIcon("https://placehold.co/200x200")
							}
						/>
					</div>
					<div className="mt-2">
						<h2 className="mt-5 line-clamp-1 font-bold ~text-lg/xl dark:text-zinc-100">
							{data.name}
						</h2>
						<p className="mt-2 line-clamp-2 ~text-sm/base dark:text-zinc-300 lg:line-clamp-3">
							{data.description}
						</p>
					</div>
					<div
						style={{ flex: 1 }}
						className="mt-4 flex flex-col justify-end"
					>
						<ResourceTags tags={data.resourceTags} />
						<div className="mt-4">
							{getDashboardPage() === "shared" ||
								(getDashboardPage() === "public" &&
									data?.sharedBy && (
										<div className="flex items-center gap-2">
											<Avatar
												name={data.sharedBy.email}
												src={data.sharedBy.image}
												className="h-5 w-5"
												size="sm"
											/>
											<p className="text-xs text-zinc-600">
												{data.sharedBy.email}
											</p>
										</div>
									))}
							<ResourceMetrics
								name={data.name}
								id={data.id}
								url={data.url}
								views={data.view_count || 0}
								likes={data.likesCount}
								shares={data.shares || 0}
								isLiked={data?.likes?.length > 0}
							/>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default ResourceCard;

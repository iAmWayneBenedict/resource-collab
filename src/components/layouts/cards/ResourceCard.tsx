"use client";

import Image from "next/image";
import { ResourceTags } from "./components/resources/ResourceTags";
import { ResourceMetrics } from "./components/resources/ResourceMetrics";
import { motion } from "motion/react";
import SaveResourcePopOver from "./components/resources/SaveResourcePopOver";
import { usePutViewResourceMutation } from "@/lib/mutations/resources";

type ResourceCardProps = {
	data: any;
};

const ResourceCard = ({ data }: ResourceCardProps) => {
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
	return (
		<motion.div
			key={data.id}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
			transition={{ ease: "easeInOut", duration: 0.2 }}
			className="relative flex min-w-[19rem] flex-1 cursor-pointer flex-col rounded-2xl bg-content1 shadow-md dark:border-small dark:border-default-200 md:min-w-[22rem]"
			onClick={onCardClickHandler}
		>
			<div className="absolute right-7 top-7">
				<SaveResourcePopOver
					bookmarkCount={data.bookmarksCount}
					isBookmarked={!!data?.resourceCollections?.length}
					collectionList={collectionList}
					id={data.id}
				/>
			</div>
			<div className="h-full">
				<div className="flex h-full flex-col p-5 xl:p-7">
					<div className="flex justify-start">
						<Image
							src={data.icon}
							alt="image"
							width={45}
							height={45}
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
							<ResourceMetrics
								resource_id={data.id}
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

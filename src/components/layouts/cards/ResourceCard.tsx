"use client";

import React, { useLayoutEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ResourceTags } from "./components/resources/ResourceTags";
import { ResourceMetrics } from "./components/resources/ResourceMetrics";
import { BookmarkButton } from "./components/resources/BookmarkButton";
import { motion, stagger } from "motion/react";
import SaveResourcePopOver from "./components/resources/SaveResourcePopOver";

type ResourceCardProps = {
	data: any;
};

const ResourceCard = ({ data }: ResourceCardProps) => {
	return (
		<motion.div
			key={data.id}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
			transition={{ ease: "easeInOut", duration: 0.2 }}
			className="relative flex min-w-[19rem] flex-1 flex-col rounded-2xl bg-white shadow-md dark:bg-black md:min-w-[22rem]"
		>
			<div className="absolute right-7 top-7">
				<SaveResourcePopOver bookmarkCount={1} id={data.id} />
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
		</motion.div>
	);
};

export default ResourceCard;

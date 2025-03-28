"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Image } from "@heroui/react";
import { metadataThumbnail } from "../../../../public/assets/img";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CollectionHeader from "./components/collections/CollectionHeader";
import CollectionFooter from "./components/collections/CollectionFooter";

const CollectionCard = ({ data }: { data: CollectionResponse }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const tab = searchParams.get("tab");
	const [enableClickHandler, setEnableClickHandler] =
		useState<boolean>(false);

	const onClickCardHandler = () => {
		router.push(`${pathname}/${data.id}?tab=${tab}`);
	};

	return (
		<motion.div
			key={data.id}
			layout
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
			transition={{ ease: "easeInOut", duration: 0.2 }}
			className="group relative flex min-w-[17rem] flex-1 cursor-pointer flex-col overflow-hidden rounded-2xl bg-content1 shadow-md dark:border-small dark:border-default-200 xl:min-w-[20%]"
		>
			<Image
				className="z-1 h-full w-full object-cover group-hover:scale-105"
				classNames={{ wrapper: "w-full h-full !max-w-full" }}
				alt="heroui"
				src={data.thumbnail || metadataThumbnail.src}
				onClick={onClickCardHandler}
			/>

			{/* header */}
			<CollectionHeader
				data={data}
				setEnableClickHandler={setEnableClickHandler}
			/>

			{/* footer */}
			<CollectionFooter
				data={data}
				onClickCardHandler={onClickCardHandler}
			/>

			{/* backdrop-top */}
			<div className="z-1 pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />

			{/* backdrop-bottom */}
			<div className="z-1 pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />
		</motion.div>
	);
};

export default CollectionCard;

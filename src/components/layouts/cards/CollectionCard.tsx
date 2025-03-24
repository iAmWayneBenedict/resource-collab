import React from "react";
import { motion } from "motion/react";
import { Image } from "@heroui/react";
import { collectionItemIcons } from "./utils";
import { Layers2 } from "lucide-react";

const CollectionCard = () => {
	return (
		<motion.div
			// key={data.id}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
			transition={{ ease: "easeInOut", duration: 0.2 }}
			className="relative flex min-w-[17rem] flex-1 cursor-pointer flex-col rounded-2xl bg-content1 shadow-md dark:border-small dark:border-default-200 xl:min-w-[20%]"
		>
			<Image
				className="z-1"
				alt="heroui"
				src="https://cdn.sanity.io/images/p2zxqf70/production/dcb08489f14dedf946fd12b4bf426cbe0c82a057-1200x630.png"
				fallbackSrc="https://placehold.co/200x200"
			/>

			<div className="absolute bottom-0 left-0 z-[2] flex w-full">
				<div className="flex flex-1 justify-between px-3 pb-2">
					{/* title */}
					<div className="flex items-center gap-2">
						<span className="text-default-200">
							<Layers2 size={16} />
						</span>
						<h3 className="text-default-200 ~text-base/sm">
							Testing title
						</h3>
					</div>
					<span className="text-default-200">
						{collectionItemIcons["private"]}
					</span>
				</div>
			</div>

			{/* backdrop */}
			<div className="z-1 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/100 via-black/30 to-transparent" />
		</motion.div>
	);
};

export default CollectionCard;

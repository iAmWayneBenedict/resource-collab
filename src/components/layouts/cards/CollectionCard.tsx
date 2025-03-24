import React from "react";
import { motion } from "motion/react";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	Image,
} from "@heroui/react";
import { collectionItemIcons } from "./utils";
import {
	EllipsisVertical,
	Layers2,
	Pencil,
	Share2,
	Trash2,
} from "lucide-react";
import { metadataThumbnail } from "../../../../public/assets/img";

const CollectionCard = ({ data }: { data: CollectionResponse }) => {
	const accessLevelIcon =
		collectionItemIcons[
			data.access_level as keyof typeof collectionItemIcons
		];
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
				className="z-1 h-full w-full object-cover"
				classNames={{ wrapper: "w-full h-full !max-w-full" }}
				alt="heroui"
				src={data.thumbnail || metadataThumbnail.src}
			/>

			{/* header */}
			<div className="absolute left-0 top-0 z-[2] flex w-full">
				<div className="flex flex-1 items-center justify-end gap-2 px-3 pt-2">
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<Button
								isIconOnly
								variant="light"
								size="sm"
								radius="full"
								className="text-default-200 dark:text-default-700"
							>
								<EllipsisVertical size={18} />
							</Button>
						</DropdownTrigger>

						<DropdownMenu variant="flat">
							<DropdownSection title={"Action"}>
								<DropdownItem key="edit">
									<div className="flex gap-2">
										<Pencil size={16} />
										<span>Edit</span>
									</div>
								</DropdownItem>
								<DropdownItem key="share">
									<div className="flex gap-2">
										<Share2 size={16} />
										<span>Share</span>
									</div>
								</DropdownItem>
								<DropdownItem
									key="delete"
									color="danger"
									// variant="solid"
								>
									<div className="flex gap-2">
										<Trash2 size={16} />
										<span>Delete</span>
									</div>
								</DropdownItem>
							</DropdownSection>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>

			{/* footer */}
			<div className="absolute bottom-0 left-0 z-[2] flex w-full">
				<div className="flex flex-1 items-end justify-between gap-2 px-5 pb-4">
					{/* title */}
					<div className="flex items-center gap-2">
						<span className="text-default-200 dark:text-default-700">
							<Layers2 size={16} />
						</span>
						<h3 className="line-clamp-1 text-default-200 ~text-sm/xs dark:text-default-700 lg:~text-base/sm">
							{data.name}
						</h3>
					</div>
					<div className="flex flex-col items-center gap-2">
						<span className="text-default-200 ~text-sm/xs dark:text-default-700">
							{data.resourceCount}
						</span>
						<span className="mb-1 text-default-200 dark:text-default-700">
							{accessLevelIcon}
						</span>
					</div>
				</div>
			</div>

			{/* backdrop-top */}
			<div className="z-1 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-black/80 via-black/40 to-transparent" />

			{/* backdrop-bottom */}
			<div className="z-1 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
		</motion.div>
	);
};

export default CollectionCard;

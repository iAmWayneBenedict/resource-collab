"use client";

import { Tab, Tabs } from "@heroui/react";
import {
	Archive,
	GalleryVerticalEnd,
	Heart,
	Layers2,
	Repeat,
} from "lucide-react";
import Link from "next/link";
import TabBody from "./TabBody";
import { useMediaQuery } from "react-responsive";
import InternalTabs from "./InternalTabs";
import ResourceTab from "./ResourceTab";
import LikedTab from "./liked/LikedTab";
import CollectionTab from "./collections/CollectionTab";

let TABS = [
	{
		id: "resources",
		label: "Resources",
		icon: <GalleryVerticalEnd size={16} />,
	},
	{
		id: "portfolios",
		label: "Portfolios",
		icon: <Archive size={16} />,
	},
	{
		id: "liked",
		label: "Liked",
		icon: <Heart size={16} />,
	},
	{
		id: "collections",
		label: "Collections",
		icon: <Layers2 size={16} />,
	},
	{
		id: "shared",
		label: "Shared",
		icon: <Repeat size={16} />,
	},
];

const ContentTabs = ({ type }: { type: string }) => {
	const mobileDevices = useMediaQuery({ query: "(max-width: 40rem)" });

	return (
		<div className="mt-24 flex w-full flex-col">
			<Tabs
				selectedKey={type}
				aria-label="Dynamic tabs"
				radius="full"
				classNames={{
					base: "sticky sm:relative top-0 z-10",
					tabList:
						"bg-[#f9f8f6] sm:bg-default-200 sm:rounded-full overflow-x-visible sm:overflow-x-scroll pb-3 sm:pb-1",
					cursor: "dark:bg-white bg-violet sm:bg-default-100 dark:sm:bg-zinc-900 -bottom-2 sm:bottom-0",
					panel: "border-t-1 pt-5 mt-5 border-zinc-300",
				}}
				variant={mobileDevices ? "underlined" : "solid"}
				fullWidth={mobileDevices}
			>
				{TABS.map((item) => (
					<Tab
						as={Link}
						href={"/dashboard/" + item.id}
						key={item.id}
						title={
							<div className="flex items-center gap-2">
								<span>{item.icon}</span>
								<span className="hidden text-xs font-medium sm:block md:text-sm">
									{item.label}
								</span>
							</div>
						}
					>
						{type === "resources" && (
							<ResourceTab type={type as any} />
						)}
						{type === "liked" && <LikedTab />}
						{type === "collections" && (
							<CollectionTab type={type as any} />
						)}
					</Tab>
				))}
			</Tabs>
		</div>
	);
};

export default ContentTabs;

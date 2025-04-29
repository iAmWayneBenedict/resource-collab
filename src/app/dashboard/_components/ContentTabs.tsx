"use client";

import { Tab, Tabs } from "@heroui/react";
import {
	Archive,
	Bookmark,
	GalleryVerticalEnd,
	Heart,
	Repeat,
} from "lucide-react";
import ResourceTab from "./ResourceTab";
import LikedTab from "./liked/LikedTab";
import CollectionTab from "./collections/CollectionTab";
import { useLayoutEffect, useState } from "react";
import {
	useParams,
	usePathname,
	useRouter,
	useSearchParams,
} from "next/navigation";
import { useMediaQuery } from "react-responsive";
import PortfolioTabs from "./PortfolioTabs";
import SharedTab from "./shared/SharedTab";

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
		icon: <Bookmark size={16} />,
	},
	{
		id: "shared",
		label: "Shared with me",
		icon: <Repeat size={16} />,
	},
];

const ContentTabs = () => {
	const mobileDevices = useMediaQuery({ query: "(max-width: 40rem)" });
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const type = searchParams.get("page") ?? "resources";
	const [currentTab, setCurrentTab] = useState<string>(type as string);
	const id = searchParams.get("item") ?? "";

	// ensure that there is always a tab selected
	useLayoutEffect(() => {
		const tab = searchParams.get("tab") ?? "";
		if (!tab && !id)
			router.replace(`${pathname}?page=${type}&tab=resources`, {
				scroll: false,
			});
	}, []);

	return (
		<div className="mt-24 flex w-full flex-col">
			<Tabs
				selectedKey={currentTab}
				onSelectionChange={(key) => {
					setCurrentTab(key as string);
					router.push(
						`/dashboard?page=${key}&tab=${["resources", "liked", "collections"].includes(key as string) ? "resources" : ""}`,
						{ scroll: false },
					);
				}}
				aria-label="Dynamic tabs"
				radius="full"
				classNames={{
					base: "sticky w-full sm:w-fit sm:relative top-0 z-10",
					tabList:
						"bg-[#f9f8f6] dark:bg-[#191919] dark:sm:bg-default-200 sm:bg-default-200 w-full sm:w-fit sm:rounded-full overflow-x-visible sm:overflow-x-scroll pb-3 sm:pb-1",
					cursor: "dark:bg-white bg-violet sm:bg-default-100 dark:sm:bg-zinc-900 -bottom-2 sm:bottom-0",
					panel: "border-t-1 pt-5 mt-5 border-zinc-300",
				}}
				variant={mobileDevices ? "underlined" : "solid"}
				suppressHydrationWarning
				shouldSelectOnPressUp={false}
			>
				{TABS.map((item) => (
					<Tab
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
						{currentTab === "portfolios" && (
							<PortfolioTabs type={currentTab} />
						)}
						{currentTab === "resources" && (
							<ResourceTab type={currentTab as any} />
						)}
						{currentTab === "liked" && <LikedTab />}
						{currentTab === "collections" && (
							<CollectionTab
								type={currentTab as any}
								id={id as string}
							/>
						)}
						{currentTab === "shared" && (
							<SharedTab
								type={currentTab as any}
								id={id as string}
							/>
						)}
					</Tab>
				))}
			</Tabs>
		</div>
	);
};

export default ContentTabs;

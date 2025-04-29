import { Tab, Tabs } from "@heroui/react";
import React, { useState } from "react";
import ResourceCollectionTab from "./ResourceCollectionTab";
import ResourceTab from "../ResourceTab";
import OptionsHeader from "../OptionsHeader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CollectionModal from "@/components/modal/CollectionModal";

type Props = {
	type:
		| "resources"
		| "liked"
		| "collections"
		| "shared"
		| "collection-resources";
	id?: string | number;
};
const CollectionTab = ({ type, id }: Props) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const tab = searchParams.get("tab");
	const [currentTab, setCurrentTab] = useState<string>(tab as string);

	if (type === "collections" && tab === "resources" && id) {
		return (
			<div className="flex flex-col gap-4">
				<OptionsHeader />
				<ResourceTab type={"collection-resources"} id={id} />
			</div>
		);
	}

	return (
		<div>
			<Tabs
				selectedKey={currentTab}
				onSelectionChange={(key) => {
					setCurrentTab(key as string);

					router.push(`${pathname}?page=collections&tab=${key}`);
				}}
				aria-label="Tabs variants"
				variant={"light"}
				radius="full"
				classNames={{
					base: "sticky sm:relative top-[3rem] sm:top-0 z-10 sm:rounded-full  w-full sm:w-fit",
					tabList:
						"bg-[#f9f8f6] dark:bg-[#191919] sm:bg-none rounded-none sm:rounded-full w-full pb-2 sm:pb-1",
				}}
			>
				<Tab key="resources" title="Resources">
					<ResourceCollectionTab type={type} />
				</Tab>
				<Tab key="portfolios" title="Portfolios">
					test
				</Tab>
			</Tabs>
			<CollectionModal />
		</div>
	);
};

export default CollectionTab;

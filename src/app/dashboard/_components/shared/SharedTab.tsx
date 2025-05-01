import { Tab, Tabs } from "@heroui/react";
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import ResourceTab from "../ResourceTab";
import OptionsHeader from "../OptionsHeader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CollectionModal from "@/components/modal/CollectionModal";
import ResourceCollectionTab from "../collections/ResourceCollectionTab";
import { useSelectedCollection } from "@/store/useSelectedCollection";
import { useDashboardTab } from "@/store/useDashboardTab";

type Props = {
	type:
		| "resources"
		| "liked"
		| "collections"
		| "shared"
		| "collection-resources";
	id?: string | number;
};
const SharedTab = ({ type, id }: Props) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const tab = searchParams.get("tab");
	const [currentCollection, setCurrentCollection] = useState<Record<
		string,
		any
	> | null>(null);
	const { dashboardTab, setDashboardTab } = useDashboardTab();

	const collectionCallback = useCallback((data: Record<string, any>) => {
		setCurrentCollection(data);
	}, []);

	if (type === "shared" && tab === "collections" && id) {
		return (
			<div className="flex flex-col gap-4">
				{/* <h3 className="font-PlayFairDisplay text-2xl">
					{currentCollection?.name}
				</h3> */}
				<OptionsHeader currentCollection={currentCollection} />
				<ResourceTab
					callback={collectionCallback}
					type={"collection-shared-resources"}
					id={id}
				/>
			</div>
		);
	}

	return (
		<div>
			<Tabs
				selectedKey={dashboardTab}
				onSelectionChange={(key) => {
					setDashboardTab(key as string);
					router.push(`${pathname}?page=shared&tab=${key}`);
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
					<ResourceTab type={type} />
				</Tab>
				<Tab key="collections" title="Collections">
					<ResourceCollectionTab type={type} />
				</Tab>
			</Tabs>
			<CollectionModal />
		</div>
	);
};

export default SharedTab;

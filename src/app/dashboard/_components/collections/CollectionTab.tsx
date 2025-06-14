import { Tab, Tabs } from "@heroui/react";
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import ResourceCollectionTab from "./ResourceCollectionTab";
import ResourceTab from "../ResourceTab";
import OptionsHeader from "../OptionsHeader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CollectionModal from "@/components/modal/CollectionModal";
import { useDashboardTab } from "@/store/useDashboardTab";
import EmptyDisplay from "@/components/layouts/EmptyDisplay";

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
	const [currentCollection, setCurrentCollection] = useState<Record<
		string,
		any
	> | null>(null);
	const { dashboardTab, setDashboardTab } = useDashboardTab();

	const collectionCallback = useCallback((data: Record<string, any>) => {
		setCurrentCollection(data);
	}, []);

	if (type === "collections" && tab === "resources" && id) {
		return (
			<div className="flex flex-col gap-4">
				<OptionsHeader currentCollection={currentCollection} />
				<ResourceTab
					type={"collection-resources"}
					id={id}
					callback={collectionCallback}
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
					<EmptyDisplay
						code="beta"
						title="Coming Soon!"
						description="We are currently in beta. Showcasing your portfolio will be available soon. Stay tuned!"
						showButton={false}
					/>
				</Tab>
			</Tabs>
			<CollectionModal />
		</div>
	);
};

export default CollectionTab;

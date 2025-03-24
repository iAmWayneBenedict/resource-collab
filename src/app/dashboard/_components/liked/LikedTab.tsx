import { Tab, Tabs } from "@heroui/react";
import React from "react";
import ResourceTab from "../ResourceTab";

const LikedTab = () => {
	return (
		<Tabs
			aria-label="Tabs variants"
			variant={"light"}
			radius="full"
			classNames={{
				base: "sticky sm:relative top-[3rem] sm:top-0 z-10 sm:rounded-full  w-full sm:w-fit",
				tabList:
					"bg-[#f9f8f6] sm:bg-none rounded-none sm:rounded-full w-full pb-2 sm:pb-1",
			}}
		>
			<Tab key="resources" title="Resources">
				<ResourceTab type="liked" />
			</Tab>
			<Tab key="portfolios" title="Portfolios">
				test
			</Tab>
		</Tabs>
	);
};

export default LikedTab;

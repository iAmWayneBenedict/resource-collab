import React from "react";
import DashboardWrapper from "./_components/DashboardWrapper";
import ContentTabs from "./_components/ContentTabs";
import ResourceFormModal from "@/components/modal/ResourceFormModal";

const Page = async () => {
	return (
		<DashboardWrapper>
			<ContentTabs />
			<ResourceFormModal />
		</DashboardWrapper>
	);
};

export default Page;

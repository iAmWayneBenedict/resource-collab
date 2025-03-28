import React from "react";
import ContentTabs from "../_components/ContentTabs";
import DashboardWrapper from "../_components/DashboardWrapper";

const Page = async () => {
	return (
		<DashboardWrapper>
			<ContentTabs />
		</DashboardWrapper>
	);
};

export default Page;

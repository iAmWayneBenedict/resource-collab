import React from "react";
import DashboardWrapper from "./_components/DashboardWrapper";
import ContentTabs from "./_components/ContentTabs";

const Page = async () => {
	return (
		<DashboardWrapper>
			<ContentTabs />
		</DashboardWrapper>
	);
};

export default Page;

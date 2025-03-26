import React from "react";
import ContentTabs from "../_components/ContentTabs";
import DashboardWrapper from "../_components/DashboardWrapper";

const Page = async ({ params }: { params: Promise<{ type: string }> }) => {
	const { type } = await params;

	return (
		<DashboardWrapper>
			<ContentTabs type={type} />
		</DashboardWrapper>
	);
};

export default Page;

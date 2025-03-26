import React from "react";
import DashboardWrapper from "../../_components/DashboardWrapper";
import ContentTabs from "../../_components/ContentTabs";

const Page = async ({
	params,
}: {
	params: Promise<{ type: string; id: number | string }>;
}) => {
	const { type, id } = await params;
	return (
		<DashboardWrapper>
			<ContentTabs type={type} id={id} />
		</DashboardWrapper>
	);
};

export default Page;

import React from "react";
import DashboardWrapper from "./_components/DashboardWrapper";
import ContentTabs from "./_components/ContentTabs";
import ResourceFormModal from "@/components/modal/ResourceFormModal";
import {
	FilterFormModal,
	SearchFormModal,
} from "../resources/_components/modal";
import CustomAlertDialog from "@/components/custom/CustomDialog";

const Page = async () => {
	return (
		<DashboardWrapper>
			<ContentTabs />
			<ResourceFormModal />
			<FilterFormModal />
			<SearchFormModal />
			<CustomAlertDialog />
		</DashboardWrapper>
	);
};

export default Page;

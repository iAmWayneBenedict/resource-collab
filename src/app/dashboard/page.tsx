import React from "react";
import DashboardWrapper from "./_components/DashboardWrapper";
import ContentTabs from "./_components/ContentTabs";
import ResourceFormModal from "@/components/modal/ResourceFormModal";
import CustomAlertDialog from "@/components/custom/CustomDialog";
import FilterFormModal from "@/components/modal/FilterModal";
import SearchFormModal from "@/components/modal/SearchModal";

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

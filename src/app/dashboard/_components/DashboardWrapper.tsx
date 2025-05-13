import Container from "@/components/layouts/Container";
import React, { ReactNode, Suspense } from "react";
import UserProfile from "./UserProfile";
import Layout from "@/components/layouts/users/Layout";
import ShareModal from "@/components/modal/ShareModal";

const DashboardWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<Layout className="mt-4">
			<Container className="mt-16">
				<UserProfile />
				<Suspense fallback={null}>{children}</Suspense>
			</Container>
			{/* <FilterFormModal /> */}
			{/* <SearchFormModal /> */}
			{/* <AISearchModal /> */}
			<ShareModal />
		</Layout>
	);
};

export default DashboardWrapper;

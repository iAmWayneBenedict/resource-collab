import Container from "@/components/layouts/Container";
import React, { ReactNode, Suspense } from "react";
import UserProfile from "./UserProfile";
import Layout from "@/components/layouts/users/Layout";

const DashboardWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<Suspense fallback={<h1>Loading</h1>}>
			<Layout className="mt-4">
				<Container className="mt-16">
					<UserProfile />
					<Suspense fallback={<h1>Loading...</h1>}>
						{children}
					</Suspense>
				</Container>
				{/* <FilterFormModal /> */}
				{/* <SearchFormModal /> */}
				{/* <AISearchModal />
				<ShareModal /> */}
			</Layout>
		</Suspense>
	);
};

export default DashboardWrapper;

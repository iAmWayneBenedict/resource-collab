import Container from "@/components/layouts/Container";
import Layout from "@/components/layouts/users/Layout";
import React, { Suspense } from "react";
import UserProfile from "../_components/UserProfile";
import ContentTabs from "../_components/ContentTabs";
import ShareModal from "@/components/modal/ShareModal";
import {
	AISearchModal,
	FilterFormModal,
	SearchFormModal,
} from "@/app/resources/_components/modal";

const Page = async ({ params }: { params: Promise<{ type: string }> }) => {
	const { type } = await params;
	return (
		<Suspense fallback={<h1>Loading</h1>}>
			<Layout className="mt-4">
				<Container className="mt-16">
					<UserProfile />
					<Suspense fallback={<h1>Loading...</h1>}>
						<ContentTabs type={type} />
					</Suspense>
				</Container>
				<FilterFormModal />
				{/* <SearchFormModal /> */}
				<AISearchModal />
				<ShareModal />
			</Layout>
		</Suspense>
	);
};

export default Page;

import Container from "@/components/layouts/Container";
import { DashboardSideNavigation } from "@/components/layouts/users/side-nav/side-nav";
import Layout from "@/components/layouts/users/Layout";
import React from "react";
import EmptyDisplay from "@/components/layouts/EmptyDisplay";

const Page = () => {
	return (
		<Layout>
			<Container className="flex justify-center">
				<div className="flex w-full max-w-5xl gap-2">
					<DashboardSideNavigation page="subscription" />
					<EmptyDisplay
						code="beta"
						title="Early Access"
						description="We are currently in beta. Choosing from different subscription plans will be available soon."
						showButton={false}
					/>
				</div>
			</Container>
		</Layout>
	);
};

export default Page;

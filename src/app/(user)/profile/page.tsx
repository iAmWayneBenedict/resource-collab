import Container from "@/components/layouts/Container";
import { DashboardSideNavigation } from "@/components/layouts/users/side-nav/side-nav";
import Layout from "@/components/layouts/users/Layout";
import React from "react";
import { ProfileForm } from "./_components/profile-form";

const Page = () => {
	return (
		<Layout>
			<Container className="flex justify-center">
				<div className="flex w-full max-w-5xl gap-2">
					<DashboardSideNavigation page="profile" />
					<ProfileForm />
				</div>
			</Container>
		</Layout>
	);
};

export default Page;

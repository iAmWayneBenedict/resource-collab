import Container from "@/components/layouts/Container";
import { DashboardSideNavigation } from "@/components/layouts/users/side-nav/side-nav";
import Layout from "@/components/layouts/users/Layout";
import React from "react";
import { ProfileForm } from "./_components/profile-form";

const Page = () => {
	return (
		<Layout>
			<Container className="flex justify-center">
				<div className="flex w-full max-w-5xl gap-6">
					<DashboardSideNavigation page="profile" />
					<div className="flex-1 space-y-6">
						<div>
							<h1 className="text-2xl font-semibold">
								Profile Settings
							</h1>
							<p className="mt-1 text-default-500">
								Customize your profile, manage security
								settings, and control how others see you on
								Coollabs.
							</p>
						</div>
						<ProfileForm />
					</div>
				</div>
			</Container>
		</Layout>
	);
};

export default Page;

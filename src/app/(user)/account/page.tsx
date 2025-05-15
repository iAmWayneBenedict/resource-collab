import Container from "@/components/layouts/Container";
import { DashboardSideNavigation } from "@/components/layouts/users/side-nav/side-nav";
import Layout from "@/components/layouts/users/Layout";
import React from "react";
import ActiveSessions from "./_components/ActiveSessions";
import DeleteAccount from "./_components/DeleteAccount";

const Page = () => {
	return (
		<Layout>
			<Container className="flex justify-center">
				<div className="flex w-full max-w-5xl gap-6">
					<DashboardSideNavigation page="account" />
					<div className="flex-1 space-y-6">
						<div>
							<h1 className="text-2xl font-semibold">
								Account Settings
							</h1>
							<p className="mt-1 text-default-500">
								Manage your account settings and active sessions
							</p>
						</div>
						<ActiveSessions />
						<DeleteAccount />
					</div>
				</div>
			</Container>
		</Layout>
	);
};

export default Page;

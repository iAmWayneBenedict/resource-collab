import React from "react";
import PublicCollections from "./_components/PublicCollections";
import Layout from "@/components/layouts/users/Layout";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";
import {
	FilterModalTrigger,
	SearchModalTrigger,
} from "@/app/resources/_components/filter";
import {
	FilterFormModal,
	SearchFormModal,
} from "@/app/resources/_components/modal";

const Page = () => {
	return (
		<Layout>
			<Container>
				<PublicCollections />
				<FilterFormModal />
				<SearchFormModal />
			</Container>
		</Layout>
	);
};

export default Page;

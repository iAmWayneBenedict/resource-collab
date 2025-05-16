import React from "react";
import PublicCollections from "./_components/PublicCollections";
import Layout from "@/components/layouts/users/Layout";
import Container from "@/components/layouts/Container";
import FilterFormModal from "@/components/modal/FilterModal";
import SearchFormModal from "@/components/modal/SearchModal";

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

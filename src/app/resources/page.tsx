"use client";

import BannerContent from "@/components/layouts/users/BannerContent";
import BannerGradient from "@/components/layouts/users/BannerGradient";
import Layout from "@/components/layouts/users/Layout";
import Section from "@/components/layouts/Section";
import React from "react";
import Container from "@/components/layouts/Container";
import { FilterModalTrigger, SearchModalTrigger } from "./_components/filter";
import ResourceCardContainer from "./_components/ResourceCardContainer";
import CategoriesAsideContainer from "./_components/CategoriesAsideContainer";
import AISearchResult from "./_components/AISearchResult";
import ShareModal from "@/components/modal/ShareModal";
import AuthModal from "@/components/modal/AuthModal";
import FilterFormModal from "@/components/modal/FilterModal";
import SearchFormModal from "@/components/modal/SearchModal";
import AISearchModal from "@/components/modal/AISearchModal";

const Page = () => {
	return (
		<Layout className="mt-4">
			<Container>
				<BannerGradient classNames="w-full h-[8rem]" />

				<Section>
					<BannerContent
						title="Discover tools for your needs"
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
		incididunt ut labore et dolore magna aliqua."
					/>
				</Section>

				<Section className="flex flex-col lg:flex-row">
					<CategoriesAsideContainer />
					<div className="w-full lg:max-w-[calc(100%-16rem)]">
						<div className="flex items-center justify-end gap-2">
							<SearchModalTrigger />
							<FilterModalTrigger />
						</div>
						<AISearchResult />
						<ResourceCardContainer />
					</div>
				</Section>
			</Container>
			<FilterFormModal />
			<SearchFormModal />
			<AISearchModal />
			<ShareModal />
			<AuthModal />
		</Layout>
	);
};

export default Page;

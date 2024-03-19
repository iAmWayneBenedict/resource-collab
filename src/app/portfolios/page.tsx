"use client";

import Aside from "@/components/layouts/users/Aside";
import BannerContent from "@/components/layouts/users/BannerContent";
import BannerGradient from "@/components/layouts/users/BannerGradient";
import Layout from "@/components/layouts/users/Layout";
import Section from "@/components/layouts/Section";
import PortfolioCard from "@/components/layouts/cards/PortfolioCard";
import React from "react";
import Container from "@/components/layouts/Container";

const Portfolios = () => {
	return (
		<Layout>
			<Container>
				<BannerGradient classNames="w-full h-[8rem]" />

				<Section>
					<BannerContent
						title={`Need a dev? \n Check out these amazing developers`}
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
		incididunt ut labore et dolore magna aliqua."
					/>
				</Section>

				<Section className="flex">
					<Aside
						links={[
							{ title: "All", href: "/portfolios" },
							{ title: "Entry Level", href: "/portfolios?filter=entry level" },
							{ title: "Junior Level", href: "/portfolios?filter=junior level" },
							{ title: "Mid Level", href: "/portfolios?filter=mid level" },
							{ title: "Senior Level", href: "/portfolios?filter=senior level" },
						]}
					/>
					<div className="w-full">
						<div className="mt-16 grid gap-4 2xl:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
							{[1, 2, 3, 4, 5, 6].map((el) => (
								<PortfolioCard key={el} />
							))}
						</div>
					</div>
				</Section>
			</Container>
		</Layout>
	);
};

export default Portfolios;

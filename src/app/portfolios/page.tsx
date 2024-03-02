"use client";

import Aside from "@/components/layouts/Aside";
import BannerContent from "@/components/layouts/BannerContent";
import BannerGradient from "@/components/layouts/BannerGradient";
import { DarkModeToggler } from "@/components/layouts/DarkModeToggler";
import Footer from "@/components/layouts/Footer";
import Main from "@/components/layouts/Main";
import NavBar from "@/components/layouts/NavBar";
import Section from "@/components/layouts/Section";
import PortfolioCard from "@/components/layouts/cards/PortfolioCard";
import ResourceCard from "@/components/layouts/cards/ResourceCard";
import React from "react";

const Portfolios = () => {
	return (
		<Main className="mt-36">
			<NavBar />
			<div className="mx-24">
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
						<div className="mt-16 grid gap-6 grid-cols-3 grid-rows-2">
							{[1, 2, 3, 4, 5, 6].map((el) => (
								<PortfolioCard key={el} />
							))}
						</div>
					</div>
				</Section>
			</div>

			<DarkModeToggler />
			<Footer />
		</Main>
	);
};

export default Portfolios;

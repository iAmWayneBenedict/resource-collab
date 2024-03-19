"use client";

import Aside from "@/components/layouts/users/Aside";
import BannerContent from "@/components/layouts/users/BannerContent";
import BannerGradient from "@/components/layouts/users/BannerGradient";
import Layout from "@/components/layouts/users/Layout";
import Section from "@/components/layouts/Section";
import ResourceCard from "@/components/layouts/cards/ResourceCard";
import React from "react";
import Container from "@/components/layouts/Container";

const Resources = () => {
	return (
		<Layout className="mt-36">
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
					<Aside
						links={[
							{ title: "All", href: "/resources" },
							{ title: "Design", href: "/resources?filter=design" },
							{ title: "Development", href: "/resources?filter=development" },
							{ title: "Marketing", href: "/resources?filter=marketing" },
							{ title: "Productivity", href: "/resources?filter=productivity" },
						]}
					/>
					<div className="w-full">
						<div className="mt-16 gap-6 flex flex-wrap">
							{[1, 2, 3, 4, 5, 6].map((el) => (
								<ResourceCard key={el} />
							))}
						</div>
					</div>
				</Section>
			</Container>
		</Layout>
	);
};

export default Resources;

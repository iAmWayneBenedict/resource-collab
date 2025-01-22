import Aside from "@/components/layouts/users/Aside";
import BannerContent from "@/components/layouts/users/BannerContent";
import BannerGradient from "@/components/layouts/users/BannerGradient";
import Layout from "@/components/layouts/users/Layout";
import Section from "@/components/layouts/Section";
import ResourceCard from "@/components/layouts/cards/ResourceCard";
import React, { Suspense } from "react";
import Container from "@/components/layouts/Container";
import ControlledMultipleChipFilter from "@/components/custom/ControlledMultipleChipFilter";

const Resources = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
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
								{ title: "Design", href: "/resources?category=design" },
								{ title: "Development", href: "/resources?category=development" },
								{ title: "Marketing", href: "/resources?category=marketing" },
								{ title: "Productivity", href: "/resources?category=productivity" },
							]}
						/>
						<div className="w-full">
							<ControlledMultipleChipFilter />
							<div className="mt-10 gap-6 flex flex-wrap">
								{[1, 2, 3, 4, 5, 6].map((el) => (
									<ResourceCard key={el} />
								))}
							</div>
						</div>
					</Section>
				</Container>
			</Layout>
		</Suspense>
	);
};

export default Resources;

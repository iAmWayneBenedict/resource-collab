import Aside from "@/components/layouts/users/Aside";
import BannerContent from "@/components/layouts/users/BannerContent";
import BannerGradient from "@/components/layouts/users/BannerGradient";
import Layout from "@/components/layouts/users/Layout";
import Section from "@/components/layouts/Section";
import ResourceCard from "@/components/layouts/cards/ResourceCard";
import React, { Suspense } from "react";
import Container from "@/components/layouts/Container";
import { FilterFormModal, SearchFormModal } from "./_components/modal";
import { FilterModalTrigger, SearchModalTrigger } from "./_components/filter";

const ASIDE_LINKS = [
	{ title: "All", href: "/resources" },
	{ title: "Design", href: "/resources?category=design" },
	{ title: "Development", href: "/resources?category=development" },
	{ title: "Marketing", href: "/resources?category=marketing" },
	{ title: "Productivity", href: "/resources?category=productivity" },
];

const Page = () => {
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
						<Aside links={ASIDE_LINKS} />
						<div className="w-full">
							<div className="flex items-center justify-end gap-2">
								<SearchModalTrigger />
								<FilterModalTrigger />
							</div>
							<div className="mt-10 flex flex-wrap gap-6">
								{[1, 2, 3, 4, 5, 6].map((el) => (
									<ResourceCard key={el} />
								))}
							</div>
						</div>
					</Section>
				</Container>
				<FilterFormModal />
				<SearchFormModal />
			</Layout>
		</Suspense>
	);
};

export default Page;

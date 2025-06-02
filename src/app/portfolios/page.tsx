import Aside from "@/components/layouts/users/Aside";
import BannerContent from "@/components/layouts/users/BannerContent";
import BannerGradient from "@/components/layouts/users/BannerGradient";
import Layout from "@/components/layouts/users/Layout";
import Section from "@/components/layouts/Section";
import PortfolioCard from "@/components/layouts/cards/PortfolioCard";
import React, { Suspense } from "react";
import Container from "@/components/layouts/Container";
import EmptyDisplay from "@/components/layouts/EmptyDisplay";

const Portfolios = () => {
	return (
		<Layout>
			<Container>
				<BannerGradient classNames="w-full h-[8rem]" />

				<Section>
					<BannerContent
						title="Explore & Connect with Inspiring Creators"
						description={`Check out these incredible portfolios and connect with the creative minds behind them.`}
					/>
				</Section>

				<Section className="flex">
					<EmptyDisplay
						code="beta"
						title="Coming Soon!"
						description="We're currently in beta. The showcasing of amazing portfolios will be available soon. Stay tuned for more!"
						showButton={false}
					/>
					{/* <Aside
						links={[
							{ id: 1, title: "All", href: "/portfolios" },
							{
								id: 2,
								title: "Entry Level",
								href: "/portfolios?filter=entry level",
							},
							{
								id: 3,
								title: "Junior Level",
								href: "/portfolios?filter=junior level",
							},
							{
								id: 4,
								title: "Mid Level",
								href: "/portfolios?filter=mid level",
							},
							{
								id: 5,
								title: "Senior Level",
								href: "/portfolios?filter=senior level",
							},
						]}
					/>
					<div className="w-full">
						<div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:gap-6">
							{[1, 2, 3, 4, 5, 6].map((el) => (
								<PortfolioCard key={el} />
							))}
						</div>
					</div> */}
				</Section>
			</Container>
		</Layout>
	);
};

export default Portfolios;

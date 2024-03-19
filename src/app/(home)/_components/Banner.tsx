import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import BannerGradient from "@/components/layouts/users/BannerGradient";
import Section from "@/components/layouts/Section";
import BannerContent from "@/components/layouts/users/BannerContent";

const Banner = () => {
	return (
		<>
			<BannerGradient />
			<Section>
				<BannerContent
					title={`Collaborator: \n Simplifying Your Project.`}
					description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
					incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
					nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
					Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
					fugiat nulla pariatur."
				/>
			</Section>
		</>
	);
};

export default Banner;

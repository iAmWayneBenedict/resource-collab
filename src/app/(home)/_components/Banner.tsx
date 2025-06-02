"use client";

import React, { useRef } from "react";
import BannerGradient from "@/components/layouts/users/BannerGradient";
import Section from "@/components/layouts/Section";
import BannerContent from "@/components/layouts/users/BannerContent";
import { Button, Divider, Image, Link as HeroUILink } from "@heroui/react";
import StatsSection from "@/components/ui/stats-four";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	fadeInUp,
	fadeIn,
	staggerContainer,
} from "@/components/animations/scroll-animations";

const Banner = () => {
	return (
		<>
			<BannerGradient classNames="w-full h-[5rem]" />
			<Section>
				<motion.div
					initial="hidden"
					animate="visible"
					variants={fadeInUp}
				>
					<BannerContent
						title={`Collaborator: \n Simplifying Your Project.`}
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
						nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
						Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
						fugiat nulla pariatur."
						classNames={{
							title: "text-4xl md:text-5xl xl:text-6xl",
							description: "text-sm md:text-base",
						}}
					/>
				</motion.div>
				<motion.div
					className="mt-6 md:mt-10 flex flex-col md:flex-row md:h-10 space-y-4 md:space-y-0 md:space-x-4"
					initial="hidden"
					animate="visible"
					variants={staggerContainer}
				>
					<motion.div className="flex flex-col sm:flex-row gap-2" variants={fadeInUp}>
						<Button
							variant="solid"
							radius="full"
							className="bg-violet text-white w-full sm:w-auto"
							size="lg"
						>
							Get Started
						</Button>
						<Button variant="ghost" radius="full" size="lg" className="w-full sm:w-auto">
							Browse Resources
						</Button>
					</motion.div>
					<Divider orientation="horizontal" className="md:hidden" />
					<Divider orientation="vertical" className="hidden md:block" />
					<motion.div variants={fadeInUp} className="flex justify-center md:justify-start">
						<HeroUILink as={Link} showAnchorIcon href="#" size="sm">
							Get Extension
						</HeroUILink>
					</motion.div>
				</motion.div>
				<motion.div
					className="mt-5 text-xs text-center md:text-left"
					initial="hidden"
					animate="visible"
					variants={fadeInUp}
					transition={{ delay: 0.4 }}
				>
					<span>Developed by </span>
					<HeroUILink
						as={Link}
						href="https://iamwayne.vercel.app/"
						className="text-xs"
						underline="always"
						target="_blank"
					>
						iAmWayneBenedict
					</HeroUILink>
				</motion.div>
				<motion.div
					initial="hidden"
					animate="visible"
					variants={fadeIn}
					transition={{ delay: 0.6 }}
					className="mt-8 md:mt-14 rounded-xl bg-[#cccccc] text-center"
				>
					<div className="inline-block w-[90%] md:w-[75%]">
						<Image src="https://cdn.dribbble.com/userupload/43548764/file/original-6adc04137ce96e6d2898c83f291137c4.png?vertical=center" />
					</div>
				</motion.div>
				<StatsSection />
			</Section>
		</>
	);
};

export default Banner;

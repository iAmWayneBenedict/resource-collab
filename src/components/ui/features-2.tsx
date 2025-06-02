"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings2, Sparkles, Zap, Layers, Users, Shield } from "lucide-react";
import { ReactNode } from "react";
import { Badge } from "@heroui/react";
import { motion } from "framer-motion";
import {
	fadeInUp,
	staggerContainer,
} from "@/components/animations/scroll-animations";

const FEATURES = [
	{
		icon: <Zap className="size-6" aria-hidden />,
		title: "Customizable",
		badge: "Popular",
		description:
			"Extensive customization options, allowing you to tailor every aspect to meet your specific needs.",
	},
	{
		icon: <Settings2 className="size-6" aria-hidden />,
		title: "Full Control",
		description:
			"From design elements to functionality, you have complete control to create a unique and personalized experience.",
	},
	{
		icon: <Sparkles className="size-6" aria-hidden />,
		title: "Powered By AI",
		badge: "New",
		description:
			"Leverage cutting-edge AI to enhance productivity and automate repetitive tasks in your workflow.",
	},
	{
		icon: <Layers className="size-6" aria-hidden />,
		title: "Scalable Architecture",
		description:
			"Built on a robust foundation that grows with your needs, from small teams to enterprise-level organizations.",
	},
	{
		icon: <Users className="size-6" aria-hidden />,
		title: "Team Collaboration",
		description:
			"Seamless tools for team members to work together efficiently, share resources, and track progress in real-time.",
	},
	{
		icon: <Shield className="size-6" aria-hidden />,
		title: "Enterprise Security",
		description:
			"Advanced security features to protect your data and ensure compliance with industry standards and regulations.",
	},
];

export default function Features() {
	return (
		<section className="relative overflow-hidden py-16 md:py-32">
			{/* Background decorative elements */}
			<div className="absolute -left-20 top-20 h-40 w-40 rounded-full bg-violet/5 blur-3xl"></div>
			<div className="absolute -right-20 bottom-20 h-40 w-40 rounded-full bg-violet/5 blur-3xl"></div>

			<div className="@container relative z-10 mx-auto max-w-6xl px-6">
				<motion.div
					className="mx-auto max-w-3xl text-center"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={fadeInUp}
				>
					<Badge variant="flat" color="secondary" className="mb-4">
						Features
					</Badge>
					<h2 className="text-balance text-4xl font-semibold lg:text-5xl">
						Built to cover your needs
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Our platform provides comprehensive tools and features
						designed to streamline your workflow and enhance team
						productivity.
					</p>
				</motion.div>
				<motion.div
					className="mx-auto mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.1 }}
					variants={staggerContainer}
				>
					{FEATURES.map((feature, index) => (
						<motion.div key={index} variants={fadeInUp}>
							<Card className="group rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
								<CardHeader className="relative pb-3">
									{feature.badge && (
										<Badge
											color="primary"
											variant="flat"
											className="absolute right-4 top-4"
										>
											{feature.badge}
										</Badge>
									)}
									<CardDecorator>
										{feature.icon}
									</CardDecorator>
									<h3 className="mt-6 text-xl font-medium">
										{feature.title}
									</h3>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}

function CardDecorator({ children }: { children: ReactNode }) {
	return (
		<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet/10 text-violet transition-colors group-hover:bg-violet group-hover:text-white">
			{children}
		</div>
	);
}

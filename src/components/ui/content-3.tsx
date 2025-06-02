"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users, Code, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@heroui/react";
import { motion } from "framer-motion";
import {
	fadeInUp,
	fadeInLeft,
	fadeInRight,
} from "@/components/animations/scroll-animations";

export default function ContentSection() {
	return (
		<section className="relative overflow-hidden py-16 md:py-32">
			{/* Background decorative elements */}
			<div className="absolute right-0 top-1/4 h-64 w-64 rounded-full bg-violet/5 blur-3xl"></div>
			<div className="absolute bottom-1/4 left-0 h-64 w-64 rounded-full bg-violet/5 blur-3xl"></div>

			<div className="relative z-10 mx-auto max-w-7xl space-y-12 px-6 md:space-y-16">
				<motion.div
					className="mb-8 text-center"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={fadeInUp}
				>
					<Badge variant="flat" color="secondary" className="mb-4">
						Ecosystem
					</Badge>
					<h2 className="mb-4 text-3xl font-semibold md:text-4xl">
						Powerful Collaboration Platform
					</h2>
					<p className="mx-auto max-w-2xl text-muted-foreground">
						Discover how our integrated ecosystem can transform your
						workflow
					</p>
				</motion.div>

				<motion.div
					className="relative overflow-hidden rounded-2xl shadow-xl"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={fadeInUp}
				>
					<div className="absolute inset-0 z-10 bg-gradient-to-r from-violet/10 to-transparent"></div>
					<img
						className="h-auto w-full transform rounded-2xl object-cover transition-transform duration-700 ease-in-out hover:scale-105"
						src="https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=2747&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="Team collaboration"
						loading="lazy"
					/>
				</motion.div>

				<div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						variants={fadeInLeft}
					>
						<h2 className="text-3xl font-medium leading-tight md:text-4xl">
							The Collaborator ecosystem brings together teams,
							resources and platforms.
						</h2>
						<div className="mt-6 flex flex-col gap-4">
							<FeatureItem
								icon={<Users className="h-5 w-5" />}
								title="Team Collaboration"
							/>
							<FeatureItem
								icon={<Code className="h-5 w-5" />}
								title="Developer Friendly"
							/>
							<FeatureItem
								icon={<Zap className="h-5 w-5" />}
								title="Productivity Boost"
							/>
						</div>
					</motion.div>
					<motion.div
						className="space-y-6"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						variants={fadeInRight}
					>
						<p className="text-lg">
							Collaborator is evolving to be more than just a
							tool. It supports an entire ecosystem — from
							resource sharing to APIs and platforms helping
							developers and businesses innovate together.
						</p>

						<Button
							asChild
							variant="default"
							size="lg"
							className="mt-4 gap-2 bg-violet text-white hover:bg-violet/90"
						>
							<Link href="#">
								<span>Learn More</span>
								<ChevronRight className="h-4 w-4" />
							</Link>
						</Button>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

function FeatureItem({
	icon,
	title,
}: {
	icon: React.ReactNode;
	title: string;
}) {
	return (
		<div className="flex items-center gap-3">
			<div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet/10 text-violet">
				{icon}
			</div>
			<span className="font-medium">{title}</span>
		</div>
	);
}

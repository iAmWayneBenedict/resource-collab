"use client";

import { cn } from "@/lib/utils";
import { Badge, Chip } from "@heroui/react";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { VSCodium, MediaWiki, GooglePaLM } from "@/components/logos";
import { motion } from "framer-motion";
import {
	fadeInUp,
	staggerContainer,
} from "@/components/animations/scroll-animations";

export default function Integrations() {
	return (
		<section className="relative py-16 md:py-32">
			{/* Background decorative elements */}
			<div className="bg-grid-pattern pointer-events-none absolute left-0 top-0 h-full w-full opacity-5"></div>
			<div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-violet/5 blur-3xl"></div>

			<div className="relative z-10 mx-auto max-w-7xl space-y-12 px-6 md:space-y-16">
				<motion.div
					className="space-y-4 text-center"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={fadeInUp}
				>
					<Badge variant="flat" color="secondary" className="mb-2">
						Ecosystem
					</Badge>
					<h2 className="text-3xl font-semibold md:text-4xl">
						Powerful Integrations
					</h2>
					<p className="mx-auto mt-4 max-w-[700px] text-muted-foreground">
						Resource Collaborator integrates with your favorite
						tools and platforms, making it easy to incorporate into
						your existing workflow.
					</p>
				</motion.div>

				<motion.div
					className="grid gap-6 md:grid-cols-3 md:gap-8 lg:gap-12"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.1 }}
					variants={staggerContainer}
				>
					<motion.div variants={fadeInUp}>
						<IntegrationCard
							title="VSCodium"
							description="Seamless integration with VSCodium provides AI-powered code completion and assistance right in your editor."
							color="blue"
							feature="Popular"
						>
							<VSCodium className="size-14" />
						</IntegrationCard>
					</motion.div>

					<motion.div variants={fadeInUp}>
						<IntegrationCard
							title="MediaWiki"
							description="Enhance your MediaWiki installation with AI capabilities for content generation and organization."
							color="green"
							feature="Recommended"
						>
							<MediaWiki className="size-14" />
						</IntegrationCard>
					</motion.div>

					<motion.div variants={fadeInUp}>
						<IntegrationCard
							title="Google PaLM"
							description="Works with Google PaLM to provide enhanced language understanding and generation capabilities."
							color="violet"
							feature="AI-Powered"
						>
							<GooglePaLM className="size-14" />
						</IntegrationCard>
					</motion.div>
				</motion.div>

				<motion.div
					className="mt-8 flex justify-center"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={fadeInUp}
				>
					<Link
						href="#"
						className="inline-flex items-center gap-2 font-medium text-violet transition-colors hover:text-violet/90"
					>
						<Plus className="size-4" />
						<span>Request an integration</span>
						<ArrowRight className="size-4" />
					</Link>
				</motion.div>
			</div>
		</section>
	);
}

interface IntegrationCardProps {
	title: string;
	description: string;
	children: React.ReactNode;
	color?: "blue" | "green" | "violet" | "orange";
	feature?: string;
}

function IntegrationCard({
	title,
	description,
	children,
	color = "blue",
	feature,
}: IntegrationCardProps) {
	const colorClasses = {
		blue: "bg-blue-50 border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/50",
		green: "bg-green-50 border-green-100 dark:bg-green-950/30 dark:border-green-900/50",
		violet: "bg-violet-50 border-violet-100 dark:bg-violet-950/30 dark:border-violet-900/50",
		orange: "bg-orange-50 border-orange-100 dark:bg-orange-950/30 dark:border-orange-900/50",
	};

	const chipColors = {
		blue: "blue",
		green: "green",
		violet: "violet",
		orange: "orange",
	} as const;

	return (
		<div
			className={cn(
				"group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
				colorClasses[color],
			)}
		>
			{feature && (
				<div className="absolute right-4 top-4">
					<Chip
						size="sm"
						variant="flat"
						radius="full"
					>
						{feature}
					</Chip>
				</div>
			)}

			<div className="mb-4">{children}</div>

			<h3 className="mb-2 text-xl font-medium">{title}</h3>
			<p className="text-muted-foreground">{description}</p>
		</div>
	);
}

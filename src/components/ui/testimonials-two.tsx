"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@heroui/react";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
	fadeInUp,
	staggerContainer,
} from "@/components/animations/scroll-animations";

export default function TestimonialSection() {
	return (
		<section className="relative overflow-hidden py-16 md:py-32">
			{/* Background decorative elements */}
			<div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-violet/5 blur-3xl"></div>
			<div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-violet/5 blur-3xl"></div>

			<div className="relative z-10 mx-auto max-w-7xl space-y-12 px-6 md:space-y-16">
				<motion.div
					className="space-y-4 text-center"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={fadeInUp}
				>
					<Badge variant="flat" color="secondary" className="mb-2">
						Testimonials
					</Badge>
					<h2 className="text-3xl font-semibold md:text-4xl">
						What Our Users Say
					</h2>
					<p className="mx-auto mt-4 max-w-[700px] text-muted-foreground">
						Hear what our users have to say about their experience
						with Resource Collaborator.
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
						<TestimonialCard
							content="Resource Collaborator has completely transformed how I approach coding. The AI assistance is like having a senior developer by my side at all times."
							name="Jane Doe"
							role="Software Engineer"
							avatarSrc="https://i.pravatar.cc/150?img=1"
							avatarFallback="JD"
							color="blue"
						/>
					</motion.div>

					<motion.div variants={fadeInUp}>
						<TestimonialCard
							content="The integration with my existing tools is seamless. Resource Collaborator has become an essential part of my daily workflow."
							name="John Smith"
							role="Product Manager"
							avatarSrc="https://i.pravatar.cc/150?img=2"
							avatarFallback="JS"
							color="violet"
							featured={true}
						/>
					</motion.div>

					<motion.div variants={fadeInUp}>
						<TestimonialCard
							content="As a student, Resource Collaborator has been invaluable for learning and understanding complex programming concepts."
							name="Alex Johnson"
							role="Computer Science Student"
							avatarSrc="https://i.pravatar.cc/150?img=3"
							avatarFallback="AJ"
							color="green"
						/>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}

interface TestimonialCardProps {
	content: string;
	name: string;
	role: string;
	avatarSrc: string;
	avatarFallback: string;
	color?: "blue" | "green" | "violet" | "orange";
	featured?: boolean;
}

function TestimonialCard({
	content,
	name,
	role,
	avatarSrc,
	avatarFallback,
	color = "blue",
	featured = false,
}: TestimonialCardProps) {
	const colorClasses = {
		blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
		green: "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400",
		violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
		orange: "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400",
	};

	return (
		<Card
			className={cn(
				"h-full overflow-hidden transition-all duration-300 hover:shadow-md",
				featured ? "border-violet ring-1 ring-violet/20" : "",
			)}
		>
			<CardContent className="flex h-full flex-col p-6">
				<div className="flex-1 space-y-6">
					<div
						className={cn(
							"flex h-10 w-10 items-center justify-center rounded-full",
							colorClasses[color],
						)}
					>
						<Quote className="h-5 w-5" />
					</div>
					<p className="text-muted-foreground">{content}</p>
				</div>

				<div className="mt-6 flex items-center gap-3">
					<Avatar>
						<AvatarImage src={avatarSrc} alt={name} />
						<AvatarFallback>{avatarFallback}</AvatarFallback>
					</Avatar>
					<div>
						<p className="font-medium">{name}</p>
						<p className="text-sm text-muted-foreground">{role}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

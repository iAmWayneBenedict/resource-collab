"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import Link from "next/link";
import { Badge } from "@heroui/react";
import { HelpCircle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type FAQItem = {
	id: string;
	icon: IconName;
	question: string;
	answer: string;
	highlight?: boolean;
};

export default function FAQsThree() {
	const faqItems: FAQItem[] = [
		{
			id: "item-1",
			icon: "code",
			question: "What is Resource Collaborator and how does it work?",
			answer: "Resource Collaborator is an AI-powered platform that helps teams share and manage resources more efficiently. It works by analyzing your workflow and providing intelligent suggestions, automation, and organization tools as you collaborate.",
			highlight: true,
		},
		{
			id: "item-2",
			icon: "credit-card",
			question: "How do subscription payments work?",
			answer: "Subscription payments are automatically charged to your default payment method on the same day each month or year, depending on your billing cycle. You can update your payment information and view billing history in your account dashboard.",
		},
		{
			id: "item-3",
			icon: "shield",
			question: "Is my data secure when using Resource Collaborator?",
			answer: "Yes, we take security very seriously. Your data is encrypted in transit and at rest. We implement strict access controls and follow industry best practices for data protection. You can also use Resource Collaborator in a self-hosted environment for maximum security.",
			highlight: true,
		},
		{
			id: "item-4",
			icon: "globe",
			question: "Do you offer localized support?",
			answer: "We offer multilingual support in English, Spanish, French, German, and Japanese. Our support team can assist customers in these languages via email, chat, and phone during standard business hours for each respective region.",
		},
		{
			id: "item-5",
			icon: "puzzle",
			question: "Can I use Resource Collaborator with my existing tools?",
			answer: "Yes, Resource Collaborator integrates with popular tools like VSCode, Slack, Microsoft Teams, and more. It's designed to enhance your existing workflow rather than replace it, making collaboration seamless across your favorite platforms.",
			highlight: true,
		},
	];

	return (
		<section className="relative overflow-hidden py-20">
			{/* Background decorative elements */}
			<div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-violet/5 blur-3xl"></div>
			<div className="absolute bottom-1/3 left-1/4 h-72 w-72 rounded-full bg-violet/5 blur-3xl"></div>

			<div className="relative z-10 mx-auto max-w-7xl px-6">
				<div className="flex flex-col gap-10 md:flex-row md:gap-16">
					<div className="md:w-1/3">
						<div className="sticky top-20 space-y-4">
							<Badge
								variant="flat"
								color="secondary"
								className="mb-2"
							>
								Support
							</Badge>
							<h2 className="text-3xl font-semibold">
								Frequently Asked Questions
							</h2>
							<p className="text-muted-foreground">
								Find answers to common questions about Resource
								Collaborator and how it can help your workflow.
							</p>
							<div className="pt-4">
								<div className="flex items-center gap-2 text-muted-foreground">
									<HelpCircle className="size-4" />
									<p>Can't find what you're looking for?</p>
								</div>
								<Link
									href="#"
									className="mt-2 inline-flex items-center gap-2 font-medium text-violet transition-colors hover:text-violet/90"
								>
									<MessageSquare className="size-4" />
									Contact our support team
								</Link>
							</div>
						</div>
					</div>
					<div className="md:w-2/3">
						<Accordion
							type="single"
							collapsible
							className="w-full space-y-3"
						>
							{faqItems.map((item) => (
								<AccordionItem
									key={item.id}
									value={item.id}
									className={cn(
										"rounded-xl border bg-card px-4 shadow-sm transition-all duration-200 hover:shadow-md",
										item.highlight
											? "ring-1 ring-violet/20"
											: "",
									)}
								>
									<AccordionTrigger className="cursor-pointer items-center py-5 hover:text-violet hover:no-underline">
										<div className="flex items-center gap-3">
											<div
												className={cn(
													"flex size-8 items-center justify-center rounded-full",
													item.highlight
														? "bg-violet/10 text-violet"
														: "bg-muted text-muted-foreground",
												)}
											>
												<DynamicIcon
													name={item.icon}
													className="size-4"
												/>
											</div>
											<span className="text-base font-medium">
												{item.question}
											</span>
										</div>
									</AccordionTrigger>
									<AccordionContent className="pb-5">
										<div className="pl-11">
											<p className="leading-relaxed text-muted-foreground">
												{item.answer}
											</p>
										</div>
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>
			</div>
		</section>
	);
}

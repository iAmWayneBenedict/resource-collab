"use client";

import { Badge } from "@heroui/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function Card() {
	return (
		<div className="group relative flex flex-col gap-5 overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300 hover:shadow-md">
			{/* Top badge */}
			<Badge variant="flat" className="absolute right-4 top-4 z-10">
				Featured
			</Badge>

			{/* Decorative corner accent */}
			<div className="absolute right-0 top-0 h-24 w-24 -translate-y-12 translate-x-12 transform rounded-full bg-gradient-to-br from-transparent to-violet/10 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0"></div>

			{/* Image with overlay gradient */}
			<div className="relative h-48 w-full overflow-hidden rounded-lg">
				<div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 to-transparent"></div>
				<Image
					src="https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="Resource collaboration"
					fill
					className="transform object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
				/>

				{/* Rating indicator */}
				<div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
					<Star className="size-3 fill-yellow-400 text-yellow-400" />
					<span>4.9</span>
				</div>
			</div>

			<div className="flex-1 space-y-3">
				<h3 className="text-xl font-semibold">
					Collaborative Resources
				</h3>
				<p className="text-muted-foreground">
					Discover how our platform enables teams to share and manage
					resources efficiently with AI-powered assistance.
				</p>
			</div>

			<div className="pt-2">
				<Button
					asChild
					variant="outline"
					className="group w-full justify-between hover:border-violet hover:text-violet"
				>
					<Link href="#">
						<span>Learn more</span>
						<ArrowRight className="size-4 transform transition-transform group-hover:translate-x-1" />
					</Link>
				</Button>
			</div>
		</div>
	);
}

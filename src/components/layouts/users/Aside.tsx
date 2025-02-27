"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark } from "lucide-react";

type Props = {
	links: LinkType[];
};

type LinkType = {
	id: string | number;
	title: string;
	href: string;
};

const Aside: React.FC<Props> = ({ links }) => {
	const params = useSearchParams();
	const category = params.get("category") || "all";

	const activeStyle =
		"bg-black text-white hover:bg-black dark:hover:bg-white dark:bg-white dark:text-black";

	return (
		<aside
			className={cn(
				"hidden min-w-[15rem] pr-10 lg:flex 2xl:min-w-[18rem] 2xl:pr-16",
			)}
		>
			<ul className="flex w-full flex-col gap-1">
				<li className="mb-5 border-b border-neutral-400 pb-5 dark:border-neutral-500">
					<Link
						href={`${links[0].href}?category=bookmark`}
						scroll={false}
					>
						<Badge
							variant={"secondary"}
							className={cn(
								category === "bookmark" ? activeStyle : "",
								"flex items-center gap-2",
							)}
						>
							<Bookmark className="transition-none" />{" "}
							<span>Bookmark</span>
						</Badge>
					</Link>
				</li>
				{links.map((link, index) => (
					<li key={index}>
						<Link href={link.href} scroll={false}>
							<Badge
								variant={"secondary"}
								className={cn(
									category == link.id ? activeStyle : "",
								)}
							>
								{link.title}
							</Badge>
						</Link>
					</li>
				))}
			</ul>
		</aside>
	);
};

export default Aside;

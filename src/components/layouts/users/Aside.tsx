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
	title: string;
	href: string;
};

/**
 * Aside component is used to display the left side of the layout and its links.
 * @param {Object} props - The props object.
 * @param {LinkType[]} props.links - An array of LinkType objects representing the links to be displayed.
 * @returns {*} React element.
 */
const Aside: React.FC<Props> = ({ links }) => {
	const params = useSearchParams();
	const category = params.get("category") || "all";
	const activeStyle =
		"bg-black text-white hover:bg-black dark:hover:bg-white dark:bg-white dark:text-black";

	return (
		<aside className={cn("hidden lg:flex min-w-[15rem] 2xl:min-w-[18rem] pr-10 2xl:pr-16")}>
			<ul className="flex flex-col gap-1 w-full">
				<li className="mb-5 pb-5 border-b border-neutral-400 dark:border-neutral-500">
					<Link href={`${links[0].href}?category=bookmark`} scroll={false}>
						<Badge
							variant={"secondary"}
							className={cn(
								category === "bookmark" ? activeStyle : "",
								"flex items-center gap-2"
							)}
						>
							<Bookmark className="transition-none" /> <span>Bookmark</span>
						</Badge>
					</Link>
				</li>
				{links.map((link, index) => (
					<li key={index}>
						<Link href={link.href} scroll={false}>
							<Badge
								variant={"secondary"}
								className={cn(
									category === link.title.toLocaleLowerCase() ? activeStyle : ""
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

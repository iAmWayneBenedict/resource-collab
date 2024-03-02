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

const Aside: React.FC<Props> = ({ links }) => {
	const params = useSearchParams();
	const filter = params.get("filter") || "all";
	const activeStyle =
		"bg-black text-white hover:bg-black dark:hover:bg-white dark:bg-white dark:text-black";

	return (
		<aside className={cn("min-w-[18rem] pr-16")}>
			<ul className="flex flex-col gap-1">
				<li className="mb-5 pb-5 border-b border-neutral-400 dark:border-neutral-500">
					<Link href={"/resources?filter=bookmark"}>
						<Badge
							variant={"secondary"}
							className={cn(
								"w-full py-3 ps-5 cursor-pointer flex gap-2 bg-background-body hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-none",
								filter === "bookmark" ? activeStyle : ""
							)}
						>
							<Bookmark className="transition-none" /> <span>Bookmark</span>
						</Badge>
					</Link>
				</li>
				{links.map((link, index) => (
					<li key={index}>
						<Link href={link.href}>
							<Badge
								variant={"secondary"}
								className={cn(
									"w-full py-3 ps-5 cursor-pointer bg-background-body hover:bg-neutral-200 dark:hover:bg-neutral-800",
									filter === link.title.toLocaleLowerCase() ? activeStyle : ""
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

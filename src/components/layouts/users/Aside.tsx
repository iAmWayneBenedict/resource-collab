"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark } from "lucide-react";
import { useAuthUser, useModal } from "@/store";
import { Button } from "@heroui/react";

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
	const { authUser } = useAuthUser();
	const onOpenModal = useModal((state) => state.onOpen);

	const activeStyle =
		"bg-black text-white hover:bg-black dark:hover:bg-white dark:bg-white dark:text-black";

	return (
		<aside
			className={cn(
				"hidden min-w-[15rem] pr-10 lg:flex 2xl:min-w-[18rem] 2xl:pr-16",
			)}
		>
			<ul className="flex w-full flex-col gap-1">
				{!authUser && (
					<li className="mb-5 border-b border-neutral-400 pb-5 dark:border-neutral-500">
						<Button
							onPress={() => onOpenModal("auth-modal", {})}
							variant="light"
							radius="full"
							className="w-full justify-start py-7 text-left text-base font-medium"
							startContent={
								<Bookmark className="transition-none" />
							}
						>
							Bookmark
						</Button>
					</li>
				)}
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

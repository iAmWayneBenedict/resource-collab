"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

const navItems = [
	{ label: "Profile", icon: "heroicons:user-circle", page: "profile" },
	{
		label: "Subscription",
		icon: "heroicons:credit-card",
		page: "subscription",
	},
	{ label: "Account", icon: "heroicons:cog-6-tooth", page: "account" },
];

export const DashboardSideNavigation = ({ page }: { page: string }) => {
	const router = useRouter();
	return (
		<aside className="h-full w-64 border-r border-divider p-4">
			<nav className="flex flex-col gap-2">
				{navItems.map((item) => (
					<Button
						key={item.page}
						variant={page === item.page ? "solid" : "light"}
						color={page === item.page ? "primary" : "default"}
						className="justify-start py-5"
						startContent={<Icon icon={item.icon} width={20} />}
						onPress={() => router.push(`/${item.page}`)}
						radius="full"
					>
						{item.label}
					</Button>
				))}
			</nav>
		</aside>
	);
};

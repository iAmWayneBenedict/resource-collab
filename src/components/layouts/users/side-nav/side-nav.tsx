"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { NavigationItem, settingsNavItems } from "@/lib/navigation";

export const DashboardSideNavigation = ({ page }: { page: string }) => {
	const router = useRouter();

	const renderNavItem = (item: NavigationItem) => {
		const IconComponent = typeof item.icon === "string" ? null : item.icon;
		return (
			<Button
				key={item.page}
				variant={page === item.page ? "solid" : "light"}
				color={page === item.page ? "primary" : "default"}
				className="justify-start py-5"
				startContent={
					IconComponent ? (
						<IconComponent size={20} />
					) : (
						<Icon icon={item.icon as string} width={20} />
					)
				}
				onPress={() => router.push(item.href || `/${item.page}`)}
				radius="full"
			>
				{item.label}
			</Button>
		);
	};

	return (
		<aside className="hidden h-full w-64 border-r border-divider p-4 md:block">
			<nav className="flex flex-col gap-2">
				{settingsNavItems.map(renderNavItem)}
			</nav>
		</aside>
	);
};

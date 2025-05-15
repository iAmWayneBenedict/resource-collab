import {
	GalleryVerticalEnd,
	Box,
	Repeat,
	User,
	CreditCard,
	Cog,
} from "lucide-react";

export type NavigationItem = {
	label: string;
	icon: string | React.ElementType;
	page: string;
	href?: string;
};

export type NavigationSection = {
	title: string;
	items: NavigationItem[];
};

export const dashboardNavItems: NavigationItem[] = [
	{
		label: "My Resources",
		icon: GalleryVerticalEnd,
		page: "resources",
		href: "/dashboard?page=resources",
	},
	{
		label: "My Collection",
		icon: Box,
		page: "collections",
		href: "/dashboard?page=collections&tab=resources",
	},
	{
		label: "Shared Collection",
		icon: Repeat,
		page: "shared",
		href: "/dashboard?page=shared&tab=resources",
	},
];

export const settingsNavItems: NavigationItem[] = [
	{
		label: "Profile",
		icon: User,
		page: "profile",
		href: "/profile",
	},
	{
		label: "Subscription",
		icon: CreditCard,
		page: "subscription",
		href: "/subscription",
	},
	{
		label: "Account",
		icon: Cog,
		page: "account",
		href: "/account",
	},
];

export const navSections: NavigationSection[] = [
	{ title: "Dashboard", items: dashboardNavItems },
	{ title: "Settings", items: settingsNavItems },
];

"use client";

import { Tooltip, Button } from "@heroui/react";
import {
	LayoutDashboard,
	Users,
	GalleryVerticalEnd,
	Archive,
	AlignStartVertical,
	User,
	Cog,
	MessageSquare,
	Bell,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const DASHBOARD_LINKS = [
	{ name: "Dashboard", link: "/admin/dashboard", icon: <LayoutDashboard /> },
	{ name: "Statistics", link: "/admin/statistics", icon: <AlignStartVertical /> },
	{ name: "Users", link: "/admin/users", icon: <Users /> },
	{ name: "Resources", link: "/admin/resources", icon: <GalleryVerticalEnd /> },
	{ name: "Portfolios", link: "/admin/portfolios", icon: <Archive /> },
	{ name: "Requests", link: "/admin/requests", icon: <MessageSquare /> },
	{ name: "Notifications", link: "/admin/notifications", icon: <Bell /> },
];

const SideNav = () => {
	const pathname = usePathname();

	return (
		<div className="flex flex-col max-w-[5rem] gap-5 items-center w-full h-[calc(100vh-5rem)] fixed">
			<div id="logo-container">
				<div className="flex items-center">
					<Link href="/" className="flex items-center">
						<span className="text-xl font-bold">RCo.</span>
					</Link>
				</div>
			</div>

			<div className="flex flex-col w-full h-full gap-3 justify-between">
				<div className="flex flex-col rounded-[9999px] bg-white p-2 gap-3 w-full shadow-md">
					{DASHBOARD_LINKS.map(({ name, link, icon }) => (
						<div key={name}>
							<Tooltip content={name} placement="right" showArrow>
								<Button
									as={Link}
									href={link}
									className="w-full h-[4rem] rounded-full"
									variant={pathname.includes(link) ? "solid" : "light"}
									color={pathname.includes(link) ? "primary" : "default"}
									isIconOnly
								>
									{icon}
								</Button>
							</Tooltip>
						</div>
					))}
				</div>
				<div className="flex flex-col rounded-[9999px] bg-white p-2 gap-3 w-full shadow-md">
					<div className="">
						<Button
							as={Link}
							href="/admin/dashboard"
							className="w-full h-[4rem] rounded-full"
							variant="light"
							isIconOnly
						>
							<Cog />
						</Button>
					</div>
					<div className="">
						<Button
							as={Link}
							href="/admin/dashboard"
							className="w-full h-[4rem] rounded-full bg-violet text-white"
							variant="solid"
							isIconOnly
						>
							<User />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SideNav;

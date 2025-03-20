/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

import { useAuthUser } from "@/store/useAuthUser";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
	Button,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Avatar,
} from "@heroui/react";
import { authClient } from "@/config/auth";
import { usePathname } from "next/navigation";

const NavBar = () => {
	return (
		<div className="fixed left-1/2 top-[30px] z-50 flex w-[95%] -translate-x-1/2 items-center justify-between rounded-full bg-blur-background shadow-lg backdrop-blur-md dark:border dark:border-zinc-950 dark:bg-zinc-950/90 dark:shadow-black/50 dark:backdrop-blur-sm md:w-[90%]">
			<LargeNav />
		</div>
	);
};

export default NavBar;

const NavLinkStyleWrapper = ({
	name,
	children,
	className = "",
	position = "bottom",
	type = "bar",
}: {
	name: string;
	children: React.ReactNode;
	className?: string;
	position?: string;
	type?: string;
}) => {
	const pathname = usePathname();
	const activeStyle = "after:opacity-100 opacity-100 after:w-1/2";
	const isHomePath = name == "home" && pathname == "/";
	const afterPseudoPosition =
		position === "bottom"
			? "after:-bottom-2 after:left-1/2 after:w-0"
			: "after:-right-[100%] after:top-1/2 after:-translate-y-1/2";
	const pseudoType =
		type === "bar" ? "after:h-[3px] after:w-0" : "after:h-2 after:w-2";

	return (
		<div
			className={cn(
				"relative w-fit text-sm font-medium capitalize opacity-75 duration-200 after:absolute after:-translate-x-1/2 after:rounded-full after:bg-violet after:opacity-0 after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:opacity-100 hover:after:w-1/2 hover:after:opacity-100",
				afterPseudoPosition,
				pseudoType,
				className,
				pathname.includes(name) || isHomePath ? activeStyle : "",
			)}
		>
			{children}
		</div>
	);
};

const NAV_LINKS = [
	{
		name: "home",
		link: "/",
	},
	{
		name: "resources",
		link: "/resources",
	},
	{
		name: "portfolios",
		link: "/portfolios",
	},
	{
		name: "about",
		link: "/about",
	},
	{
		name: "contact",
		link: "/contact",
	},
	{
		name: "admin",
		link: "/admin/dashboard",
	},
];

const LargeNav = () => {
	const { authUser } = useAuthUser();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuItems = [
		"Profile",
		"Dashboard",
		"Activity",
		"Analytics",
		"System",
		"Deployments",
		"My Settings",
		"Team Settings",
		"Help & Feedback",
		"Log Out",
	];
	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					location.href = "/";
				},
			},
		});
	};
	return (
		<React.Fragment>
			<Navbar
				onMenuOpenChange={setIsMenuOpen}
				className="rounded-full bg-transparent"
				classNames={{ wrapper: "max-w-full px-10" }}
			>
				<NavbarContent>
					<NavbarBrand>
						<div className="flex items-center">
							<Link href="/" className="flex items-center">
								<span className="text-xl font-bold">RCo.</span>
							</Link>
						</div>
					</NavbarBrand>
				</NavbarContent>

				<NavbarContent
					className="hidden ~gap-4/8 md:flex"
					justify="center"
				>
					{NAV_LINKS.map(({ name, link }) => {
						if (name == "admin" && authUser?.role !== "admin")
							return null;
						return (
							<NavbarItem key={name}>
								<Link href={link}>
									<NavLinkStyleWrapper name={name}>
										{name}
									</NavLinkStyleWrapper>
								</Link>
							</NavbarItem>
						);
					})}
				</NavbarContent>
				<NavbarContent justify="end">
					{!authUser ? (
						<>
							<NavbarItem className="hidden lg:flex">
								<Link href="/auth/login">Login</Link>
							</NavbarItem>
							<NavbarItem>
								<Button
									as={Link}
									color="primary"
									href="/auth/signup"
									variant="flat"
									radius="full"
									className="bg-violet text-white"
								>
									Sign Up
								</Button>
							</NavbarItem>
						</>
					) : (
						<Dropdown placement="bottom-end">
							<DropdownTrigger>
								<Avatar
									isBordered
									as="button"
									className="transition-transform"
									name="Jason Hughes"
									size="sm"
									src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
								/>
							</DropdownTrigger>
							<DropdownMenu
								aria-label="Profile Actions"
								variant="flat"
							>
								<DropdownItem
									key="profile"
									className="h-14 gap-2"
								>
									<p className="font-semibold">
										Signed in as
									</p>
									<p className="font-semibold">
										zoey@example.com
									</p>
								</DropdownItem>
								<DropdownItem key="settings">
									My Settings
								</DropdownItem>
								<DropdownItem key="team_settings">
									Team Settings
								</DropdownItem>
								<DropdownItem key="analytics">
									Analytics
								</DropdownItem>
								<DropdownItem key="system">System</DropdownItem>
								<DropdownItem key="configurations">
									Configurations
								</DropdownItem>
								<DropdownItem key="help_and_feedback">
									Help & Feedback
								</DropdownItem>
								<DropdownItem
									key="logout"
									color="danger"
									onPress={handleLogout}
								>
									Log Out
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					)}
					<NavbarMenuToggle
						aria-label={isMenuOpen ? "Close menu" : "Open menu"}
						className="md:hidden"
					/>
				</NavbarContent>
				<NavbarMenu className="gap-4 pt-14">
					{NAV_LINKS.map((item, index) => (
						<NavbarMenuItem key={`${item}-${index}`}>
							<Link
								className="w-full capitalize"
								color={
									index === 2
										? "primary"
										: index === menuItems.length - 1
											? "danger"
											: "foreground"
								}
								href={item.link}
								prefetch={true}
							>
								<NavLinkStyleWrapper
									name={item.name}
									className="text-base"
									position="right"
									// type="dot"
								>
									{item.name}
								</NavLinkStyleWrapper>
							</Link>
						</NavbarMenuItem>
					))}
				</NavbarMenu>
			</Navbar>
		</React.Fragment>
	);
};

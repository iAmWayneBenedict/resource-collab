/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet";

// import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import ProfileDropDown from "./Nav/ProfileDropDown";
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
} from "@heroui/react";

const NavBar = () => {
	return (
		<div className="fixed left-1/2 top-[30px] z-50 flex w-[95%] -translate-x-1/2 items-center justify-between rounded-full bg-blur-background shadow-lg backdrop-blur-md dark:border dark:border-zinc-950 dark:bg-zinc-950/90 dark:shadow-black/50 dark:backdrop-blur-sm md:w-[90%]">
			{/* <div id="nav-left" style={{ flex: 1 }} className="flex">
				<div className="flex items-center">
					<Link href="/" className="flex items-center">
						<span className="text-xl font-bold">RCo.</span>
					</Link>
				</div>
			</div>
			<SmallNav /> */}
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

const SmallNav = () => {
	return (
		<div className="flex lg:hidden">
			<Sheet>
				<SheetTrigger>
					<div
						className="flex h-[12px] w-[30px] cursor-pointer flex-col justify-between"
						id="hamburger"
					>
						<div className="h-[1px] w-full bg-black dark:bg-white"></div>
						<div className="h-[1px] w-full bg-black dark:bg-white"></div>
					</div>
				</SheetTrigger>
				<SheetContent
					className={cn(
						"w-full max-w-none dark:border-zinc-950 dark:bg-zinc-950 sm:max-w-none",
					)}
				>
					<SheetHeader>
						{/* <SheetTitle>Are you absolutely sure?</SheetTitle> */}
						<SheetDescription>
							This action cannot be undone. This will permanently
							delete your account and remove your data from our
							servers.
						</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
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
			{/* <div style={{ flex: 1 }} className="hidden justify-center lg:flex">
				<NavigationMenu>
					<NavigationMenuList>
						{NAV_LINKS.map(({ name, link }) => {
							if (name == "admin" && authUser?.role !== "admin")
								return null;
							return (
								<NavigationMenuItem key={name}>
									<Link href={link} legacyBehavior passHref>
										<NavigationMenuLink
											className={cn(
												navigationMenuTriggerStyle(),
												"bg-transparent hover:bg-transparent focus:bg-transparent",
											)}
										>
											<NavLinkStyleWrapper
												name={name}
												className="capitalize"
											>
												{name}
											</NavLinkStyleWrapper>
										</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>
							);
						})}
					</NavigationMenuList>
				</NavigationMenu>
			</div>
			<div
				style={{ flex: 1 }}
				className="hidden items-center justify-end gap-3 lg:flex"
			>
				{!authUser && (
					<>
						<Link href="/auth/signup" passHref>
							Sign up
						</Link>
						<Button
							asChild
							className={cn(
								"rounded-full bg-violet px-7 hover:bg-violet-foreground",
							)}
						>
							<Link href="/auth/login" passHref>
								Login
							</Link>
						</Button>
					</>
				)}
				{authUser && <ProfileDropDown />}
			</div> */}
		</React.Fragment>
	);
};

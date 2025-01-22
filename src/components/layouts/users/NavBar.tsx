/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import React from "react";
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

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import ProfileDropDown from "./Nav/ProfileDropDown";
import { useAuthUser } from "@/store/useAuthUser";

const NavBar = () => {
	return (
		<div className="fixed top-[30px] left-1/2 -translate-x-1/2 w-[90%] flex justify-between items-center bg-blur-background py-4 px-10 rounded-full shadow-lg backdrop-blur-md z-50">
			<div id="nav-left" style={{ flex: 1 }} className="flex">
				<div className="flex items-center">
					<Link href="/" className="flex items-center">
						<span className="text-xl font-bold">RCo.</span>
					</Link>
				</div>
			</div>
			<LargeNav />
			<SmallNav />
		</div>
	);
};

export default NavBar;

const NavLinkStyleWrapper = ({
	name,
	children,
	className = "",
}: {
	name: string;
	children: React.ReactNode;
	className?: string;
}) => {
	const pathname = usePathname();
	const activeStyle = "after:opacity-100 opacity-100";
	const isHomePath = name == "home" && pathname == "/";
	return (
		<div
			className={cn(
				"relative opacity-75 hover:opacity-100 after:opacity-0 after:absolute after:content-[''] after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-violet",
				className,
				pathname.includes(name) || isHomePath ? activeStyle : ""
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
						className="w-[30px] h-[12px] flex flex-col justify-between cursor-pointer"
						id="hamburger"
					>
						<div className="h-[1px] w-full bg-black dark:bg-white"></div>
						<div className="h-[1px] w-full bg-black dark:bg-white"></div>
					</div>
				</SheetTrigger>
				<SheetContent className={cn("w-full max-w-none sm:max-w-none")}>
					<SheetHeader>
						{/* <SheetTitle>Are you absolutely sure?</SheetTitle> */}
						<SheetDescription>
							This action cannot be undone. This will permanently delete your account
							and remove your data from our servers.
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
	console.log(authUser);
	return (
		<React.Fragment>
			<div style={{ flex: 1 }} className="hidden lg:flex justify-center">
				<NavigationMenu>
					<NavigationMenuList>
						{NAV_LINKS.map(({ name, link }) => {
							if (name == "admin" && authUser?.role !== "admin") return null;
							return (
								<NavigationMenuItem key={name}>
									<Link href={link} legacyBehavior passHref>
										<NavigationMenuLink
											className={cn(
												navigationMenuTriggerStyle(),
												"bg-transparent hover:bg-transparent focus:bg-transparent"
											)}
										>
											<NavLinkStyleWrapper name={name} className="capitalize">
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
			<div style={{ flex: 1 }} className="items-center justify-end hidden gap-3 lg:flex">
				{!authUser && (
					<>
						<Link href="/auth/signup" passHref>
							Sign up
						</Link>
						<Button
							asChild
							className={cn("rounded-full px-7 bg-violet hover:bg-violet-foreground")}
						>
							<Link href="/auth/login" passHref>
								Login
							</Link>
						</Button>
					</>
				)}
				{authUser && <ProfileDropDown />}
			</div>
		</React.Fragment>
	);
};

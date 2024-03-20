/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
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
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import useElementSize from "@/hooks/useElementSize";
import { usePathname } from "next/navigation";

const NavBar = () => {
	const rightNavRef = useRef<HTMLDivElement>(null);
	const { size, setObserveElement } = useElementSize();

	useEffect(() => {
		if (rightNavRef.current) setObserveElement(rightNavRef.current);
	}, []);
	console.log(process.env.NEXT_PUBLIC_DC);
	return (
		<div className="fixed top-[30px] left-1/2 -translate-x-1/2 w-[90%] flex justify-between items-center bg-blur-background py-4 px-10 rounded-full shadow-lg backdrop-blur-md z-50">
			<div
				id="nav-left"
				style={{
					width: `${size.width}px`,
				}}
				className="flex"
			>
				<div className="flex items-center">
					<Link href="/" className="flex items-center">
						<span className="text-xl font-bold">Co.</span>
					</Link>
				</div>
			</div>
			<LargeNav size={size} rightNavRef={rightNavRef} />
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
	const activeStyle = "after:opacity-100";
	return (
		<div
			className={cn(
				"relative after:opacity-0 after:absolute after:content-[''] after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-violet",
				className,
				pathname.includes(name) || (name == "home" && pathname == "/") ? activeStyle : ""
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

const LargeNav = ({
	size,
	rightNavRef,
}: {
	size: { width: number; height: number };
	rightNavRef: React.RefObject<HTMLDivElement>;
}) => {
	return (
		<>
			{size.width > 0 && (
				<div className="hidden lg:flex">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link href="/" legacyBehavior passHref>
									<NavigationMenuLink
										className={cn(
											navigationMenuTriggerStyle(),
											"bg-transparent hover:bg-transparent focus:bg-transparent"
										)}
									>
										<NavLinkStyleWrapper name="home">Home</NavLinkStyleWrapper>
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/resources" legacyBehavior passHref>
									<NavigationMenuLink
										className={cn(
											navigationMenuTriggerStyle(),
											"bg-transparent hover:bg-transparent focus:bg-transparent"
										)}
									>
										<NavLinkStyleWrapper name="resources">
											Resources
										</NavLinkStyleWrapper>
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/portfolios" legacyBehavior passHref>
									<NavigationMenuLink
										className={cn(
											navigationMenuTriggerStyle(),
											"bg-transparent hover:bg-transparent focus:bg-transparent"
										)}
									>
										<NavLinkStyleWrapper name="portfolios">
											Portfolios
										</NavLinkStyleWrapper>
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/docs" legacyBehavior passHref>
									<NavigationMenuLink
										className={cn(
											navigationMenuTriggerStyle(),
											"bg-transparent hover:bg-transparent focus:bg-transparent"
										)}
									>
										<NavLinkStyleWrapper name="about">
											About
										</NavLinkStyleWrapper>
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/contact" legacyBehavior passHref>
									<NavigationMenuLink
										className={cn(
											navigationMenuTriggerStyle(),
											"bg-transparent hover:bg-transparent focus:bg-transparent"
										)}
									>
										<NavLinkStyleWrapper name="contact">
											Contact
										</NavLinkStyleWrapper>
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
			)}
			<div ref={rightNavRef} className="hidden lg:flex items-center gap-3">
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
			</div>
		</>
	);
};

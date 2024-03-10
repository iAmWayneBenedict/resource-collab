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
import { Button } from "@/components/ui/button";
import useElementSize from "@/hooks/useElementSize";
import { usePathname } from "next/navigation";

const NavBar = () => {
	const rightNavRef = useRef<HTMLDivElement>(null);
	const { size, setObserveElement } = useElementSize();

	useEffect(() => {
		if (rightNavRef.current) setObserveElement(rightNavRef.current);
	}, []);

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
			{size.width > 0 && (
				<div>
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
			<div ref={rightNavRef} className="flex items-center gap-3">
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

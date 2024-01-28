"use client";

import Image from "next/image";
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
import { Button } from "@/components/ui/button";

const NavBar = () => {
	return (
		<div className="fixed top-[30px] left-1/2 -translate-x-1/2 w-[90%] flex justify-between items-center bg-blur-background py-4 px-10 rounded-full shadow-lg backdrop-blur-md z-50">
			<div id="nav-left" className="flex">
				<div className="flex items-center">
					<a href="/" className="flex items-center">
						<Image
							src="/favicon.ico"
							alt="Logo"
							width={32}
							height={32}
							className="h-8 mr-2"
						/>
						<span className="text-xl font-bold">Next.js</span>
					</a>
				</div>
			</div>
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
									Home
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
									Resource
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
									About
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
									Contact
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>
			<div className="flex items-center gap-3">
				<Link href="/docs/getting-started" passHref>
					Sign up
				</Link>
				<Button asChild className={cn("rounded-full px-7")}>
					<Link href="/docs/getting-started" passHref>
						Login
					</Link>
				</Button>
			</div>
		</div>
	);
};

export default NavBar;

/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import React, { JSX, useLayoutEffect, useState } from "react";
import { cn, toggleScrollBody } from "@/lib/utils";
import { Icon } from "@iconify/react";
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
	Image,
	DropdownSection,
	addToast,
} from "@heroui/react";
import { authClient } from "@/config/auth";
import { usePathname, useRouter } from "next/navigation";
import { favicon } from "../../../../public/assets";
import { useTheme } from "next-themes";
import { LogOut, Moon, Sun } from "lucide-react";
import { navSections } from "@/lib/navigation";

const NavBar = () => {
	return (
		<div className="flex w-full justify-center">
			<div className="z-50 flex w-[95%] items-center justify-between rounded-full bg-blur-background shadow-lg backdrop-blur-md dark:border dark:border-zinc-950 dark:bg-zinc-950/90 dark:shadow-black/50 dark:backdrop-blur-sm xl:w-[90%]">
				<LargeNav />
			</div>
		</div>
	);
};

const AFTER_PSEUDO_POSITION = {
	bottom: "after:-bottom-2 after:left-1/2 after:w-0",
	right: "after:-right-[100%] after:top-1/2 after:-translate-y-1/2",
};

const PSEUDO_TYPE = {
	bar: "after:h-[3px] md:after:h-1.5 after:w-0",
	dot: "after:h-2 after:w-2",
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
	position?: "bottom" | "right";
	type?: "bar" | "dot";
}) => {
	const pathname = usePathname();
	const activeStyle =
		"after:opacity-100 opacity-100 after:w-1/2 md:after:w-1.5";
	const isHomePath = name == "home" && pathname == "/";

	return (
		<div
			className={cn(
				"relative w-fit text-sm font-medium capitalize opacity-75 duration-200 after:absolute after:-translate-x-1/2 after:rounded-full after:bg-violet after:opacity-0 after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:opacity-100 hover:after:w-1/2 hover:after:opacity-100 md:hover:after:w-1.5",
				AFTER_PSEUDO_POSITION[position],
				PSEUDO_TYPE[type],
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
	const { authUser, setAuthUser } = useAuthUser();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const router = useRouter();

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					setAuthUser(null);
					addToast({
						title: "Success",
						description: "Logout successfully",
						color: "success",
					});
					router.push("/");
				},
				onError: (err) => {
					console.log(err);
					addToast({
						title: "Error",
						description: "Something went wrong",
						color: "danger",
					});
				},
			},
		});
	};

	useLayoutEffect(() => {
		toggleScrollBody(false);
	}, []);

	const onMenuOpenChange = (isOpen: boolean) => {
		if (isOpen) toggleScrollBody(true);
		else toggleScrollBody(false);
		setIsMenuOpen(isOpen);
	};

	return (
		<React.Fragment>
			<Navbar
				onMenuOpenChange={onMenuOpenChange}
				className="rounded-full bg-transparent"
				classNames={{
					wrapper: "max-w-full px-6 md:px-10",
				}}
			>
				<NavbarContent>
					<NavbarBrand>
						<div className="flex items-center">
							<Link href="/" className="flex items-center gap-2">
								<Image
									src={favicon.src}
									className="aspect-auto w-10"
									disableSkeleton
									disableAnimation
								/>
								<span className="hidden font-PlayFairDisplay text-lg font-black uppercase sm:flex">
									Coollabs
								</span>
							</Link>
						</div>
					</NavbarBrand>
				</NavbarContent>

				<NavbarContent
					className="hidden ~gap-4/8 md:flex"
					justify="center"
				>
					{NAV_LINKS.map(({ name, link }) => {
						if (name == "admin") return null;
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
				<NavbarContent justify="end" className="gap-2">
					<Button
						onPress={() =>
							setTheme(theme == "light" ? "dark" : "light")
						}
						variant="light"
						disableRipple
						isIconOnly
						size="sm"
						className="mr-2"
					>
						<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						<span className="sr-only">Toggle theme</span>
					</Button>
					{!authUser ? (
						<>
							<NavbarItem className="hidden lg:flex">
								<Button
									as={Link}
									color="default"
									href="/auth/login"
									variant="light"
									radius="full"
									className="min-w-0 px-2 data-[hover=true]:bg-transparent"
								>
									Login
								</Button>
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
						<Dropdown placement="bottom-end" backdrop="blur">
							<DropdownTrigger className="flex-row-reverse">
								<Avatar
									as="button"
									name={authUser.name}
									src={authUser.image}
									className="transition-transform"
									isBordered
									size="sm"
									imgProps={{
										loading: "eager",
									}}
								/>
							</DropdownTrigger>
							<DropdownMenu
								aria-label="Profile Actions"
								variant="flat"
							>
								<DropdownItem
									key="profile"
									className="h-14 cursor-default gap-2 hover:bg-transparent data-[hover=true]:bg-transparent"
									isReadOnly
								>
									<p className="font-semibold">
										Signed in as
									</p>
									<p className="font-semibold">
										{authUser.email}
									</p>
								</DropdownItem>
								{authUser.role === "admin" ? (
									<DropdownSection title="Management">
										<DropdownItem
											key="admin-dashboard"
											href="/admin/dashboard"
										>
											Admin Dashboard
										</DropdownItem>
									</DropdownSection>
								) : null}

								{/* Dashboard Navigation */}
								<DropdownSection
									key={navSections[0].title}
									title={navSections[0].title}
								>
									{navSections[0].items.map((item) => {
										const IconComponent =
											typeof item.icon === "string"
												? null
												: item.icon;
										return (
											<DropdownItem
												key={item.page}
												as={Link}
												href={
													item.href || `/${item.page}`
												}
												startContent={
													IconComponent ? (
														<IconComponent
															size={16}
														/>
													) : (
														<Icon
															icon={
																item.icon as string
															}
															width={16}
														/>
													)
												}
											>
												{item.label}
											</DropdownItem>
										);
									})}
								</DropdownSection>

								{/* Settings Navigation */}
								<DropdownSection
									key={navSections[1].title}
									title={navSections[1].title}
								>
									{navSections[1].items.map((item) => {
										const IconComponent =
											typeof item.icon === "string"
												? null
												: item.icon;
										return (
											<DropdownItem
												key={item.page}
												as={Link}
												href={
													item.href || `/${item.page}`
												}
												startContent={
													IconComponent ? (
														<IconComponent
															size={16}
														/>
													) : (
														<Icon
															icon={
																item.icon as string
															}
															width={16}
														/>
													)
												}
											>
												{item.label}
											</DropdownItem>
										);
									})}
								</DropdownSection>

								<DropdownSection title="Session">
									<DropdownItem
										key="logout"
										color="danger"
										onPress={handleLogout}
										startContent={<LogOut size={16} />}
									>
										Log Out
									</DropdownItem>
								</DropdownSection>
							</DropdownMenu>
						</Dropdown>
					)}
					<NavbarMenuToggle
						aria-label={isMenuOpen ? "Close menu" : "Open menu"}
						className="ml-2 md:hidden"
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
										: index === NAV_LINKS.length - 1
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

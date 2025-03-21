"use client";

import { cn } from "@/lib/utils";
import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

type Props = {
	children: React.ReactNode;
	className?: string;
	refObject?: React.RefObject<HTMLDivElement>;
};

/**
 * (Users) - Layout component is used to display the main layout of the application.
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children elements.
 * @param {string} [props.className] - Additional CSS class name.
 * @param {React.RefObject<HTMLDivElement>} [props.refObject] - Ref object for the div element.
 * @returns {React.ReactElement} The rendered component.
 */
const Layout: React.FC<Props> = ({
	children,
	className,
	refObject,
	...props
}) => {
	return (
		<div
			{...props}
			ref={refObject}
			className={cn("relative mt-4 pb-56", className)}
		>
			<NavBar />
			{children}
			<Footer />
		</div>
	);
};

export default Layout;

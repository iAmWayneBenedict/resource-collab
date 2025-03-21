import { cn } from "@/lib/utils";
import React, { RefObject } from "react";
import NavBar from "./users/NavBar";

type Props = {
	children: React.ReactNode;
	refObject?: RefObject<HTMLDivElement>;
	className?: string;
};

/**
 * (Layouts) - Container component is used to display the main container of the application.
 * @component
 * @param {Object} props - The component props.
 * @param {React.RefObject<HTMLDivElement>} [props.refObject] - Ref object for the div element.
 * @param {React.ReactNode} props.children - The children elements.
 * @param {string} [props.className] - Additional CSS class name.
 * @returns {React.ReactElement} The rendered component.
 */
const Container = ({
	refObject,
	children,
	className = "",
	...props
}: Props): React.ReactElement => {
	return (
		<div
			ref={refObject}
			className={cn(
				"mx-3 mt-10 sm:mx-6 md:mx-8 xl:mx-14 2xl:mx-24",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export default Container;

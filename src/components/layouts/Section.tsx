import { cn } from "@/lib/utils";
import React from "react";

type Props = {
	children: React.ReactNode;
	className?: string;
	refObject?: React.RefObject<HTMLElement>;
};

/**
 * Section component is used to display the main sections of the application.
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children elements.
 * @param {string} [props.className] - Additional CSS class name.
 * @param {React.RefObject<HTMLElement>} [props.refObject] - Ref object for the section element.
 * @returns {React.ReactElement} The rendered component.
 */
const Section: React.FC<Props> = ({
	children,
	refObject,
	className,
	...props
}) => {
	return (
		<section
			ref={refObject}
			className={cn("mt-16 w-full", className)}
			{...props}
		>
			{children}
		</section>
	);
};

export default Section;

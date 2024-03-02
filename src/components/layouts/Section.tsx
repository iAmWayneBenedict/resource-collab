import { cn } from "@/lib/utils";
import React from "react";

type Props = {
	children: React.ReactNode;
	className?: string;
};

const Section: React.FC<Props> = ({ children, className, ...props }) => {
	return (
		<section className={cn(className, "mt-16 w-full")} {...props}>
			{children}
		</section>
	);
};

export default Section;

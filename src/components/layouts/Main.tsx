import { cn } from "@/lib/utils";
import React from "react";

type Props = {
	children: React.ReactNode;
	className?: string;
	refObject?: React.RefObject<HTMLElement>;
};

const Main: React.FC<Props> = ({ children, className, refObject, ...props }) => {
	return (
		<main {...props} ref={refObject} className={cn("relative pb-56", className)}>
			{children}
		</main>
	);
};

export default Main;

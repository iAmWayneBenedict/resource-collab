import React, { ReactNode } from "react";
import "./style.css";
import { cn } from "@/lib/utils";

const Spinner = ({
	className,
	children,
	...props
}: {
	className?: string;
	children?: ReactNode;
}) => {
	return (
		<div className="flex flex-col justify-center">
			<div className={cn("spinner w-[40px] h-[40px]", className)} {...props}>
				<div className="dot1"></div>
				<div className="dot2"></div>
			</div>
			{children && (
				<p className="text-center text-xs lg:text-sm text-gray-500 font-medium">
					{children}
				</p>
			)}
		</div>
	);
};

export default Spinner;

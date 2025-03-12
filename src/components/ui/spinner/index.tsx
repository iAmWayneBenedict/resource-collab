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
			<div
				className={cn("spinner h-[40px] w-[40px]", className)}
				{...props}
			>
				<div className="dot1"></div>
				<div className="dot2"></div>
			</div>
			{children && (
				<p className="text-center text-xs font-medium text-zinc-500 lg:text-sm">
					{children}
				</p>
			)}
		</div>
	);
};

export default Spinner;

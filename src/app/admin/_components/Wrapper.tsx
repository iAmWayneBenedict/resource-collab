import { cn } from "@/lib/utils";
import React from "react";

type Props = {
	className?: string;
	children: React.ReactNode;
};
const Wrapper: React.FC<Props> = ({ className, children }) => {
	return <div className={cn("w-full px-10 py-8", className)}>{children}</div>;
};

export default Wrapper;

import { cn } from "@/lib/utils";
import React from "react";
import Wrapper from "./Wrapper";
import SideNav from "./SideNav";

type Props = {
	title?: React.ReactNode;
	className?: string;
	description?: React.ReactNode;
	children: React.ReactNode;
};
const AdminContainer: React.FC<Props> = ({
	title,
	className,
	description,
	children,
}) => {
	return (
		<Wrapper className={cn("", className)}>
			<SideNav />
			<Wrapper className="px-2 py-0 pl-[calc(5rem+4rem)]">
				<div className="text-4xl font-bold">{title}</div>
				<div className="text-muted-foreground">{description}</div>
				<div className="mt-10">{children}</div>
			</Wrapper>
		</Wrapper>
	);
};

export default AdminContainer;

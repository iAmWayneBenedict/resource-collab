import Link from "next/link";
import React from "react";

const NoScrollLink = ({
	children,
	href,
	...props
}: {
	children: any;
	href: string;
}) => {
	return (
		<Link scroll={false} href={href} {...props}>
			{children}
		</Link>
	);
};

export default NoScrollLink;

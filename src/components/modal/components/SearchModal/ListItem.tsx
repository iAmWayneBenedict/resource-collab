import React from "react";
import { ForwardRefComponent, HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const listItemVariants = {
	hidden: {
		opacity: 0,
		y: 10,
	},
	visible: {
		opacity: 1,
		y: 0,
	},
	exit: {
		opacity: 0,
		y: -10,
	},
};

type Props = {
	children: React.ReactNode;
	keyIdentifier?: string;
	className?: string;
	selected?: boolean;
	overrideClassName?: boolean;
	onClick?: () => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLLIElement>) => void;
};

const ListItem = ({
	children,
	keyIdentifier,
	className,
	selected,
	overrideClassName,
	onClick,
	onKeyDown,
	...props
}: Props) => {
	return (
		<motion.li
			key={keyIdentifier}
			layout
			variants={listItemVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			transition={{
				duration: 0.25,
			}}
			className={
				overrideClassName
					? className
					: cn(
							"group flex cursor-pointer items-center justify-between rounded-2xl bg-default-100 py-3 pl-3 pr-3 text-default-700 hover:bg-violet hover:text-white focus:bg-violet focus:text-white focus:outline-none",
							className,
						)
			}
			role="option"
			aria-selected={selected}
			tabIndex={0}
			onClick={onClick}
			onKeyDown={onKeyDown}
			{...props}
		>
			{children}
		</motion.li>
	);
};

export default ListItem;
